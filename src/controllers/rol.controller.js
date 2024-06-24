const Rol = require("../models/rol")

const paginarRoles = async (req, res) => {
    const { pagina = 1, limite = 5 } = req.query;
    const paginaNumero = parseInt(pagina, 10);
    const limiteNumero = parseInt(limite, 10);
    const skip = (paginaNumero - 1) * limiteNumero;
    const query = {
        activo: true
    }
    const [totalResultados, roles] = await Promise.all([
        Rol.countDocuments(query),
        Rol.find(query)
            .skip(skip).limit(limiteNumero)
    ]);

    const totalPaginas = Math.ceil(totalResultados / limiteNumero);

    const rolesResponse = roles.map(rol => {
        return {
            rolId: rol._id,
            nombre: rol.nombre
        }
    });

    return res.status(200).send({
        estado: 'OK',
        respuesta: {
            totalResultados,
            totalPaginas,
            paginaActual: paginaNumero,
            resultados: rolesResponse
        }

    })
}

const crearRol = async (req, res) => {
    try {
        const { body: rolBody } = req;
        const regexpNombre = new RegExp(`^${rolBody.nombre}$`, 'i');

        const rol = await Rol.findOne({ nombre: regexpNombre, activo: true });
        if (rol) {
            return res.status(400).send({
                estado: 'VALIDACION_DB',
                respuesta: { mensaje: `El nombre ${rolBody.nombre} ya encuentra registrado` }
            })
        }
        const rolData = {
            nombre: rolBody.nombre
        }
        const rolNuevo = new Rol(rolData);
        const rolCreado = await rolNuevo.save();

        const rolRespuesta = {
            rolId: rolCreado._id,
            nombre: rolCreado.nombre
        }

        return res.status(201).send({
            estado: 'OK',
            respuesta: {
                mensaje: 'Rol creado correctamente',
                rol: rolRespuesta
            }
        })
    } catch (error) {
        return res.status(500).send({
            estado: 'ERROR_EXCEPCION',
            respuesta: { mensaje: error.message }
        })
    }

}

const obtenerRol = async (req, res) => {
    try {
        const { rolId } = req.params;

        const rol = await Rol.findOne({ _id: rolId, activo: true });
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

const actualizarRol = async (req, res) => {
    const { rolId } = req.params;
    const rolEncontrado = await Rol.findOne({ _id: rolId, activo: true });
    if (!rolEncontrado) {
        return res.status(404).send({
            estado: 'VALIDACION_DB',
            respuesta: { mensaje: `Id ${rolId} no encontrado` }
        });
    }
    const { body: rolBody } = req;
    const regexpNombre = new RegExp(`^${rolBody.nombre}$`, 'i');
    const rol = await Rol.findOne({ nombre: regexpNombre, activo: true, _id: { $ne: rolId } })
    if (rol) {
        return res.status(400).send({
            estado: 'VALIDACION_DB',
            respuesta: { mensaje: `El nombre ${rolBody.nombre} ya encuentra registrado` }
        })
    }
    const rolData = {
        nombre: rolBody.nombre
    }
    const rolAct = await Rol.findByIdAndUpdate(rolId, rolData, { new: true });

    const rolRespuesta = {
        rolId: rolAct._id,
        nombre: rolAct.nombre
    }
    return res.status(200).send({
        estado: 'OK',
        respuesta: {
            mensaje: 'Rol modificado correctamente',
            rol: rolRespuesta
        }
    })
}

const eliminarRol = async (req, res) => {
    const { rolId } = req.params;
    const rolEncontrado = await Rol.findOne({ _id: rolId, activo: true });
    if (!rolEncontrado) {
        return res.status(404).send({
            estado: 'VALIDACION_DB',
            respuesta: { mensaje: `Id ${rolId} no encontrado` }
        });
    }
    const rolData = {
        activo: false
    }
    const rolAct = await Rol.findByIdAndUpdate(rolId, rolData, { new: true });

    return res.status(200).send({
        estado: 'OK',
        respuesta: {
            mensaje: 'Rol eliminado correctamente'
        }
    })
}

module.exports = {
    paginarRoles,
    crearRol,
    obtenerRol,
    actualizarRol,
    eliminarRol
}
