const express = require('express');
require('dotenv').config();
const connectDB = require('./config/database');

// Importar las rutas
const saleRoutes = require('./routes/saleRoutes.js');
const productGeneralRoutes = require('./routes/productGeneralRoutes.js');

// Conectar a la base de datos
connectDB();

// Crear una instancia de Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware para manejar el cuerpo de las solicitudes
// Esto permite que el servidor pueda recibir datos en formato JSON
app.use(express.json());


app.get('/', (req, res) => {
  res.send('¡Servidor Backend funcionando!');
});


app.use('/api/sales', saleRoutes); 
app.use('/api/products-general', productGeneralRoutes); 


// Iniciar el servidor
// El servidor escuchará en el puerto especificado en las variables de entorno o en el puerto 3000 por defecto
app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
// Este archivo es el punto de entrada del servidor backend



