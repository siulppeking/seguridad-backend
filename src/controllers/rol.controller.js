const Rol = require("../models/rol")

const paginarRoles = async (req, res) => {
    const roles = await Rol.find({ estado: true });

    return res.status(200).send({
        estado: 'OK',
        datos: roles
    })
}

const crearRol = async (req, res) => {
    const { body: rolBody } = req;

    const rolNew = new Rol(rolBody);

    res.status(201).send({
        estado: 'OK',
        datos: {
            mensaje: 'Rol creado correctamente',
            body: rolNew
        }
    })

}

const obtenerRol = async (req, res) => {

}

const actualizarRol = async (req, res) => {

}

const eliminarRol = async (req, res) => {

}

module.exports = {
    paginarRoles,
    crearRol,
    obtenerRol,
    actualizarRol,
    eliminarRol
}
