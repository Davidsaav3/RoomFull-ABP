const Usuario = require('../models/usuario');
const suscripcion = require('../controllers/suscripciones');
const tipoSuscripcion = require('../models/tipoSuscripcion');
const Chat = require('../models/chat');
const Escena = require('../models/escena');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { infoToken } = require("../helpers/infotoken");
const { crearFiltros } = require("../helpers/crearFiltros");

const getUsuarios = async(req, res = response) => {
    const id = req.query.id;
    const desde = req.query.desde || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const token = req.header('x-token');
    try {
        let usuario, total;
        
        if (id) {
            let existeUsuarioNormal = await Usuario.findById(id);
            let uidtokenUsuarioNormal = infoToken(token).uid;
            let tokenUsuarioNormalExiste = await Usuario.findById(uidtokenUsuarioNormal);
            let rolUsuario = infoToken(token).rol;

            if(!existeUsuarioNormal) {
                return res.status(404).json({
                    ok: false,
                    msg: "No existe un usuario con ese id normal"
                });
            }
            if(!tokenUsuarioNormalExiste) {
                return res.status(404).json({
                    ok: false,
                    msg: "No existe un usuario con ese id token"
                });
            }
            const chatExiste = await Chat.find({ $and: [{ idUsuarioEmi: uidtokenUsuarioNormal }, { idUsuarioRec: id }] });
            if (id !== uidtokenUsuarioNormal && rolUsuario !== "Admin" && !chatExiste) {
                return res.status(403).json({
                    ok: false,
                    msg: "Usted no tiene autorización para acceder a este recurso"
                });
            }
            if(id === uidtokenUsuarioNormal || rolUsuario === "Admin" || chatExiste){
                [usuario, total] = await Promise.all([
                    Usuario.findById(id),
                    Usuario.countDocuments()
                ]);
            }
        } else {
            let rolToken = infoToken(token).rol;
            let uidToken = infoToken(token).uid;
            let usuarioExiste = await Usuario.findById(uidToken);
            if (!token) {
                return res.status(401).json({
                    ok: false,
                    msg: "No se reconoce el token en la cabecera"
                });
            }
            if (!usuarioExiste) {
                return res.status(404).json({
                    ok: false,
                    msg: "No existe un usuario con ese id"
                });
            } else if (usuarioExiste.rol !== "Admin" || rolToken !== "Admin") {
                return res.status(403).json({
                    ok: false,
                    msg: "Usuario no autorizado a realizar esta acción"
                });
            }
            [usuario, total] = await Promise.all([
                Usuario.find({}).skip(desde).limit(registropp),
                Usuario.countDocuments()
            ]);
        }
        return res.status(200).json({
            ok: true,
            msg: 'Obtener usuarios',
            usuario,
            page: {
                desde,
                registropp,
                total
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener usuarios'
        });
    }
}

const getUsuarioNombre = async(req, res = response) => {
    const nombre = req.query.nombre;
    try {
        let usuario;
        if (nombre) {
            usuario = await Usuario.findOne({ nombreUsuario: nombre });
            if (!usuario) {
                return res.status(404).json({
                    ok: false,
                    msg: "No existe un usuario con ese nombre de usuario"
                });
            }
        } else {
            return res.status(406).json({
                ok: false,
                msg: "No se ha pasado un nombre por parametro"
            });
        }
        return res.status(200).json({
            ok: true,
            msg: 'Obtener usuario por nombnre de usuario',
            usuario
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener usuario por nombre de usuario'
        });
    }
}


const crearUsuarios = async(req, res = response) => {

    const { email, password, nombreUsuario, ...object } = req.body;

    try {
        const exiteEmail = await Usuario.findOne({ email: email });
        let result = nombreUsuario.replace(" ", "_");
        const exiteUsuario = await Usuario.findOne({ nombreUsuario: result });

        if (exiteEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Email ya existe'
            });
        }

        if (exiteUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Nombre usuario ya existe'
            });
        }

        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(password, salt);

        const usuario = new Usuario(req.body);
        usuario.password = cpassword;
        usuario.nombreUsuario = result;
        const arrayOpciones = [{ notificaciones: true, interacciones: true, asistente: true }];
        usuario.opciones = arrayOpciones;

        const tiempo = Date.now();
        const hoy = new Date(tiempo);
        usuario.fechaCreacion = hoy;

        usuario.subscription = "registro_" + usuario._id;

        if (object.empresa == null) {
            usuario.empresa = "";
        }

        if (object.telefono == null) {
            usuario.telefono = "";
        }

        if (object.descripcion == null) {
            usuario.descripcion = "";
        }
        if(object.localizacion){
            usuario.localizacion = object.localizacion;
        }
        usuario.rol = "Usuario";
        usuario.imagen = "default.png";
        await usuario.save();

        res.status(201).json({
            ok: true,
            msg: 'Usuario creado correctamente',
            usuario
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear usuario'
        });
    }

}

const crearUsuariosGoogle = async(req, res = response) => {

    const { email, nombreUsuario, ...object } = req.body;

    try {
        const exiteEmail = await Usuario.findOne({ email: email });
        let nombreUsu = nombreUsuario.split("@")[0];

        const exiteUsuario = await Usuario.findOne({ nombreUsuario: nombreUsu });

        if (exiteEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Nombre de usuario o email ya existentes'
            });
        }

        if (exiteUsuario) {
            let aux = 1;
            let existeError = true;
            while (existeError) {
                let n = nombreUsu + "_" + aux;
                const existeusu = await Usuario.findOne({ nombreUsuario: n });
                if (!existeusu) {
                    existeError = false;
                    nombreUsu = n;
                    break;
                } else {
                    existeError = true;
                    aux = aux + 1;
                }
            }
        }

        const usuario = new Usuario(req.body);
        usuario.nombreUsuario = nombreUsu;
        const cpassword = "null";

        const salt = bcrypt.genSaltSync();
        const passwordCript = bcrypt.hashSync(cpassword, salt);
        usuario.password = passwordCript;


        const arrayOpciones = [{ notificaciones: true, interacciones: true, asistente: true }];
        usuario.opciones = arrayOpciones;

        usuario.metodo = "google";

        const tiempo = Date.now();
        const hoy = new Date(tiempo);
        usuario.fechaCreacion = hoy;

        usuario.subscription = "registro_" + usuario._id;
        
        if (object.empresa == null) {
            usuario.empresa = "";
        }

        if (object.telefono == NaN) {
            usuario.telefono = "";
        }

        if (object.descripcion == null) {
            usuario.descripcion = "";
        }

        if (usuario.imagen == "") {
            usuario.imagen = "default.png";
        }
        if(object.localizacion){
            usuario.localizacion = object.localizacion;
        }
        usuario.rol = "Usuario";
        await usuario.save();

        return res.status(201).json({
            ok: true,
            msg: 'Usuario creado correctamente',
            usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear usuario de google'
        });
    }

}

const actualizarUsuarios = async(req, res = response) => {

    const { nombreUsuario, email, ...object } = req.body;
    const uid = req.params.id;
    const token = req.header('x-token');
    try {
        const tokenId = infoToken(token).uid; 
        const tokenRol = infoToken(token).rol;

        const existeEmail = await Usuario.findOne({ email: email });
        const existeUsuario = await Usuario.findOne({ nombreUsuario: nombreUsuario });
        const existeIdUsuario = await Usuario.findById(uid);
        const existeUsuarioToken = await Usuario.findById(tokenId);

        if(!existeUsuarioToken){
            return res.status(400).json({
                ok: false,
                msg: 'Id de usuario incorrecto o inexistente en token'
            });
        }

        if(!existeIdUsuario){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ese Id de usuario'
            });
        }

        if (existeEmail) {
            if (existeEmail._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email ya existe'
                });
            }
        }

        if (existeUsuario) {
            if (existeUsuario._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Nombre de usuario ya existe'
                });
            }
        }
        if(uid !== tokenId && tokenRol !== "Admin" ){
            return res.status(403).json({
                ok: false,
                msg: 'No está autorizado a acceder a este recurso'
            });
        }

        if(email){
            existeIdUsuario.email = email;
        }
        if(nombreUsuario){
            existeIdUsuario.nombreUsuario = nombreUsuario;
        } 
        if(object.apellidos){
            existeIdUsuario.apellidos = object.apellidos ;
        }
        if(object.nombre){
            existeIdUsuario.nombre = object.nombre ;
        }
        if(object.empresa){
            existeIdUsuario.empresa = object.empresa ;
        }
        if(object.telefono){
            existeIdUsuario.telefono = object.telefono ;
        }
        if(object.descripcion){
            existeIdUsuario.descripcion = object.descripcion ;
        }
        const usuario = await Usuario.findByIdAndUpdate(uid, existeIdUsuario, { new: true });
        await usuario.save();
        res.status(201).json({
            ok: true,
            msg: 'Usuario actualizado correctamente',
            usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar usuario'
        });
    }
}

const actualizarUsuFoto = async(req, res = response) => {

    const {...object } = req.body;
    const uid = req.params.id;
    const token = req.header('x-token');
    try {
        const tokenId = infoToken(token).uid;
        const tokenRol = infoToken(token).rol;
        const existeIdUsuario = await Usuario.findById(uid);
        const existeIdTokenUsuario = await Usuario.findById(tokenId);
        if(!existeIdUsuario){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ese Id de usuario'
            });
        }
        if(!existeIdTokenUsuario){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ese Id de usuario en cabecera'
            });
        }
        if(uid !== tokenId && tokenRol !== "Admin"){
            return res.status(403).json({
                ok: false,
                msg: 'No está autorizado a acceder a este recurso'
            });
        }
        if(object.imagen){
            existeIdUsuario.imagen = object.imagen;
        }
        const usuario = await Usuario.findByIdAndUpdate(uid, existeIdUsuario, { new: true });
        await usuario.save();
        res.status(201).json({
            ok: true,
            msg: 'Foto usuario actualizada correctamente'
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar foto usuario'
        });
    }
}

const actualizarUsuDescription = async(req, res = response) => {

    const { ...object } = req.body;
    const uid = req.params.id;
    const token = req.header('x-token');
    try {
        const tokenId = infoToken(token).uid;
        const tokenRol = infoToken(token).rol;
        const existeIdUsuario = await Usuario.findById(uid);
        const existeIdTokenUsuario = await Usuario.findById(tokenId);
        if(!existeIdUsuario){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ese Id de usuario'
            });
        }
        if(!existeIdTokenUsuario){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ese Id de usuario en cabecera'
            });
        }
        if(uid !== tokenId && tokenRol !== "Admin"){
            return res.status(403).json({
                ok: false,
                msg: 'No está autorizado a acceder a este recurso'
            });
        }

        if(object.description){
            existeIdUsuario.descripcion = object.description;
        }

        const usuario = await Usuario.findByIdAndUpdate(uid, existeIdUsuario, { new: true });
        await usuario.save();
        res.status(201).json({
            ok: true,
            msg: 'Usuario- descripcion actualizado correctamente'
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar desc usuario'
        });
    }
}

const actualizarUsuMetodo = async(req, res = response) => {

    const uid = req.params.id;
    const token = req.header('x-token');
    try {
        const tokenId = infoToken(token).uid;
        const tokenRol = infoToken(token).rol;
        const existeIdUsuario = await Usuario.findById(uid);
        const existeIdTokenUsuario = await Usuario.findById(tokenId);
        if(!existeIdUsuario){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ese Id de usuario'
            });
        }
        if(!existeIdTokenUsuario){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ese Id de usuario en cabecera'
            });
        }
        if(uid !== tokenId && tokenRol !== "Admin"){
            return res.status(403).json({
                ok: false,
                msg: 'No está autorizado a acceder a este recurso'
            });
        }
        if (existeIdUsuario.metodo === 'google') {
            existeIdUsuario.metodo = "google-foto";
        }
        // else if(existeIdUsuario.metodo === 'normal') {
        //     existeIdUsuario.metodo = "google";
        // }


        const usuario = await Usuario.findByIdAndUpdate(uid, existeIdUsuario, { new: true });
        await usuario.save();
        console.log(usuario)
        res.status(201).json({
            ok: true,
            msg: 'Método de usuario actualizado correctamente',
            usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar el método de usuario'
        });
    }
}

const borrarUsuarios = async(req, res = response) => {

    const uid = req.params.id;
    const token = req.header('x-token');
        
    try {
        const tokenId = infoToken(token).uid;
        const tokenRol = infoToken(token).rol;
        const existeIdUsuario = await Usuario.findById(uid);
        const existeIdTokenUsuario = await Usuario.findById(tokenId);
        if(!existeIdUsuario){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ese Id de usuario'
            });
        }
        if(!existeIdTokenUsuario){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ese Id de usuario en cabecera'
            });
        }
        if(uid !== tokenId && tokenRol !== "Admin"){
            return res.status(403).json({
                ok: false,
                msg: 'No está autorizado a acceder a este recurso'
            });
        }
        //Borrar conversaciones, archivos de modelos, modelos, imagen de usuario, (suscripcion cuando este)`, usuario
        let conversaciones, archivosModelo;
        var pathImagen = process.env.PATHFILES + "imagenEscena/";
        var pathModelo = process.env.PATHFILES + "escena/";
        var pathFotoPerfil = process.env.PATHFILES + "fotoperfil/" + existeIdUsuario.imagen;
        conversaciones = await Chat.deleteMany({$or: [{idUsuarioEmi: existeIdUsuario._id},{idUsuarioRec: existeIdUsuario._id}]});
        archivosModelo = await Escena.find({creadorID: existeIdUsuario._id},{_id:1,imagen:1,modelo:1});
        if(!existeIdUsuario.imagen.includes("default")){
            if(fs.existsSync(pathFotoPerfil)){
                fs.unlinkSync(pathFotoPerfil);
            }
        }
        if(archivosModelo.length > 0){
            archivosModelo.forEach(async(element) => {
                if(!element.imagen.includes("default")){
                    console.log("Hola");
                    pathImagen += element.imagen;
                    if(fs.existsSync(pathImagen)){
                        fs.unlinkSync(pathImagen);
                    }
                    pathImagen = process.env.PATHFILES + "imagenEscena/";
                }
                if(!element.modelo.includes("default")){
                    pathModelo += element.modelo;
                    if(fs.existsSync(pathModelo)){
                        fs.unlinkSync(pathModelo);
                    }
                    pathModelo = process.env.PATHFILES + "escena/";
                }
                if(element._id){
                    let mod = element._id.toString();
                    await Escena.findByIdAndRemove(mod);
                }
            });
        } 
        const resultado = await Usuario.findByIdAndRemove(uid);
        return res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado',
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al eliminar usuario'
        });
    }
}

const addSuscripcion = async(req, res = response) => {

    const {...object } = req.body;

    const uid = req.params.id;
    const uidTipoSus = object.idTipoSus;
    const token = req.header("x-token");
    try {
        const existeUsuario = await Usuario.findById(uid);

        if (!existeUsuario) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }
        let tokenId = infoToken(token).uid;
        if (tokenId !== id) {
            return res.status(403).json({
                ok: false,
                msg: 'No se puede modificar las opciones de otro usuario'
            });
        }
        const existeTipoSus = await tipoSuscripcion.findById(uidTipoSus);

        if (!existeTipoSus) {
            return res.status(404).json({
                ok: false,
                msg: 'El tipo de suscripción no existe'
            });
        }

        var hoy = Date.now();
        const fechafin = new Date(hoy);
        const fechaini = new Date(hoy);

        if (object.tiempo == 1) {
            fechafin.setMonth(fechafin.getMonth() + 1);
        } else if (object.tiempo == 12) {
            fechafin.setYear(fechafin.getYear() + 1);
        }

        ini = fechaini.toLocaleDateString();
        fin = fechafin.toLocaleDateString();

        const suscrip = await suscripcion.crearSus({
            "body": {
                "idUsuario": uid,
                "idTipoSus": uidTipoSus,
                "fechaIni": ini,
                "fechaFin": fin,
                "metodoPago": object.metodoPago,
                "renovacion": "true"
            }
        });

        if (suscrip == 0) {
            res.status(400).json({
                ok: true,
                msg: 'Error al crear suscripción'
            });
        }

        existeUsuario.subscription = suscrip._id;

        await existeUsuario.save();

        return res.status(201).json({
            ok: true,
            msg: 'Añadida la suscripción con éxito',
            suscrip
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear suscripción de usuario'
        });
    }
}

const cambiarContrasena = async(req, res = response) => {

    const {...object } = req.body;
    const uid = req.params.id;
    const token = req.header('x-token');

    try {
        const tokenId = infoToken(token).uid;
        const existeUsuario = await Usuario.findById(uid);
        const existeIdTokenUsuario = await Usuario.findById(tokenId);
        if (!existeUsuario) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }
        if(!existeIdTokenUsuario){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ese Id de usuario en cabecera'
            });
        }
        if(uid !== tokenId){
            return res.status(403).json({
                ok: false,
                msg: 'No está autorizado a acceder a este recurso'
            });
        }
        if (object.passNueva1 !== object.passNueva2) {
            return res.status(406).json({
                ok: false,
                msg: 'La contraseña nueva y la nueva repetida no coinciden'
            });
        }
        
        bcrypt.compare(object.passActual, existeUsuario.password, async (err, resComp) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Error al comparar contraseña'
                });
            }
            if (resComp === false) {
                return res.status(406).json({
                    ok: false,
                    msg: 'La contraseña actual no coincide con la introducida'
                });
            }else{
                const salt = bcrypt.genSaltSync();
                const cpassword = bcrypt.hashSync(object.passNueva1, salt);
                const usuario = await Usuario.findByIdAndUpdate(uid, { password: cpassword }, { new: true });
                await usuario.save();
                return res.status(201).json({
                    ok: true,
                    msg: 'Contraseña cambiada correctamente'
                });
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al cambiar la contraseña de usuario'
        });
    }
}

const codigoVerificacion = async(req, res = response) => {
    const email = req.body.email;
    try {
        if (!email) {
            return res.status(406).json({
                ok: false,
                msg: 'No se ha introducido un email valido'
            });
        }
        const usuario = await Usuario.findOne({ email: email });
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese email en la base de datos'
            });
        }

        if (usuario.metodo === 'google' || usuario.metodo === 'google-foto') {
            return res.status(400).json({
                ok: false,
                msg: 'No se permite a los usuarios de google recuperar la contraseña'
            });
        }
        let min = 100000;
        let max = 999999
        let codigo = Math.floor(Math.random() * (max - min) + min);
        let message = {
            from: "fulloopteam@gmail.com",
            to: email,
            subject: "Ejemplo de asunto de correo",
            text: "Plaintext version of the message",
            html: `<p>Su código de verificación es </p><h3>${codigo}</h3>`
        };
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            // port: 465,
            // secure: true, // true for 465, false for other ports
            // auth: {
            //     user: 'fulloopteam@gmail.com', // generated ethereal user
            //     pass: 'erfrbmkdxaymbgrb', // generated ethereal password
            // }
            secure: false,
            port: 587,
            auth: {
            user: 'fulloopteam@gmail.com',
            pass: 'erfrbmkdxaymbgrb'
            },
            tls: {
            rejectUnauthorized: false
            }
        });
        transporter.sendMail(message, async(error, info) => {
            if (error) {
                console.log("Error enviando email");
                console.log(error.message);
                return res.status(400).json({
                    ok: false,
                    msg: 'Error al enviar codigo de verificacion'
                });
            } else {
                console.log("Email enviado");
                console.log(info);
                console.log(usuario);
                usuario.codigo = codigo;
                let fecha = new Date();
                fecha.setMinutes(fecha.getMinutes() + 5);
                usuario.fechaExpirado = fecha;
                await usuario.save();
            }
        });
        return res.status(201).json({
            ok: true,
            msg: 'Se ha generado y enviado correctamente el codigo',
            fechaExpirado: usuario.fechaExpirado,
            codigo: usuario.codigo
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al generar y enviar codigo de verificacion'
        });
    }
}

const verificarCodigo = async(req, res = response) => {
    const { email, codigo } = req.body;
    try {
        if (!email) {
            return res.status(406).json({
                ok: false,
                msg: 'No se ha introducido un email'
            });
        }
        if (!codigo) {
            return res.status(406).json({
                ok: false,
                msg: 'No se ha introducido un codigo'
            });
        }
        const usuario = await Usuario.findOne({ email: email });
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese email en la base de datos'
            });
        }
        if (usuario.codigo !== Number(codigo)) {
            return res.status(406).json({
                ok: false,
                msg: `El codigo no coincide`
            });
        }
        if (new Date(usuario.fechaExpirado) < new Date()) {
            return res.status(406).json({
                ok: false,
                msg: 'Ha caducado el codigo'
            });
        }

        return res.status(201).json({
            ok: true,
            msg: 'El codigo de verificacion es correcto',
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al comprobar codigo de verificación'
        });
    }
}

const nuevaContrasena = async(req, res = response) => {
    const { email, contrasenaNueva, contrasenaNuevaRepite } = req.body;
    try {
        if (!email) {
            return res.status(406).json({
                ok: false,
                msg: 'No se ha introducido un email'
            });
        }
        const usuario = await Usuario.findOne({ email: email });
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese email en la base de datos'
            });
        }
        if (contrasenaNueva !== contrasenaNuevaRepite) {
            return res.status(406).json({
                ok: false,
                msg: 'Las contraseñas no coinciden'
            });
        }
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(contrasenaNueva, salt);
        usuario.password = cpassword;
        await usuario.save();
        return res.status(201).json({
            ok: true,
            msg: 'Se ha cambiado la contraseña',
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al cambiar contraseña al usuario'
        });
    }
}

const cambiarOpciones = async(req, res) => {
    const id = req.params.id;
    const {...object } = req.body;
    const token = req.header("x-token");
    try {
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }
        let tokenId = infoToken(token).uid;
        if (tokenId !== id) {
            return res.status(403).json({
                ok: false,
                msg: 'No se puede modificar las opciones de otro usuario'
            });
        }
        const usu = await Usuario.findByIdAndUpdate(id, object, { new: true });
        await usu.save();
        return res.status(201).json({
            ok: true,
            msg: 'Se han actualizado las opciones del usuario',
            usu
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar las opciones del usuario'
        });
    }
}

const getUsuarioNombreAdmin = async(req, res = response) => {
    const nombreUsu = req.query.nombreUsuario;
    const registropp = 10;
    const desde = (Number(req.query.desde) - 1) * 10 || 0;
    const token = req.header("x-token");
    const filtros = req.query;
    try {
        const tokenId = infoToken(token).uid;
        const existeAdmin = await Usuario.findById(tokenId);
        if(!existeAdmin){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }
        if (infoToken(token).rol !== "Admin" || existeAdmin.rol !== "Admin") {
            return res.status(401).json({
                ok: false,
                msg: 'No está autorizado a acceder a este recurso'
            });
        }
        let resultadoFiltros = crearFiltros(filtros, ['nombreUsuario', 'desde']);
        let usuarios, total;
        if (nombreUsu) {
            let expresion = new RegExp(nombreUsu, 'gi');
            usuarios = await Usuario.find({ nombreUsuario: expresion }).sort(resultadoFiltros).skip(desde).limit(registropp).exec();
        } else {
            usuarios = await Usuario.find({}).sort(resultadoFiltros).skip(desde).limit(registropp).exec();
        }
        total = await Usuario.countDocuments();
        return res.status(200).json({
            ok: true,
            msg: 'Obtener usuarios para Admin',
            usuarios,
            page: {
                registropp,
                total,
                paginas: Math.round(total / registropp)
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener usuarios para Admin'
        });
    }
}


module.exports = { getUsuarios, getUsuarioNombre, crearUsuarios, actualizarUsuarios, actualizarUsuFoto, actualizarUsuDescription, actualizarUsuMetodo, borrarUsuarios, addSuscripcion, cambiarContrasena, crearUsuariosGoogle, codigoVerificacion, verificarCodigo, nuevaContrasena, cambiarOpciones, getUsuarioNombreAdmin }