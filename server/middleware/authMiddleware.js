// filepath: c:\Users\Usuario\OneDrive\Escritorio\ecommerce-yerbaxanaes\server\middleware\authMiddleware.js
import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';
import logger from '../config/logger.js';

export const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        logger.error("Error Crítico en protectAdmin: JWT_SECRET no está definido.");
        const err = new Error('Error de configuración del servidor.');
        // err.statusCode = 500;
        return next(err);
      }

      const decoded = jwt.verify(token, jwtSecret);
      req.admin = await AdminUser.findById(decoded.adminId).select('-password');

      if (!req.admin) {
        const err = new Error('No autorizado, usuario no encontrado.');
        // err.statusCode = 401;
        return next(err);
      }
      next();
    } catch (error) {
      logger.error('Error de autenticación de token:', { message: error.message, token });
      const err = new Error('No autorizado, token inválido.');
      // err.statusCode = 401;
      if (error.name === 'JsonWebTokenError') {
        // err.message = 'Token JWT malformado o inválido.'; // Más específico
      } else if (error.name === 'TokenExpiredError') {
        // err.message = 'Token JWT expirado.'; // Más específico
      }
      return next(err);
    }
  }
  if (!token) {
    const err = new Error('No autorizado, no se proporcionó token.');
    // err.statusCode = 401;
    return next(err);
  }
};