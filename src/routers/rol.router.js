const express = require('express');
const rolController = require('../controllers/rol.controller');

const rolRouter = express.Router();

rolRouter.get('/', rolController.paginarRoles);
rolRouter.post('/', rolController.crearRol);

module.exports = rolRouter;