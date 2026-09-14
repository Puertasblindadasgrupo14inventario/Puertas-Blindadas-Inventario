const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const { query } = require('../db/pool');
const auditoria = require('./auditoriaController');

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
         uc.usuario_contrasena                              AS password_hash,
         uc.es_temporal                                     AS es_temporal
       FROM usuario u
       JOIN usuario_contrasena uc ON uc.usuario_id_usuario = u.usuario_id_usuario
       WHERE u.usuario_username = $1
       ORDER BY u.usuario_id_usuario LIMIT 1`,
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

    await auditoria.registrar(user.id, 'login', `Inicio de sesión: ${user.username}`);

    // CU-84 CP3: Verificar si la contraseña es temporal (persistido en BD)
    const requiere_cambio = user.es_temporal === true;

    res.json({
      token,
      user: { id: user.id, username: user.username, nombre, rol },
      ...(requiere_cambio && { requiere_cambio_password: true })
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
      `UPDATE usuario_contrasena SET usuario_contrasena = $1, es_temporal = FALSE
       WHERE usuario_id_usuario = $2`,
      [hash, userId]
    );

    await auditoria.registrar(userId, 'cambiar_password', `Usuario ID ${userId} cambió su contraseña`);
    res.json({ message: 'Contraseña actualizada correctamente' });

  } catch (err) {
    console.error('Error cambiando contraseña:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/auth/solicitar-recuperacion
 * CU-82: Genera token temporal de recuperación
 * Body: { username } — acepta username o email
 */
// CU-83: Antispam — limitar a 3 solicitudes por IP en 15 minutos
const _recuperacionIntentos = new Map();
function verificarAntispam(ip) {
  const ahora = Date.now();
  const ventana = 15 * 60 * 1000; // 15 minutos
  if (!_recuperacionIntentos.has(ip)) _recuperacionIntentos.set(ip, []);
  const intentos = _recuperacionIntentos.get(ip).filter(t => ahora - t < ventana);
  _recuperacionIntentos.set(ip, intentos);
  if (intentos.length >= 3) return false;
  intentos.push(ahora);
  return true;
}

async function solicitarRecuperacion(req, res) {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Debe ingresar su correo electrónico o nombre de usuario' });
  }

  // CU-83 CP4: Control antispam
  const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';
  if (!verificarAntispam(clientIp)) {
    return res.status(429).json({ error: 'Demasiadas solicitudes de recuperación. Intente nuevamente en 15 minutos.' });
  }

  try {
    // Buscar por username O por correo electrónico
    const { rows } = await query(
      `SELECT u.usuario_id_usuario AS id, u.usuario_username AS username,
              u.usuario_estado_cuenta AS estado
       FROM usuario u
       WHERE u.usuario_username = $1
          OR u.usuario_correo = $1`,
      [username]
    );

    // CU-77 Exc 1: usuario no encontrado — respondemos genéricamente por seguridad
    if (rows.length === 0) {
      return res.json({
        message: 'Si el usuario existe, se ha generado un enlace de recuperación.'
      });
    }

    // CU-77 Exc 2: cuenta inactiva
    if (!['activo', 'activa'].includes(rows[0].estado)) {
      return res.json({
        message: 'Si el usuario existe, se ha generado un enlace de recuperación.'
      });
    }

    // Generar token temporal con expiración de 30 min
    const token = jwt.sign(
      { id: rows[0].id, tipo: 'recuperacion' },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    await auditoria.registrar(rows[0].id, 'solicitar_recuperacion', `Solicitud de recuperación para: ${rows[0].username}`);

    // En producción se enviaría por email. Aquí lo devolvemos en la respuesta (simulado).
    res.json({
      message: 'Si el usuario existe, se ha generado un enlace de recuperación.',
      token_recuperacion: token,
      nota: 'En producción este token se enviaría por correo electrónico.',
      expira_en: '30 minutos'
    });
  } catch (err) {
    console.error('Error en solicitar recuperación:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/auth/resetear-password
 * CU-77: Consume token de recuperación y establece nueva contraseña
 * Body: { token, password_nueva }
 */
async function resetearPassword(req, res) {
  const { token, password_nueva } = req.body;

  if (!token || !password_nueva) {
    return res.status(400).json({ error: 'Token y nueva contraseña son requeridos' });
  }

  if (password_nueva.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
  }

  try {
    // Verificar token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      // CU-83 Exc 2: token expirado — generar automáticamente uno nuevo
      if (e.name === 'TokenExpiredError') {
        const payload = jwt.decode(token);
        if (payload && payload.id && payload.tipo === 'recuperacion') {
          const nuevoToken = jwt.sign(
            { id: payload.id, tipo: 'recuperacion' },
            process.env.JWT_SECRET,
            { expiresIn: '30m' }
          );
          await auditoria.registrar(payload.id, 'solicitar_recuperacion', `Token expirado — se generó automáticamente un nuevo enlace de recuperación`);
          return res.status(400).json({
            error: 'El enlace de recuperación ha expirado. Se ha generado automáticamente uno nuevo.',
            token_regenerado: nuevoToken,
            expira_en: '30 minutos'
          });
        }
      }
      // Token inválido (no expirado, sino corrupto o manipulado)
      return res.status(400).json({ error: 'El enlace de recuperación es inválido. Solicite uno nuevo.' });
    }

    if (decoded.tipo !== 'recuperacion') {
      return res.status(400).json({ error: 'Token inválido' });
    }

    const hash = await bcrypt.hash(password_nueva, 12);
    await query(
      `UPDATE usuario_contrasena SET usuario_contrasena = $1
       WHERE usuario_id_usuario = $2`,
      [hash, decoded.id]
    );

    await auditoria.registrar(decoded.id, 'resetear_password', `Contraseña restablecida para usuario ID ${decoded.id}`);
    res.json({ message: 'Contraseña restablecida correctamente. Inicie sesión con su nueva contraseña.' });
  } catch (err) {
    console.error('Error reseteando contraseña:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { login, cambiarPassword, solicitarRecuperacion, resetearPassword };
