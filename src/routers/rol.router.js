const express = require('express');
const rolController = require('../controllers/rol.controller');

const rolRouter = express.Router();

rolRouter.get('/', rolController.paginarRoles);
rolRouter.post('/', rolController.crearRol);
rolRouter.get('/:rolId', rolController.obtenerRol);
rolRouter.put('/:rolId', rolController.actualizarRol);
rolRouter.delete('/:rolId', rolController.eliminarRol);

module.exports = rolRouter;