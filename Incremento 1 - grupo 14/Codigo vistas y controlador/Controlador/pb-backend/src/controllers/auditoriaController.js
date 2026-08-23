const { query } = require('../db/pool');

/**
 * Registra una acción en la tabla de auditoría (FR-60).
 * Se llama desde otros controladores después de cada operación.
 *
 * @param {number} usuarioId
 * @param {string} accion   — ej: 'crear_material', 'editar_usuario', 'registrar_entrada'
 * @param {string} detalle  — descripción breve del registro afectado
 */
async function registrar(usuarioId, accion, detalle) {
  try {
    await query(
      `INSERT INTO reporte (
         reporte_tipo_reporte,
         reporte_estado,
         reporte_periodo_inicio,
         reporte_periodo_fin,
         usuario_id_usuario
       ) VALUES ($1, $2, now()::date, now()::date, $3)`,
      [`auditoria:${accion}:${detalle}`, 'completado', usuarioId]
    );
  } catch (err) {
    // La auditoría no debe romper el flujo principal
    console.warn('No se pudo registrar auditoría:', err.message);
  }
}

/**
 * GET /api/auditoria
 * Lista registros de auditoría — solo gerencia (FR-60)
 * Query params: ?desde=&hasta=&usuario_id=&accion=
 */
async function listar(req, res) {
  const { desde, hasta, usuario_id, accion } = req.query;
  try {
    const { rows } = await query(
      `SELECT
         r.reporte_id_reporte                              AS id,
         r.reporte_fecha_generacion                        AS timestamp,
         u.usuario_username                                AS usuario,
         -- El tipo_reporte tiene formato 'auditoria:accion:detalle'
         SPLIT_PART(r.reporte_tipo_reporte, ':', 2)        AS accion,
         SPLIT_PART(r.reporte_tipo_reporte, ':', 3)        AS detalle
       FROM reporte r
       LEFT JOIN usuario u ON u.usuario_id_usuario = r.usuario_id_usuario
       WHERE r.reporte_tipo_reporte LIKE 'auditoria:%'
         AND ($1::date IS NULL OR r.reporte_fecha_generacion >= $1::date)
         AND ($2::date IS NULL OR r.reporte_fecha_generacion < ($2::date + INTERVAL '1 day'))
         AND ($3::bigint IS NULL OR r.usuario_id_usuario = $3)
         AND ($4::text IS NULL OR r.reporte_tipo_reporte ILIKE '%' || $4 || '%')
       ORDER BY r.reporte_fecha_generacion DESC
       LIMIT 200`,
      [desde || null, hasta || null, usuario_id || null, accion || null]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error listando auditoría:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { registrar, listar };
