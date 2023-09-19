const { infoToken } = require('../helpers/infotoken');
const tipoSuscripcion = require('../models/tipoSuscripcion');
const Usuario = require('../models/usuario');
const { crearFiltros } = require('../helpers/crearFiltros');


const getTipoSus = async(req, res) => {
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;

    try {
        let tipoSus, total;
        if (id) {
            [tipoSus, total] = await Promise.all([
                tipoSuscripcion.findById(id),
                tipoSuscripcion.countDocuments()
            ]);
        } else {
            [tipoSus, total] = await Promise.all([
                tipoSuscripcion.find({}).skip(desde).limit(registropp),
                tipoSuscripcion.countDocuments()
            ]);
        }
        return res.status(200).json({
            ok: true,
            msg: 'getTipoSus',
            tipoSus,
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
            msg: 'Error al obtener los tipos de suscripciones'
        });
    }
}

const getTipoSusNombre = async(req, res = response) => {
    const nombre = req.query.nombre;

    try {
        let sus;
        if (nombre) {
            sus = await tipoSuscripcion.findOne({ nombreSus: nombre });
            if (!sus) {
                return res.status(404).json({
                    ok: false,
                    msg: "No existe un tipo de suscripción con ese nombre"
                });
            }
        } else {
            return res.status(406).json({
                ok: false,
                msg: "No se ha pasado un nombre por parámetro"
            });
        }
        return res.status(200).json({
            ok: true,
            msg: 'Obtener tipo de suscripción por nombre',
            sus
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener tipo de suscripción por nombre'
        });
    }
}


const crearTipoSus = async(req, res = response) => {
    const { ...object } = req.body;
    const token = req.header("x-token");
    try {
        const exiteNombre = await tipoSuscripcion.findOne({ nombre: object.nombre });

        if (exiteNombre) {
            return res.status(400).json({
                ok: false,
                msg: 'Nombre de suscripción ya existe'
            });
        }
        const id = infoToken(token).uid;
        const rol = infoToken(token).rol;
        const existeAdmin = await Usuario.findById(id);
        if (!existeAdmin) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ese usuario'
            });
        }
        if (rol !== "Admin" || existeAdmin.rol !== "Admin") {
            return res.status(403).json({
                ok: false,
                msg: 'Solo un administrador puede crer un tipo de Suscripción'
            });
        }
        const insertarTipoSus = {};
        insertarTipoSus.nombre = object.nombre;
        insertarTipoSus.descripcion = object.descripcion;
        insertarTipoSus.precio = object.precio;
        insertarTipoSus.modelos = object.modelos;
        insertarTipoSus.caract = object.caract;
        const tipoSus = new tipoSuscripcion(insertarTipoSus);


        await tipoSus.save();
        return res.status(201).json({
            ok: true,
            msg: 'Tipo de suscripción creada correctamente',
            tipoSus
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear tipo de suscripción'
        });
    }

}

const actualizarTipoSus = async(req, res = response) => {

    const { ...object } = req.body;
    const uid = req.params.id;
    const token = req.header("x-token");
    try {
        const existeTipo = await tipoSuscripcion.findById(uid);
        if (existeTipo) {
            if (existeTipo._id.toString() !== uid) {
                const valor = existeTipo._id;
                return res.status(404).json({
                    ok: false,
                    msg: 'El tipo de suscripción no existe'
                });
            }
        }

        if (existeTipo.nombre !== object.nombre) {
            const exiteNombre = await tipoSuscripcion.findOne({ nombre: object.nombre });

            if (exiteNombre) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Nombre de suscripción ya existe'
                });
            }
        }
        const id = infoToken(token).uid;
        const rol = infoToken(token).rol;
        const existeAdmin = await Usuario.findById(id);
        if (!existeAdmin) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ese usuario'
            });
        }
        if (rol !== "Admin" || existeAdmin.rol !== "Admin") {
            return res.status(403).json({
                ok: false,
                msg: 'Solo un administrador puede actualizar un tipo de Suscripción'
            });
        }
        const insertarTipoSus = {};
        insertarTipoSus.nombre = object.nombre;
        insertarTipoSus.descripcion = object.descripcion;
        insertarTipoSus.precio = object.precio;
        insertarTipoSus.caract = object.caract;
        insertarTipoSus.modelos = object.modelos;

        const tipoSus = await tipoSuscripcion.findByIdAndUpdate(uid, insertarTipoSus, { new: true });
        return res.status(201).json({
            ok: true,
            msg: 'Tipo suscripción actualizada correctamente',
            tipoSus
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar tipo de suscripción'
        });
    }
}

const borrarTipoSus = async(req, res = response) => {

    const uid = req.params.id;
    const token = req.header("x-token");
    try {
        const existeTipo = await tipoSuscripcion.findById(uid);
        if (!existeTipo) {
            return res.status(404).json({
                ok: false,
                msg: 'El tipo de suscripción no existe'
            });
        }
        const id = infoToken(token).uid;
        const rol = infoToken(token).rol;
        const existeAdmin = await Usuario.findById(id);
        if (!existeAdmin) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ese usuario'
            });
        }
        if (rol !== "Admin" || existeAdmin.rol !== "Admin") {
            return res.status(403).json({
                ok: false,
                msg: 'Solo un administrador puede crer un tipo de Suscripción'
            });
        }
        const resultado = await tipoSuscripcion.findByIdAndRemove(uid);
        return res.status(200).json({
            ok: true,
            msg: 'Tipo suscripción eliminada con éxito',
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al eliminar tipo de suscripción'
        });
    }
}

const getTipoSusNombreAdmin = async(req, res = response) => {
    const nombre = req.query.texto;
    const registropp = 10;
    const desde = (Number(req.query.desde) - 1) * 10 || 0;
    const token = req.header("x-token");
    const filtros = req.query;
    try {
        const idToken = infoToken(token).uid;
        const existeAdmin = await Usuario.findById(idToken);
        if(!existeAdmin){
            return res.status(404).json({
                ok: false,
                msg: 'No existe ese usuario'
            });
        }
        if (infoToken(token).rol !== "Admin" || existeAdmin.rol !== "Admin") {
            return res.status(403).json({
                ok: false,
                msg: 'No está autorizado a acceder a este recurso'
            });
        }
        let resultadoFiltros = crearFiltros(filtros, ['nombre', 'desde']);
        let tipoSus, total;
        if (nombre) {
            let expresion = new RegExp(nombre, 'gi');
            tipoSus = await tipoSuscripcion.find({ nombre: expresion }).sort(resultadoFiltros).skip(desde).limit(registropp).exec();
        } else {
            tipoSus = await tipoSuscripcion.find({}).skip(desde).sort(resultadoFiltros).limit(registropp).exec();
        }
        total = await tipoSuscripcion.countDocuments();
        return res.status(200).json({
            ok: true,
            msg: 'Obtener tipo suscripciones para Admin',
            tipoSus,
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
            msg: 'Error al obtener tipo de suscripciones para Admin'
        });
    }
}

const getTipoSusAll = async(req, res = response) => {
    try {
        let tipoSus, total;
        var sort = { precio: 1 };
        [tipoSus, total] = await Promise.all([
            tipoSuscripcion.find({}).sort(sort),
            tipoSuscripcion.countDocuments()
        ]);
        return res.status(200).json({
            ok: true,
            msg: 'Todos los tipos de suscripciones',
            tipoSus
        });
    } catch {
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener los tipos de suscripciones'
        });
    }
}

module.exports = { getTipoSus, getTipoSusNombre, crearTipoSus, actualizarTipoSus, borrarTipoSus, getTipoSusNombreAdmin, getTipoSusAll }