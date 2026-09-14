const { query } = require('../db/pool');
const auditoria = require('./auditoriaController');

/**
 * GET /api/reservas
 * Lista reservas de stock con filtros (CU-124)
 * Query params: ?estado=&buscar=&orden_id=
 */
async function listar(req, res) {
  const { estado, buscar, orden_id } = req.query;
  try {
    const { rows } = await query(
      `SELECT
         ri.reserva_inventario_id_reserva         AS id,
         ri.reserva_inventario_cantidad_reservada  AS cantidad,
         ri.reserva_inventario_fecha_reserva       AS fecha_reserva,
         ri.reserva_inventario_fecha_liberacion    AS fecha_liberacion,
         ri.reserva_inventario_estado_reserva      AS estado,
         ri.material_sku                           AS sku,
         m.material_nombre_material                AS material_nombre,
         m.material_material_critico               AS es_critico,
         u.material_unidad_medida_nombre           AS unidad,
         ri.orden_trabajo_id_orden                 AS orden_id,
         ri.proyecto_id_proyecto                   AS proyecto_id,
         p.codigo_proyecto                         AS proyecto_codigo,
         p.nombre_referencia                       AS proyecto_nombre
       FROM reserva_inventario ri
       JOIN material m ON m.material_sku = ri.material_sku
       LEFT JOIN material_unidad_medida u
              ON u.material_unidad_medida_id_unidad_medida = m.material_unidad_medida_id_unidad_medida
       LEFT JOIN terreno.proyecto p ON p.id_proyecto = ri.proyecto_id_proyecto
       WHERE ($1::text IS NULL OR ri.reserva_inventario_estado_reserva = $1)
         AND ($2::text IS NULL OR
              ri.material_sku ILIKE '%' || $2 || '%' OR
              m.material_nombre_material ILIKE '%' || $2 || '%')
         AND ($3::bigint IS NULL OR ri.orden_trabajo_id_orden = $3)
       ORDER BY ri.reserva_inventario_fecha_reserva DESC`,
      [estado || null, buscar || null, orden_id || null]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error listando reservas:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * PUT /api/reservas/:id/liberar
 * Libera una reserva activa y devuelve el stock reservado (CU-124)
 */
async function liberar(req, res) {
  const { id } = req.params;
  try {
    // Obtener reserva
    const { rows: reserva } = await query(
      `SELECT reserva_inventario_id_reserva         AS id,
              reserva_inventario_cantidad_reservada  AS cantidad,
              reserva_inventario_estado_reserva      AS estado,
              material_sku                           AS sku,
              orden_trabajo_id_orden                 AS orden_id
       FROM reserva_inventario
       WHERE reserva_inventario_id_reserva = $1`,
      [id]
    );

    if (reserva.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    const r = reserva[0];

    // CU-124 Exc 1: ya liberada o anulada
    if (r.estado !== 'activa') {
      return res.status(400).json({
        error: 'La reserva ya se encuentra liberada o anulada. No puede gestionarse.'
      });
    }

    // CU-124 Exc 2: verificar si la OT asociada fue cancelada
    if (r.orden_id) {
      const { rows: ot } = await query(
        `SELECT orden_trabajo_estado AS estado
         FROM orden_trabajo WHERE orden_trabajo_id_orden = $1`,
        [r.orden_id]
      );
      if (ot.length > 0 && ot[0].estado === 'cancelada') {
        return res.status(400).json({
          error: 'La reserva está asociada a un pedido cancelado y no puede gestionarse.'
        });
      }
    }

    // Devolver stock reservado en inventario_bodega (FIFO inverso)
    const { rows: lotes } = await query(
      `SELECT ib.lote_id_lote, ib.bodega_id_bodega,
              ib.inventario_bodega_cantidad_reservada AS reservado
       FROM inventario_bodega ib
       JOIN lote l ON l.lote_id_lote = ib.lote_id_lote
       WHERE ib.material_sku = $1
         AND ib.inventario_bodega_cantidad_reservada > 0
       ORDER BY l.lote_fecha_ingreso DESC NULLS LAST`,
      [r.sku]
    );

    let restante = parseFloat(r.cantidad);
    for (const lote of lotes) {
      if (restante <= 0) break;
      const liberar = Math.min(restante, parseFloat(lote.reservado));
      await query(
        `UPDATE inventario_bodega
         SET inventario_bodega_cantidad_reservada = inventario_bodega_cantidad_reservada - $1
         WHERE material_sku = $2 AND lote_id_lote = $3 AND bodega_id_bodega = $4`,
        [liberar, r.sku, lote.lote_id_lote, lote.bodega_id_bodega]
      );
      restante -= liberar;
    }

    // Actualizar reserva
    await query(
      `UPDATE reserva_inventario
       SET reserva_inventario_estado_reserva = 'liberada',
           reserva_inventario_fecha_liberacion = now()
       WHERE reserva_inventario_id_reserva = $1`,
      [id]
    );

    await auditoria.registrar(req.user?.id, 'liberar_reserva', `Reserva ID ${id} liberada (SKU ${r.sku}, cantidad ${r.cantidad})`);
    res.json({ message: 'Reserva liberada correctamente. Stock disponible actualizado.' });
  } catch (err) {
    console.error('Error liberando reserva:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * PUT /api/reservas/:id/anular
 * Anula una reserva (distinto de liberar — marca error administrativo)
 */
async function anular(req, res) {
  const { id } = req.params;
  try {
    const { rows: reserva } = await query(
      `SELECT reserva_inventario_estado_reserva AS estado,
              reserva_inventario_cantidad_reservada AS cantidad,
              material_sku AS sku
       FROM reserva_inventario WHERE reserva_inventario_id_reserva = $1`,
      [id]
    );

    if (reserva.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    if (reserva[0].estado !== 'activa') {
      return res.status(400).json({ error: 'Solo se pueden anular reservas activas' });
    }

    // Devolver stock reservado igual que en liberar
    const { rows: lotes } = await query(
      `SELECT ib.lote_id_lote, ib.bodega_id_bodega,
              ib.inventario_bodega_cantidad_reservada AS reservado
       FROM inventario_bodega ib
       JOIN lote l ON l.lote_id_lote = ib.lote_id_lote
       WHERE ib.material_sku = $1
         AND ib.inventario_bodega_cantidad_reservada > 0
       ORDER BY l.lote_fecha_ingreso DESC NULLS LAST`,
      [reserva[0].sku]
    );

    let restante = parseFloat(reserva[0].cantidad);
    for (const lote of lotes) {
      if (restante <= 0) break;
      const liberar = Math.min(restante, parseFloat(lote.reservado));
      await query(
        `UPDATE inventario_bodega
         SET inventario_bodega_cantidad_reservada = inventario_bodega_cantidad_reservada - $1
         WHERE material_sku = $2 AND lote_id_lote = $3 AND bodega_id_bodega = $4`,
        [liberar, reserva[0].sku, lote.lote_id_lote, lote.bodega_id_bodega]
      );
      restante -= liberar;
    }

    await query(
      `UPDATE reserva_inventario
       SET reserva_inventario_estado_reserva = 'anulada',
           reserva_inventario_fecha_liberacion = now()
       WHERE reserva_inventario_id_reserva = $1`,
      [id]
    );

    await auditoria.registrar(req.user?.id, 'anular_reserva', `Reserva ID ${id} anulada (SKU ${reserva[0].sku}, cantidad ${reserva[0].cantidad})`);
    res.json({ message: 'Reserva anulada correctamente' });
  } catch (err) {
    console.error('Error anulando reserva:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { listar, liberar, anular };
