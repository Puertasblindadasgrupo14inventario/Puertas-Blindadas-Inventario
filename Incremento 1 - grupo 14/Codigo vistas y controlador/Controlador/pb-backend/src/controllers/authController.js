const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const { query } = require('../db/pool');

/**
 * POST /api/auth/login
 * Body: { username, password }
 *
 * El modelo tiene:
 *   usuario.usuario_username
 *   usuario.usuario_estado_cuenta  ('activo' | 'inactivo')
 *   usuario.usuario_es_gerencia    BOOLEAN
 *   usuario.usuario_es_jop         BOOLEAN
 *   usuario_contrasena.usuario_contrasena (hash bcrypt)
 */
async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  try {
    // Buscar usuario + contraseña en una sola query
    const { rows } = await query(
      `SELECT
         u.usuario_id_usuario                               AS id,
         u.usuario_username                                 AS username,
         u.usuario_nombre_completo_primer_nombre_usuario    AS primer_nombre,
         u.usuario_nombre_completo_primer_apellido_usuario  AS primer_apellido,
         u.usuario_estado_cuenta                            AS estado,
         u.usuario_es_gerencia                              AS es_gerencia,
         u.usuario_es_jop                                   AS es_jop,
         u.usuario_es_tecnico                               AS es_tecnico,
         u.usuario_es_administrador                         AS es_admin,
         u.usuario_es_secretaria                            AS es_sec,
         uc.usuario_contrasena                              AS password_hash
       FROM usuario u
       JOIN usuario_contrasena uc ON uc.usuario_id_usuario = u.usuario_id_usuario
       WHERE u.usuario_username = $1`,
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const user = rows[0];

    // Verificar estado de cuenta
    if (!['activo','activa'].includes(user.estado)) {
      return res.status(403).json({ error: 'Cuenta inactiva. Contacta a Gerencia.' });
    }

    // Verificar contraseña
    const passwordOk = await bcrypt.compare(password, user.password_hash);
    if (!passwordOk) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Determinar rol para el frontend
    // El modelo usa booleanos: es_gerencia, es_jop, es_tecnico, etc.
    let rol = 'jop';
    if (user.es_gerencia)      rol = 'gerencia';
    else if (user.es_tecnico)  rol = 'tecnico';
    else if (user.es_admin)    rol = 'administrador';
    else if (user.es_sec)      rol = 'secretaria';

    const nombre = `${user.primer_nombre || ''} ${user.primer_apellido || ''}`.trim();

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, nombre, rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    // Actualizar última conexión
    await query(
      `UPDATE usuario SET usuario_fecha_ultima_conexion = now()
       WHERE usuario_id_usuario = $1`,
      [user.id]
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, nombre, rol }
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/auth/cambiar-password
 * Requiere token. Body: { password_actual, password_nueva }
 */
async function cambiarPassword(req, res) {
  const { password_actual, password_nueva } = req.body;
  const userId = req.user.id;

  if (!password_actual || !password_nueva) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  if (password_nueva.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
  }

  try {
    const { rows } = await query(
      `SELECT usuario_contrasena FROM usuario_contrasena WHERE usuario_id_usuario = $1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const ok = await bcrypt.compare(password_actual, rows[0].usuario_contrasena);
    if (!ok) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    const hash = await bcrypt.hash(password_nueva, 12);
    await query(
      `UPDATE usuario_contrasena SET usuario_contrasena = $1
       WHERE usuario_id_usuario = $2`,
      [hash, userId]
    );

    res.json({ message: 'Contraseña actualizada correctamente' });

  } catch (err) {
    console.error('Error cambiando contraseña:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { login, cambiarPassword };
