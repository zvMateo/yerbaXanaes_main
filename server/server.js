import express from 'express'; // Cambiado a import ES6
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

import connectDB from './config/database.js'; // Asegúrate que la extensión .js esté si usas ES Modules
import logger from './config/logger.js';

// Importar Rutas
import saleRoutes from './routes/saleRoutes.js';
import productGeneralRoutes from './routes/productGeneralRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Conectar a la base de datos
connectDB();

// Crear una instancia de Express
const app = express();

// --- MIDDLEWARES GLOBALES ---

// 1. Helmet (para seguridad de cabeceras HTTP) - ¡Lo más pronto posible!
app.use(helmet());

// 2. CORS (Habilitar CORS para permitir solicitudes desde otros dominios)
// Configuración CORS más específica si es necesario:
// const corsOptions = {
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Reemplaza con la URL de tu frontend
//   optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));
app.use(cors()); // Configuración simple por ahora

// 3. Body Parsers (para manejar el cuerpo de las solicitudes)
app.use(express.json({ limit: '10mb' })); // Límite para JSON, ajusta según necesidad (ej. para base64 de imágenes pequeñas)
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Límite para datos de formulario

// 4. Mongo Sanitize (para prevenir inyección NoSQL) - Después de los body parsers
// app.use(mongoSanitize());

// 5. Morgan (Logging de solicitudes HTTP) - En desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- RATE LIMITERS (Aplicar a rutas específicas antes de definirlas) ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Limita cada IP a 10 solicitudes por ventana para /api/auth/login
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos de inicio de sesión desde esta IP, por favor intente de nuevo después de 15 minutos' },
  // keyGenerator: (req, res) => req.ip // Por defecto usa req.ip, puedes personalizarlo
});

// --- RUTAS DE LA APLICACIÓN ---
app.get('/', (req, res) => {
  res.send('¡Servidor Backend YerbaXanaes funcionando!');
});

app.use('/api/auth/login', authLimiter); // Aplicar limiter solo al endpoint de login
app.use('/api/auth', authRoutes);
app.use('/api/products-general', productGeneralRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/customers', customerRoutes);
// Aquí se pueden agregar más rutas según sea necesario

// --- MANEJO DE ERRORES ---

// 1. Middleware para manejar rutas no encontradas (404)
// Se ejecuta si ninguna ruta anterior coincide
app.use((req, res, next) => {
  const error = new Error(`No encontrado - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pasa el error al siguiente middleware de errores
});

// 2. Middleware de MANEJO DE ERRORES GLOBAL
// Debe ser el último middleware que se añade
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
    error: { // Agrupar detalles del error
        message: err.message,
        stack: err.stack, // Winston puede manejar el objeto error directamente
    },
    request: { // Agrupar detalles de la solicitud
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      // body: req.body, // CUIDADO: No loguear datos sensibles como contraseñas. Considera filtrar.
      query: req.query,
      params: req.params,
    }
  });

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5001; // Cambié el puerto por defecto para evitar colisiones comunes
app.listen(PORT, () => {
  logger.info(`Servidor corriendo en el puerto ${PORT} en modo ${process.env.NODE_ENV}`);
});