// filepath: c:\Users\Usuario\OneDrive\Escritorio\ecommerce-yerbaxanaes\server\controllers\saleController.js
import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import logger from '../config/logger.js';

// Registrar una venta y descontar stock
export const createSale = async (req, res, next) => {
  try {
    const {
      productId, packageSize, quantity, type,
      customerName, customerEmail, customerPhone, shippingAddress
    } = req.body;

    if (!customerName || !customerEmail) {
      const err = new Error('El nombre y el email del cliente son obligatorios.');
      // err.statusCode = 400;
      return next(err);
    }

    const product = await Product.findById(productId);
    if (!product) {
      const err = new Error('Producto no encontrado.');
      // err.statusCode = 404;
      return next(err);
    }
    if (!product.isActive) {
      const err = new Error('Este producto no está disponible actualmente.');
      // err.statusCode = 400;
      return next(err);
    }

    let totalKgCalculated = 0;
    let priceAtSale = 0;
    let selectedPackageDetails = null; // Para guardar el paquete si aplica

    if (product.type === 'yerba' || product.type === 'yuyo') {
      if (!packageSize) {
        const err = new Error('Debes indicar el tamaño del paquete para yerba/yuyo.');
        return next(err);
      }
      selectedPackageDetails = product.packageSizes.find(pkg => pkg.sizeInKg == packageSize);
      if (!selectedPackageDetails) {
        const err = new Error(`El tamaño de paquete ${packageSize}Kg no está disponible para este producto.`);
        return next(err);
      }
      priceAtSale = selectedPackageDetails.price;
      totalKgCalculated = parseFloat(packageSize) * quantity;
      if (product.stockInKg < totalKgCalculated) {
        const err = new Error('Stock insuficiente para esta venta.');
        return next(err);
      }
      product.stockInKg -= totalKgCalculated;
    } else {
      priceAtSale = product.price;
      if (product.stock < quantity) {
        const err = new Error('Stock insuficiente para esta venta.');
        return next(err);
      }
      product.stock -= quantity;
    }

    if (priceAtSale <= 0) {
      logger.error(`Error: El producto ${product.name} (ID: ${productId}) tiene un precio inválido de ${priceAtSale} al momento de la venta.`);
      const err = new Error('Error en la configuración de precios del producto. No se puede vender un producto con precio cero o negativo.');
      return next(err);
    }

    await product.save();
    const totalAmount = priceAtSale * quantity;

    const saleData = new Sale({
      product: productId,
      packageSize: (product.type === 'yerba' || product.type === 'yuyo') ? parseFloat(packageSize) : undefined,
      quantity,
      totalKg: (product.type === 'yerba' || product.type === 'yuyo') ? totalKgCalculated : undefined,
      priceAtSale,
      totalAmount,
      type,
      customerName,
      customerEmail,
      customerPhone: customerPhone || undefined,
      shippingAddress: shippingAddress || undefined,
    });
    const newSale = await saleData.save();
    logger.info(`Venta creada: ${newSale._id} para producto ${product.name}`);
    res.status(201).json({ message: 'Venta registrada y stock actualizado.', sale: newSale });

  } catch (error) {
    logger.error('Error en createSale:', { message: error.message, stack: error.stack, body: req.body });
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        const err = new Error(`Error de validación: ${messages.join(', ')}`);
        // err.statusCode = 400;
        return next(err);
    }
    next(error);
  }
};

export const getAllSales = async (req, res, next) => {
  try {
    const sales = await Sale.find().lean().populate('product', 'name type category').sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    logger.error('Error en getAllSales:', { message: error.message, stack: error.stack });
    next(error);
  }
};

export const getSalesByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const productExists = await Product.findById(productId);
    if (!productExists) {
      const err = new Error('Producto no encontrado.');
      // err.statusCode = 404;
      return next(err);
    }
    const sales = await Sale.find({ product: productId }).lean()
      .populate('product', 'name type category')
      .sort({date: -1});
    if (!sales || sales.length === 0) {
      // No es un error, simplemente no hay ventas. Devolver array vacío.
      return res.json([]);
    }
    res.json(sales);
  } catch (error) {
    logger.error('Error en getSalesByProduct:', { message: error.message, stack: error.stack, params: req.params });
    next(error);
  }
};

// Este controlador maneja las operaciones CRUD para las ventas
// y actualiza el stock de los productos después de cada venta.