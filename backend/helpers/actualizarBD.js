const Usuario = require('../models/usuario');
const Escena = require('../models/escena');
const fs = require('fs');
const { infoToken } = require('../helpers/infotoken');

const actualizarBD = async(tipo, path, nombreArchivo, id, token) => {

    switch (tipo) {
        case 'fotoperfil':

            const usuario = await Usuario.findById(id);
            console.log(usuario.imagen)
            if (!usuario) {
                return false;
            }

            // Comprobar que el id de usuario que actualiza es el mismo id del token
            // solo el usuario puede cambiar su foto
            if (token != '') {
                if (infoToken(token).uid !== id) {
                    if (infoToken(token).rol != "Admin") {
                        console.log('el usuario que actualiza no es el propietario de la foto')
                        return false;
                    }
                }
            }

            const fotoVieja = usuario.imagen;
            const pathFotoVieja = process.cwd() + `${path}/${fotoVieja}`;
            if (fotoVieja && fs.existsSync(pathFotoVieja) && pathFotoVieja !== '/uploads/fotoperfil/default.png') {
                fs.unlinkSync(pathFotoVieja);
            }

            usuario.imagen = nombreArchivo;
            await usuario.save();
            return true;
            break;
        case 'imagenEscena':
            const escena = await Escena.findById(id);
            if (!escena) {
                console.log("No existe la escena");
                return false;
            }
            let creadorID = escena.creadorID.toString();
            // Comprobar que el id de usuario que actualiza es el mismo id del token
            // solo el creador de la escena puede cambiar la foto de Escena
            if (infoToken(token).uid !== creadorID) {
                if (infoToken(token).rol != "Admin") {
                    console.log('el usuario que actualiza no es el propietario de la escena')
                    return false;
                }
            }

            const fotoViejaEscena = escena.imagen;
            const pathFotoViejaEscena = process.cwd() + `${path}/${fotoViejaEscena}`;
            if (fotoViejaEscena && fs.existsSync(pathFotoViejaEscena) && pathFotoViejaEscena !== '/uploads/imagenEscena/default.png') {
                fs.unlinkSync(pathFotoViejaEscena);
            }

            escena.imagen = nombreArchivo;
            await escena.save();
            return true;
            break;

        case 'escena':
            const escenaMod = await Escena.findById(id);
            if (!escenaMod) {
                return false;
            }
            let creadorIDMod = escenaMod.creadorID.toString();
            // Comprobar que el id de usuario que actualiza es el mismo id del token
            // solo el creador de la escena puede cambiar la foto de Escena
            if (infoToken(token).uid !== creadorIDMod) {
                if (infoToken(token).rol != "Admin") {
                    console.log('el usuario que actualiza no es el propietario de la escena')
                    return false;
                }
            }

            const escenaModViejo = escenaMod.modelo;
            const pathModViejo = process.cwd() + `${path}/${escenaModViejo}`;
            if (escenaModViejo && fs.existsSync(pathModViejo) && pathModViejo !== '/uploads/escena/default.blend') {
                fs.unlinkSync(pathModViejo);
            }

            escenaMod.modelo = nombreArchivo;
            await escenaMod.save();
            return true;
            break;

        default:
            console.log("Algo ha salido mal al actualizar la base de datos");
            break;
    }

}

module.exports = { actualizarBD }