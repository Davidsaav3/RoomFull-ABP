const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const EscenaSchema = Schema({
    fecha: {
        type: Date,
        default: new Date()
    },
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    creadorID: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    modelo:{
        type: String,
        default: 'default.blend'
    },
    imagen: {
        type: String,
        default: 'default.png'
    },
    url: {
        type: String,
        default: uuidv4()
    },
    privado:{
        type: Boolean,
        default: false
    },
    NVisitas: {
        type: Number,
        default: 0
    },
    NValoraciones: {
        type: Number,
        default: 0
    },
    NGuardados: {
        type: Number,
        default: 0
    },
    opciones: {
        type: Schema.Types.Mixed
    },
    puntos: {
        type: Array
    }
}, { collection: 'escenas' });
EscenaSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model('Escena', EscenaSchema);