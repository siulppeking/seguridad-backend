
const bcrypt = require('bcryptjs');
const { createAccessToken } = require('../helpers/jwt.helper');
const Acceso = require("../models/acceso");
const Usuario = require("../models/usuario");
const { momentFormat } = require('../helpers/moment.helper');

const paginarUsuarios = async (req, res) => {
    const { pagina = 1, limite = 5 } = req.query;
    const paginaNumero = parseInt(pagina, 10);
    const limiteNumero = parseInt(limite, 10);
    const skip = (paginaNumero - 1) * limiteNumero;
    const query = {
        activo: true
    }
    const [totalResultados, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(skip).limit(limiteNumero)
    ]);

    const totalPaginas = Math.ceil(totalResultados / limiteNumero);

    const usuariosResponse = usuarios.map(usuario => {
        return {
            userId: usuario._id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            google: usuario.google,
            imagen: usuario.imagen,
            fecCre: momentFormat(usuario.fecCre, 'DD/MM/YYYY HH:mm:ss')
        }
    });

    return res.status(200).send({
        estado: 'OK',
        respuesta: {
            totalResultados,
            totalPaginas,
            paginaActual: paginaNumero,
            resultados: usuariosResponse
        }

    })
}

const crearUsuario = async (req, res) => {
    try {
        const { correo, clave } = req.body;
        const regexpCorreo = new RegExp(`^${correo}$`, 'i');
        const usuario = await Usuario.findOne({ correo: regexpCorreo, activo: true });
        if (usuario) {
            return res.status(400).send({
                estado: "VALIDACION_DB",
                respuesta: { message: `El correo ${correo} ya se encuentra registrado` }
            })
        }
        const random = (Math.floor(Math.random() * 900000) + 100000).toString();
        const nombre = 'usuario' + random;
        const hashedPassword = await bcrypt.hash(clave, 10);
        const usuarioNuevo = new Usuario({ nombre, correo, clave: hashedPassword });
        const usuarioCreado = await usuarioNuevo.save();
        const token = await createAccessToken({ uid: usuarioCreado._id });
        const accesoNuevo = new Acceso({
            usuario: usuarioCreado._id,
            token,
            hosting: 'host-xys',
            navegador: 'browser-xyz'
        });
        await accesoNuevo.save();
        return res.status(200).send({
            estado: "OK",
            respuesta: {
                nombre: usuarioCreado.nombre,
                correo,
                token
            }
        })
    } catch (error) {
        return res.status(500).send({
            status: "ERROR_EXCEPCION",
            data: { message: error.message }
        });
    }
}

const obtenerUsuario = async (req, res) => {
    try {
        const { rolId } = req.params;

        const rol = await Usuario.findOne({ _id: rolId, activo: true });
        if (!rol) {
            return res.status(404).send({
                estado: 'VALIDACION_DB',
                respuesta: { mensaje: `Id ${rolId} no encontrado` }
            });
        }
        const rolResponse = {
            rolId: rol._id,
            nombre: rol.nombre
        }

        return res.status(200).send({
            estado: 'OK',
            respuesta: {
                rol: rolResponse
            }
        })
    } catch (error) {
        return res.status(500).send({
            estado: 'ERROR_EXCEPCION',
            respuesta: { mensaje: error.message }
        })
    }
}

const actualizarUsuario = async (req, res) => {
    const { rolId } = req.params;
    const rolEncontrado = await Usuario.findOne({ _id: rolId, activo: true });
    if (!rolEncontrado) {
        return res.status(404).send({
            estado: 'VALIDACION_DB',
            respuesta: { mensaje: `Id ${rolId} no encontrado` }
        });
    }
    const { body: rolBody } = req;
    const regexpNombre = new RegExp(`^${rolBody.nombre}$`, 'i');
    const rol = await Usuario.findOne({ nombre: regexpNombre, activo: true, _id: { $ne: rolId } })
    if (rol) {
        return res.status(400).send({
            estado: 'VALIDACION_DB',
            respuesta: { mensaje: `El nombre ${rolBody.nombre} ya encuentra registrado` }
        })
    }
    const rolData = {
        nombre: rolBody.nombre
    }
    const rolAct = await Usuario.findByIdAndUpdate(rolId, rolData, { new: true });

    const rolRespuesta = {
        rolId: rolAct._id,
        nombre: rolAct.nombre
    }
    return res.status(200).send({
        estado: 'OK',
        respuesta: {
            mensaje: 'Usuario modificado correctamente',
            rol: rolRespuesta
        }
    })
}

const eliminarUsuario = async (req, res) => {
    const { rolId } = req.params;
    const rolEncontrado = await Usuario.findOne({ _id: rolId, activo: true });
    if (!rolEncontrado) {
        return res.status(404).send({
            estado: 'VALIDACION_DB',
            respuesta: { mensaje: `Id ${rolId} no encontrado` }
        });
    }
    const rolData = {
        activo: false
    }
    const rolAct = await Usuario.findByIdAndUpdate(rolId, rolData, { new: true });

    return res.status(200).send({
        estado: 'OK',
        respuesta: {
            mensaje: 'Usuario eliminado correctamente'
        }
    })
}

module.exports = {
    paginarUsuarios,
    crearUsuario,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario
}
