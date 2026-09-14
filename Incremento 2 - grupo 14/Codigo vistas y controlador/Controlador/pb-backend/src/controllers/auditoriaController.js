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
      `INSERT INTO finanzas.evento_auditoria (
         id_usuario,
         accion_realizada,
         entidad_afectada,
         registro_afectado
       ) VALUES ($1, $2, $3, $4)`,
      [usuarioId, accion, 'inventario', detalle]
    );
  } catch (err) {
    // La auditoría no debe romper el flujo principal
    console.error('❌ AUDITORÍA FALLÓ:', err.message, '| Params:', { usuarioId, accion, detalle });
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
         ea.id_evento                                AS id,
         ea.fecha_hora                               AS timestamp,
         u.usuario_username                          AS usuario,
         ea.accion_realizada                         AS accion,
         ea.registro_afectado                        AS detalle,
         ea.entidad_afectada                         AS entidad,
         ea.motivo,
         ea.observacion
       FROM finanzas.evento_auditoria ea
       LEFT JOIN inventario.usuario u ON u.usuario_id_usuario = ea.id_usuario
       WHERE ($1::date IS NULL OR ea.fecha_hora >= $1::timestamptz)
         AND ($2::date IS NULL OR ea.fecha_hora < ($2::date + INTERVAL '1 day'))
         AND ($3::bigint IS NULL OR ea.id_usuario = $3)
         AND ($4::text IS NULL OR ea.accion_realizada ILIKE '%' || $4 || '%')
       ORDER BY ea.fecha_hora DESC
       LIMIT $5`,
      [desde || null, hasta || null, usuario_id || null, accion || null,
       (!desde && !hasta && !usuario_id && !accion) ? 30 : 200]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error listando auditoría:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { registrar, listar };
