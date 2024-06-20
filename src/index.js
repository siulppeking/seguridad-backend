require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const connectarMongoDB = require('./database');
const rolRouter = require('./routers/rol.router');

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use('/api/v1/roles', rolRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto: ${PORT}`);
});

connectarMongoDB();

