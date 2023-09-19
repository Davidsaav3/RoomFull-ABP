const { Router } = require('express');
const { obtenerTiempoMedio, obtenerPaisesSuscripcion, obtenerUsuariosSucripcionesSuperiores, obtenerUsuariosMasConversaciones, obtenerModelosMasRepercusion } = require('../controllers/estadisticas');
const { validarCampos } = require('../middleware/validarCampos');
const { validarJWT } = require('../middleware/validarJWT');
const { check } = require('express-validator');

const router = Router();
router.get('/tiempomedio', [
    validarJWT,
    check('intervalo', 'El intervalo de tiempo es opcional').optional(),
    validarCampos
], obtenerTiempoMedio);

router.get('/suspais', [
    validarJWT,
    check('intervalo', 'El intervalo de tiempo es opcional').optional(),
    validarCampos
], obtenerPaisesSuscripcion);

router.get('/usuariosuperiores', [
    validarJWT,
    check('intervalo', 'El intervalo de tiempo es opcional').optional(),
    validarCampos
], obtenerUsuariosSucripcionesSuperiores);

router.get('/modelosmasrepercusion', [
    validarJWT,
    check('intervalo', 'El intervalo de tiempo es opcional').optional(),
    validarCampos
], obtenerModelosMasRepercusion);

router.get('/usuariosmasconversaciones', [
    validarJWT,
    check('intervalo', 'El intervalo de tiempo es opcional').optional(),
    validarCampos
], obtenerUsuariosMasConversaciones);

module.exports = router;