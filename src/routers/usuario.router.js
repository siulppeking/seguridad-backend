const express = require('express');
const usuarioController = require('../controllers/usuario.controller');

const usuarioRouter = express.Router();

usuarioRouter.get('/', usuarioController.paginarUsuarios);
usuarioRouter.post('/', usuarioController.crearUsuario);

module.exports = usuarioRouter;