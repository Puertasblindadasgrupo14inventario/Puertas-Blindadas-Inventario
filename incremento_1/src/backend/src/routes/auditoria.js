const express = require('express');
const router  = express.Router();
const { listar } = require('../controllers/auditoriaController');
const { authMiddleware, soloGerencia } = require('../middleware/auth');

router.use(authMiddleware);
router.use(soloGerencia);

router.get('/', listar);

module.exports = router;
