import jwt from 'jsonwebtoken';

// ✅ Función principal de protección para admin
export const protectAdmin = async (req, res, next) => {
  try {
    // ✅ En desarrollo, omitir autenticación
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Modo desarrollo: omitiendo autenticación de admin');
      req.admin = { 
        id: 'dev-admin', 
        email: 'admin@dev.com',
        role: 'admin'
      };
      return next();
    }

    // ✅ En producción, validar token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token, autorización denegada' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Acceso denegado. Se requieren permisos de administrador.' 
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error('❌ Error en protectAdmin:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Token inválido' 
    });
  }
};

// ✅ Middleware genérico (alias para compatibilidad)
export const authMiddleware = protectAdmin;

// ✅ Exportación por defecto
export default protectAdmin;