const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser'); // Lo necesitaremos para verificar si el usuario aún existe
// dotenv ya debería estar cargado por server.js, pero si este middleware se usa en un contexto donde no,
// podrías añadir require('dotenv').config({ path: '../.env' }); aquí, ajustando la ruta.

const protectAdmin = async (req, res, next) => {
  let token;

  // Los tokens JWT suelen enviarse en la cabecera Authorization con el formato "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Extraer el token de la cabecera
      token = req.headers.authorization.split(' ')[1]; // Obtiene la parte del token

      // 2. Verificar el token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error("Error Crítico en protectAdmin: JWT_SECRET no está definido.");
        // No envíes este detalle al cliente en producción, loguealo en el servidor.
        return res.status(500).json({ message: 'Error de configuración del servidor.' });
      }

      const decoded = jwt.verify(token, jwtSecret);

      // 3. Adjuntar el usuario administrador al objeto req (sin la contraseña)
      // Buscamos al usuario en la BD para asegurarnos de que aún existe y no ha sido eliminado
      // o sus permisos cambiados desde que se emitió el token.
      req.admin = await AdminUser.findById(decoded.adminId).select('-password');

      if (!req.admin) {
        // Si el usuario del token ya no existe en la BD
        return res.status(401).json({ message: 'No autorizado, usuario no encontrado.' });
      }

      next(); // Si todo está bien, pasar al siguiente middleware o controlador de ruta
    } catch (error) {
      console.error('Error de autenticación de token:', error.message);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'No autorizado, token inválido.' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'No autorizado, token expirado.' });
      }
      return res.status(401).json({ message: 'No autorizado, fallo en la verificación del token.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no se proporcionó token.' });
  }
};

module.exports = { protectAdmin };