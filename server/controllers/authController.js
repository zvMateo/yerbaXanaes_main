const AdminUser = require('../models/AdminUser');
const jwt = require('jsonwebtoken');

// Login de Administrador
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Por favor, proporciona email y contraseña.' });
  }

  try {
    // 1. Verificar si el usuario administrador existe
    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Credenciales inválidas.' }); // Email no encontrado
    }

    // 2. Verificar si la contraseña es correcta
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' }); // Contraseña incorrecta
    }

    // 3. Si las credenciales son correctas, crear y firmar un token JWT
    const payload = {
      adminId: admin._id,
      email: admin.email,
      // Puedes añadir más datos al payload si los necesitas, ej. rol
    };

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error("Error Crítico: JWT_SECRET no está definido en las variables de entorno.");
        return res.status(500).json({ message: "Error de configuración del servidor." });
    }

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }, // El token expira en 1 día (puedes cambiarlo)
      (err, token) => {
        if (err) {
            console.error("Error al firmar el token JWT:", err);
            return res.status(500).json({ message: "Error al generar el token de autenticación." });
        }
        res.json({
          message: 'Login exitoso.',
          token,
          admin: { // Opcional: devolver algunos datos del admin
            id: admin._id,
            email: admin.email
          }
        });
      }
    );

  } catch (error) {
    console.error('Error en loginAdmin:', error);
    res.status(500).json({ message: 'Error del servidor durante el login.' });
  }
};

module.exports = {
  loginAdmin,
};