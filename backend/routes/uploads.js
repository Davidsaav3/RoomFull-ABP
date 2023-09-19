/*
Ruta base: /api/upload
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { subirArchivo, enviarArchivo, borrarArchivo, enviarContenidoSkybox, enviarContenidoEscena, enviarContenidoEscenaNoToken, enviarContenidoShader, enviarContenidoShaderNoToken } = require('../controllers/uploads');
const { validarJWT } = require('../middleware/validarJWT');
const { validarCampos } = require('../middleware/validarCampos');

const router = Router();

router.get('/:tipo/:nombreArchivo', [
    validarJWT,
    check('nombreArchivo', 'El nombre de archivo debe ser válido').not().isEmpty().trim(),
    validarCampos,
], enviarArchivo);

router.get('/escena/content/:nombreArchivo', [
    validarJWT,
    check('nombreArchivo', 'El nombre de archivo debe ser válido').not().isEmpty().trim(),
    validarCampos,
], enviarContenidoEscena);

router.get('/escena/content/noToken/:nombreArchivo', [
    check('nombreArchivo', 'El nombre de archivo debe ser válido').not().isEmpty().trim(),
    validarCampos,
], enviarContenidoEscenaNoToken);

router.get('/shader/content/:nombreArchivo', [
    validarJWT,
    check('nombreArchivo', 'El nombre de archivo debe ser válido').not().isEmpty().trim(),
    validarCampos,
], enviarContenidoShader);

router.get('/shader/content/noToken/:nombreArchivo', [
    check('nombreArchivo', 'El nombre de archivo debe ser válido').not().isEmpty().trim(),
    validarCampos,
], enviarContenidoShaderNoToken);


router.get('/skybox', [], enviarContenidoSkybox);

router.post('/:tipo/:id', [
    validarJWT,
    check('id', 'El id debe ser válido').isMongoId(),
    /* check('nombre', 'El nombre de archivo es obligatorio').not().isEmpty(),
    check('archivo', 'Es obligatorio pasar el contenido del archivo').not().isEmpty(), */
    validarCampos,
], subirArchivo);


router.post('/registro/:tipo/:id', [
    check('id', 'El id debe ser válido').isMongoId(),
    check('nombre', 'El nombre de archivo es obligatorio').not().isEmpty(),
    check('archivo', 'Es obligatorio pasar el contenido del archivo').not().isEmpty(),
    validarCampos,
], subirArchivo);
router.delete('/:tipo/:nombreArchivo', [
    validarJWT,
    check('nombreArchivo', 'El nombre de archivo debe ser válido').not().isEmpty(),
    validarCampos,
], borrarArchivo);

module.exports = router;