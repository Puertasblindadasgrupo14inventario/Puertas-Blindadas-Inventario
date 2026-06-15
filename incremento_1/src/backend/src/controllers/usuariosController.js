const bcrypt   = require('bcrypt');
const { query } = require('../db/pool');
const audLog = require('./auditoriaController');

/**
 * GET /api/usuarios
 * Lista todos los usuarios — solo gerencia (FR-57)
 */
async function listar(req, res) {
  const { buscar, rol, estado } = req.query;
  try {
    const { rows } = await query(
      `SELECT
         u.usuario_id_usuario                                    AS id,
         u.usuario_username                                      AS username,
         u.usuario_correo                                        AS correo,
         u.usuario_estado_cuenta                                 AS estado,
         u.usuario_fecha_de_creacion                             AS creado,
         u.usuario_fecha_ultima_conexion                         AS ultima_conexion,
         u.usuario_es_gerencia                                   AS es_gerencia,
         u.usuario_es_jop                                        AS es_jop,
         CONCAT_WS(' ',
           u.usuario_nombre_completo_primer_nombre_usuario,
           u.usuario_nombre_completo_primer_apellido_usuario)    AS nombre_completo,
         CASE
           WHEN u.usuario_es_gerencia THEN 'gerencia'
           WHEN u.usuario_es_jop      THEN 'jop'
           ELSE 'otro'
         END AS rol
       FROM usuario u
       WHERE ($1::text IS NULL OR
              u.usuario_username ILIKE '%' || $1 || '%' OR
              u.usuario_correo   ILIKE '%' || $1 || '%' OR
              CONCAT(u.usuario_nombre_completo_primer_nombre_usuario, ' ',
                     u.usuario_nombre_completo_primer_apellido_usuario) ILIKE '%' || $1 || '%')
         AND ($2::text IS NULL OR
              ($2 = 'gerencia' AND u.usuario_es_gerencia = TRUE) OR
              ($2 = 'jop'      AND u.usuario_es_jop = TRUE))
         AND ($3::text IS NULL OR u.usuario_estado_cuenta ILIKE $3 OR u.usuario_estado_cuenta ILIKE $3 || 'a')
       ORDER BY u.usuario_nombre_completo_primer_apellido_usuario`,
      [buscar || null, rol || null, estado || null]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error listando usuarios:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/usuarios
 * Crear usuario — solo gerencia (CU-72 a CU-75)
 */
async function crear(req, res) {
  const {
    username, correo, password,
    nombre, apellido, rol, estado
  } = req.body;

  if (!username || !password || !rol) {
    return res.status(400).json({ error: 'Username, contraseña y rol son requeridos' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
  }

  try {
    // Verificar unicidad de username y correo
    const { rows: exist } = await query(
      `SELECT usuario_id_usuario FROM usuario
       WHERE usuario_username = $1 OR ($2::text IS NOT NULL AND usuario_correo = $2)`,
      [username, correo || null]
    );
    if (exist.length > 0) {
      return res.status(409).json({ error: 'El username o correo ya está en uso' });
    }

    // Insertar usuario
    const { rows } = await query(
      `INSERT INTO usuario (
         usuario_username, usuario_correo,
         usuario_nombre_completo_primer_nombre_usuario,
         usuario_nombre_completo_primer_apellido_usuario,
         usuario_estado_cuenta,
         usuario_es_gerencia, usuario_es_jop
       ) VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING usuario_id_usuario AS id`,
      [
        username, correo || null,
        nombre || null, apellido || null,
        estado || 'activa',
        rol === 'gerencia', rol === 'jop'
      ]
    );

    const userId = rows[0].id;

    // Insertar contraseña hasheada
    const hash = await bcrypt.hash(password, 12);
    await query(
      `INSERT INTO usuario_contrasena (usuario_id_usuario, usuario_contrasena) VALUES ($1, $2)`,
      [userId, hash]
    );

    audLog.registrar(req.user?.id, 'crear_usuario', `username: ${username}, rol: ${rol}`);
    res.status(201).json({ message: 'Usuario creado correctamente', id: userId });
  } catch (err) {
    console.error('Error creando usuario:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * PUT /api/usuarios/:id/permisos
 * Editar rol y estado de un usuario — solo gerencia (FR-61)
 */
async function editarPermisos(req, res) {
  const { id }    = req.params;
  const { rol, estado } = req.body;

  if (!rol && !estado) {
    return res.status(400).json({ error: 'Debes enviar al menos rol o estado' });
  }

  try {
    const { rowCount } = await query(
      `UPDATE usuario SET
         usuario_es_gerencia  = CASE WHEN $1 = 'gerencia' THEN TRUE  ELSE FALSE END,
         usuario_es_jop       = CASE WHEN $1 = 'jop'      THEN TRUE  ELSE FALSE END,
         usuario_estado_cuenta = COALESCE($2, usuario_estado_cuenta),
         usuario_fecha_de_ultima_edicion = now()
       WHERE usuario_id_usuario = $3`,
      [rol || 'jop', estado || null, id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    audLog.registrar(req.user?.id, 'editar_permisos', `usuario_id: ${id}, rol: ${rol}, estado: ${estado}`);
    res.json({ message: 'Permisos actualizados correctamente' });
  } catch (err) {
    console.error('Error editando permisos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/usuarios/:id/recuperar-password
 * Genera nueva contraseña temporal — solo gerencia (FR-56)
 */
async function recuperarPassword(req, res) {
  const { id } = req.params;

  try {
    const { rows } = await query(
      `SELECT usuario_correo, usuario_username FROM usuario WHERE usuario_id_usuario = $1`, [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // En producción aquí iría el envío de email con enlace de recuperación.
    // Por ahora generamos una contraseña temporal y la devolvemos.
    const tempPassword = Math.random().toString(36).slice(-10);
    const hash = await bcrypt.hash(tempPassword, 12);

    await query(
      `UPDATE usuario_contrasena SET usuario_contrasena = $1 WHERE usuario_id_usuario = $2`,
      [hash, id]
    );

    res.json({
      message: `Contraseña temporal generada para ${rows[0].usuario_username}`,
      // En producción NO devolver la contraseña — enviar por email
      password_temporal: tempPassword,
      correo: rows[0].usuario_correo
    });
  } catch (err) {
    console.error('Error recuperando contraseña:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/usuarios/auditoria
 * Historial de acciones de usuarios — solo gerencia (FR-60)
 * Nota: la auditoría real requiere una tabla de logs dedicada.
 * Por ahora devuelve los movimientos registrados por cada usuario.
 */
async function auditoria(req, res) {
  const { desde, hasta, usuario_id } = req.query;
  try {
    const { rows } = await query(
      `SELECT
         mi.movimiento_inventario_fecha_hora   AS timestamp,
         u.usuario_username                    AS usuario,
         'registrar_movimiento'                AS accion,
         CONCAT(
           tm.movimiento_inventario_tipo_movimiento_nombre, ' — SKU ',
           mi.material_sku, ', cantidad: ', mi.movimiento_inventario_cantidad
         )                                     AS detalle
       FROM movimiento_inventario mi
       JOIN usuario u ON u.usuario_id_usuario = mi.usuario_id_usuario
       JOIN movimiento_inventario_tipo_movimiento tm
            ON tm.movimiento_inventario_tipo_movimiento_id_tipo_movimiento
             = mi.movimiento_inventario_tipo_movimiento_id_tipo_movimiento
       WHERE ($1::date IS NULL OR mi.movimiento_inventario_fecha_hora >= $1::date)
         AND ($2::date IS NULL OR mi.movimiento_inventario_fecha_hora < ($2::date + INTERVAL '1 day'))
         AND ($3::bigint IS NULL OR mi.usuario_id_usuario = $3)
       ORDER BY mi.movimiento_inventario_fecha_hora DESC
       LIMIT 200`,
      [desde || null, hasta || null, usuario_id || null]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error obteniendo auditoria:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { listar, crear, editarPermisos, recuperarPassword, auditoria };
