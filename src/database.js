const mongoose = require('mongoose');

const connectarMongoDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        if (db) {
            console.log('Conectado a la base de datos de MongoDB');
        }
    } catch (error) {
        console.log(`Error al conectar a la base de datos de MongoDB: ${error.message}`);
    }
}

module.exports = connectarMongoDB;