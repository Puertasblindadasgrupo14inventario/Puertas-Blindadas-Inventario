const express = require('express');
const router  = express.Router();
const { login, cambiarPassword, solicitarRecuperacion, resetearPassword } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

router.post('/login', login);
router.post('/cambiar-password', authMiddleware, cambiarPassword);
// CU-77
router.post('/solicitar-recuperacion', solicitarRecuperacion);
router.post('/resetear-password', resetearPassword);

module.exports = router;
