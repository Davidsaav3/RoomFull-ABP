const { Schema, model } = require('mongoose');

const TipoSusSchema = Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number, //Schema.Types.Decimal128
        required: true
    },
    caract: {
        type: String,
        required: true
    },
    modelos: {
        type: Number,
        required: true
    }   
}, { collection: 'tipoSuscripciones' });

TipoSusSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model('tipoSuscripcion', TipoSusSchema);