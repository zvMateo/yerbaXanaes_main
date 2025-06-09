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
router.post('/', protectAdmin, createSale);
router.get('/', protectAdmin, getAllSales);
router.get('/product/:productId', protectAdmin, getSalesByProduct);

// ✨ NUEVAS RUTAS
router.get('/order/:orderNumber', protectAdmin, getSaleByOrderNumber);
router.put('/:saleId/status', protectAdmin, updateOrderStatus);
router.get('/customer/:customerEmail', protectAdmin, getSalesByCustomer);

export default router;