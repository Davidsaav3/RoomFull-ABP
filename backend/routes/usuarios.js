const { Router } = require('express');
const { getUsuarios, getUsuarioNombre, crearUsuarios, actualizarUsuarios, actualizarUsuFoto, actualizarUsuDescription, actualizarUsuMetodo, borrarUsuarios, addSuscripcion, crearUsuariosGoogle, cambiarContrasena, codigoVerificacion, verificarCodigo, nuevaContrasena, cambiarOpciones, getUsuarioNombreAdmin } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos');
const { validarJWT } = require('../middleware/validarJWT');

const router = Router();

router.get('/', [
    validarJWT,
    check('id', 'El id debe ser válido').isMongoId().optional(),
    check('desde', ' Debe ser un valor numérico').isNumeric().optional(),
    validarCampos
], getUsuarios);

router.get('/name', [
    validarJWT,
    check('nombre', 'El parámetro nombre de usuario es obligatorio').not().isEmpty(),
    validarCampos
], getUsuarioNombre);

router.post('/', [
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('nombreUsuario', 'El argumento nombre de usuario es obligatorio').not().isEmpty(),
    check('apellidos', 'El argumento apellidos es opcional').isString().optional(),
    check('email', 'El argumento email es obligatorio').not().isEmpty().isEmail(),
    validarCampos
], crearUsuarios);

router.post('/google', [
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('nombreUsuario', 'El argumento nombre de usuario es obligatorio').not().isEmpty(),
    check('apellidos', 'El argumento apellidos es opcional').isString().optional(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    //validarCampos
], crearUsuariosGoogle);

router.patch('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es opcional').isString().optional(),
    check('nombreUsuario', 'El argumento nombre de usuario es opcional').isString().optional(),
    check('apellidos', 'El argumento apellidos es opcional').isString().optional(),
    check('email', 'El argumento email es opcional').isString().optional(),
    check('descripcion', 'El argumento descripcion es opcional').isString().optional(),
    check('empresa', 'El argumento empresa es opcional').isString().optional(),
    check('telefono', 'El argumento telefono es opcional').optional(),
    validarCampos
], actualizarUsuarios);

router.put('/actualizarDesc/:id', [
    validarJWT,
    check('description', 'El argumento description es obligatorio').not().isEmpty(),
    validarCampos
], actualizarUsuDescription);

router.put('/actualizarMetodo/:id', [
    validarJWT,
    validarCampos
], actualizarUsuMetodo);

router.patch('/actualizarFoto/:id', [
    validarJWT,
    check('imagen', 'El argumento imagen es obligatorio').not().isEmpty(),
    validarCampos
], actualizarUsuFoto);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarUsuarios);

router.post('/suscripcion/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('idTipoSus', 'El identificador no es válido').isMongoId(),
    check('tiempo', 'El identificador tiempo es necesario').not().isEmpty(),
    check('metodoPago', 'El identificador método de pago es necesario').not().isEmpty(),
    validarCampos
], addSuscripcion);

router.patch('/cambiarContrasena/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('passActual', 'La contraseña es obligatoria').not().isEmpty(),
    check('passNueva1', 'La contraseña nueva es obligatoria').not().isEmpty(),
    check('passNueva2', 'La confirmación de la contraseña nueva es obligatoria').not().isEmpty(),
    validarCampos
], cambiarContrasena);

router.post('/codigoVerificacion', [
    check('email', 'El argumento email es obligatorio').not().isEmpty().isEmail(),
    validarCampos
], codigoVerificacion);

router.post('/verificarCodigo', [
    check('email', 'El argumento email es obligatorio').not().isEmpty().isEmail(),
    check('codigo', 'El argumento codigo es obligatorio').not().isEmpty(),
    validarCampos
], verificarCodigo);

router.post('/nuevaContrasena', [
    check('email', 'El campo email es obligtorio').not().isEmpty().isEmail(),
    check('contrasenaNueva', 'La contraseña nueva es obligatoria').not().isEmpty(),
    check('contrasenaNuevaRepite', 'La confirmación de la contraseña nueva es obligatoria').not().isEmpty(),
    validarCampos
], nuevaContrasena)

router.patch('/cambiarOpciones/:id', [
    validarJWT,
    check('notificaciones','El campo notificaciones es opcional').isBoolean().optional(),
    check('interacciones','El campo interacciones es opcional').isBoolean().optional(),
    check('asistente','El campo asistente es opcional').isBoolean().optional(),
    validarCampos
], cambiarOpciones)

router.get('/nameAdmin',[
    validarJWT,
    check('nombreUsuario', 'Debe ser de tipo string').isString().optional(),
    check('desde', 'Debe ser un valor numérico').isNumeric().optional(),
    check('fechaCreacion', 'La fecha debe ser de tipo asc o desc').optional(),
    check('nombre', 'El nombre debe ser de tipo asc o desc').optional(),
    validarCampos
], getUsuarioNombreAdmin)
module.exports = router;