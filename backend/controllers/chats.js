const Chat = require('../models/chat');
const Usuario = require('../models/usuario');
const { infoToken } = require('../helpers/infotoken');
const { crearFiltros } = require('../helpers/crearFiltros');


const obtenerChats = async(req, res) => {
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const mensajesPagina = Number(process.env.MENSAJESPAGE); //Numero de mensajes que devuelve
    const id = req.query.id;
    const token = req.header("x-token");
    const numMensajes = Number(req.query.mensajes); // A partir de mensaje tiene que devolver
    try {
        const rolToken = infoToken(token).rol;
        const idToken = infoToken(token).uid;
        let chats, total, mensajes = [];
        if (id) {
            const existeIdChat = await Chat.findById(id);
            const existeIdUsuario = await Usuario.findById(idToken);
            if(!existeIdChat){
                return res.status(404).json({
                    ok: false,
                    msg: "No existe un chat con ese id"
                });
            }
            if(!existeIdUsuario ){
                return res.status(404).json({
                    ok: false,
                    msg: "No existe un usuario con ese id"
                });
            }
            const emisor = existeIdChat.idUsuarioEmi;
            const receptor = existeIdChat.idUsuarioRec;
            if(emisor.toString() === idToken || receptor.toString() === idToken || rolToken === "Admin"){
                total = 1;
                chats = await Chat.findById(id);
                if(numMensajes >= 0){
                    let mensajesChat = chats.mensajes;
                    for(let i = numMensajes; i < numMensajes + mensajesPagina; i++){
                        mensajes.push(mensajesChat[i]);
                    }
                }
            }else{
                return res.status(403).json({
                    ok: false,
                    msg: "No está autorizado a acceder a este recurso"
                });
            }
            
        }else{
            const existeIdUsuario = await Usuario.findById(idToken);
            if(!existeIdUsuario ){
                return res.status(404).json({
                    ok: false,
                    msg: "No existe un usuario con ese id"
                });
            }
            if(rolToken === "Admin" && existeIdUsuario.rol === "Admin"){
                [chats, total] = await Promise.all([
                    Chat.find({}).skip(desde).limit(registropp),
                    Chat.countDocuments()
                ]);
            }else{
                return res.status(403).json({
                    ok: false,
                    msg: 'A es administrador por lo que no esta autorizado a realizar esta operación',
                });
            }   
        }
        return res.status(200).json({
            ok: true,
            msg: 'getChats',
            chats,
            page: {
                desde,
                registropp,
                total
            },
            mensajes
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener chats'
        });
    }
}

const obtenerChatsPorFecha = async(req, res) => {
    const id = req.params.id;
    const token = req.header('x-token');
    const nombre = req.query.nombre;
    try {
        
        if (!id) {
            return res.status(406).json({
                ok: false,
                msg: 'Debe especificarse un identificador',
            });
        }
        if (id !== infoToken(token).uid) {
            return res.status(401).json({
                ok: false,
                msg: 'Usuario no autorizado por diferencia con token',
            });
        }
        let chats, total, totalReal;
        [chats, total] = await Promise.all([
            Chat.find({ $or: [{ idUsuarioEmi: id }, { idUsuarioRec: id }] }).sort({ fecha: -1 }),
            Chat.countDocuments()
        ]);

        totalReal = chats.length;

        if (nombre || nombre != ""){
            let expresion = new RegExp(nombre, 'gi');
            let chatsAux = await Chat.find({ $and: [

                { asunto: expresion },
                {
                $or: [{ idUsuarioEmi: id }, { idUsuarioRec: id }] 
                }

                ] }).sort({ fecha: -1 });
            chats = chatsAux;
            total = chats.length;
        }

        return res.status(200).json({
            ok: true,
            msg: 'Obtener chats por fecha',
            chats,
            total,
            totalReal
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener chats ordenados por fecha'
        });
    }
}

const obtenerChatsPorNombre = async(req, res) => {
    console.log('obtenerChatsPorNombre');
    const id = req.params.id;
    const value = req.params.value;
    const token = req.header('x-token');
    try {
        
        if (!id) {
            return res.status(406).json({
                ok: false,
                msg: 'Debe especificarse un identificador',
            });
        }
        if (id !== infoToken(token).uid) {
            return res.status(401).json({
                ok: false,
                msg: 'Usuario no autorizado por diferencia con token',
            });
        }
        let chats, total;
        [chats, total] = await Promise.all([
            Chat.find({ $or: [{ idUsuarioEmi: id }, { idUsuarioRec: id }] }).where({idUsuarioRec: value}),
            Chat.countDocuments()
        ]);
        return res.status(200).json({
            ok: true,
            msg: 'Obtener chats por nombre',
            chats,
            total
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener chats ordenados por nombre'
        });
    }
}


const crearChats = async(req, res = response) => {
    const {...object } = req.body;
    const token = req.header("x-token");
    try {
        const existeEmi = await Usuario.findById(object.idUsuarioEmi);
        const existeRec = await Usuario.findById(object.idUsuarioRec);
        const tokenUid = infoToken(token).uid;
        if (!existeEmi) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ese emisor'
            });
        }
        if (!existeRec) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ese receptor'
            });
        }

        if(tokenUid !== object.idUsuarioEmi){
            return res.status(403).json({
                ok: false,
                msg: 'No puedes crear el chat de otro usuario'
            });
        }

        // Si el emisor es el mismo que el receptor
        if (object.idUsuarioEmi === object.idUsuarioRec) {
            return res.status(406).json({
                ok: false,
                msg: 'No puedes hacer un chat contigo mismo'
            });
        }

        // console.log('emisor: ' + object.idUsuarioEmi);
        // console.log('receptor: ' + object.idUsuarioRec);

        // Para el emisor
        const chatExistente = await Chat.findOne({ $or: [{ idUsuarioEmi: existeEmi._id, idUsuarioRec: existeRec._id }, { idUsuarioEmi: existeRec._id, idUsuarioRec: existeEmi._id }] });
        if (chatExistente) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un chat entre esos dos usuarios'
            });
        }

        const insertarEnChat = {};
        insertarEnChat.idUsuarioEmi = object.idUsuarioEmi;
        insertarEnChat.idUsuarioRec = object.idUsuarioRec;
        insertarEnChat.asunto = object.asunto;
        const chat = new Chat(insertarEnChat);
        // const fecha = new Date();
        // const 
        object.fecha = new Date();
        chat.mensajes = [];
        chat.fecha = new Date();
        const insertarEnMensaje = {};
        insertarEnMensaje.idUsuarioEmi = object.idUsuarioEmi;
        insertarEnMensaje.idUsuarioRec = object.idUsuarioRec;
        insertarEnMensaje.fecha = object.fecha;
        insertarEnMensaje.mensajes = object.mensajes;
        if (object.mensajes != '') {
            chat.mensajes.push(insertarEnMensaje);
        }
        await chat.save();
        return res.status(201).json({
            ok: true,
            msg: 'Se ha creado el chat',
            chat
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al crear chat'
        });
    }
}

const actualizarChats = async(req, res = response) => {
    const uid = req.params.id;
    const {...object } = req.body;
    const token = req.header("x-token");
    try {
        const existeChat = await Chat.findById(uid);
        if (!existeChat) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un chat con ese id'
            });
        }
        // if(!object.contenido || !object.autor){
        //     return res.status(400).json({
        //         ok: false,
        //         msg: 'Falta al menos algún campo del mensaje'
        //     });
        // }

        const tokenId = infoToken(token).uid; 
        const idUsuarioEmi = existeChat.idUsuarioEmi.toString();
        const idUsuarioRec = existeChat.idUsuarioRec.toString();
        if(tokenId !== idUsuarioEmi && idUsuarioRec !== tokenId){
            return res.status(403).json({
                ok: false,
                msg: 'No esta autorizado a actualizar un chat ajeno'
            });
        }
        const chatAct = await Chat.findById(uid);
        const insertarEnMensaje = {};
        insertarEnMensaje.fecha = new Date();
        insertarEnMensaje.idUsuarioEmi = tokenId;
        insertarEnMensaje.mensajes = object.mensajes;
        chatAct.mensajes.unshift(insertarEnMensaje);

        // const chatAct = await Chat.findById(uid);
        // object.fecha = new Date();
        // if (object.mensajes != '') {
        //     chatAct.mensajes.unshift(object);
        // }
        chatAct.fecha = new Date();
        const chat = await Chat.findByIdAndUpdate(uid, chatAct, { new: true });
        return res.status(201).json({
            ok: true,
            msg: 'Se ha actualizado el chat',
            chat
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error al actualizar mensaje'
        });
    }
}

const borrarChats = async(req, res = response) => {
    const uid = req.params.id;
    const token = req.header("x-token");
    try {
        const idToken = infoToken(token).uid;
        const rolToken = infoToken(token).rol;
        const tipoUsuario = await Usuario.findById(idToken);
        if (!uid) {
            return res.status(406).json({
                ok: false,
                msg: 'No se ha pasado un id'
            });
        }
        
        const existeChat = await Chat.findById(uid);
        if (!existeChat) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el chat especificado'
            });
        }
        const idEmi = existeChat.idUsuarioEmi.toString();
        const idRec = existeChat.idUsuarioRec.toString();

        if(idToken !== idEmi && idToken !== idRec && rolToken !== "Admin" && tipoUsuario.rol !== "Admin"){
            return res.status(403).json({
                ok: false,
                msg: 'No esta autorizado a eliminar este recurso'
            });
        }
        const resultado = await Chat.findByIdAndRemove(uid);
        return res.status(200).json({
            ok: true,
            msg: 'Chat eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al borrar chat'
        });
    }

}

// Usa paginadores
const getChatNombreAdmin = async(req, res = response) => {
    const asunto = req.query.nombreChat;
    const registropp = 10;
    const desde = (Number(req.query.desde) - 1) * 10 || 0;
    const token = req.header("x-token");
    const filtros = req.query;
    try {
        const idToken = infoToken(token).uid;
        const existeAdmin = await Usuario.findById(idToken);
        if (infoToken(token).rol !== "Admin" || existeAdmin.rol !== "Admin") {
            return res.status(401).json({
                ok: false,
                msg: 'No está autorizado a acceder a este recurso'
            });
        }
        let resultadoFiltros = crearFiltros(filtros, ['asunto', 'desde']);
        let chatsFiltros, total;
        total = await Chat.countDocuments();
        if (asunto) {
            let expresion = new RegExp(asunto, 'gi');
            chatsFiltros = await Chat.find({ asunto: expresion }).sort(resultadoFiltros).skip(desde).limit(registropp).exec();
        } else {
            chatsFiltros = await Chat.find({}).skip(desde).sort(resultadoFiltros).limit(registropp).exec();
        }
        let receptor, emisor;
        let chats = [];
        for(let i = 0 ; i < chatsFiltros.length ; i++){
            receptor = await Usuario.findById(chatsFiltros[i].idUsuarioRec.toString());
            emisor = await Usuario.findById(chatsFiltros[i].idUsuarioEmi.toString());
            if(emisor && receptor){
                chats.push(chatsFiltros[i]);
            }
        }
        
        return res.status(200).json({
            ok: true,
            msg: 'Obtener chats para Admin',
            chats,
            page: {
                registropp,
                total,
                paginas: Math.round(total / registropp)
            },
            "hola":"hola"
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener chats para Admin'
        });
    }
}
module.exports = { obtenerChats, crearChats, actualizarChats, borrarChats, obtenerChatsPorFecha, getChatNombreAdmin , obtenerChatsPorNombre}