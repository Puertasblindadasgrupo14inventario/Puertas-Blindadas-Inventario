const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/pedidosController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/',                ctrl.listar);
router.get('/:id/checklist',  ctrl.checklist);
router.post('/:id/reservar',  ctrl.reservar);

module.exports = router;
