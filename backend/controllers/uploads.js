const { response } = require('express');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { actualizarBD } = require('../helpers/actualizarBD');
const Usuario = require('../models/usuario');
const Escena = require('../models/escena');
const { infoToken } = require('../helpers/infotoken');
const tipoSuscripcion = require('../models/tipoSuscripcion');
const Suscripcion = require('../models/suscripcion');


const subirArchivo = async(req, res = response) => {


    if (!req.body['archivo'] || req.body['archivo'].length === 0) {
        return res.status(404).json({
            ok: false,
            msg: 'No se ha enviado archivo',
        });
    }
    if (!req.body['nombre']) {
        return res.status(404).json({
            ok: false,
            msg: 'No se ha enviado nombre de archivo',
        });
    }
    // if (req.files.archivo.truncated) {
    //     return res.status(400).json({
    //         ok: false,
    //         msg: `El archivo es demasiado grande, permitido hasta ${process.env.MAXSIZEUPLOAD}MB`
    //     });
    // }


    let tipo = req.params.tipo; // fotoperfil   imagenEscena  escena
    const id = req.params.id;
    const token = req.header('x-token');
    try {
        //Operaciones de control sobre usuario: solo el propio Usuario o Admin
        const tokenId = infoToken(token).uid;
        const tokenRol = infoToken(token).rol;
        const existeUsuarioRol = await Usuario.findById(tokenId);
        if (!existeUsuarioRol) {
            return res.status(404).json({
                ok: false,
                msg: "No existe un usuario con ese ID token"
            });
        }

        if (!tokenId && (tokenRol !== "Admin" && existeUsuarioRol.rol !== "Admin")) {
            return res.status(404).json({
                ok: false,
                msg: "No está autorizado a acceder a este recurso"
            });
        }

        const archivosValidos = {
                fotoperfil: ['jpeg', 'jpg', 'png', 'webp'],
                imagenEscena: ['jpeg', 'jpg', 'png', 'webp'],
                escena: ['fbx', '3ds', '3dm', 'blend', 'gltf'],
            }
            //Controlar el límite de subidas según la suscripción del usuario


        var encoding = 'utf8';
        var archivo = req.body['archivo'];
        const nombrePartido = req.body['nombre'].split('.');
        const extension = nombrePartido[nombrePartido.length - 1];
        if (tipo == "imagenUsuario") {
            tipo = "fotoperfil";
        }
        switch (tipo) {
            case 'fotoperfil':
                encoding = 'base64';
                archivo = req.body['archivo'].replace(/^.+?(;base64),/, '');
                if (!archivosValidos.fotoperfil.includes(extension)) {
                    return res.status(406).json({
                        ok: false,
                        msg: `El tipo de archivo '${extension}' no está permtido (${archivosValidos.fotoperfil})`
                    });
                }

                // Comprobar que solo el usuario cambia su foto de usuario

                break;
            case 'imagenEscena':
                encoding = 'base64';
                archivo = req.body['archivo'].replace(/^.+?(;base64),/, '');
                if (!archivosValidos.imagenEscena.includes(extension)) {
                    return res.status(406).json({
                        ok: false,
                        msg: `El tipo de archivo '${extension}' no está permtido (${archivosValidos.imagenEscena})`
                    });
                }
                break;
            case 'escena':

                if (!archivosValidos.escena.includes(extension)) {
                    return res.status(406).json({
                        ok: false,
                        msg: `El tipo de archivo '${extension}' no está permtido (${archivosValidos.escena})`
                    });
                }
                break;
            default:
                return res.status(406).json({
                    ok: false,
                    msg: `El tipo de operacion no está permtida`,
                    tipoOperacion: tipo
                });

        }
        const path = `${process.env.PATHUPLOAD}/${tipo}`;
        const nombreArchivo = `${uuidv4()}.${extension}`;
        let patharchivo = `${path}/${nombreArchivo}`;
        //patharchivo =  + patharchivo;

        patharchivo = process.cwd().split('backend')[0] + 'frontend/src/assets/' + patharchivo;
        console.log(patharchivo);
        // archivo.mv(patharchivo, (err) => {
        //     if (err) {
        //         return res.status(400).json({
        //             ok: false,
        //             msg: `No se pudo subir el archivo`,
        //             tipoOperacion: tipo
        //         });
        //     }
        fs.writeFile(patharchivo, archivo, encoding, err => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    ok: false,
                    msg: `No se pudo subir el archivo`,
                    tipoOperacion: tipo
                });
            }

            actualizarBD(tipo, path, nombreArchivo, id, token)
                .then(valor => {
                    if (!valor) {
                        fs.unlinkSync(patharchivo);
                        return res.status(400).json({
                            ok: false,
                            msg: `No se pudo establecer el archivo en la base de datos`,
                        });
                    } else {
                        return res.status(201).json({
                            ok: true,
                            msg: 'subirArchivo',
                            nombreArchivo,
                            rutaArchivo: `${path} + ${nombreArchivo}`,
                            archivo
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    fs.unlinkSync(patharchivo);
                    return res.status(400).json({
                        ok: false,
                        msg: `Error al cargar archivo`,
                    });
                });
        });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            msg: "Error antes del metodo actualizarBD"
        })
    }
}

const enviarArchivo = async(req, res = response) => {

    const tipo = req.params.tipo; // fotoperfil   imagenEscena  escena
    const nombreArchivo = req.params.nombreArchivo;

    let path = `${process.env.PATHUPLOAD}/${tipo}`;
    let pathArchivo = `${path}/${nombreArchivo}`;
    pathArchivo = process.cwd() + pathArchivo;
    if (!fs.existsSync(pathArchivo)) {
        if (!["fotoperfil", "imagenEscena", "escena"].includes(tipo)) {
            return res.status(404).json({
                ok: false,
                msg: 'Tipo de archivo no existe'
            });
        }
        if (tipo === 'escena') {
            pathArchivo = `${process.cwd()}/${process.env.PATHUPLOAD}/${tipo}/default.blend`;
        } else {
            pathArchivo = `${process.cwd()}/${process.env.PATHUPLOAD}/${tipo}/default.png`;
        }

    }
    console.log(process.cwd());
    console.log(pathArchivo);
    res.sendFile(pathArchivo);

    try {
        return res.status(200).json({
            ok: true,
            pathArchivo
        });
    } catch (err) {
        return res.status(400).json({
            ok: false,
            msg: 'Ha ocurrido un error al obtener el archivo'
        });
    }
}

const borrarArchivo = async(req, res = response) => {

    const tipo = req.params.tipo; // fotoperfil   imagenEscena  escena
    const nombreArchivo = req.params.nombreArchivo;
    const token = req.header("x-token");

    try {
        const tokenId = infoToken(token).uid;
        const tokenRol = infoToken(token).rol;
        const existeUsuario = await Usuario.findById(tokenId);
        if (!existeUsuario) {
            return res.status(404).json({
                ok: false,
                msg: "No existe un usuario con ese ID"
            });
        }
        var path = `${process.env.PATHUPLOAD}/${tipo}`;
        var pathArchivo = `${path}/${nombreArchivo}`;
        pathArchivo = process.cwd() + pathArchivo;
        pathArchivo = "../frontend/src/assets/uploads/" + tipo + "/" + nombreArchivo;
        console.log(pathArchivo);
        console.log(fs.existsSync("../frontend/src/assets/uploads/"));
        if (!fs.existsSync(pathArchivo)) {
            if (!["fotoperfil", "imagenEscena", "escena"].includes(tipo)) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Tipo de archivo no existe'
                });
            }
            return res.status(404).json({
                ok: false,
                msg: 'No existe el path hasta ese archivo',
            });
        }
        if (["default.png", "default.blend"].includes(nombreArchivo)) {
            return res.status(403).json({
                ok: false,
                msg: 'No se puede eliminar las imagenes de ejemplo del servidor'
            });
        }
        switch (tipo) {
            case "fotoperfil":
                if (existeUsuario.imagen !== nombreArchivo && tokenRol !== "Admin") {
                    return res.status(403).json({
                        ok: false,
                        msg: "No esta autorizado a acceder a la foto de perfil"
                    });
                }
                break;
            case "imagenEscena":
                const escenaImg = await Escena.find({ imagen: nombreArchivo });
                if (!escenaImg) {
                    return res.status(404).json({
                        ok: false,
                        msg: "No existe una imagen de escena con ese nombre"
                    });
                }
                const idUsuarioImgEscena = escenaImg[0].creadorID.toString();
                if (idUsuarioImgEscena !== tokenId && tokenRol !== "Admin") {
                    return res.status(403).json({
                        ok: false,
                        msg: "No esta autorizado a acceder a la imagen de la escena"
                    });
                }
                break;
            case "escena":
                const escenaEsc = await Escena.find({ modelo: nombreArchivo });
                if (!escenaEsc) {
                    return res.status(404).json({
                        ok: false,
                        msg: "No existe una escena con ese nombre"
                    });
                }
                const idUsuarioEscena = escenaEsc[0].creadorID.toString();
                if (idUsuarioEscena !== tokenId && tokenRol !== "Admin") {
                    return res.status(403).json({
                        ok: false,
                        msg: "No esta autorizado a acceder a esta escena"
                    });
                }
                break;
            default:
                return res.status(404).json({
                    ok: false,
                    msg: "No esta registrado ese tipo de archivo"
                });
        }
        try {
            fs.unlinkSync(pathArchivo)
            return res.status(200).json({
                ok: true,
                pathArchivo,
                nombreArchivo
            });
        } catch (err) {
            console.error('Something wrong happened removing the file', err)
            return res.status(500).json({
                ok: false,
                msg: 'Ha ocurrido un error al eliminar el archivo'
            });
        }
    } catch (error) {

    }
}

const enviarContenidoEscena = async(req, res = response) => {

    const tipo = 'escena'; // fotoperfil   imagenEscena  escena
    const nombreArchivo = req.params.nombreArchivo;

    try {

        let path = `${process.env.PATHUPLOAD}/${tipo}`;
        let pathArchivo = `${path}/${nombreArchivo}`;
        pathArchivo = "../frontend/src/assets/uploads/escena/" + nombreArchivo;

        if (fs.existsSync(pathArchivo)) {
            const content = fs.readFileSync(pathArchivo, 'utf8');
            return res.status(200).json({
                ok: true,
                content
            });

        } else {
            return res.status(404).json({
                ok: false,
                msg: 'La escena no existe'
            });
        }

    } catch (err) {
        return res.status(400).json({
            ok: false,
            msg: 'Ha ocurrido un error al obtener el archivo'
        });
    }
}

const enviarContenidoEscenaNoToken = async(req, res = response) => {

    const tipo = 'escena'; // fotoperfil   imagenEscena  escena
    const nombreArchivo = req.params.nombreArchivo;

    try {

        let path = `${process.env.PATHUPLOAD}/${tipo}`;
        let pathArchivo = `${path}/${nombreArchivo}`;
        pathArchivo = "../frontend/src/assets/uploads/escena/" + nombreArchivo;

        if (fs.existsSync(pathArchivo)) {
            const content = fs.readFileSync(pathArchivo, 'utf8');
            return res.status(200).json({
                ok: true,
                content
            });

        } else {
            return res.status(404).json({
                ok: false,
                msg: 'La escena no existe'
            });
        }

    } catch (err) {
        return res.status(400).json({
            ok: false,
            msg: 'Ha ocurrido un error al obtener el archivo'
        });
    }
}

const enviarContenidoShader = async(req, res = response) => {
    const nombreArchivo = req.params.nombreArchivo;

    try {
        let path = "../frontend/src/app/pages/modelos/engine2/engine-components/shaders/" + nombreArchivo;

        if (fs.existsSync(path)) {
            const content = fs.readFileSync(path, 'utf8');
            return res.status(200).json({
                ok: true,
                content
            });

        } else {
            return res.status(404).json({
                ok: false,
                msg: 'El shader no existe'
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            ok: false,
            msg: 'Ha ocurrido un error al obtener el archivo',
        });
    }
}

const enviarContenidoShaderNoToken = async(req, res = response) => {
    const nombreArchivo = req.params.nombreArchivo;

    try {
        let path = "../frontend/src/app/pages/modelos/engine2/engine-components/shaders/" + nombreArchivo;

        if (fs.existsSync(path)) {
            const content = fs.readFileSync(path, 'utf8');
            return res.status(200).json({
                ok: true,
                content
            });

        } else {
            return res.status(404).json({
                ok: false,
                msg: 'El shader no existe'
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            ok: false,
            msg: 'Ha ocurrido un error al obtener el archivo',
        });
    }
}

const enviarContenidoSkybox = async(req, res = response) => {
    const nombreArchivo = req.params.nombreArchivo;

    try {
        let path = "../frontend/src/assets/textures/skyboxPlaya.jpg";
        let path2 = "../frontend/src/assets/textures/skyboxCampo.jpg";
        let path3 = "../frontend/src/assets/textures/skyboxDespejado.jpg";
        let path4 = "../frontend/src/assets/textures/skyboxNocheNubes.jpg";

        let images = [];

        //return array of images
        if (fs.existsSync(path)) {
            images.push(fs.readFileSync(path, { encoding: 'base64' }));
        }
        if (fs.existsSync(path2)) {
            images.push(fs.readFileSync(path2, { encoding: 'base64' }));
        }
        if (fs.existsSync(path3)) {
            images.push(fs.readFileSync(path3, { encoding: 'base64' }));
        }
        if (fs.existsSync(path4)) {
            images.push(fs.readFileSync(path4, { encoding: 'base64' }));
        }

        return res.status(200).json({
            ok: true,
            images
        });
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            ok: false,
            msg: 'Ha ocurrido un error al obtener el archivo',
        });
    }
}


module.exports = { subirArchivo, enviarArchivo, borrarArchivo, enviarContenidoEscena, enviarContenidoShader, enviarContenidoSkybox, enviarContenidoEscenaNoToken, enviarContenidoShaderNoToken }