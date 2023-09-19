const { Schema, model } = require('mongoose');

const ChatSchema = Schema({
    idUsuarioEmi: {
        type: Schema.Types.ObjectId,
        required: true
    },
    idUsuarioRec: {
        type: Schema.Types.ObjectId,
        required: true
    },
    mensajes: {
        type: Array
    },
    asunto: {
        type: Array,
        required: true
    },
    fecha : {
        type: Date
    }
}, { collection: 'chats' });
ChatSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model('Chat', ChatSchema);