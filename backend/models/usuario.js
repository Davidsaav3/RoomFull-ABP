const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    fechaCreacion: {
        type: Date
    },
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
    },
    nombreUsuario: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    empresa: {
        type: String
    },
    telefono: {
        type: Number,
    },
    imagen: {
        type: String
    },
    subscription: {
        type: String
    },
    escenasLikes: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Escena',
    }],
    escenasGuardadas: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Escena' 
    }],
    rol: {
        type: String,
        default: "Usuario"
    },
    opciones: [{
        notificaciones: {
            type: Boolean,
            default: true
        },
        interacciones: {
            type: Boolean,
            default: true
        },
        asistente: {
            type: Boolean,
            default: true
        }
      }],
    metodo: {
        type: String,
        default: "normal"
    },
    codigo: {
        type: Number
    },
    fechaExpirado: {
        type: String
    },
    localizacion: {
        type: String
    }
}, { collection: 'usuarios' });

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model('Usuario', UsuarioSchema);