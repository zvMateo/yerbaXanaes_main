const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');
const saleRoutes = require('./routes/saleRoutes.js');
const productGeneralRoutes = require('./routes/productGeneralRoutes.js');
const authRoutes = require('./routes/authRoutes');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Conectar a la base de datos
connectDB();

// Crear una instancia de Express
const app = express();


// Middleware para manejar el cuerpo de las solicitudes
// Esto permite que el servidor pueda recibir datos en formato JSON
app.use(express.json());

app.use(cors()); // Habilitar CORS para permitir solicitudes desde otros dominios


// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('¡Servidor Backend funcionando!');
}); 


app.use('/api/sales', saleRoutes); 
app.use('/api/products-general', productGeneralRoutes); 
app.use('/api/auth', authRoutes); // Rutas de autenticación
// Aquí se pueden agregar más rutas según sea necesario



// Iniciar el servidor
// El servidor escuchará en el puerto especificado en las variables de entorno o en el puerto 3000 por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

// Este archivo es el punto de entrada del servidor backend



