require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectarMongoDB = require('./database');
const rolRouter = require('./routers/rol.router');
const usuarioRouter = require('./routers/usuario.router');

const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan('dev'));

// rutas de la aplicacion
app.use('/api/v1/roles', rolRouter);
app.use('/api/v1/usuarios', usuarioRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto: ${PORT}`);
});

connectarMongoDB();

