const multer = require('multer');

// Configurar almacenamiento en memoria (Cloudinary puede tomar el buffer directamente)
// O puedes usar diskStorage si prefieres guardar temporalmente en disco.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Aceptar solo imágenes
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('¡Solo se permiten archivos de imagen!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limitar a 5MB por imagen (ajusta según necesites)
  }
});

// Middleware para un solo archivo, el nombre del campo en el form-data debe ser 'image'
const uploadSingleImage = upload.single('image');

module.exports = { uploadSingleImage };

// El nombre `'image'` en `upload.single('image')` debe coincidir con el `name` del campo `<input type="file" name="image">` en tu formulario del frontend.