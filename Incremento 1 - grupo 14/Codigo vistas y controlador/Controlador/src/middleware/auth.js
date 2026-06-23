const jwt = require('jsonwebtoken');

/**
 * Verifica el token JWT en el header Authorization.
 * Si es válido, adjunta el payload en req.user y continúa.
 */
function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, username, nombre, rol }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
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
