const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/reservasController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/',              ctrl.listar);
router.put('/:id/liberar',   ctrl.liberar);
router.put('/:id/anular',    ctrl.anular);

module.exports = router;
