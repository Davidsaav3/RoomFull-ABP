/*
Ruta base: /api/login
*/

const { Router } = require('express');
const { login, token, loginGoogle, registroGoogle, confirmarUsuarioLogeado } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos');

const router = Router();

router.get('/token', [
    check('x-token', 'El argumento x-token es obligatorio').not().isEmpty(),
    validarCampos,
], token);

router.post('/', [
    check('password', 'El argumento pasword es obligatorio').not().isEmpty(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    validarCampos,
], login);

router.post('/google', [
    check('token', 'El token es obligatorio').not().isEmpty(),
    validarCampos,
], loginGoogle);

router.post('/authgoogle', [
    check('token', 'El token es obligatorio').not().isEmpty(),
    validarCampos,
], registroGoogle);

router.get('/confirmarUsuarioLogeado', [
    check('x-token', 'El argumento x-token es obligatorio').not().isEmpty(),
    validarCampos,
], confirmarUsuarioLogeado);

module.exports = router;