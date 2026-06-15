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

// CRUD materiales
router.get('/',     ctrl.listar);
router.get('/:sku', ctrl.obtener);
router.post('/',    ctrl.crear);
router.put('/:sku',    ctrl.actualizar);
router.delete('/:sku', soloGerencia, ctrl.eliminar);

module.exports = router;
