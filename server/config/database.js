const mongoose = require('mongoose');

// No definas MONGO_URI aquí fuera de la función si dependes de dotenv en otro archivo.

const connectDB = async () => {
  try {
    // Lee la variable de entorno MONGODB_URI DENTRO de la función.
    // Para este punto, dotenv.config() en server.js ya se habrá ejecutado.
    const dbUriToConnect = process.env.MONGODB_URI;

    if (!dbUriToConnect) {
      console.error(
        'Error Crítico en connectDB: MONGODB_URI no está definida en las variables de entorno.'
      );
      console.error(
        'Asegúrate de que tu archivo .env (en la carpeta "server") esté configurado correctamente y que dotenv.config() se llame antes de connectDB().'
      );
      process.exit(1); // Salir si la URI no está
    }

    // Mongoose 6+ no necesita las opciones { useNewUrlParser: true, useUnifiedTopology: true, etc. }
    await mongoose.connect(dbUriToConnect);
    console.log('MongoDB conectada exitosamente desde database.js.');
  } catch (err) {
    console.error('Error al conectar a MongoDB desde database.js:', err.message);
    // Salir del proceso con fallo si no se puede conectar a la BD
    process.exit(1);
  }
};

module.exports = connectDB;