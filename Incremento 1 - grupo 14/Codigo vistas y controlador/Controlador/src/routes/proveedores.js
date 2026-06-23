const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/proveedoresController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/',     ctrl.listar);
router.get('/:id',  ctrl.obtener);
router.post('/',    ctrl.crear);
router.put('/:id',  ctrl.actualizar);

module.exports = router;
