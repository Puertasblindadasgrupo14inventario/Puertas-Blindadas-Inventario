const jwt = require('jsonwebtoken');
const { query } = require('../db/pool');

/**
 * Verifica el token JWT en el header Authorization.
 * Si es válido, verifica que la cuenta siga activa en la BD
 * y adjunta el payload en req.user.
 */
async function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar que la cuenta sigue activa en la base de datos
    const { rows } = await query(
      'SELECT usuario_estado_cuenta FROM inventario.usuario WHERE usuario_id_usuario = $1',
      [payload.id]
    );

    if (!rows.length || !['activo','activa'].includes(rows[0].usuario_estado_cuenta)) {
      return res.status(401).json({ error: 'Cuenta desactivada. Contacte al administrador.' });
    }

    req.user = payload; // { id, username, nombre, rol }
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
    return res.status(500).json({ error: 'Error interno de autenticación' });
  }
}

/**
 * Solo permite acceso a usuarios con rol gerencia.
 * Usar después de authMiddleware.
 */
function soloGerencia(req, res, next) {
  if (req.user?.rol !== 'gerencia') {
    return res.status(403).json({ error: 'Acceso restringido a gerencia' });
  }
  next();
}

/**
 * Permite acceso a gerencia, administrador y jop.
 * Bloquea solo roles sin acceso operativo (técnico, secretaria).
 */
function soloOperativo(req, res, next) {
  const rolesPermitidos = ['gerencia', 'administrador', 'jop'];
  if (!rolesPermitidos.includes(req.user?.rol)) {
    return res.status(403).json({ error: 'Acceso restringido a personal operativo' });
  }
  next();
}

module.exports = { authMiddleware, soloGerencia, soloOperativo };
