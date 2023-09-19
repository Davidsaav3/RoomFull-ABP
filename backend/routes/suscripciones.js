const { Router } = require('express');
const { getSus, crearSus, actualizarSus, borrarSus } = require('../controllers/suscripciones');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos');
const { validarJWT } = require('../middleware/validarJWT');
const router = Router();

// -------------------------------------------------------

router.get('/', [
    validarJWT,
    check('id', 'El argumento id es opcional').optional().isMongoId(),
    check('idusu','El argumento idusu es opcional').optional().isMongoId(),
    validarCampos
], getSus);

router.post('/', [
    check('fechaIni', 'El argumento fecha inicio es obligatorio').not().isEmpty(),
    check('fechaFin', 'El argumento fecha fin de suscripción es obligatorio').not().isEmpty(),
    check('metodoPago', 'El argumento método de pago es obligatorio').not().isEmpty(),
    check('idUsuario', 'El identificador de usuario no es válido').isMongoId(),
    check('idTipoSus', 'El tipo de suscripción no es válido').isMongoId(),
    check('renovacion', 'El argumento renovación es obligatorio').not().isEmpty(),
    validarCampos
], crearSus);

router.put('/:id', [
    validarJWT,
    check('fechaIni', 'El argumento fecha inicio es obligatorio').not().isEmpty(),
    check('fechaFin', 'El argumento fecha fin de suscripción es obligatorio').not().isEmpty(),
    check('metodoPago', 'El argumento método de pago es obligatorio').not().isEmpty(),
    check('idUsuario', 'El identificador de usuario no es válido').isMongoId(),
    check('idTipoSus', 'El tipo de suscripción no es válido').isMongoId(),
    check('renovacion', 'El argumento renovación es obligatorio').not().isEmpty(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], actualizarSus);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarSus);

module.exports = router;