const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
} = require('../controllers/productGeneralController');

// Crear un producto
router.post('/', createProduct);

// Listar todos los productos
router.get('/', getAllProducts);

// Eliminar un producto por ID
router.delete('/:id', deleteProduct);

router.put('/:id', updateProduct); // Ruta para actualizar un producto por ID

module.exports = router;

// Este archivo define las rutas para las operaciones CRUD de los productos