const Usuario = require('../models/usuario');
const suscripcion = require('../controllers/suscripciones');
const tipoSuscripcion = require('../models/tipoSuscripcion');
const Chat = require('../models/chat');
const Escena = require('../models/escena');
const { infoToken } = require("../helpers/infotoken");
const { crearFiltros } = require("../helpers/crearFiltros");
const { mysqlConnection } = require('../database/mysqldb');


const obtenerTiempoMedio = async(req, res = response) => {
    const token = req.header('x-token');
    const intervalo = req.query.intervalo;
    try {
            let idToken = infoToken(token).uid;
            let existeUsuario = await Usuario.findById(idToken);
            let rolUsuario = infoToken(token).rol;

            if(!existeUsuario) {
                return res.status(404).json({
                    ok: false,
                    msg: "No existe un usuario con ese id"
                });
            }
           if(existeUsuario.rol !== "Admin" || rolUsuario !== "Admin"){
            return res.status(403).json({
                ok: false,
                msg: "No esta autorizado a acceder a este recurso"
            });
           }
           const db = await mysqlConnection();
           let resultado;
           if(!intervalo){
                resultado = await db.query("SELECT CAST(AVG(tiempo_diario_horas) AS DECIMAL(10,1)) as tiempoMedio FROM usuarios");
           }else{
                let unidad = intervalo.split('')[1];
                let valor = parseInt(intervalo.split('')[0]);
                let fecha_comp = "";
                let fecha_hasta = "";
            switch (unidad) {
                case "d":
                    [fecha_comp,fecha_hasta] = generarFecha(valor);
                    console.log(fecha_comp + " " + fecha_hasta)
                    resultado = await db.query(`SELECT CAST(AVG(tiempo_diario_horas) AS DECIMAL(10,1)) as tiempoMedio FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') ORDER BY str_to_date(fecha_alta, '%d/%m/%Y') DESC`);
                    break;
                case "w":
                    valor *= 7;
                    [fecha_comp,fecha_hasta] = generarFecha(valor);
                    resultado = await db.query(`SELECT CAST(AVG(tiempo_diario_horas) AS DECIMAL(10,1)) as tiempoMedio FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') ORDER BY str_to_date(fecha_alta, '%d/%m/%Y') DESC`)
                    break;
                case "m":
                    valor*= 30;
                    [fecha_comp,fecha_hasta] = generarFecha(valor);
                    resultado = await db.query(`SELECT CAST(AVG(tiempo_diario_horas) AS DECIMAL(10,1)) as tiempoMedio FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') ORDER BY str_to_date(fecha_alta, '%d/%m/%Y') DESC`)
                    break;
                case "y":
                    valor*= 365;
                    [fecha_comp,fecha_hasta] = generarFecha(valor);
                    resultado = await db.query(`SELECT CAST(AVG(tiempo_diario_horas) AS DECIMAL(10,1)) as tiempoMedio FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') ORDER BY str_to_date(fecha_alta, '%d/%m/%Y') DESC`)
                    break;
                default:
                    break;
            }
           }
           await db.end();
           console.log(resultado)
           resultado = resultado[0];
        return res.status(200).json({
            ok: true,
            msg: 'Obtener tiempo medio',
            resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener estadisticas'
        });
    }
}

const obtenerPaisesSuscripcion = async(req, res = response) => {
    const token = req.header('x-token');
    const intervalo = req.query.intervalo;
    try {
            let idToken = infoToken(token).uid;
            let existeUsuario = await Usuario.findById(idToken);
            let rolUsuario = infoToken(token).rol;

            if(!existeUsuario) {
                return res.status(404).json({
                    ok: false,
                    msg: "No existe un usuario con ese id"
                });
            }
           if(existeUsuario.rol !== "Admin" || rolUsuario !== "Admin"){
            return res.status(403).json({
                ok: false,
                msg: "No esta autorizado a acceder a este recurso"
            });
           }
           const db = await mysqlConnection();
           let gratuita, premium, premiumPlus, premiumUltra;
           if(!intervalo){
                gratuita = await db.query("SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE nombre_suscripcion like('Gratuita') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5");
                premium = await db.query("SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE nombre_suscripcion like('Premium') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5");
                premiumPlus = await db.query("SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE nombre_suscripcion like('Premium Plus') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5");
                premiumUltra = await db.query("SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE nombre_suscripcion like('Premium Ultra') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5");
           }else{
                let unidad = intervalo.split('')[1];
                let valor = parseInt(intervalo.split('')[0]);
                let fecha_comp = "";
                let fecha_hasta = "";
                switch (unidad) {
                    case "d":
                        [fecha_comp,fecha_hasta] = generarFecha(valor);
                        gratuita = await db.query(`SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Gratuita') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5`);
                        premium = await db.query(`SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5`);
                        premiumPlus = await db.query(`SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium Plus') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5`);
                        premiumUltra = await db.query(`SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium Ultra') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5`);
                        break;
                    case "w":
                        valor *= 7;
                        [fecha_comp,fecha_hasta] = generarFecha(valor);
                        gratuita = await db.query(`SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Gratuita') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5`);
                        premium = await db.query(`SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5`);
                        premiumPlus = await db.query(`SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium Plus') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5`);
                        premiumUltra = await db.query(`SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium Ultra') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5`);
                        break;
                    case "m":
                        valor*= 30;
                        [fecha_comp,fecha_hasta] = generarFecha(valor);
                        gratuita = await db.query(`SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Gratuita') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5`);
                        premium = await db.query(`SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5`);
                        premiumPlus = await db.query(`SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium Plus') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5`);
                        premiumUltra = await db.query(`SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium Ultra') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5`);
                        break;
                    case "y":
                        valor*= 365;
                        [fecha_comp,fecha_hasta] = generarFecha(valor);
                        gratuita = await db.query(`SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Gratuita') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5`);
                        premium = await db.query(`SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5`);
                        premiumPlus = await db.query(`SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium Plus') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5`);
                        premiumUltra = await db.query(`SELECT COUNT(pais) AS numero, pais FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium Ultra') GROUP BY nombre_suscripcion, pais ORDER BY numero DESC limit 5`);
                        break;
                    default:
                        break;
                }
           }
           await db.end();
        return res.status(200).json({
            ok: true,
            msg: 'Obtener paises suscripcion',
            gratuita,
            premium,
            premiumPlus,
            premiumUltra
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener paises suscripcion'
        });
    }
}

const obtenerUsuariosSucripcionesSuperiores = async(req, res = response) => {
    const token = req.header('x-token');
    const intervalo = req.query.intervalo;
    try {
            let idToken = infoToken(token).uid;
            let existeUsuario = await Usuario.findById(idToken);
            let rolUsuario = infoToken(token).rol;

            if(!existeUsuario) {
                return res.status(404).json({
                    ok: false,
                    msg: "No existe un usuario con ese id"
                });
            }
           if(existeUsuario.rol !== "Admin" || rolUsuario !== "Admin"){
            return res.status(403).json({
                ok: false,
                msg: "No esta autorizado a acceder a este recurso"
            });
           }
           const db = await mysqlConnection();
           let totalUsuarios, usuarioSuperiores, usuariosPremium, usuariosPremiumPlus, usuariosPremiumUltra;
           if(!intervalo){
                totalUsuarios = await db.query("SELECT COUNT(*) AS totalUsuarios FROM usuarios");
                usuarioSuperiores = await db.query("SELECT COUNT(*) AS usuarioSuperiores FROM usuarios WHERE nombre_suscripcion NOT LIKE('Gratuita')");
                usuariosPremium = await db.query("SELECT COUNT(*) AS usuariosPremium FROM usuarios WHERE nombre_suscripcion LIKE('Premium')");
                usuariosPremiumPlus = await db.query("SELECT COUNT(*) AS usuariosPremiumPlus FROM usuarios WHERE nombre_suscripcion LIKE('Premium Plus')");
                usuariosPremiumUltra = await db.query("SELECT COUNT(*) AS usuariosPremiumUltra FROM usuarios WHERE nombre_suscripcion LIKE('Premium Ultra')");
           }else{
                let unidad = intervalo.split('')[1];
                let valor = parseInt(intervalo.split('')[0]);
                let fecha_comp = "";
                let fecha_hasta = "";
                switch (unidad) {
                    case "d":
                        [fecha_comp,fecha_hasta] = generarFecha(valor);
                        totalUsuarios = await db.query(`SELECT COUNT(*) AS totalUsuarios FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y')`);
                        usuarioSuperiores = await db.query(`SELECT COUNT(*) AS usuarioSuperiores FROM usuarios WHERE nombre_suscripcion NOT LIKE('Gratuita') AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y')`);
                        usuariosPremium = await db.query(`SELECT COUNT(*) AS usuariosPremium FROM usuarios WHERE nombre_suscripcion LIKE('Premium') AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y')`);
                        usuariosPremiumPlus = await db.query(`SELECT COUNT(*) AS usuariosPremiumPlus FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium Plus')`);
                        usuariosPremiumUltra = await db.query(`SELECT COUNT(*) AS usuariosPremiumUltra FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium Ultra')`);
                        break;
                    case "w":
                        valor *= 7;
                        [fecha_comp,fecha_hasta] = generarFecha(valor);
                        totalUsuarios = await db.query(`SELECT COUNT(*) AS totalUsuarios FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y')`);
                        usuarioSuperiores = await db.query(`SELECT COUNT(*) AS usuarioSuperiores FROM usuarios WHERE nombre_suscripcion NOT LIKE('Gratuita') AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y')`);
                        usuariosPremium = await db.query(`SELECT COUNT(*) AS usuariosPremium FROM usuarios WHERE nombre_suscripcion LIKE('Premium') AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y')`);
                        usuariosPremiumPlus = await db.query(`SELECT COUNT(*) AS usuariosPremiumPlus FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium Plus')`);
                        usuariosPremiumUltra = await db.query(`SELECT COUNT(*) AS usuariosPremiumUltra FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium Ultra')`);
                        break;
                    case "m":
                        valor*= 30;
                        [fecha_comp,fecha_hasta] = generarFecha(valor);
                        totalUsuarios = await db.query(`SELECT COUNT(*) AS totalUsuarios FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y')`);
                        usuarioSuperiores = await db.query(`SELECT COUNT(*) AS usuarioSuperiores FROM usuarios WHERE nombre_suscripcion NOT LIKE('Gratuita') AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y')`);
                        usuariosPremium = await db.query(`SELECT COUNT(*) AS usuariosPremium FROM usuarios WHERE nombre_suscripcion LIKE('Premium') AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y')`);
                        usuariosPremiumPlus = await db.query(`SELECT COUNT(*) AS usuariosPremiumPlus FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium Plus')`);
                        usuariosPremiumUltra = await db.query(`SELECT COUNT(*) AS usuariosPremiumUltra FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium Ultra')`);
                        break;
                    case "y":
                        valor*= 365;
                        [fecha_comp,fecha_hasta] = generarFecha(valor);
                        totalUsuarios = await db.query(`SELECT COUNT(*) AS totalUsuarios FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y')`);
                        usuarioSuperiores = await db.query(`SELECT COUNT(*) AS usuarioSuperiores FROM usuarios WHERE nombre_suscripcion NOT LIKE('Gratuita') AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y')`);
                        usuariosPremium = await db.query(`SELECT COUNT(*) AS usuariosPremium FROM usuarios WHERE nombre_suscripcion LIKE('Premium') AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y')`);
                        usuariosPremiumPlus = await db.query(`SELECT COUNT(*) AS usuariosPremiumPlus FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium Plus')`);
                        usuariosPremiumUltra = await db.query(`SELECT COUNT(*) AS usuariosPremiumUltra FROM usuarios WHERE str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') AND nombre_suscripcion like('Premium Ultra')`);
                        break;
                    default:
                        break;
                }
           }
        await db.end();
        return res.status(200).json({
            ok: true,
            msg: 'Obtener usuarios con suscripciones superiores',
            totalUsuarios,
            usuarioSuperiores,
            usuariosPremium,
            usuariosPremiumPlus,
            usuariosPremiumUltra
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener usuarios con suscripciones superiores'
        });
    }
}

const obtenerModelosMasRepercusion = async(req, res = response) => {
    const token = req.header('x-token');
    const intervalo = req.query.intervalo;
    try {
            let idToken = infoToken(token).uid;
            let existeUsuario = await Usuario.findById(idToken);
            let rolUsuario = infoToken(token).rol;

            if(!existeUsuario) {
                return res.status(404).json({
                    ok: false,
                    msg: "No existe un usuario con ese id"
                });
            }
           if(existeUsuario.rol !== "Admin" || rolUsuario !== "Admin"){
            return res.status(403).json({
                ok: false,
                msg: "No esta autorizado a acceder a este recurso"
            });
           }
           const db = await mysqlConnection();
           let modelosMasVisualizaciones, modelosMasLikes, modelosMasGuardados;
           if(!intervalo){
                modelosMasVisualizaciones = await db.query("SELECT modelos.nombre,modelos.visualizaciones as valor,usuarios.nombre_usuario FROM modelos,usuarios WHERE modelos.id_usu = usuarios.id ORDER BY modelos.visualizaciones DESC LIMIT 3");
                modelosMasLikes = await db.query("SELECT modelos.nombre,modelos.likes as valor,usuarios.nombre_usuario FROM modelos,usuarios WHERE modelos.id_usu = usuarios.id ORDER BY modelos.likes DESC LIMIT 3");
                modelosMasGuardados = await db.query("SELECT modelos.nombre,modelos.guardados as valor,usuarios.nombre_usuario FROM modelos,usuarios WHERE modelos.id_usu = usuarios.id ORDER BY modelos.guardados DESC LIMIT 3");
           }else{
                let unidad = intervalo.split('')[1];
                let valor = parseInt(intervalo.split('')[0]);
                let fecha_comp = "";
                let fecha_hasta = "";
                switch (unidad) {
                    case "d":
                        [fecha_comp,fecha_hasta] = generarFecha(valor);
                        modelosMasVisualizaciones = await db.query(`SELECT modelos.nombre,modelos.visualizaciones,usuarios.nombre_usuario FROM modelos,usuarios WHERE modelos.id_usu = usuarios.id AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') ORDER BY modelos.visualizaciones DESC LIMIT 3`);
                        modelosMasLikes = await db.query(`SELECT modelos.nombre,modelos.likes,usuarios.nombre_usuario FROM modelos,usuarios WHERE modelos.id_usu = usuarios.id AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') ORDER BY modelos.likes DESC LIMIT 3`);
                        modelosMasGuardados = await db.query(`SELECT modelos.nombre,modelos.guardados,usuarios.nombre_usuario FROM modelos,usuarios WHERE modelos.id_usu = usuarios.id AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') ORDER BY modelos.guardados DESC LIMIT 3`);
                        break;
                    case "w":
                        valor *= 7;
                        [fecha_comp,fecha_hasta] = generarFecha(valor);
                        modelosMasVisualizaciones = await db.query(`SELECT modelos.nombre,modelos.visualizaciones,usuarios.nombre_usuario FROM modelos,usuarios WHERE modelos.id_usu = usuarios.id AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') ORDER BY modelos.visualizaciones DESC LIMIT 3`);
                        modelosMasLikes = await db.query(`SELECT modelos.nombre,modelos.likes,usuarios.nombre_usuario FROM modelos,usuarios WHERE modelos.id_usu = usuarios.id AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') ORDER BY modelos.likes DESC LIMIT 3`);
                        modelosMasGuardados = await db.query(`SELECT modelos.nombre,modelos.guardados,usuarios.nombre_usuario FROM modelos,usuarios WHERE modelos.id_usu = usuarios.id AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') ORDER BY modelos.guardados DESC LIMIT 3`);
                        break;
                    case "m":
                        valor*= 30;
                        [fecha_comp,fecha_hasta] = generarFecha(valor);
                        modelosMasVisualizaciones = await db.query(`SELECT modelos.nombre,modelos.visualizaciones,usuarios.nombre_usuario FROM modelos,usuarios WHERE modelos.id_usu = usuarios.id AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') ORDER BY modelos.visualizaciones DESC LIMIT 3`);
                        modelosMasLikes = await db.query(`SELECT modelos.nombre,modelos.likes,usuarios.nombre_usuario FROM modelos,usuarios WHERE modelos.id_usu = usuarios.id AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') ORDER BY modelos.likes DESC LIMIT 3`);
                        modelosMasGuardados = await db.query(`SELECT modelos.nombre,modelos.guardados,usuarios.nombre_usuario FROM modelos,usuarios WHERE modelos.id_usu = usuarios.id AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') ORDER BY modelos.guardados DESC LIMIT 3`);
                        break;
                    case "y":
                        valor*= 365;
                        [fecha_comp,fecha_hasta] = generarFecha(valor);
                        modelosMasVisualizaciones = await db.query(`SELECT modelos.nombre,modelos.visualizaciones,usuarios.nombre_usuario FROM modelos,usuarios WHERE modelos.id_usu = usuarios.id AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') ORDER BY modelos.visualizaciones DESC LIMIT 3`);
                        modelosMasLikes = await db.query(`SELECT modelos.nombre,modelos.likes,usuarios.nombre_usuario FROM modelos,usuarios WHERE modelos.id_usu = usuarios.id AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') ORDER BY modelos.likes DESC LIMIT 3`);
                        modelosMasGuardados = await db.query(`SELECT modelos.nombre,modelos.guardados,usuarios.nombre_usuario FROM modelos,usuarios WHERE modelos.id_usu = usuarios.id AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') ORDER BY modelos.guardados DESC LIMIT 3`);
                        break;
                    default:
                        break;
                }
           }
           await db.end();
        return res.status(200).json({
            ok: true,
            msg: 'Obtener modelos con mas repercusion',
            modelosMasVisualizaciones,
            modelosMasLikes,
            modelosMasGuardados
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener modelos con mas repercusion'
        });
    }
}

const obtenerUsuariosMasConversaciones = async(req, res = response) => {
    const token = req.header('x-token');
    const intervalo = req.query.intervalo;
    try {
            let idToken = infoToken(token).uid;
            let existeUsuario = await Usuario.findById(idToken);
            let rolUsuario = infoToken(token).rol;
            if(!existeUsuario) {
                return res.status(404).json({
                    ok: false,
                    msg: "No existe un usuario con ese id"
                });
            }
           if(existeUsuario.rol !== "Admin" || rolUsuario !== "Admin"){
            return res.status(403).json({
                ok: false,
                msg: "No esta autorizado a acceder a este recurso"
            });
           }
           const db = await mysqlConnection();
           let totalConversaciones;
           if(!intervalo){
            totalConversaciones = await db.query("SELECT COUNT(*) AS numero_conversaciones, usuarios.id AS id_usuario, usuarios.nombre_usuario AS nombre_usuario FROM usuarios, conversaciones WHERE usuarios.id = conversaciones.id_usu_emisor GROUP BY usuarios.id ORDER BY numero_conversaciones DESC LIMIT 5");
           }else{
            let unidad = intervalo.split('')[1];
            let valor = parseInt(intervalo.split('')[0]);
            let fecha_comp = "";
            let fecha_hasta = "";
            switch (unidad) {
                case "d":
                    [fecha_comp,fecha_hasta] = generarFecha(valor);
                    totalConversaciones = await db.query(`SELECT COUNT(*) AS numero_conversaciones, usuarios.id AS id_usuario, usuarios.nombre_usuario AS nombre_usuario FROM usuarios, conversaciones WHERE usuarios.id = conversaciones.id_usu_emisor AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') GROUP BY usuarios.id ORDER BY numero_conversaciones DESC LIMIT 5`);
                    break;
                case "w":
                    valor *= 7;
                    [fecha_comp,fecha_hasta] = generarFecha(valor);
                    totalConversaciones = await db.query(`SELECT COUNT(*) AS numero_conversaciones, usuarios.id AS id_usuario, usuarios.nombre_usuario AS nombre_usuario FROM usuarios, conversaciones WHERE usuarios.id = conversaciones.id_usu_emisor AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') GROUP BY usuarios.id ORDER BY numero_conversaciones DESC LIMIT 5`);
                    break;
                case "m":
                    valor*= 30;
                    [fecha_comp,fecha_hasta] = generarFecha(valor);
                    totalConversaciones = await db.query(`SELECT COUNT(*) AS numero_conversaciones, usuarios.id AS id_usuario, usuarios.nombre_usuario AS nombre_usuario FROM usuarios, conversaciones WHERE usuarios.id = conversaciones.id_usu_emisor AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') GROUP BY usuarios.id ORDER BY numero_conversaciones DESC LIMIT 5`);
                    break;
                case "y":
                    valor*= 365;
                    [fecha_comp,fecha_hasta] = generarFecha(valor);
                    totalConversaciones = await db.query(`SELECT COUNT(*) AS numero_conversaciones, usuarios.id AS id_usuario, usuarios.nombre_usuario AS nombre_usuario FROM usuarios, conversaciones WHERE usuarios.id = conversaciones.id_usu_emisor AND str_to_date(fecha_alta, '%d/%m/%Y') BETWEEN str_to_date('${fecha_hasta}', '%d/%m/%Y') AND str_to_date('${fecha_comp}', '%d/%m/%Y') GROUP BY usuarios.id ORDER BY numero_conversaciones DESC LIMIT 5`);
                    break;
                default:
                    break;
            }
           }
           await db.end();
        return res.status(200).json({
            ok: true,
            msg: 'Obtener usuarios con mas conversaciones',
            totalConversaciones,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener usuarios usuarios con mas conversaciones'
        });
    }
}
//Funciones auxiliares
const generarFecha = (dias) =>{
    let dias_param = dias;
    let fecha_comp = new Date();
    let fecha_hasta = new Date();
    fecha_hasta.setDate(fecha_hasta.getDate() - dias_param);
    let days_comp = fecha_comp.getDate();
    let month_comp = fecha_comp.getMonth();
    let year_comp = fecha_comp.getFullYear();
    let days_hasta = fecha_hasta.getDate();
    let month_hasta = fecha_hasta.getMonth();
    let year_hasta = fecha_hasta.getFullYear();
    if(month_comp < 10){
        month_comp = '0' + month_comp;
    }
    if(days_comp < 10){
        days_comp = '0' + days_comp;
    }
    if(month_hasta < 10){
        month_hasta = '0' + month_hasta;
    }
    if(days_hasta < 10){
        days_hasta = '0' + days_hasta;
    }
    return [`${days_comp}/${month_comp}/${year_comp}`,`${days_hasta}/${month_hasta}/${year_hasta}`];
}
module.exports = { obtenerTiempoMedio, obtenerPaisesSuscripcion, obtenerUsuariosSucripcionesSuperiores, obtenerModelosMasRepercusion, obtenerUsuariosMasConversaciones }
