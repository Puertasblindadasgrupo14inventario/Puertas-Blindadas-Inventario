const { query } = require('../db/pool');
const auditoria = require('./auditoriaController');
const { generarAlertasAutomaticas } = require('./alertasController');

/**
 * GET /api/movimientos
 * Historial de movimientos con filtros
 * Query params: ?buscar=&tipo=&desde=&hasta=&page=&limit=
 */
async function listar(req, res) {
  const { buscar, tipo, desde, hasta, page = 1, limit = 50 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { rows } = await query(
      `SELECT
         mi.movimiento_inventario_id_movimiento          AS id,
         mi.movimiento_inventario_fecha_hora             AS fecha_hora,
         mi.movimiento_inventario_cantidad               AS cantidad,
         mi.movimiento_inventario_estado                 AS estado,
         mi.material_sku                                 AS sku,
         m.material_nombre_material                      AS material_nombre,
         b.bodega_nombre_bodega                          AS bodega,
         tm.movimiento_inventario_tipo_movimiento_nombre AS tipo,
         mot.movimiento_inventario_motivo_movimiento_nombre AS motivo,
         cs.movimiento_inventario_clasificacion_salida_nombre AS clasificacion_salida,
         u.usuario_username                              AS usuario,
         l.lote_numero_lote                              AS lote,
         p.nombre_referencia                             AS proyecto_nombre,
         p.codigo_proyecto                               AS proyecto_codigo,
         prov.proveedor_razon_social                     AS proveedor
       FROM movimiento_inventario mi
       JOIN material m   ON m.material_sku = mi.material_sku
       JOIN movimiento_inventario_tipo_movimiento tm
            ON tm.movimiento_inventario_tipo_movimiento_id_tipo_movimiento
             = mi.movimiento_inventario_tipo_movimiento_id_tipo_movimiento
       LEFT JOIN bodega b ON b.bodega_id_bodega = mi.bodega_id_bodega
       LEFT JOIN movimiento_inventario_motivo_movimiento mot
            ON mot.movimiento_inventario_motivo_movimiento_id_motivo_movimiento
             = mi.movimiento_inventario_motivo_movimiento_id_motivo_movimiento
       LEFT JOIN movimiento_inventario_clasificacion_salida cs
            ON cs.movimiento_inventario_clasificacion_salida_id_clasificacion_salida
             = mot.movimiento_inventario_clasificacion_salida_id_clasificacion_salida
       LEFT JOIN usuario u ON u.usuario_id_usuario = mi.usuario_id_usuario
       LEFT JOIN lote l    ON l.lote_id_lote = mi.lote_id_lote
       LEFT JOIN terreno.proyecto p ON p.id_proyecto = mi.proyecto_id_proyecto
       LEFT JOIN proveedor prov ON prov.proveedor_id_proveedor = l.proveedor_id_proveedor
       WHERE ($1::text IS NULL OR
              mi.material_sku ILIKE '%' || $1 || '%' OR
              m.material_nombre_material ILIKE '%' || $1 || '%')
         AND ($2::text IS NULL OR tm.movimiento_inventario_tipo_movimiento_nombre ILIKE '%' || $2 || '%')
         AND ($3::date IS NULL OR mi.movimiento_inventario_fecha_hora >= $3::date)
         AND ($4::date IS NULL OR mi.movimiento_inventario_fecha_hora < ($4::date + INTERVAL '1 day'))
       ORDER BY mi.movimiento_inventario_fecha_hora DESC
       LIMIT $5 OFFSET $6`,
      [buscar || null, tipo || null, desde || null, hasta || null, limit, offset]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error listando movimientos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/movimientos/catalogos
 * Tipos y motivos de movimiento para los formularios
 */
async function catalogos(req, res) {
  try {
    const [tipos, motivos, clasificaciones] = await Promise.all([
      query(`SELECT movimiento_inventario_tipo_movimiento_id_tipo_movimiento AS id,
                    movimiento_inventario_tipo_movimiento_nombre AS nombre
             FROM movimiento_inventario_tipo_movimiento ORDER BY nombre`),
      query(`SELECT movimiento_inventario_motivo_movimiento_id_motivo_movimiento AS id,
                    movimiento_inventario_motivo_movimiento_nombre AS nombre,
                    movimiento_inventario_clasificacion_salida_id_clasificacion_salida AS clasificacion_id
             FROM movimiento_inventario_motivo_movimiento ORDER BY nombre`),
      query(`SELECT movimiento_inventario_clasificacion_salida_id_clasificacion_salida AS id,
                    movimiento_inventario_clasificacion_salida_nombre AS nombre
             FROM movimiento_inventario_clasificacion_salida ORDER BY nombre`),
    ]);
    res.json({
      tipos: tipos.rows,
      motivos: motivos.rows,
      clasificaciones: clasificaciones.rows,
    });
  } catch (err) {
    console.error('Error obteniendo catalogos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/movimientos/entrada
 * Registrar entrada de stock (FR-18, FR-22)
 */
async function registrarEntrada(req, res) {
  const {
    sku, bodega_id, cantidad,
    proveedor_id, numero_lote, fecha_vencimiento,
    tipo_movimiento_id, numero_factura
  } = req.body;

  const userId = req.user.id;

  if (!sku || !bodega_id || !cantidad || !tipo_movimiento_id) {
    return res.status(400).json({ error: 'SKU, bodega, cantidad y tipo de movimiento son requeridos' });
  }
  if (cantidad <= 0) {
    return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
  }

  try {
    // Verificar que el material existe
    const { rows: mat } = await query(
      `SELECT material_sku FROM material WHERE material_sku = $1`, [sku]
    );
    if (mat.length === 0) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }

    // Crear o reusar lote
    let loteId;
    if (numero_lote) {
      const { rows: loteExist } = await query(
        `SELECT lote_id_lote FROM lote WHERE lote_numero_lote = $1`, [numero_lote]
      );
      if (loteExist.length > 0) {
        loteId = loteExist[0].lote_id_lote;
      } else {
        const { rows: loteNuevo } = await query(
          `INSERT INTO lote (lote_numero_lote, lote_fecha_ingreso, lote_fecha_vencimiento,
                             lote_fecha_recepcion, lote_estado, proveedor_id_proveedor)
           VALUES ($1, now(), $2, now(), 'activo', $3)
           RETURNING lote_id_lote`,
          [numero_lote, fecha_vencimiento || null, proveedor_id || null]
        );
        loteId = loteNuevo[0].lote_id_lote;
      }
    } else {
      // Crear lote con número automático
      const { rows: loteGen } = await query(
        `INSERT INTO lote (lote_fecha_ingreso, lote_fecha_recepcion, lote_estado, proveedor_id_proveedor)
         VALUES (now(), now(), 'activo', $1)
         RETURNING lote_id_lote`,
        [proveedor_id || null]
      );
      loteId = loteGen[0].lote_id_lote;
      // Generar número automático LOTE-YYYYMMDD-{id}
      const fechaStr = new Date().toISOString().slice(0,10).replace(/-/g,'');
      await query(
        `UPDATE lote SET lote_numero_lote = $1 WHERE lote_id_lote = $2`,
        [`LOTE-${fechaStr}-${loteId}`, loteId]
      );
    }

    // Registrar movimiento
    const { rows: mov } = await query(
      `INSERT INTO movimiento_inventario (
         movimiento_inventario_cantidad, movimiento_inventario_estado,
         material_sku, bodega_id_bodega, lote_id_lote,
         usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento
       ) VALUES ($1, 'completado', $2, $3, $4, $5, $6)
       RETURNING movimiento_inventario_id_movimiento AS id`,
      [cantidad, sku, bodega_id, loteId, userId, tipo_movimiento_id]
    );

    // Actualizar inventario_bodega (upsert)
    await query(
      `INSERT INTO inventario_bodega
         (material_sku, lote_id_lote, bodega_id_bodega, inventario_bodega_cantidad_fisica)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (material_sku, lote_id_lote, bodega_id_bodega)
       DO UPDATE SET inventario_bodega_cantidad_fisica =
         inventario_bodega.inventario_bodega_cantidad_fisica + EXCLUDED.inventario_bodega_cantidad_fisica`,
      [sku, loteId, bodega_id, cantidad]
    );

    auditoria.registrar(req.user?.id, 'registrar_entrada', `SKU: ${sku}, cantidad: ${cantidad}, bodega: ${bodega_id}`);
    generarAlertasAutomaticas().catch(e => console.warn('Alertas:', e.message));
    res.status(201).json({
      message: 'Entrada registrada correctamente',
      movimiento_id: mov[0].id,
      lote_id: loteId
    });
  } catch (err) {
    console.error('Error registrando entrada:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/movimientos/salida
 * Registrar salida de stock (FR-19, FR-24, FR-25)
 */
async function registrarSalida(req, res) {
  const {
    sku, bodega_id, cantidad,
    tipo_movimiento_id, motivo_id
  } = req.body;

  const userId = req.user.id;

  if (!sku || !bodega_id || !cantidad || !tipo_movimiento_id) {
    return res.status(400).json({ error: 'SKU, bodega, cantidad y tipo de movimiento son requeridos' });
  }
  if (cantidad <= 0) {
    return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
  }

  try {
    // Verificar stock disponible
    const { rows: stock } = await query(
      `SELECT
         COALESCE(SUM(inventario_bodega_cantidad_fisica), 0) -
         COALESCE(SUM(inventario_bodega_cantidad_reservada), 0) AS disponible
       FROM inventario_bodega
       WHERE material_sku = $1 AND bodega_id_bodega = $2`,
      [sku, bodega_id]
    );

    const disponible = parseFloat(stock[0]?.disponible || 0);
    if (cantidad > disponible) {
      return res.status(400).json({
        error: `Stock insuficiente. Disponible: ${disponible}`,
        stock_disponible: disponible
      });
    }

    // Obtener lote FIFO (el más antiguo con stock)
    const { rows: lotes } = await query(
      `SELECT ib.lote_id_lote,
              ib.inventario_bodega_cantidad_fisica - ib.inventario_bodega_cantidad_reservada AS disponible
       FROM inventario_bodega ib
       JOIN lote l ON l.lote_id_lote = ib.lote_id_lote
       WHERE ib.material_sku = $1
         AND ib.bodega_id_bodega = $2
         AND ib.inventario_bodega_cantidad_fisica > ib.inventario_bodega_cantidad_reservada
       ORDER BY l.lote_fecha_ingreso ASC NULLS LAST`,
      [sku, bodega_id]
    );

    // Descontar por FIFO
    let restante = parseFloat(cantidad);
    for (const lote of lotes) {
      if (restante <= 0) break;
      const descontar = Math.min(restante, parseFloat(lote.disponible));
      await query(
        `UPDATE inventario_bodega
         SET inventario_bodega_cantidad_fisica = inventario_bodega_cantidad_fisica - $1
         WHERE material_sku = $2 AND lote_id_lote = $3 AND bodega_id_bodega = $4`,
        [descontar, sku, lote.lote_id_lote, bodega_id]
      );
      restante -= descontar;
    }

    // Registrar movimiento
    const { rows: mov } = await query(
      `INSERT INTO movimiento_inventario (
         movimiento_inventario_cantidad, movimiento_inventario_estado,
         material_sku, bodega_id_bodega,
         usuario_id_usuario,
         movimiento_inventario_tipo_movimiento_id_tipo_movimiento,
         movimiento_inventario_motivo_movimiento_id_motivo_movimiento
       ) VALUES ($1, 'completado', $2, $3, $4, $5, $6)
       RETURNING movimiento_inventario_id_movimiento AS id`,
      [cantidad, sku, bodega_id, userId, tipo_movimiento_id, motivo_id || null]
    );

    auditoria.registrar(req.user?.id, 'registrar_salida', `SKU: ${sku}, cantidad: ${cantidad}, bodega: ${bodega_id}`);
    generarAlertasAutomaticas().catch(e => console.warn('Alertas:', e.message));
    res.status(201).json({
      message: 'Salida registrada correctamente',
      movimiento_id: mov[0].id
    });
  } catch (err) {
    console.error('Error registrando salida:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/movimientos/:id/revertir
 * Revertir un movimiento (FR-30) — solo gerencia
 */
async function revertir(req, res) {
  const { id } = req.params;

  try {
    // Obtener movimiento original
    const { rows: mov } = await query(
      `SELECT * FROM movimiento_inventario WHERE movimiento_inventario_id_movimiento = $1`, [id]
    );

    if (mov.length === 0) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }

    const m = mov[0];

    if (m.movimiento_inventario_estado === 'revertido') {
      return res.status(400).json({ error: 'Este movimiento ya fue revertido' });
    }

    // Obtener tipo para saber si fue entrada o salida
    const { rows: tipo } = await query(
      `SELECT movimiento_inventario_tipo_movimiento_nombre AS nombre
       FROM movimiento_inventario_tipo_movimiento
       WHERE movimiento_inventario_tipo_movimiento_id_tipo_movimiento = $1`,
      [m.movimiento_inventario_tipo_movimiento_id_tipo_movimiento]
    );

    const esEntrada = tipo[0]?.nombre?.toLowerCase().includes('entrada');

    if (m.bodega_id_bodega && m.lote_id_lote) {
      if (esEntrada) {
        // Revertir entrada: descontar
        await query(
          `UPDATE inventario_bodega
           SET inventario_bodega_cantidad_fisica = inventario_bodega_cantidad_fisica - $1
           WHERE material_sku = $2 AND lote_id_lote = $3 AND bodega_id_bodega = $4`,
          [m.movimiento_inventario_cantidad, m.material_sku, m.lote_id_lote, m.bodega_id_bodega]
        );
      } else {
        // Revertir salida: reponer
        await query(
          `UPDATE inventario_bodega
           SET inventario_bodega_cantidad_fisica = inventario_bodega_cantidad_fisica + $1
           WHERE material_sku = $2 AND lote_id_lote = $3 AND bodega_id_bodega = $4`,
          [m.movimiento_inventario_cantidad, m.material_sku, m.lote_id_lote, m.bodega_id_bodega]
        );
      }
    }

    // Marcar como revertido
    await query(
      `UPDATE movimiento_inventario SET movimiento_inventario_estado = 'revertido'
       WHERE movimiento_inventario_id_movimiento = $1`, [id]
    );

    auditoria.registrar(req.user?.id, 'revertir_movimiento', `ID movimiento: ${id}`);
    res.json({ message: 'Movimiento revertido correctamente' });
  } catch (err) {
    console.error('Error revirtiendo movimiento:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { listar, catalogos, registrarEntrada, registrarSalida, revertir };
