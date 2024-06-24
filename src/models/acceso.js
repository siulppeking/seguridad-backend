const { Schema, model } = require('mongoose');

const AccesoSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'seg_usuarios'
    },
    token: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    hosting: {
        type: String,
        required: true
    },
    navegador: {
        type: String,
        required: true
    }
});

const Acceso = model('seg_accesos', AccesoSchema);

module.exports = Acceso;