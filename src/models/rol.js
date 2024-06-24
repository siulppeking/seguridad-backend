const { Schema, model } = require('mongoose');

const RolSchema = new Schema({
    nombre: {
        type: String,
    },
    activo: {
        type: Boolean,
        default: true
    }
});

const Rol = model('seg_roles', RolSchema);

module.exports = Rol;