const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/alertasFaltantesController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/',                   ctrl.listar);
router.post('/generar',           ctrl.generar);
router.get('/:id',                ctrl.obtener);
router.put('/:id/solicitud',      ctrl.emitirSolicitud);
router.put('/:id/resolver',       ctrl.resolver);

module.exports = router;
