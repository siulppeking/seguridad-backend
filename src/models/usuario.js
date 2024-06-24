const { Schema, model } = require('mongoose');

const UsuarioSchema = new Schema({
    rol: {
        type: Schema.Types.ObjectId,
        ref: 'seg_roles'
    },
    correo: {
        type: String,
        required: true
    },
    clave: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    google: {
        type: Boolean,
        default: false
    },
    imagen: {
        type: String,
        default: 'https://res.cloudinary.com/ddsphxk7g/image/upload/v1718891536/user_2_v12lg7.png'
    },
    activo: {
        type: Boolean,
        default: true
    },
    fecCre: {
        type: Date,
        default: Date.now
    },
    fecAct: {
        type: Date,
        default: null
    },
    fecEli: {
        type: Date,
        default: null
    }
})

const Usuario = model('seg_usuarios', UsuarioSchema);

module.exports = Usuario;