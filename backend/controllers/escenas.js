const Escena = require('../models/escena');
const Usuario = require('../models/usuario');
const Suscripcion = require('../models/suscripcion');
const tipoSuscripcion = require('../models/tipoSuscripcion');
const Uploads = require('../controllers/uploads');
const fs = require('fs');
const { infoToken } = require('../helpers/infotoken');
const { crearFiltros } = require('../helpers/crearFiltros');
const { v4: uuidv4 } = require('uuid');

const obtenerEscenas = async(req, res) => {

    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;
    const contavisita = req.query.contavisita;
    const token = req.header("x-token");
    const idToken = infoToken(token).uid;
    const usuToken = await Usuario.findById(idToken);
    let liked = false;
    let saved = false;


    try {
        const idToken = infoToken(token).uid;
        const rolToken = infoToken(token).rol;
        let escenas, total, unica = false;
        if (id) {
            [escenas, total] = await Promise.all([
                Escena.findById(id).populate('creadorID', 'nombreUsuario nombre imagen'),
                Escena.countDocuments()
            ]);
            if (escenas.creadorID) {
                if (escenas.creadorID.toString() !== idToken) {
                    unica = true;
                }
            }
        } else {
            [escenas, total] = await Promise.all([
                Escena.find({}).skip(desde).limit(registropp),
                Escena.countDocuments()
            ]);
        }
        if (unica) {
            let arrayLikes = [...usuToken.escenasLikes];
            let arrayGuardados = [...usuToken.escenasGuardadas];
            arrayLikes.forEach(element => {
                if (element.equals(escenas._id)) {
                    liked = true;
                }
            });
            arrayGuardados.forEach(element => {
                if (element.equals(escenas._id)) {
                    saved = true;
                }
            });

            if (contavisita === 'true') {
                escenas.NVisitas += 1;
                await escenas.save();
            }

        }
        return res.status(200).json({
            ok: true,
            msg: 'obtenerEscenas',
            escenas,
            liked: liked,
            saved: saved,
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
            msg: 'Error al obtener escenas'
        });
    }
}

const obtenerEscenasNoToken = async(req, res) => {

    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;
    const contavisita = req.query.contavisita;
    let liked = false;
    let saved = false;


    try {
        let escenas, total, unica = false;
        if (id) {
            [escenas, total] = await Promise.all([
                Escena.findById(id).populate('creadorID', 'nombreUsuario nombre imagen'),
                Escena.countDocuments()
            ]);
        } else {
            [escenas, total] = await Promise.all([
                Escena.find({}).skip(desde).limit(registropp),
                Escena.countDocuments()
            ]);
        }
        return res.status(200).json({
            ok: true,
            msg: 'obtenerEscenas',
            escenas,
            liked: liked,
            saved: saved,
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
            msg: 'Error al obtener escenas'
        });
    }
}

const obtenerEscenasNoTokenCargar = async(req, res) => {

    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;
    const contavisita = req.query.contavisita;
    let liked = false;
    let saved = false;


    try {
        let escenas, total, unica = false;
        if (id) {
            [escenas, total] = await Promise.all([
                Escena.findById(id).populate('creadorID', 'nombreUsuario nombre imagen'),
                Escena.countDocuments()
            ]);
        } else {
            [escenas, total] = await Promise.all([
                Escena.find({}).skip(desde).limit(registropp),
                Escena.countDocuments()
            ]);
        }
        return res.status(200).json({
            ok: true,
            msg: 'obtenerEscenas',
            escenas,
            liked: liked,
            saved: saved,
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
            msg: 'Error al obtener escenas'
        });
    }
}

const obtenerEscenasNoUsu = async(req, res) => {

    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;
    const contavisita = req.query.contavisita;
    let liked = false;
    let saved = false;


    try {

        let escenas, total, unica = false;
        if (id) {
            [escenas, total] = await Promise.all([
                Escena.findById(id).populate('creadorID', 'nombreUsuario nombre imagen'),
                Escena.countDocuments()
            ]);

        } else {
            [escenas, total] = await Promise.all([
                Escena.find({}).skip(desde).limit(registropp),
                Escena.countDocuments()
            ]);
        }
        return res.status(200).json({
            ok: true,
            msg: 'obtenerEscenas',
            escenas,
            liked: liked,
            saved: saved,
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
            msg: 'Error al obtener escenas'
        });
    }
}


const crearEscena = async(req, res) => {
    const {...object } = req.body;
    try {
        const token = req.header('x-token');
        const idUsuario = infoToken(token).uid;
        const rolUsuario = infoToken(token).rol;
        const existeUsu = await Usuario.findById(idUsuario);
        if (!existeUsu) {
            return res.status(403).json({
                ok: false,
                msg: 'No existe ese usuario o no está autorizado'
            });
        }
        if (rolUsuario === "Usuario" && existeUsu.rol === "Usuario") {
            const susUsu = await Suscripcion.findOne({ idUsuario: idUsuario });
            const tipoSus = await tipoSuscripcion.findById(susUsu.idTipoSus.toString());
            const modelosMax = tipoSus.modelos;
            const numModelosUsu = await Escena.find({ creadorID: existeUsu._id }).count();
            if (numModelosUsu > modelosMax) {
                return res.status(403).json({
                    ok: false,
                    msg: "Este usuario no puede subir más modelos"
                });
            }
        }
        object.url = uuidv4().toString();
        const escena = new Escena(object);
        escena.creadorID = idUsuario;
        await escena.save();

        return res.status(201).json({
            ok: true,
            msg: 'Se ha creado la escena',
            escena
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al crear escena'
        });
    }
}

const cambiarNombre = async(req, res)=> {
    const uid = req.params.id;
    const {...object } = req.body;
    const pos = req.query.pos;

    console.log(object)
    console.log(pos)

    try {
        const existeEscena = await Escena.findById(uid);
        if (!existeEscena) {
            res.status(404).json({
                ok: false,
                msg: 'No existe una escena con ese id'
            });
        }
        const token = req.header('x-token');
        const idUsuario = infoToken(token).uid;
        const existeUsu = await Usuario.findById(idUsuario);
        if (!existeUsu) {
            return res.status(403).json({
                ok: false,
                msg: 'No existe ese usuario o no está autorizado'
            });
        }

        if (infoToken(token).uid !== existeEscena.creadorID.toString()) {
            return res.status(400).json({
                ok: false,
                msg: 'Existe el usuario pero no es el creador del modelo por lo que no puede actualizarlo'
            });
        }

        const escenaAct = await Escena.findById(uid);

        escenaAct.puntos[pos].nombre = object.nombre;
        const escena = await Escena.findByIdAndUpdate(uid, escenaAct, { new: true });

        console.log(escena)

        return res.status(201).json({
            ok: true,
            msg: 'Se ha actualizado el nombre del punto de la escena',
            escena
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error al actualizar escena'
        });
    }

}

const actualizarEscena = async(req, res) => {
    const uid = req.params.id;
    const {...object } = req.body;
    console.log(object)
    try {
        const existeEscena = await Escena.findById(uid);
        if (!existeEscena) {
            res.status(404).json({
                ok: false,
                msg: 'No existe una escena con ese id'
            });
        }

        const token = req.header('x-token');
        const idUsuario = infoToken(token).uid;
        const existeUsu = await Usuario.findById(idUsuario);
        if (!existeUsu) {
            return res.status(403).json({
                ok: false,
                msg: 'No existe ese usuario o no está autorizado'
            });
        }

        if (infoToken(token).uid !== existeEscena.creadorID.toString()) {
            return res.status(400).json({
                ok: false,
                msg: 'Existe el usuario pero no es el creador del modelo por lo que no puede actualizarlo'
            });
        }


        const escenaAct = await Escena.findById(uid);
        escenaAct.nombre = object.nombre;
        escenaAct.descripcion = object.descripcion;
        escenaAct.privado = object.privado;
        escenaAct.opciones = object.opciones;
        escenaAct.puntos = object.puntos;
        

        const escena = await Escena.findByIdAndUpdate(uid, escenaAct, { new: true });

        return res.status(201).json({
            ok: true,
            msg: 'Se ha actualizado la escena',
            escena
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error al actualizar escena'
        });
    }

    //Actualizar luego el modelo y la imágen de escena almacenados en la escena si fuese necesario
}

const borrarEscena = async(req, res) => {
    const uid = req.params.id;
    try {
        if (!uid) {
            return res.status(406).json({
                ok: false,
                msg: 'No se ha pasado un id'
            });
        }
        const existeEscena = await Escena.findById(uid);
        if (!existeEscena) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe la escena especificada'
            });
        }
        const token = req.header('x-token');
        const idUsuario = infoToken(token).uid;
        const rolToken = infoToken(token).rol;
        const idCreador = existeEscena.creadorID.toString();
        if (idUsuario !== idCreador && rolToken !== "Admin") {
            return res.status(403).json({
                ok: false,
                msg: 'El usuario que pretende eliminar no es el propietario de la escena'
            });
        }

        let imagen = existeEscena.imagen;
        let modelo = existeEscena.modelo;
        var pathImagen = process.env.PATHFILES + "imagenEscena/" + imagen;
        var pathModelo = process.env.PATHFILES + "fotoperfil/" + modelo;
        if (!modelo.includes("default") && !imagen.includes("default")) {
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
            if (fs.existsSync(pathModelo)) {
                fs.unlinkSync(pathModelo);
            }
        }

        const resultado = await Escena.findByIdAndRemove(uid);
        return res.status(200).json({
            ok: true,
            msg: 'Escena eliminada',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al borrar escena'
        });
    }


    //Borrar luego el modelo y la imágen de escena almacenados en la escena
}

const darLikeGuardar = async(req, res = response) => {
    const uid = req.params.id;
    const accion = req.query.accion;
    try {
        const existeEscena = await Escena.findById(uid);
        if (!existeEscena) {
            res.status(404).json({
                ok: false,
                msg: 'No existe una escena con ese id'
            });
        }

        const token = req.header('x-token');
        const idUsuario = infoToken(token).uid;
        const existeUsu = await Usuario.findById(idUsuario);

        if (!existeUsu) {
            return res.status(403).json({
                ok: false,
                msg: 'No existe ese usuario o no está autorizado'
            });
        }
        if (!accion) {
            return res.status(400).json({
                ok: false,
                msg: 'No se ha especificado una accion'
            });
        }
        let arrayLikes = [...existeUsu.escenasLikes];
        let arrayGuardados = [...existeUsu.escenasGuardadas];
        let puedeLike = true;
        let puedeGuardar = true;
        arrayLikes.forEach(element => {
            if (element.equals(existeEscena._id)) {
                console.log('no puede dar like')
                puedeLike = false;
            }
        });
        arrayGuardados.forEach(element => {
            if (element.equals(existeEscena._id)) {
                puedeGuardar = false;
            }
        });

        if (accion === 'like') {
            console.log(puedeLike)
            if (!puedeLike) {
                campo = "NOescenasLikes";
                existeEscena.NValoraciones -= 1;
            } else {
                campo = "escenasLikes";
                existeEscena.NValoraciones += 1;
            }

        } else if (accion === 'guardar') {
            if (!puedeGuardar) {
                campo = "NOescenasValoradas";
                existeEscena.NGuardados -= 1;
            } else {
                campo = "escenasValoradas";
                existeEscena.NGuardados += 1;
            }

        } else {
            return res.status(404).json({
                ok: false,
                msg: 'Esa accion no existe'
            });
        }
        const escena = await Escena.findByIdAndUpdate(uid, existeEscena, { new: true });
        console.log(campo);
        switch (campo) {
            case "NOescenasLikes":
                existeUsu.escenasLikes.forEach((value) => {
                    if (value.equals(existeEscena._id)) {
                        existeUsu.escenasLikes.remove(value);
                    }
                })

                break;
            case "escenasLikes":

                existeUsu.escenasLikes.unshift(existeEscena._id);

                break;
            case "escenasValoradas":
                existeUsu.escenasGuardadas.unshift(existeEscena._id);
                break;
            case "NOescenasValoradas":
                existeUsu.escenasGuardadas.forEach((value) => {
                    if (value.equals(existeEscena._id)) {
                        existeUsu.escenasGuardadas.remove(value);
                    }
                })
                break;

        }
        /*   if (campo === "escenasLikes") {
              existeUsu.escenasLikes.unshift(existeEscena._id);
          } else if (campo === "escenasValoradas") {
              existeUsu.escenasGuardadas.unshift(existeEscena._id);
          } */

        await existeUsu.save();
        return res.status(200).json({
            ok: true,
            msg: 'Se ha realizado una accion sobre la escena',
            escena,
            accion
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error al realizar una accion sobre la escena'
        });
    }
}

// Paginadores
const buscarPorFiltro = async(req, res = response) => {
    
    const desde = (Number(req.query.desde) - 1) * 8 || 0;
    const registropp = 8;
    const nombre = req.query.nombre || "";
    const filtros = req.query;
    let maximo = await Escena.countDocuments();

    try {
        if (Object.keys(filtros).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No has buscado por ningún filtro',

            });
        }
        let cadena = "";
        let valido = true;
        Object.keys(filtros).forEach(key => {

            if (key != 'nombre') {
                if (key != 'desde'){
                    if (key !== 'autor' && ["asc", "desc"].includes(filtros[key])) {
                        cadena += `"${key}":"${filtros[key]}",`;
                    } else if (key !== 'autor' && !["asc", "desc"].includes(filtros[key])) {
                        valido = false;
                    }
                }
            }

        });
        if (!valido) {
            return res.status(406).json({
                ok: false,
                msg: 'Los parametros que no sean autor o nombre deben ser asc o desc',
            });
        }

        if (filtros.autor) {
            let autor = await Usuario.findOne({ nombreUsuario: filtros.autor });
            if (!autor) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un usuario con ese nombre de usuario'
                });
            }
            var id = autor._id.toString();
        }


        let formateado = "{" + cadena + "}";

        console.log(formateado)

        let filt = formateado.slice(0, formateado.length - 2);
        let filtrado = filt + "}";

        let filtrosFormateados;
        
        try {
            filtrosFormateados = JSON.parse(filtrado);
        } catch (e) {
            console.log(e);
        }

        console.log(filtrosFormateados);

        if (id) {

            if (nombre != "" || nombre) {
                

                let expresion = new RegExp(nombre, 'gi');

                var escenas = await Escena.find({ creadorID: id }).populate('creadorID', 'nombreUsuario imagen').sort(filtrosFormateados).skip(desde).limit(registropp).exec();
                let escenasTot = await Escena.find({ creadorID: id }).populate('creadorID', 'nombreUsuario imagen').exec(); 
                maximo = escenasTot.length;


                // Encontrar nombres de las escenas a partir del id
                let escenasAux = await Escena.find({ $and: [{ nombre: expresion }, { creadorID: id }] }).sort(filtrosFormateados).skip(desde).limit(registropp).exec();
                escenas = escenasAux;

                console.log(escenas)
            } else {
                var escenas = await Escena.find({ creadorID: id }).populate('creadorID', 'nombreUsuario imagen').sort(filtrosFormateados).skip(desde).limit(registropp).exec();
                let escenasTot = await Escena.find({ creadorID: id }).populate('creadorID', 'nombreUsuario imagen').exec(); 
                maximo = escenasTot.length;
            }

        } else {

            if (nombre != "" || nombre) {

                let expresion = new RegExp(nombre, 'gi');
                console.log(expresion)

                var escenas = await Escena.find( { nombre: expresion }).populate('creadorID', 'nombreUsuario imagen').sort(filtrosFormateados).skip(desde).limit(registropp).exec();

            } else {
                var escenas = await Escena.find({}).populate('creadorID', 'nombreUsuario imagen').sort(filtrosFormateados).skip(desde).limit(registropp).exec();
            }     

        }


        // Implementar la búsqueda por nombre de la escena
        let total = escenas.length;

        console.log('escenas ajenas')
        console.log(escenas)

        return res.status(200).json({
            ok: true,
            msg: 'obtenerEscenasPorFiltro',
            escenas,
            page: {
                desde,
                registropp,
                total,
                maximo
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener escenas por filtro'
        });
    }
}

// Paginadores
const buscarPorFiltroNoPrivado = async(req, res = response) => {
    
    const desde = (Number(req.query.desde) - 1) * 8 || 0;
    const registropp = 8;
    const nombre = req.query.nombre || "";
    const filtros = req.query;
    let maximo = await Escena.countDocuments();

    try {
        if (Object.keys(filtros).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No has buscado por ningún filtro',

            });
        }
        let cadena = "";
        let valido = true;
        Object.keys(filtros).forEach(key => {

            if (key != 'nombre') {
                if (key != 'desde'){
                    if (key !== 'autor' && ["asc", "desc"].includes(filtros[key])) {
                        cadena += `"${key}":"${filtros[key]}",`;
                    } else if (key !== 'autor' && !["asc", "desc"].includes(filtros[key])) {
                        valido = false;
                    }
                }
            }

        });
        if (!valido) {
            return res.status(406).json({
                ok: false,
                msg: 'Los parametros que no sean autor o nombre deben ser asc o desc',
            });
        }

        if (filtros.autor) {
            let autor = await Usuario.findOne({ nombreUsuario: filtros.autor });
            if (!autor) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un usuario con ese nombre de usuario'
                });
            }
            var id = autor._id.toString();
        }


        let formateado = "{" + cadena + "}";

        console.log(formateado)

        let filt = formateado.slice(0, formateado.length - 2);
        let filtrado = filt + "}";

        let filtrosFormateados;
        
        try {
            filtrosFormateados = JSON.parse(filtrado);
        } catch (e) {
            console.log(e);
        }

        console.log(filtrosFormateados);

        if (id) {

            if (nombre != "" || nombre) {
                

                let expresion = new RegExp(nombre, 'gi');

                var escenas = await Escena.find({ $and: [{ creadorID: id }, {privado: false}]}).populate('creadorID', 'nombreUsuario imagen').sort(filtrosFormateados).skip(desde).limit(registropp).exec();
                let escenasTot = await Escena.find({ privado: false }).populate('creadorID', 'nombreUsuario imagen').exec(); 
                maximo = escenasTot.length;


                // Encontrar nombres de las escenas a partir del id
                let escenasAux = await Escena.find({ $and: [{ nombre: expresion }, { creadorID: id }, { privado: false }] }).sort(filtrosFormateados).skip(desde).limit(registropp).exec();
                escenas = escenasAux;

                console.log(escenas)
            } else {
                var escenas = await Escena.find({$and:[{ creadorID: id },{ privado: false }]}).populate('creadorID', 'nombreUsuario imagen').sort(filtrosFormateados).skip(desde).limit(registropp).exec();
                let escenasTot = await Escena.find({ privado: false }).populate('creadorID', 'nombreUsuario imagen').exec(); 
                maximo = escenasTot.length;
            }

        } else {

            if (nombre != "" || nombre) {

                let expresion = new RegExp(nombre, 'gi');
                console.log(expresion)

                var escenas = await Escena.find({$and:[{ nombre: expresion },{ privado: false }]}).populate('creadorID', 'nombreUsuario imagen').sort(filtrosFormateados).skip(desde).limit(registropp).exec();

                let escenasTot = await Escena.find({ privado: false }).populate('creadorID', 'nombreUsuario imagen').exec(); 
                maximo = escenasTot.length;

            } else {
                var escenas = await Escena.find({ privado: false }).populate('creadorID', 'nombreUsuario imagen').sort(filtrosFormateados).skip(desde).limit(registropp).exec();
                
                let escenasTot = await Escena.find({ privado: false }).populate('creadorID', 'nombreUsuario imagen').exec(); 
                maximo = escenasTot.length;
            }     


        }


        // Implementar la búsqueda por nombre de la escena
        let total = escenas.length;

        console.log(escenas)
        return res.status(200).json({
            ok: true,
            msg: 'obtenerEscenasPorFiltro',
            escenas,
            page: {
                desde,
                registropp,
                total,
                maximo
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener escenas por filtro'
        });
    }
}

// Paginadores
const buscarPorFiltroNoPrivadoNoUsu = async(req, res = response) => {
    
    const desde = (Number(req.query.desde) - 1) * 8 || 0;
    const registropp = 8;
    const nombre = req.query.nombre || "";
    const filtros = req.query;
    let maximo = await Escena.countDocuments();

    try {
        if (Object.keys(filtros).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No has buscado por ningún filtro',

            });
        }
        let cadena = "";
        let valido = true;
        Object.keys(filtros).forEach(key => {

            if (key != 'nombre') {
                if (key != 'desde'){
                    if (key !== 'autor' && ["asc", "desc"].includes(filtros[key])) {
                        cadena += `"${key}":"${filtros[key]}",`;
                    } else if (key !== 'autor' && !["asc", "desc"].includes(filtros[key])) {
                        valido = false;
                    }
                }
            }

        });
        if (!valido) {
            return res.status(406).json({
                ok: false,
                msg: 'Los parametros que no sean autor o nombre deben ser asc o desc',
            });
        }

        if (filtros.autor) {
            let autor = await Usuario.findOne({ nombreUsuario: filtros.autor });
            if (!autor) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un usuario con ese nombre de usuario'
                });
            }
            var id = autor._id.toString();
        }


        let formateado = "{" + cadena + "}";

        console.log(formateado)

        let filt = formateado.slice(0, formateado.length - 2);
        let filtrado = filt + "}";

        let filtrosFormateados;
        
        try {
            filtrosFormateados = JSON.parse(filtrado);
        } catch (e) {
            console.log(e);
        }

        console.log(filtrosFormateados);

        if (id) {

            if (nombre != "" || nombre) {
                

                let expresion = new RegExp(nombre, 'gi');

                var escenas = await Escena.find({ $and: [{ creadorID: id }, {privado: false}]}).populate('creadorID', 'nombreUsuario imagen').sort(filtrosFormateados).skip(desde).limit(registropp).exec();
                let escenasTot = await Escena.find({ privado: false }).populate('creadorID', 'nombreUsuario imagen').exec(); 
                maximo = escenasTot.length;


                // Encontrar nombres de las escenas a partir del id
                let escenasAux = await Escena.find({ $and: [{ nombre: expresion }, { creadorID: id }, { privado: false }] }).sort(filtrosFormateados).skip(desde).limit(registropp).exec();
                escenas = escenasAux;

                console.log(escenas)
            } else {
                var escenas = await Escena.find({$and:[{ creadorID: id },{ privado: false }]}).populate('creadorID', 'nombreUsuario imagen').sort(filtrosFormateados).skip(desde).limit(registropp).exec();
                let escenasTot = await Escena.find({ privado: false }).populate('creadorID', 'nombreUsuario imagen').exec(); 
                maximo = escenasTot.length;
            }

        } else {

            if (nombre != "" || nombre) {

                let expresion = new RegExp(nombre, 'gi');
                console.log(expresion)

                var escenas = await Escena.find({$and:[{ nombre: expresion },{ privado: false }]}).populate('creadorID', 'nombreUsuario imagen').sort(filtrosFormateados).skip(desde).limit(registropp).exec();

                let escenasTot = await Escena.find({ privado: false }).populate('creadorID', 'nombreUsuario imagen').exec(); 
                maximo = escenasTot.length;

            } else {
                var escenas = await Escena.find({ privado: false }).populate('creadorID', 'nombreUsuario imagen').sort(filtrosFormateados).skip(desde).limit(registropp).exec();
                
                let escenasTot = await Escena.find({ privado: false }).populate('creadorID', 'nombreUsuario imagen').exec(); 
                maximo = escenasTot.length;
            }     


        }


        // Implementar la búsqueda por nombre de la escena
        let total = escenas.length;

        console.log(escenas)
        return res.status(200).json({
            ok: true,
            msg: 'obtenerEscenasPorFiltro',
            escenas,
            page: {
                desde,
                registropp,
                total,
                maximo
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener escenas por filtro'
        });
    }
}

// Paginadores
const buscarPorFiltroPerfil = async(req, res = response) => {
    const desde = (Number(req.query.desde) - 1) * 8 || 0;
    const registropp = 8;
    const nombre = req.query.nombre || "";
    const filtros = req.query;
    const criterio = req.query.criterio;
    const token = req.header("x-token");

    console.log(desde)

    try {

        if (!["likes", "guardados", "propios", "ajenas"].includes(criterio)) {
            return res.status(404).json({
                ok: false,
                msg: 'Criterio no existente, validos: "likes" , "guardados" , "propios", "ajenas'
            });
        }

        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: 'No existe el token'
            });
        }

        // Cogemos el id
        const idToken = infoToken(token).uid;


        if (Object.keys(filtros).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No has buscado por ningún filtro',

            });
        }
        let cadena = "";
        let valido = true;
        Object.keys(filtros).forEach(key => {

            if (key != 'nombre') {
                if (key != 'desde'){
                    if (key != 'criterio'){
                        if (key !== 'autor' && ["asc", "desc"].includes(filtros[key])) {
                            cadena += `"${key}":"${filtros[key]}",`;
                        } else if (key !== 'autor' && !["asc", "desc"].includes(filtros[key])) {
                            valido = false;
                        }
                    }
                }
            }

        });
        if (!valido) {
            return res.status(406).json({
                ok: false,
                msg: 'Los parametros que no sean autor o nombre deben ser asc o desc',
            });
        }

        if (filtros.autor) {
            let autor = await Usuario.findOne({ nombreUsuario: filtros.autor });
            if (!autor) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un usuario con ese nombre de usuario'
                });
            }
            var id = autor._id.toString();
        }


        let formateado = "{" + cadena + "}";

        console.log(formateado)

        let filt = formateado.slice(0, formateado.length - 2);
        let filtrado = filt + "}";

        let filtrosFormateados;
        
        try {
            filtrosFormateados = JSON.parse(filtrado);
        } catch (e) {
            console.log(e);
        }

        console.log(filtrosFormateados);

        if (criterio === "propios") {

            // Si hay nombre
            if (nombre != "" || nombre) {

                let expresion = new RegExp(nombre, 'gi');
                console.log(expresion)

                var escenas  = await Escena.find(  { $and: [{ nombre: expresion }, { creadorID: idToken }] }  ).populate('creadorID', 'nombreUsuario imagen').sort(filtrosFormateados).skip(desde).limit(registropp).exec();

                let escenasAux = await Escena.find(  { $and: [{ nombre: expresion }, { creadorID: idToken }] }  ).exec()
                maximo = escenasAux.length

            } else {
                var escenas = await Escena.find({ creadorID: idToken }).populate('creadorID', 'nombreUsuario imagen').sort(filtrosFormateados).skip(desde).limit(registropp).exec();

                let escenasAux = await Escena.find( { creadorID: idToken }  ).exec()
                maximo = escenasAux.length
            }  

        }
        else if (criterio == "likes"){

            if (nombre || nombre != "") {

                let expresion = new RegExp(nombre, 'gi');

                // Usuario con escenas guardadas
                escenas = await Usuario.findById(idToken).populate('escenasLikes', 'creadorID').exec();
                console.log(escenas)
                maximo = escenas.escenasLikes.length;

                // Encontrar nombres de las escenas a partir del id
                let escenasAux = await Escena.find({ $and: [{ nombre: expresion }, { _id: { $in: escenas.escenasLikes } }] }).sort(filtrosFormateados).skip(desde).limit(registropp).exec();
                escenas = escenasAux;
                // console.log(escenas);
                
            } else {
                 // Usuario con escenas guardadas
                 escenas = await Usuario.findById(idToken).populate('escenasLikes', 'creadorID').exec();
                 maximo = escenas.escenasLikes.length;

                // Encontrar nombres de las escenas a partir del id
                let escenasAux = await Escena.find( { _id: { $in: escenas.escenasLikes } } ).sort(filtrosFormateados).skip(desde).limit(registropp).exec();
                escenas = escenasAux;

                console.log(escenas);

            }

        }
        else if (criterio == "guardados"){
            if (nombre || nombre != "") {

                let expresion = new RegExp(nombre, 'gi');

                // Usuario con escenas guardadas
                escenas = await Usuario.findById(idToken).populate('escenasGuardadas', 'creadorID').exec();
                maximo = escenas.escenasGuardadas.length;

                // Encontrar nombres de las escenas a partir del id
                let escenasAux = await Escena.find({ $and: [{ nombre: expresion }, { _id: { $in: escenas.escenasGuardadas } }] }).sort(filtrosFormateados).skip(desde).limit(registropp).exec();
                escenas = escenasAux;
                // console.log(escenas);
                
            } else {
                 // Usuario con escenas guardadas
                 escenas = await Usuario.findById(idToken).populate('escenasGuardadas', 'creadorID').exec();
                 maximo = escenas.escenasGuardadas.length;

                // Encontrar nombres de las escenas a partir del id
                let escenasAux = await Escena.find( { _id: { $in: escenas.escenasGuardadas } } ).sort(filtrosFormateados).skip(desde).limit(registropp).exec();
                escenas = escenasAux;

                console.log(escenas);

            }

        }

        // Implementar la búsqueda por nombre de la escena
        let total = escenas.length;

        console.log(escenas)
        return res.status(200).json({
            ok: true,
            msg: 'obtenerEscenasPorFiltroPerfil',
            escenas,
            page: {
                desde,
                registropp,
                total,
                maximo
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener escenas por filtro'
        });
    }
}

// Paginadores
const buscarPorFiltroNoUsu = async(req, res = response) => {
    const desde = (Number(req.query.desde) - 1) * 8 || 0;
    const registropp = 8;
    const nombre = req.query.nombre || "";
    const filtros = req.query;

    try {
        if (Object.keys(filtros).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No has buscado por ningún filtro',

            });
        }
        let cadena = "";
        let valido = true;
        Object.keys(filtros).forEach(key => {

            if (key != 'nombre') {
                if (key != 'desde'){
                    if (key !== 'autor' && ["asc", "desc"].includes(filtros[key])) {
                        cadena += `"${key}":"${filtros[key]}",`;
                    } else if (key !== 'autor' && !["asc", "desc"].includes(filtros[key])) {
                        valido = false;
                    }
                }
            }

        });
        if (!valido) {
            return res.status(406).json({
                ok: false,
                msg: 'Los parametros que no sean autor o nombre deben ser asc o desc',
            });
        }

        if (filtros.autor) {
            let autor = await Usuario.findOne({ nombreUsuario: filtros.autor });
            if (!autor) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un usuario con ese nombre de usuario'
                });
            }
            var id = autor._id.toString();
        }


        let formateado = "{" + cadena + "}";

        console.log(formateado)

        let filt = formateado.slice(0, formateado.length - 2);
        let filtrado = filt + "}";

        let filtrosFormateados;
        
        try {
            filtrosFormateados = JSON.parse(filtrado);
        } catch (e) {
            console.log(e);
        }

        console.log(filtrosFormateados);

        if (id) {

            if (nombre != "" || nombre) {
                

                let expresion = new RegExp(nombre, 'gi');

                var escenas = await Escena.find({ creadorID: id }).populate('creadorID', 'nombreUsuario imagen').sort(filtrosFormateados).skip(desde).limit(registropp).exec();

                // Encontrar nombres de las escenas a partir del id
                let escenasAux = await Escena.find({ $and: [{ nombre: expresion }, { _id: { $in: escenas } }] });
                escenas = escenasAux;

                console.log(escenas)
            } else {
                var escenas = await Escena.find({ creadorID: id }).populate('creadorID', 'nombreUsuario imagen').sort(filtrosFormateados).skip(desde).limit(registropp).exec();
            }

        } else {

            if (nombre != "" || nombre) {

                let expresion = new RegExp(nombre, 'gi');
                console.log(expresion)

                var escenas = await Escena.find( { nombre: expresion }).populate('creadorID', 'nombreUsuario imagen').sort(filtrosFormateados).skip(desde).limit(registropp).exec();

            } else {
                var escenas = await Escena.find({}).populate('creadorID', 'nombreUsuario imagen').sort(filtrosFormateados).skip(desde).limit(registropp).exec();
            }     

        }


        // Implementar la búsqueda por nombre de la escena
        let total = escenas.length;
        let maximo = await Escena.countDocuments();

        console.log(escenas)
        return res.status(200).json({
            ok: true,
            msg: 'obtenerEscenasPorFiltro',
            escenas,
            page: {
                desde,
                registropp,
                total,
                maximo
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener escenas por filtro'
        });
    }
}

// Paginadores
const obtenerEscenasUsuario = async(req, res = response) => {
    const nombre = req.query.nombre;
    const desde = (Number(req.query.desde) - 1) * 8 || 0;
    // Debería devolver TODAS las escenas no un número limitado
    const registropp = Number(process.env.ESCENASPERPAGE);
    const token = req.header("x-token");
    const criterio = req.query.criterio;
    try {
        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: 'No existe el token'
            });
        }
        const idToken = infoToken(token).uid;
        let escenas;
        if (!["likes", "guardados", "propios", "ajenas"].includes(criterio)) {
            return res.status(404).json({
                ok: false,
                msg: 'Criterio no existente, validos: "likes" , "guardados" , "propios", "ajenas'
            });
        }
        if (criterio === "propios") {

            if (nombre || nombre != "") {
                let expresion = new RegExp(nombre, 'gi');
                escenas = await Escena.find({ creadorID: idToken, nombre: expresion }).skip(desde).limit(registropp).exec();
            } else {
                escenas = await Escena.find({ creadorID: idToken }).skip(desde).limit(registropp).exec();
            }

            total = escenas.length;
        }
        if (criterio === "guardados") {

            if (nombre || nombre != "") {

                let expresion = new RegExp(nombre, 'gi');

                // Usuario con escenas guardadas
                escenas = await Usuario.findById(idToken).populate('escenasGuardadas', 'creadorID').skip(desde).limit(registropp).exec();

                // Encontrar nombres de las escenas a partir del id
                let escenasAux = await Escena.find({ $and: [{ nombre: expresion }, { _id: { $in: escenas.escenasGuardadas } }] });
                //console.log(escenasAux);

                escenas = escenasAux;
                total = escenas.length;

            } else {
                escenas = await Usuario.findById(idToken).populate('escenasGuardadas', 'creadorID').skip(desde).limit(registropp).exec();
                total = escenas.escenasGuardadas.length;
            }


        }
        if (criterio === "likes") {

            if (nombre || nombre != "") {

                let expresion = new RegExp(nombre, 'gi');

                // Usuario con escenas guardadas
                escenas = await Usuario.findById(idToken).populate('escenasLikes', 'creadorID').skip(desde).limit(registropp).exec();

                // Encontrar nombres de las escenas a partir del id
                let escenasAux = await Escena.find({ $and: [{ nombre: expresion }, { _id: { $in: escenas.escenasLikes } }] });
                //console.log(escenasAux);

                escenas = escenasAux;
                total = escenas.length;

            } else {
                escenas = await Usuario.findById(idToken).populate('escenasLikes', 'creadorID').skip(desde).limit(registropp).exec();
                total = escenas.escenasLikes.length;
            }


        }

        let maximo = await Escena.countDocuments();
        console.log('devuelvo')
        console.log(escenas)

        //console.log('Escenas encontradas: \n' + escenas)
        return res.status(200).json({
            ok: true,
            msg: 'obtener Escenas de Usuario',
            criterio,
            escenas,
            page: {
                desde,
                registropp,
                total,
                maximo
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener escenas de usuario'
        });
    }
}

// Paginadores
const getEscenaNombreAdmin = async(req, res = response) => {
    const nombre = req.query.texto;
    const registropp = 10;
    const desde = (Number(req.query.desde) - 1) * 10 || 0;
    const token = req.header("x-token");
    const filtros = req.query;
    const privado = req.query.privado;
    try {
        if (infoToken(token).rol !== "Admin") {
            return res.status(401).json({
                ok: false,
                msg: 'No está autorizado a acceder a este recurso'
            });
        }
        let resultadoFiltros = crearFiltros(filtros, ['nombre', 'desde', 'privado']);
        if (!resultadoFiltros) {
            resultadoFiltros = null;
        }
        let escenas, total;
        if (nombre) {
            let expresion = new RegExp(nombre, 'gi');
            if (privado == "true" || privado == "false") {
                escenas = await Escena.find({ nombre: expresion, privado: privado }).sort(resultadoFiltros).skip(desde).limit(registropp);
            } else {
                escenas = await Escena.find({ nombre: expresion }).sort(resultadoFiltros).skip(desde).limit(registropp);
            }
        } else {
            if (privado == "true" || privado == "false") {
                escenas = await Escena.find({ privado: privado }).sort(resultadoFiltros).skip(desde).limit(registropp);
            }
            escenas = await Escena.find({}).sort(resultadoFiltros).skip(desde).limit(registropp);
        }
        total = await Escena.countDocuments();
        res.status(200).json({
            ok: true,
            msg: 'Obtener escenas para Admin',
            escenas,
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
            msg: 'Error al obtener escenas para Admin'
        });
    }
}

const getEscenaNombre = async(req, res = response) => {
    const nombre = req.query.nombreEscena;
    const filtros = req.query;
    try {
        let resultadoFiltros = crearFiltros(filtros, ['nombre']);
        if (!resultadoFiltros) {
            resultadoFiltros = null;
        }
        let escenas, total;
        if (nombre) {
            let expresion = new RegExp(nombre, 'gi');
            escenas = await Escena.find({ nombre: expresion }).sort(resultadoFiltros);

        } else {
            escenas = await Escena.find({}).sort(resultadoFiltros);
        }
        total = await Escena.countDocuments();

        return res.status(200).json({
            ok: true,
            msg: 'Obtener escenas',
            escenas,
            page: {
                total
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener escenas'
        });
    }
}

const obtenerEscenaEnlace = async(req, res = response) => {
    const enlace = req.query.enlace;
    try {
        if (!enlace) {
            return res.status(404).json({
                ok: false,
                msg: "Es necesario proporcionar un enalce"
            })
        }
        const escena = await Escena.findOne({ url: enlace });
        return res.status(200).json({
            ok: true,
            msg: 'Obtener escena por enlace privado',
            escena,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener escena privada por enlace'
        });
    }

}

const obtenerEscenasIdUsuario = async(req,res = response) =>{
    const id = req.query.id;
    const token = req.header("x-token");
    const idToken = infoToken(token).uid;
    try {
        const existeUsuario = await Usuario.findById(idToken);
        if(!existeUsuario){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese ID'
            });
        }
        const escenas = await Escena.find({creadorID:id});
        return res.status(200).json({
            ok: true,
            msg: 'Obtener escena por nombre de usuario',
            escenas,
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener escena por nombre de usuario'
        });
    }
} 

module.exports = { obtenerEscenas, obtenerEscenasNoToken, obtenerEscenasNoTokenCargar, crearEscena, actualizarEscena, borrarEscena, darLikeGuardar, buscarPorFiltro, buscarPorFiltroNoUsu, obtenerEscenasUsuario, getEscenaNombreAdmin, getEscenaNombre, obtenerEscenaEnlace, obtenerEscenasNoUsu, buscarPorFiltroPerfil, obtenerEscenasIdUsuario, buscarPorFiltroNoPrivado, buscarPorFiltroNoPrivadoNoUsu, cambiarNombre}

