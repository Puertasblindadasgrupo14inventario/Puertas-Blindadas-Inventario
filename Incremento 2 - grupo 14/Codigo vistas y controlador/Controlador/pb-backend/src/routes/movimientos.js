const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/movimientosController');
const { authMiddleware, soloGerencia } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/',            ctrl.listar);
router.get('/catalogos',   ctrl.catalogos);
router.post('/entrada',    ctrl.registrarEntrada);
router.post('/salida',     ctrl.registrarSalida);
// CU-74 CP3: Verificar mermas pendientes >24h (debe ir antes de /:id)
router.post('/verificar-mermas-pendientes', ctrl.verificarMermasPendientes);
router.post('/:id/revertir',       soloGerencia, ctrl.revertir);
// Incremento 2 — CU-68.1
router.put('/:id/aprobar-merma',   soloGerencia, ctrl.aprobarMerma);
router.put('/:id/rechazar-merma',  soloGerencia, ctrl.rechazarMerma);

module.exports = router;
