import express from 'express';
const router = express.Router();
import { 
    createSale,
    getAllSales,
    getSalesByProduct,
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
router.post('/', protectAdmin, createSale); // Protegida: Admin crea ventas desde el dashboard

// Rutas Protegidas para ver ventas (solo admin)
router.get('/', protectAdmin, getAllSales);
router.get('/product/:productId', protectAdmin, getSalesByProduct);

export default router;