// filepath: c:\Users\Usuario\OneDrive\Escritorio\ecommerce-yerbaxanaes\server\middleware\multerUpload.js
import multer from 'multer';

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    // Pasar el error a Multer, que luego puede ser capturado por el middleware de error global
    cb(new Error('¡Solo se permiten archivos de imagen!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10 // Aumentado a 10MB como ejemplo, ajusta
  }
});

// Middleware para un solo archivo
export const uploadSingleImage = upload.single('image');

// Si necesitas para múltiples archivos:
export const uploadMultipleImages = upload.array('images', 5); // 'images' es el nombre del campo, 5 es el máx de archivos