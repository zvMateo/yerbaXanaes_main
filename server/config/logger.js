import winston from 'winston';
import fs from 'fs'; // Para verificar/crear directorio de logs
import path from 'path'; // Para construir rutas de forma segura

const { combine, timestamp, printf, colorize, align } = winston.format;
const logDir = 'logs'; // Directorio para los archivos de log

// Crear el directorio de logs si no existe
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDir, 'app.log'), // Usar path.join para rutas seguras
      level: 'error',
    }),
  ],
  exceptionHandlers: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logDir, 'exceptions.log') })
  ],
  rejectionHandlers: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logDir, 'rejections.log') })
  ]
});

export default logger;