const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/alertasController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/',              ctrl.listar);
router.post('/generar',      ctrl.generar);
router.put('/:id/resolver',  ctrl.resolver);

module.exports = router;
