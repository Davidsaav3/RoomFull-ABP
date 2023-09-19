const { Router } = require('express');
const { getTipoSus, crearTipoSus, actualizarTipoSus, borrarTipoSus, getTipoSusNombreAdmin, getTipoSusAll, getTipoSusNombre } = require('../controllers/tipoSuscripciones');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos');
const { validarJWT } = require('../middleware/validarJWT');

const router = Router();

// -------------------------------------------------------

router.get('/', [
    check('id', 'El id debe ser válido').isMongoId().optional(),
    check('desde', ' Debe ser un valor numérico').isNumeric().optional(),
], getTipoSus);

router.get('/nombre', [
    check('nombre', 'Debe ser de tipo string y obligatorio').isString().not().isEmpty(),
], getTipoSusNombre);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'El argumento descripción de suscripción es obligatorio').not().isEmpty(),
    check('precio', 'El argumento precio es obligatorio').not().isEmpty(),
    check('caract', 'El argumento características es obligatorio').not().isEmpty(),
    check('modelos', 'El argumento modelos es obligatorio').not().isEmpty().isNumeric(),
    validarCampos
], crearTipoSus);

router.put('/:id', [
    validarJWT,
    check('id', 'El identificador no es un id válido').isMongoId(),
    check('nombre', 'El argumento nombre es opcional').isString().optional(),
    check('descripcion', 'El argumento descripción es opcional').isString().optional(),
    check('precio', 'El argumento precio es opcional').isNumeric().optional(),
    check('caract', 'El argumento características es opcional').isString().optional(),
    check('modelos', 'El argumento modelos es opcional').isNumeric().optional(),
    validarCampos
], actualizarTipoSus);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarTipoSus);

router.get('/nameAdmin', [
    validarJWT,
    check('nombre', 'Debe ser de tipo string').isString().optional(),
    check('desde', 'Debe ser un valor numérico').isNumeric().optional(),
    check('precio', 'Debe ser asc o desc').optional(),
    validarCampos
], getTipoSusNombreAdmin);

router.get('/All', [

], getTipoSusAll);

module.exports = router;