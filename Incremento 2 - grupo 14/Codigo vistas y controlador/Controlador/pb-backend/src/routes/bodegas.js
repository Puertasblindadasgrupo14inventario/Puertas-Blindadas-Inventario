const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/bodegasController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/',                           ctrl.listar);
router.get('/:id',                        ctrl.obtener);
router.get('/:id/stock-consolidado',      ctrl.stockConsolidado);
router.post('/',                          ctrl.crear);
router.put('/:id',                        ctrl.actualizar);
// Incremento 2 — Anaqueles
router.post('/:id/anaqueles',             ctrl.crearAnaquel);
router.delete('/:id/anaqueles/:anaquelId', ctrl.eliminarAnaquel);

module.exports = router;
