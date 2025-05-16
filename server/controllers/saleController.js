const Sale = require('../models/Sale');
const Product = require('../models/Product'); // Importa el modelo general

// Registrar una venta y descontar stock
const createSale = async (req, res) => {
  try {
    const { productId, packageSize, quantity, type } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    let totalKg = 0;

    if (product.type === 'yerba' || product.type === 'yuyo') {
      // Venta de yerba/yuyo por paquete
      if (!packageSize) {
        return res.status(400).json({ message: 'Debes indicar el tamaño del paquete.' });
      }
      totalKg = packageSize * quantity;
      if (product.stockInKg < totalKg) {
        return res.status(400).json({ message: 'Stock insuficiente para esta venta.' });
      }
      product.stockInKg -= totalKg;
    } else {
      // Venta de accesorio/mate/bombilla
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Stock insuficiente para esta venta.' });
      }
      product.stock -= quantity;
    }

    await product.save();

    const sale = new Sale({
      product: productId,
      packageSize: packageSize || null,
      quantity,
      totalKg: totalKg || null,
      type,
    });
    await sale.save();

    res.status(201).json({ message: 'Venta registrada y stock actualizado.', sale });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar la venta.' });
  }
};

// Obtener todas las ventas
const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('product', 'name');
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las ventas.' });
  }
};

module.exports = {
  createSale,
  getAllSales,
};

// Este controlador maneja las operaciones CRUD para las ventas
// y actualiza el stock de los productos después de cada venta.
