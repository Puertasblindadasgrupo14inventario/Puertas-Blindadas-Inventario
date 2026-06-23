const { query } = require('../db/pool');

/**
 * GET /api/reportes/movimientos
 * Reporte de movimientos por rango de fechas
 * Query params: ?desde=&hasta=&tipo=
 */
async function reporteMovimientos(req, res) {
  const { desde, hasta, tipo } = req.query;

  if (!desde || !hasta) {
    return res.status(400).json({ error: 'Los parámetros desde y hasta son requeridos' });
  }

  try {
    const { rows } = await query(
      `SELECT
         mi.movimiento_inventario_id_movimiento            AS id,
         mi.movimiento_inventario_fecha_hora               AS fecha_hora,
         mi.movimiento_inventario_cantidad                 AS cantidad,
         mi.movimiento_inventario_estado                   AS estado,
         mi.material_sku                                   AS sku,
         m.material_nombre_material                        AS material,
         b.bodega_nombre_bodega                            AS bodega,
         tm.movimiento_inventario_tipo_movimiento_nombre   AS tipo,
         mot.movimiento_inventario_motivo_movimiento_nombre AS motivo,
         u.usuario_username                                AS usuario,
         l.lote_numero_lote                                AS lote,
         -- Precio referencial del proveedor principal (solo gerencia lo verá en el frontend)
         mp.material_proveedor_precio_referencial          AS precio_unitario
       FROM movimiento_inventario mi
       JOIN material m ON m.material_sku = mi.material_sku
       JOIN movimiento_inventario_tipo_movimiento tm
            ON tm.movimiento_inventario_tipo_movimiento_id_tipo_movimiento
             = mi.movimiento_inventario_tipo_movimiento_id_tipo_movimiento
       LEFT JOIN bodega b   ON b.bodega_id_bodega = mi.bodega_id_bodega
       LEFT JOIN lote l     ON l.lote_id_lote = mi.lote_id_lote
       LEFT JOIN usuario u  ON u.usuario_id_usuario = mi.usuario_id_usuario
       LEFT JOIN movimiento_inventario_motivo_movimiento mot
            ON mot.movimiento_inventario_motivo_movimiento_id_motivo_movimiento
             = mi.movimiento_inventario_motivo_movimiento_id_motivo_movimiento
       -- Precio referencial del proveedor principal
       LEFT JOIN material_proveedor mp
            ON mp.material_sku = mi.material_sku
           AND mp.material_proveedor_proveedor_principal = TRUE
       WHERE mi.movimiento_inventario_fecha_hora >= $1::date
         AND mi.movimiento_inventario_fecha_hora < ($2::date + INTERVAL '1 day')
         AND ($3::text IS NULL OR tm.movimiento_inventario_tipo_movimiento_nombre ILIKE '%' || $3 || '%')
       ORDER BY mi.movimiento_inventario_fecha_hora DESC`,
      [desde, hasta, tipo || null]
    );

    // Resumen
    const resumen = {
      total_movimientos: rows.length,
      total_entradas: rows.filter(r => r.tipo?.toLowerCase().includes('entrada')).length,
      total_salidas:  rows.filter(r => r.tipo?.toLowerCase().includes('salida')).length,
    };

    res.json({ resumen, movimientos: rows });
  } catch (err) {
    console.error('Error generando reporte movimientos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/reportes/mermas
 * Reporte de mermas (FR-50) — movimientos con motivo de pérdida/daño
 * Query params: ?desde=&hasta=&motivo=
 * Nota: precio_unitario solo se devuelve si el usuario es gerencia (FR-59)
 */
async function reporteMermas(req, res) {
  const { desde, hasta, motivo } = req.query;

  if (!desde || !hasta) {
    return res.status(400).json({ error: 'Los parámetros desde y hasta son requeridos' });
  }

  const esGerencia = req.user?.rol === 'gerencia';

  try {
    const { rows } = await query(
      `SELECT
         mi.movimiento_inventario_id_movimiento              AS id,
         mi.movimiento_inventario_fecha_hora                 AS fecha,
         mi.movimiento_inventario_cantidad                   AS cantidad,
         mi.material_sku                                     AS sku,
         m.material_nombre_material                          AS producto,
         mot.movimiento_inventario_motivo_movimiento_nombre  AS motivo,
         u.usuario_username                                  AS usuario,
         mp.material_proveedor_precio_referencial            AS precio_unitario
       FROM movimiento_inventario mi
       JOIN material m ON m.material_sku = mi.material_sku
       JOIN movimiento_inventario_tipo_movimiento tm
            ON tm.movimiento_inventario_tipo_movimiento_id_tipo_movimiento
             = mi.movimiento_inventario_tipo_movimiento_id_tipo_movimiento
       JOIN movimiento_inventario_motivo_movimiento mot
            ON mot.movimiento_inventario_motivo_movimiento_id_motivo_movimiento
             = mi.movimiento_inventario_motivo_movimiento_id_motivo_movimiento
       LEFT JOIN movimiento_inventario_clasificacion_salida cs
            ON cs.movimiento_inventario_clasificacion_salida_id_clasificacion_salida
             = mot.movimiento_inventario_clasificacion_salida_id_clasificacion_salida
       LEFT JOIN usuario u ON u.usuario_id_usuario = mi.usuario_id_usuario
       LEFT JOIN material_proveedor mp
            ON mp.material_sku = mi.material_sku
           AND mp.material_proveedor_proveedor_principal = TRUE
       WHERE mi.movimiento_inventario_fecha_hora >= $1::date
         AND mi.movimiento_inventario_fecha_hora < ($2::date + INTERVAL '1 day')
         AND tm.movimiento_inventario_tipo_movimiento_nombre ILIKE '%salida%'
         AND cs.movimiento_inventario_clasificacion_salida_nombre ILIKE '%pérdida%'
         AND ($3::text IS NULL OR mot.movimiento_inventario_motivo_movimiento_nombre ILIKE '%' || $3 || '%')
       ORDER BY mi.movimiento_inventario_fecha_hora DESC`,
      [desde, hasta, motivo || null]
    );

    // KPIs
    const totalUnidades = rows.reduce((s, r) => s + parseFloat(r.cantidad || 0), 0);
    const totalValor    = rows.reduce((s, r) => s + parseFloat(r.cantidad || 0) * parseFloat(r.precio_unitario || 0), 0);
    const skusDistintos = new Set(rows.map(r => r.sku)).size;

    // Si es JOP, eliminar precio_unitario de cada fila (FR-59)
    const mermas = rows.map(r => {
      const row = { ...r };
      if (!esGerencia) {
        delete row.precio_unitario;
      } else {
        row.valor_merma = parseFloat(r.cantidad || 0) * parseFloat(r.precio_unitario || 0);
      }
      return row;
    });

    const resumen = {
      total_eventos:   rows.length,
      total_unidades:  totalUnidades,
      skus_afectados:  skusDistintos,
      // Solo gerencia recibe el valor monetario
      ...(esGerencia && { valor_total_merma: totalValor }),
    };

    res.json({ resumen, mermas });
  } catch (err) {
    console.error('Error generando reporte mermas:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { reporteMovimientos, reporteMermas };
