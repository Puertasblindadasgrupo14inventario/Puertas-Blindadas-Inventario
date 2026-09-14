const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/materialesController');
const { soloGerencia } = require('../middleware/auth');
const { authMiddleware } = require('../middleware/auth');

// Todos los endpoints requieren autenticación
router.use(authMiddleware);

// Catálogos para formularios (deben ir antes de /:sku)
router.get('/catalogos/unidades',   ctrl.listarUnidades);
router.get('/catalogos/categorias', ctrl.listarCategorias);

// Incremento 2: rutas especiales (antes de /:sku)
router.get('/pinturas-sobrantes',  ctrl.pinturasSobrantes);
router.post('/duplicar', soloGerencia, ctrl.duplicar);

// CRUD materiales
router.get('/',     ctrl.listar);
router.get('/:sku', ctrl.obtener);
router.post('/',    ctrl.crear);
router.put('/:sku',    ctrl.actualizar);
router.delete('/:sku', soloGerencia, ctrl.eliminar);

// Incremento 2: acciones sobre un material específico
router.put('/:sku/reactivar',       soloGerencia, ctrl.reactivar);
router.get('/:sku/historial-precios', ctrl.historialPrecios);

module.exports = router;
