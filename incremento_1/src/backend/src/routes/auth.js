const express = require('express');
const router  = express.Router();
const { login, cambiarPassword } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/cambiar-password  (requiere token)
router.post('/cambiar-password', authMiddleware, cambiarPassword);

module.exports = router;
