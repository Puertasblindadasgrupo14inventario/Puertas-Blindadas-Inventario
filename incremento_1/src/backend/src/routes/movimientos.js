const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/movimientosController');
const { authMiddleware, soloGerencia } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/',            ctrl.listar);
router.get('/catalogos',   ctrl.catalogos);
router.post('/entrada',    ctrl.registrarEntrada);
router.post('/salida',     ctrl.registrarSalida);
router.post('/:id/revertir', soloGerencia, ctrl.revertir);

module.exports = router;
