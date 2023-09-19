const { response } = require('express');
const Suscripcion = require('../models/suscripcion');
const tipoSuscripcion = require('../models/tipoSuscripcion');
const Usuario = require('../models/usuario');

const getSus = async(req, res = response) => {

    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;
    const idusu = req.query.idusu;
    try {
        let Sus, total;
        if (id) {
            [Sus, total] = await Promise.all([
                Suscripcion.findById(id),
                Suscripcion.countDocuments()
            ]);
        }else if(idusu){
            [Sus, total] = await Promise.all([
                Suscripcion.find({idUsuario:idusu}),
                Suscripcion.countDocuments()
            ]);
        } else {
            [Sus, total] = await Promise.all([
                Suscripcion.find({}).skip(desde).limit(registropp),
                Suscripcion.countDocuments()
            ]);
        }
        return res.status(200).json({
            ok: true,
            msg: 'getSus',
            Sus,
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
            msg: 'Error al obtener las suscripciones'
        });
    }
}

const crearSus = async(req, res) => {

    const uidUsuario = req.body.idUsuario;
    const uidTipoSus = req.body.idTipoSus;

    try {

        const existeSusUsuario = await Usuario.findById(uidUsuario);
        const existetipoSus = await tipoSuscripcion.findById(uidTipoSus);

        const UsuarioTieneSub = await Suscripcion.findOne({ idUsuario: uidUsuario });

        if (UsuarioTieneSub) {
            usuExiste = UsuarioTieneSub._id;
            req.body.uid = usuExiste;

            try {
                return actualizarSus(req, res);
            } catch {
                return res.status(404).json({
                    ok: false,
                    msg: 'Error al gestionar suscripción'
                });
            }
        }

        if (!existeSusUsuario) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }

        if (!existetipoSus) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el tipo de suscripcion'

            });
        }

        const Sus = new Suscripcion(req.body);

        await Sus.save();

        res.status(201).json({
            ok: true,
            msg: 'Suscripción creada correctamente',
            Sus
        });

        return Sus;

    } catch (error) {
        console.log(error);
        return 0;
    }

}

const actualizarSus = async(req, res = response) => {
    const { idUsuario, idTipoSus, ...object } = req.body;

    let uid = "";
    let intentoExiste = false;

    if (req.body.uid) {
        uid = req.body.uid;
        intentoExiste = true;
    } else {
        uid = req.params.id;
    }

    try {
        const existeSus = await Suscripcion.findById(uid);

        if (!existeSus) {
            return res.status(404).json({
                ok: false,
                msg: 'La suscripción no existe'
            });
        }

        if (existeSus.idUsuario != idUsuario) {
            if (intentoExiste) {
                return 0;
            }
            return res.status(400).json({
                ok: false,
                msg: 'Usuario es distinto al de la suscripción'
            });
        }

        if (existeSus.idTipoSus != idTipoSus) {

            const existeTipoSus = await tipoSuscripcion.findById(idTipoSus);

            if (!existeTipoSus) {
                if (intentoExiste) {
                    return 0;
                }
                return res.status(404).json({
                    ok: false,
                    msg: 'Tipo de suscripción no existe'
                });
            }
        }


        object.idUsuario = idUsuario;
        object.idTipoSus = idTipoSus;

        let sus = await Suscripcion.findByIdAndUpdate(uid, object, { new: true });


        if (sus){

            return res.status(201).json({
                ok: true,
                msg: 'Suscripción actualizada correctamente',
                sus
            });
        }
        else {
            return res.status(400).json({
                ok: false,
                msg: 'Error al actualizar suscripción'
            });
        }

    } catch (error) {
        console.log(error);
        if (intentoExiste) {
            return 0;
        }
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar suscripción'
        });
    }
}

const borrarSus = async(req, res = response) => {

    const uid = req.params.id;

    try {
        const existeSus = await Suscripcion.findById(uid);

        if (!existeSus) {
            return res.status(404).json({
                ok: false,
                msg: 'La suscripción no existe'
            });
        }
        const usuario = await Usuario.findById(existeSus.idUsuario);

        if (usuario) {
            usuario.subscription = "";
        }

        await Suscripcion.findByIdAndRemove(uid);

        return res.status(200).json({
            ok: true,
            msg: 'Suscripción eliminada con éxito'
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al eliminar suscripción'
        });
    }
}

module.exports = { getSus, crearSus, actualizarSus, borrarSus }