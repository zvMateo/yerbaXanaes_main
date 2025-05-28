const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} = require('../controllers/productGeneralController');
const { protectAdmin } = require('../middleware/authMiddleware'); // Importar el middleware
const { uploadSingleImage } = require('../middleware/multerUpload');


//Rutas publicas (para la tienda online)
  // Listar todos los productos
  router.get('/', getAllProducts);
 
// Necesitarás una ruta para obtener un producto por ID para la vista de detalle de la tienda
router.get('/:id', getProductById); // Asumiendo que tienes getProductById en tu controlador


//Rutas protegidas (para el administrador)
  router.post('/', protectAdmin, uploadSingleImage, createProduct); // Solo admin puede crear
router.put('/:id', protectAdmin, uploadSingleImage, updateProduct); // Solo admin puede actualizar
router.delete('/:id', protectAdmin, deleteProduct); // Solo admin puede eliminar

module.exports = router;
// Este archivo define las rutas para las operaciones CRUD de los productos