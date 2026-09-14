const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/reportesController');
const { authMiddleware, soloGerencia } = require('../middleware/auth');

const usrCtrl = require('../controllers/usuariosController');

router.use(authMiddleware);

router.get('/movimientos',          ctrl.reporteMovimientos);
router.get('/mermas',               ctrl.reporteMermas);
// Incremento 2
router.get('/valorizacion',         soloGerencia, ctrl.valorizacion);
router.get('/areas',                ctrl.listarAreas);
router.get('/consumo-area',         ctrl.consumoArea);
router.get('/programacion-semanal', ctrl.programacionSemanal);
// CU-122 + CU-81.1 (exportar con detección de extracción masiva)
router.get('/programacion-semanal/exportar', usrCtrl.deteccionExtraccionMasiva, ctrl.exportarProgramacion);
router.get('/programacion-semanal/exportar-pdf', usrCtrl.deteccionExtraccionMasiva, ctrl.exportarProgramacionPDF);

module.exports = router;
