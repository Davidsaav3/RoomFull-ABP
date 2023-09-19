const { Router } = require('express');
const { obtenerChats, crearChats, actualizarChats, borrarChats, obtenerChatsPorFecha, getChatNombreAdmin, obtenerChatsPorNombre} = require('../controllers/chats');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos');
const { validarJWT } = require('../middleware/validarJWT');

const router = Router();


router.get('/', [
    validarJWT,
    check('id', 'El id debe ser válido').isMongoId().optional(),
    check('desde', ' Debe ser un valor numérico').isNumeric().optional(),
    check('mensajes','El campo mensajes es opcional').isNumeric().optional(),
    validarCampos
], obtenerChats);

router.get('/porFecha/:id', [
    validarJWT,
    check('id','El id de usuario es obligatorio').isMongoId(),
    validarCampos
], obtenerChatsPorFecha )


router.post('/', [
    validarJWT,
    check('idUsuarioEmi','El id de emisor debe ser válido').isMongoId(),
    check('idUsuarioRec','El id de receptor debe ser válido').isMongoId(),
    check('asunto','El asunto del chat es obligatorio').not().isEmpty().trim(),
    check('mensajes','El campo mensajes es obligatorio').not().isEmpty(),
    validarCampos
], crearChats);

router.put('/:id', [
    validarJWT,
    check('id', 'El id debe ser válido').isMongoId(),
    //check('autor', 'El id de autor debe existir y ser válido').isMongoId(),
    check('mensajes', 'El mensaje debe llevar algún contenido').not().isEmpty(),
    validarCampos
], actualizarChats);

router.delete('/:id', [
    validarJWT,
    check('id', 'El id debe ser válido').isMongoId(),
    validarCampos
], borrarChats);

router.get('/nameAdmin',[
    validarJWT,
    check('asunto', 'Debe ser de tipo string').isString().optional(),
    check('desde', 'Debe ser un valor numérico').isNumeric().optional(),
    check('fecha', 'La fecha debe ser de tipo asc o desc').optional(),
    validarCampos
], getChatNombreAdmin)

module.exports = router;