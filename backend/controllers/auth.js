const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { infoToken } = require('../helpers/infotoken');
const jwt = require('jsonwebtoken');
const { googleVerify } = require('../helpers/verifyGoogle');

const token = async(req, res = response) => {

    const token = req.headers['x-token'];

    try {
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);

        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(401).json({
                ok: false,
                msg: 'Token no válido',
                token: ''
            });
        }
        const rolBD = usuarioBD.rol;

        const nuevoToken = await generarJWT(uid, rol);

        res.status(200).json({
            ok: true,
            msg: 'Token',
            uid: uid,
            nombre: usuarioBD.nombre,
            apellidos: usuarioBD.apellidos,
            nombreUsuario: usuarioBD.nombreUsuario,
            descripcion: usuarioBD.descripcion,
            email: usuarioBD.email,
            empresa: usuarioBD.empresa,
            rol: rolBD,
            subscription: usuarioBD.subscription,
            EscenasLikes: usuarioBD.EscenasLikes,
            EscenasGuardadas: usuarioBD.EscenasGuardadas,
            imagen: usuarioBD.imagen,
            token: nuevoToken
        });
    } catch {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido',
        });
    }
}

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuarioBD = await Usuario.findOne({ email });
        if (!usuarioBD) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        const { _id, rol } = usuarioBD;
        const token = await generarJWT(usuarioBD._id, usuarioBD.rol);

        res.status(200).json({
            ok: true,
            msg: 'login',
            uid: _id,
            rol,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en login',
            token: ''
        });
    }
}
const confirmarUsuarioLogeado = async(req, res) => {
    const token = req.header('x-token');
    console.log(req);
    try {
        if (!token) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el token enviado',
            });
        }
        const uid = infoToken(token).uid;
        res.status(200).json({
            ok: true,
            msg: 'Usuario logeado confirmado',
            id: uid
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al confirmar usuario logeado',
        });
    }
}


const registroGoogle = async(req, res = response) => {

    const tokenGoogle = req.body.token;

    try {

        // Compruebo si el token recibido por el front es válido
        const {...payload } = await googleVerify(tokenGoogle);
        console.log(payload);

        res.status(202).json({
            ok: true,
            msg: 'Registro con google',
            payload
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en registro con google'
        });
    }

}


// Recibimos el token de google y comprobamos su validez (si existe, si corresponde con usuario de la bd)
const loginGoogle = async(req, res = response) => {

    const tokenGoogle = req.body.token;

    try {

        // Compruebo si el token recibido por el front es válido
        const { email, ...payload } = await googleVerify(tokenGoogle);
        console.log(payload);

        // Cuando no encuentra al usuario en la bd
        const usuarioBD = await Usuario.findOne({ email });
        if (!usuarioBD) {
            return res.status(404).json({
                ok: false,
                msg: 'Identificación con google incorrecta',
                token: ''
            });
        }

        const { _id, rol } = usuarioBD;
        const token = await generarJWT(usuarioBD._id, usuarioBD.rol);
        res.status(200).json({
            ok: true,
            msg: 'Login con google',
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en login con google',
            token: ''
        });
    }

}

module.exports = { login, token, loginGoogle, registroGoogle, confirmarUsuarioLogeado }