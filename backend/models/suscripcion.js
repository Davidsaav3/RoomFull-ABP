const { Schema, model } = require('mongoose');

const SusSchema = Schema({
    fechaIni: {
        type: String,
        required: true
    },
    fechaFin: {
        type: String,
        required: true
    },
    idUsuario: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    idTipoSus: {
        type: Schema.Types.ObjectId,
        required: true
    },
    metodoPago: {
        type: Number,
        required: true
    },
    renovacion: {
        type: Boolean,
        default: true
    }
}, { collection: 'suscripciones' });

SusSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model('Suscripcion', SusSchema);