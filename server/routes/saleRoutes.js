import express from 'express';
const router = express.Router();
import { 
    createSale,
    getAllSales,
    getSalesByProduct,
    getSaleByOrderNumber,
    updateOrderStatus,
    getSalesByCustomer
} from '../controllers/saleController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

// Ruta para crear una venta:
// - Si es desde la tienda pública, no necesita autenticación de admin.
// - Si es desde el dashboard (venta presencial), SÍ necesita autenticación de admin.
// Por ahora, la protegeremos. Si la tienda pública necesita crear ventas,
// se podría crear un endpoint diferente o ajustar la lógica.
// O, más comúnmente, la tienda pública crea ventas sin token de admin,
// y el dashboard del admin usa esta ruta CON token de admin.
// Para simplificar y cumplir tu requisito de que el admin cree ventas:
// Rutas existentes mejoradas
router.post('/', authMiddleware, createSale);
router.get('/', authMiddleware, getAllSales);
router.get('/product/:productId', authMiddleware, getSalesByProduct);

// ✨ NUEVAS RUTAS
router.get('/order/:orderNumber', authMiddleware, getSaleByOrderNumber);
router.put('/:saleId/status', authMiddleware, updateOrderStatus);
router.get('/customer/:customerEmail', authMiddleware, getSalesByCustomer);

export default router;