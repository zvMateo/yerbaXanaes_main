import AdminUser from '../models/AdminUser.js'; // CORREGIDO: Sin paréntesis y con .js
import jwt from 'jsonwebtoken';                 // CORREGIDO: Sin paréntesis
import logger from '../config/logger.js';     // AÑADIDO: Importar logger

// Login de Administrador
export const loginAdmin = async (req, res, next) => { // AÑADIDO: next como parámetro
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error('Por favor, proporciona email y contraseña.');
    // err.statusCode = 400; // Opcional
    return next(err); // CAMBIADO: Usar next
  }

  try {
    // 1. Verificar si el usuario administrador existe
    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      const err = new Error('Credenciales inválidas.'); // Email no encontrado
      // err.statusCode = 401; // Opcional
      return next(err); // CAMBIADO: Usar next
    }

    // 2. Verificar si la contraseña es correcta
    const isMatch = await admin.comparePassword(password); // Asumiendo que tienes este método en tu modelo AdminUser
    if (!isMatch) {
      const err = new Error('Credenciales inválidas.'); // Contraseña incorrecta
      // err.statusCode = 401; // Opcional
      return next(err); // CAMBIADO: Usar next
    }

    // 3. Si las credenciales son correctas, crear y firmar un token JWT
    const payload = {
      adminId: admin._id,
      email: admin.email,
    };

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        logger.error("Error Crítico: JWT_SECRET no está definido en las variables de entorno."); // CAMBIADO: Usar logger
        const err = new Error("Error de configuración del servidor.");
        // err.statusCode = 500; // Opcional
        return next(err); // CAMBIADO: Usar next
    }

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
      (err, token) => {
        if (err) {
            logger.error("Error al firmar el token JWT:", { message: err.message, stack: err.stack }); // CAMBIADO: Usar logger
            const signError = new Error("Error al generar el token de autenticación.");
            // signError.statusCode = 500; // Opcional
            return next(signError); // CAMBIADO: Usar next
        }
        res.json({
          message: 'Login exitoso.',
          token,
          admin: {
            id: admin._id,
            email: admin.email
          }
        });
      }
    );

  } catch (error) {
    logger.error('Error en loginAdmin:', { message: error.message, stack: error.stack }); // CAMBIADO: Usar logger
    next(error); // CAMBIADO: Usar next
  }
};

// ELIMINADO: export default { loginAdmin, };
// La exportación nombrada 'export const loginAdmin' ya es suficiente.
// Si tienes más funciones, simplemente añádeles 'export const' al principio.