const express = require('express');
const router = express.Router();
const { createSale, getAllSales } = require('../controllers/saleController');

router.post('/', createSale);      // Registrar venta
router.get('/', getAllSales);      // Ver todas las ventas

module.exports = router;