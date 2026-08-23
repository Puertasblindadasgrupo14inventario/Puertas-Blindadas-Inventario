const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/reportesController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/movimientos', ctrl.reporteMovimientos);
router.get('/mermas',      ctrl.reporteMermas);

module.exports = router;
