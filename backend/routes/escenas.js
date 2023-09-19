const { Router } = require('express');


const { obtenerEscenas, obtenerEscenaEnlace, obtenerEscenasNoUsu, obtenerEscenasNoTokenCargar, crearEscena, actualizarEscena, borrarEscena, darLikeGuardar, buscarPorFiltro, buscarPorFiltroNoUsu, obtenerEscenasUsuario, getEscenaNombreAdmin, getEscenaNombre, buscarPorFiltroPerfil, buscarPorFiltroNoPrivado, obtenerEscenasIdUsuario, buscarPorFiltroNoPrivadoNoUsu, cambiarNombre, obtenerEscenasNoToken } = require('../controllers/escenas');

const { validarCampos } = require('../middleware/validarCampos');
const { validarJWT } = require('../middleware/validarJWT');
const { check } = require('express-validator');

const router = Router();
router.get('/', [
    validarJWT,
    check('id', 'El id debe ser válido').isMongoId().optional(),
    check('desde', ' Debe ser un valor numérico').isNumeric().optional(),
    validarCampos
], obtenerEscenas);

router.get('/noToken', [
    check('id', 'El id debe ser válido').isMongoId().optional(),
    check('desde', ' Debe ser un valor numérico').isNumeric().optional(),
    validarCampos
], obtenerEscenasNoToken);

router.get('/cargarNoToken', [
    check('id', 'El id debe ser válido').isMongoId().optional(),
    check('desde', ' Debe ser un valor numérico').isNumeric().optional(),
    validarCampos
], obtenerEscenasNoTokenCargar);

router.get('/noUsu', [
    check('id', 'El id debe ser válido').isMongoId().optional(),
    check('desde', ' Debe ser un valor numérico').isNumeric().optional(),
    validarCampos
], obtenerEscenasNoUsu);

router.post('/', [
    validarJWT,
    check('nombre', 'Debe introducir un nombre').not().isEmpty().trim(),
    check('descripcion', 'Debe introducir una descripcion').not().isEmpty().trim(),
    //Campos opcionales
    check('privado', 'Solo acepta Boolean').optional().isBoolean(),
    check('puntos','El campo puntos es opcional').optional(),
    validarCampos
], crearEscena);

router.put('/:id', [
    validarJWT,
    check('nombre', 'Debe introducir un nombre').optional().not().isEmpty(),
    check('descripcion', 'Debe introducir una descripcion').optional().not().isEmpty(),
    check('privado', 'Solo acepta Boolean').optional().isBoolean(),
    check('opciones','El campo opciones es opcional').optional(),
    check('puntos','El campo puntos es opcional').optional(),
    validarCampos
], actualizarEscena);

router.delete('/:id', [
    validarJWT,
    check('id', 'El id debe ser válido').isMongoId(),
    validarCampos
], borrarEscena);

router.put('/darLikeGuardar/:id', [
    validarJWT,
    check('accion', 'Debes pasar que accion se va a realizar sobre la escena').not().isEmpty(),
    check('id', 'El id debe ser válido').isMongoId(),
    validarCampos
], darLikeGuardar);

router.put('/cambiarNombre/:id', [
    validarJWT,
    check('id', 'El id debe ser válido').isMongoId(),
    validarCampos
], cambiarNombre);

router.get('/filtros', [
    validarJWT,
    check('desde', 'Específica el inicio desde donde va a recoger escenas').optional().not().isEmpty(),
    check('fecha', 'Campo opcional filtro por fecha').optional().not().isEmpty(),
    check('NValoraciones', 'Campo opcional filtro por valoraciones').optional().not().isEmpty(),
    check('NVisitas', 'Campo opcional filtro por visualizaciones').optional().not().isEmpty(),
    check('autor', 'Campo opcional filtro por autor').optional().not().isEmpty(),
    check('nombre', 'Campo opcional filtro por nombre de la escena').optional(),
    validarCampos
], buscarPorFiltro);

router.get('/filtrosNoPriv', [
    validarJWT,
    check('desde', 'Específica el inicio desde donde va a recoger escenas').optional().not().isEmpty(),
    check('fecha', 'Campo opcional filtro por fecha').optional().not().isEmpty(),
    check('NValoraciones', 'Campo opcional filtro por valoraciones').optional().not().isEmpty(),
    check('NVisitas', 'Campo opcional filtro por visualizaciones').optional().not().isEmpty(),
    check('autor', 'Campo opcional filtro por autor').optional().not().isEmpty(),
    check('nombre', 'Campo opcional filtro por nombre de la escena').optional(),
    validarCampos
], buscarPorFiltroNoPrivado);

router.get('/filtrosNoPrivNoUsu', [
    check('desde', 'Específica el inicio desde donde va a recoger escenas').optional().not().isEmpty(),
    check('fecha', 'Campo opcional filtro por fecha').optional().not().isEmpty(),
    check('NValoraciones', 'Campo opcional filtro por valoraciones').optional().not().isEmpty(),
    check('NVisitas', 'Campo opcional filtro por visualizaciones').optional().not().isEmpty(),
    check('autor', 'Campo opcional filtro por autor').optional().not().isEmpty(),
    check('nombre', 'Campo opcional filtro por nombre de la escena').optional(),
    validarCampos
], buscarPorFiltroNoPrivadoNoUsu);

router.get('/filtrosPerfil', [
    validarJWT,
    check('desde', 'Específica el inicio desde donde va a recoger escenas').optional().not().isEmpty(),
    check('fecha', 'Campo opcional filtro por fecha').optional().not().isEmpty(),
    check('NValoraciones', 'Campo opcional filtro por valoraciones').optional().not().isEmpty(),
    check('NVisitas', 'Campo opcional filtro por visualizaciones').optional().not().isEmpty(),
    check('autor', 'Campo opcional filtro por autor').optional().not().isEmpty(),
    check('nombre', 'Campo opcional filtro por nombre de la escena').optional(),
    validarCampos
], buscarPorFiltroPerfil);

router.get('/filtrosNoUsu', [
    check('desde', 'Específica el inicio desde donde va a recoger escenas').optional().not().isEmpty(),
    check('fecha', 'Campo opcional filtro por fecha').optional().not().isEmpty(),
    check('NValoraciones', 'Campo opcional filtro por valoraciones').optional().not().isEmpty(),
    check('NVisitas', 'Campo opcional filtro por visualizaciones').optional().not().isEmpty(),
    check('autor', 'Campo opcional filtro por autor').optional().not().isEmpty(),
    validarCampos
], buscarPorFiltroNoUsu);

router.get('/name', [
    validarJWT,
    check('nombreEscena', 'Debe ser de tipo string').isString().optional(),
    validarCampos
], getEscenaNombre);

router.get('/nameNoUsu', [
    check('nombreEscena', 'Debe ser de tipo string').isString().optional(),
    validarCampos
], getEscenaNombre);

router.get('/obtenerEscenasUsuario', [
    validarJWT,
    check('criterio', 'Campo obligatorio referido a un criterio').not().isEmpty(),
    validarCampos
], obtenerEscenasUsuario);

router.get('/nameAdmin', [
    validarJWT,
    check('nombre', 'Debe ser de tipo string').isString().optional(),
    check('desde', 'Debe ser un valor numérico').isNumeric().optional(),
    check('privado', 'El campo deber ser de tipo true o false').optional(),
    check('NVisitas', 'El campo debe ser de tipo asc o desc').optional(),
    check('NValoraciones', 'El campo debe ser de tipo asc o desc').optional(),
    validarCampos
], getEscenaNombreAdmin)
router.get('/enlace', [
    check('enlace', 'Debe proporcionar el enlace privado del modelo').isString().notEmpty(),
    validarCampos
], obtenerEscenaEnlace)

router.get('/escenasdeusuario', [
    validarJWT,
    check('id', 'El id de usuario es obligatorio').isMongoId().notEmpty(),
    validarCampos
], obtenerEscenasIdUsuario)


module.exports = router;