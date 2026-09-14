const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/ordenesTrabajoController');
const { authMiddleware, soloGerencia } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/',                       ctrl.listar);
router.get('/:id/consumos',           ctrl.consultarConsumos);
router.post('/:id/consumos',          ctrl.registrarConsumo);
router.put('/:id/estimados',          ctrl.registrarEstimados);
router.delete('/:id/materiales/:sku', ctrl.eliminarMaterial);
router.get('/:id/comparativo',        ctrl.comparativo);
router.get('/:id/costos',    soloGerencia, ctrl.costos);
router.get('/:id/rentabilidad', soloGerencia, ctrl.rentabilidad);

module.exports = router;
