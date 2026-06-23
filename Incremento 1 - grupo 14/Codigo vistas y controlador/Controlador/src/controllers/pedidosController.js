const { query } = require('../db/pool');

/**
 * GET /api/pedidos
 * Lista órdenes de trabajo con estado de stock para el checklist (FR-65, FR-74)
 * Cruza inventario.orden_trabajo con terreno.proyecto
 */
async function listar(req, res) {
  const { estado, buscar } = req.query;
  try {
    const { rows } = await query(
      `SELECT
         ot.orden_trabajo_id_orden                           AS id,
         ot.orden_trabajo_fecha_hora                         AS fecha,
         ot.orden_trabajo_estado                             AS estado,
         ot.proyecto_id_proyecto                             AS proyecto_id,
         p.codigo_proyecto                                   AS proyecto_codigo,
         p.nombre_referencia                                 AS proyecto_nombre,
         p.estado_operacional                                AS proyecto_estado,
         p.rut_cliente                                       AS rut_cliente,
         at.area_trabajo_nombre_area                              AS area,
         u.usuario_username                                  AS responsable,
         -- Resumen de materiales: cuántos tienen stock suficiente
         COUNT(mot.material_sku)                             AS total_materiales,
         COUNT(CASE
           WHEN COALESCE(stock.disponible, 0) >= COALESCE(mot.material_orden_trabajo_consumo_estimado, 0)
           THEN 1 END)                                       AS materiales_ok,
         COUNT(CASE
           WHEN COALESCE(stock.disponible, 0) < COALESCE(mot.material_orden_trabajo_consumo_estimado, 0)
           THEN 1 END)                                       AS materiales_faltantes
       FROM orden_trabajo ot
       LEFT JOIN terreno.proyecto p ON p.id_proyecto = ot.proyecto_id_proyecto
       LEFT JOIN area_trabajo at    ON at.area_trabajo_id_area = ot.area_trabajo_id_area
       LEFT JOIN usuario u          ON u.usuario_id_usuario = ot.usuario_id_usuario
       LEFT JOIN material_orden_trabajo mot ON mot.orden_trabajo_id_orden = ot.orden_trabajo_id_orden
       -- Stock disponible por material (todas las bodegas)
       LEFT JOIN LATERAL (
         SELECT
           ib.material_sku,
           SUM(ib.inventario_bodega_cantidad_fisica) -
           SUM(ib.inventario_bodega_cantidad_reservada) AS disponible
         FROM inventario_bodega ib
         WHERE ib.material_sku = mot.material_sku
         GROUP BY ib.material_sku
       ) stock ON stock.material_sku = mot.material_sku
       WHERE ($1::text IS NULL OR ot.orden_trabajo_estado = $1)
         AND ($2::text IS NULL OR
              p.codigo_proyecto ILIKE '%' || $2 || '%' OR
              p.nombre_referencia ILIKE '%' || $2 || '%')
       GROUP BY
         ot.orden_trabajo_id_orden, ot.orden_trabajo_fecha_hora, ot.orden_trabajo_estado,
         ot.proyecto_id_proyecto,
         p.codigo_proyecto, p.nombre_referencia, p.estado_operacional, p.rut_cliente,
         at.area_trabajo_nombre_area, u.usuario_username
       ORDER BY ot.orden_trabajo_fecha_hora DESC`,
      [estado || null, buscar || null]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error listando pedidos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/pedidos/:id/checklist
 * Checklist detallado de materiales para una orden de trabajo (FR-74)
 * Muestra estado disponible / faltante / reservado por material
 */
async function checklist(req, res) {
  const { id } = req.params;
  try {
    // Datos de la orden
    const { rows: orden } = await query(
      `SELECT
         ot.orden_trabajo_id_orden    AS id,
         ot.orden_trabajo_estado      AS estado,
         ot.orden_trabajo_fecha_hora  AS fecha,
         ot.proyecto_id_proyecto      AS proyecto_id,
         p.codigo_proyecto            AS proyecto_codigo,
         p.nombre_referencia          AS proyecto_nombre,
         p.rut_cliente                AS rut_cliente,
         at.area_trabajo_nombre_area       AS area,
         u.usuario_username           AS responsable
       FROM orden_trabajo ot
       LEFT JOIN terreno.proyecto p ON p.id_proyecto = ot.proyecto_id_proyecto
       LEFT JOIN area_trabajo at    ON at.area_trabajo_id_area = ot.area_trabajo_id_area
       LEFT JOIN usuario u          ON u.usuario_id_usuario = ot.usuario_id_usuario
       WHERE ot.orden_trabajo_id_orden = $1`,
      [id]
    );

    if (orden.length === 0) {
      return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
    }

    // Materiales requeridos con stock disponible (FR-65)
    const { rows: materiales } = await query(
      `SELECT
         mot.material_sku                                    AS sku,
         m.material_nombre_material                          AS nombre,
         u.material_unidad_medida_nombre                     AS unidad,
         mot.material_orden_trabajo_consumo_estimado         AS cantidad_requerida,
         mot.material_orden_trabajo_consumo_real             AS cantidad_real,
         -- Stock total disponible en todas las bodegas
         COALESCE(SUM(ib.inventario_bodega_cantidad_fisica) -
                  SUM(ib.inventario_bodega_cantidad_reservada), 0) AS stock_disponible,
         -- Ya reservado para esta orden
         COALESCE(ri.reserva_inventario_cantidad_reservada, 0)     AS ya_reservado,
         ri.reserva_inventario_id_reserva                          AS reserva_id,
         ri.reserva_inventario_estado_reserva                      AS reserva_estado,
         CASE
           WHEN COALESCE(ri.reserva_inventario_cantidad_reservada, 0) >=
                COALESCE(mot.material_orden_trabajo_consumo_estimado, 0)
           THEN 'reservado'
           WHEN COALESCE(SUM(ib.inventario_bodega_cantidad_fisica) -
                         SUM(ib.inventario_bodega_cantidad_reservada), 0) >=
                COALESCE(mot.material_orden_trabajo_consumo_estimado, 0)
           THEN 'disponible'
           ELSE 'faltante'
         END AS estado_stock
       FROM material_orden_trabajo mot
       JOIN material m ON m.material_sku = mot.material_sku
       LEFT JOIN material_unidad_medida u
              ON u.material_unidad_medida_id_unidad_medida = m.material_unidad_medida_id_unidad_medida
       LEFT JOIN inventario_bodega ib ON ib.material_sku = mot.material_sku
       LEFT JOIN reserva_inventario ri
              ON ri.material_sku = mot.material_sku
             AND ri.orden_trabajo_id_orden = mot.orden_trabajo_id_orden
             AND ri.reserva_inventario_estado_reserva = 'activa'
       WHERE mot.orden_trabajo_id_orden = $1
       GROUP BY
         mot.material_sku, m.material_nombre_material,
         u.material_unidad_medida_nombre,
         mot.material_orden_trabajo_consumo_estimado,
         mot.material_orden_trabajo_consumo_real,
         ri.reserva_inventario_cantidad_reservada,
         ri.reserva_inventario_id_reserva,
         ri.reserva_inventario_estado_reserva
       ORDER BY estado_stock DESC, m.material_nombre_material`,
      [id]
    );

    // Preparaciones del pedido
    const { rows: preparaciones } = await query(
      `SELECT
         pp.preparacion_pedido_id_preparacion AS id,
         pp.preparacion_pedido_observacion    AS observacion,
         ppe.preparacion_pedido_estado_nombre_estado     AS estado,
         ppe.preparacion_pedido_estado_timestamp_accion  AS timestamp
       FROM preparacion_pedido pp
       JOIN reserva_inventario ri ON ri.reserva_inventario_id_reserva = pp.reserva_inventario_id_reserva
       LEFT JOIN preparacion_pedido_estado ppe
              ON ppe.preparacion_pedido_id_preparacion = pp.preparacion_pedido_id_preparacion
       WHERE ri.orden_trabajo_id_orden = $1
       ORDER BY ppe.preparacion_pedido_estado_timestamp_accion DESC`,
      [id]
    );

    res.json({
      orden: orden[0],
      materiales,
      preparaciones,
      resumen: {
        total:      materiales.length,
        disponible: materiales.filter(m => m.estado_stock === 'disponible').length,
        reservado:  materiales.filter(m => m.estado_stock === 'reservado').length,
        faltante:   materiales.filter(m => m.estado_stock === 'faltante').length,
      }
    });
  } catch (err) {
    console.error('Error obteniendo checklist:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/pedidos/:id/reservar
 * Reservar stock para una orden de trabajo (FR-65)
 */
async function reservar(req, res) {
  const { id } = req.params;
  const { materiales } = req.body;
  // materiales: [{ sku, cantidad }]

  if (!Array.isArray(materiales) || materiales.length === 0) {
    return res.status(400).json({ error: 'Debes enviar al menos un material a reservar' });
  }

  try {
    const resultados = [];

    for (const item of materiales) {
      const { sku, cantidad } = item;
      if (!sku || !cantidad || cantidad <= 0) continue;

      // Verificar stock disponible
      const { rows: stock } = await query(
        `SELECT
           COALESCE(SUM(inventario_bodega_cantidad_fisica), 0) -
           COALESCE(SUM(inventario_bodega_cantidad_reservada), 0) AS disponible
         FROM inventario_bodega WHERE material_sku = $1`,
        [sku]
      );

      const disponible = parseFloat(stock[0]?.disponible || 0);

      if (cantidad > disponible) {
        resultados.push({ sku, estado: 'faltante', disponible, requerido: cantidad });
        continue;
      }

      // Crear reserva
      const { rows: reserva } = await query(
        `INSERT INTO reserva_inventario (
           reserva_inventario_cantidad_reservada,
           reserva_inventario_estado_reserva,
           material_sku,
           orden_trabajo_id_orden
         ) VALUES ($1, 'activa', $2, $3)
         ON CONFLICT DO NOTHING
         RETURNING reserva_inventario_id_reserva AS id`,
        [cantidad, sku, id]
      );

      // Actualizar cantidad reservada en inventario_bodega (FIFO)
      const { rows: lotes } = await query(
        `SELECT ib.lote_id_lote, ib.bodega_id_bodega,
                ib.inventario_bodega_cantidad_fisica - ib.inventario_bodega_cantidad_reservada AS disponible
         FROM inventario_bodega ib
         JOIN lote l ON l.lote_id_lote = ib.lote_id_lote
         WHERE ib.material_sku = $1
           AND ib.inventario_bodega_cantidad_fisica > ib.inventario_bodega_cantidad_reservada
         ORDER BY l.lote_fecha_ingreso ASC NULLS LAST`,
        [sku]
      );

      let restante = parseFloat(cantidad);
      for (const lote of lotes) {
        if (restante <= 0) break;
        const reservar = Math.min(restante, parseFloat(lote.disponible));
        await query(
          `UPDATE inventario_bodega
           SET inventario_bodega_cantidad_reservada = inventario_bodega_cantidad_reservada + $1
           WHERE material_sku = $2 AND lote_id_lote = $3 AND bodega_id_bodega = $4`,
          [reservar, sku, lote.lote_id_lote, lote.bodega_id_bodega]
        );
        restante -= reservar;
      }

      resultados.push({ sku, estado: 'reservado', id: reserva[0]?.id });
    }

    const todoOk = resultados.every(r => r.estado === 'reservado');
    res.status(todoOk ? 200 : 207).json({
      message: todoOk ? 'Todos los materiales reservados correctamente' : 'Reserva parcial — algunos materiales no tienen stock suficiente',
      resultados
    });
  } catch (err) {
    console.error('Error reservando materiales:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { listar, checklist, reservar };
