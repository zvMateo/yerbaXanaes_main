const express = require('express');
const router = express.Router();
const { 
    createSale,
    getAllSales,
    getSalesByProduct,
} = require('../controllers/saleController');

router.post('/', createSale);      // Registrar venta
router.get('/', getAllSales);      // Ver todas las ventas

//Ruta para obtener todas las ventas por producto
router.get('/product/:productId', getSalesByProduct);

module.exports = router;