const mongoose = require('mongoose');

// Configuración de la conexión a MongoDB
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_yerbaxanaes';


const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
    });
    console.log('MongoDB conectada exitosamente.');
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err.message);
    // Salir del proceso con fallo si no se puede conectar a la BD
    process.exit(1);
  }
};

module.exports = connectDB;
