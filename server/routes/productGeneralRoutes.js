import express from 'express';
const router = express.Router();

import {
  createProduct,
  getAllProductsAdmin,
  getProductByIdAdmin,
  deleteProduct,
  updateProduct,
} from '../controllers/productGeneralController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { uploadSingleImage } from '../middleware/multerUpload.js';

router.route('/')
  .get(protectAdmin, getAllProductsAdmin) // <--- Y usar el nombre corregido aquí
  .post(protectAdmin, uploadSingleImage, createProduct);

router.route('/:id')
  .get(protectAdmin, getProductByIdAdmin) // <--- Y aquí
  .put(protectAdmin, uploadSingleImage, updateProduct)
  .delete(protectAdmin, deleteProduct);

export default router;
// Este archivo define las rutas para las operaciones CRUD de los productos