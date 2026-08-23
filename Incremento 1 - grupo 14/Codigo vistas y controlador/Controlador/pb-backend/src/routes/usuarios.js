const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/usuariosController');
const { authMiddleware, soloGerencia } = require('../middleware/auth');

router.use(authMiddleware);
router.use(soloGerencia); // Todos los endpoints de usuarios son solo gerencia

router.get('/',                         ctrl.listar);
router.get('/auditoria',                ctrl.auditoria);
router.post('/',                        ctrl.crear);
router.put('/:id/permisos',             ctrl.editarPermisos);
router.post('/:id/recuperar-password',  ctrl.recuperarPassword);

module.exports = router;
