const Sale = require('../models/Sale');
const Product = require('../models/Product'); // Importa el modelo general

// Registrar una venta y descontar stock
const createSale = async (req, res) => {
  try {
    const {
      productId,
      packageSize, // Solo para yerba/yuyo
      quantity,
      type, // online, presencial
      // Nuevos campos del cliente
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress
    } = req.body;

    // Validaciones básicas de los datos del cliente (puedes expandirlas)
    if (!customerName || !customerEmail) {
      return res.status(400).json({ message: 'El nombre y el email del cliente son obligatorios.' });
    }
    // Aquí podrías añadir más validaciones para shippingAddress si es obligatorio para ventas 'online', etc.

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    if (!product.isActive) {
      return res.status(400).json({ message: 'Este producto no está disponible actualmente.'});
    }

    let totalKgCalculated = 0; // Renombrado para evitar confusión con el campo del modelo
    let priceAtSale = 0;
    let selectedPackage = null;

    if (product.type === 'yerba' || product.type === 'yuyo') {
      // Venta de yerba/yuyo por paquete
      if (!packageSize) {
        return res.status(400).json({ message: 'Debes indicar el tamaño del paquete para yerba/yuyo.' });
      }

      // Encontrar el paquete específico para obtener su precio
      selectedPackage = product.packageSizes.find(pkg => pkg.sizeInKg == packageSize); // Usar == para comparar número con posible string
      if (!selectedPackage) {
        return res.status(400).json({ message: `El tamaño de paquete ${packageSize}Kg no está disponible para este producto.` });
      }
      priceAtSale = selectedPackage.price; // Precio del paquete
      totalKgCalculated = parseFloat(packageSize) * quantity; // Asegurar que packageSize es número

      if (product.stockInKg < totalKgCalculated) {
        return res.status(400).json({ message: 'Stock insuficiente para esta venta.' });
      }
      product.stockInKg -= totalKgCalculated;
    } else {
      // Venta de accesorio/mate/bombilla
      priceAtSale = product.price; // Precio unitario del producto
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Stock insuficiente para esta venta.' });
      }
      product.stock -= quantity;
      // totalKgCalculated permanece 0 para estos productos, o puedes omitirlo al guardar la venta
    }

    // Salvaguarda: Verificar que el precio obtenido sea válido
    if (priceAtSale <= 0) {
        console.error(`Error: El producto ${product.name} (ID: ${productId}) tiene un precio inválido de ${priceAtSale} al momento de la venta.`);
        return res.status(500).json({ message: 'Error en la configuración de precios del producto. No se puede vender un producto con precio cero o negativo.' });
    }

    await product.save();

    const totalAmount = priceAtSale * quantity;

    const sale = new Sale({
      product: productId,
      packageSize: (product.type === 'yerba' || product.type === 'yuyo') ? parseFloat(packageSize) : undefined,
      quantity,
      totalKg: (product.type === 'yerba' || product.type === 'yuyo') ? totalKgCalculated : undefined,
      priceAtSale, // Guardar el precio al momento de la venta
      totalAmount, // Guardar el monto total calculado
      type,
      // Guardar datos del cliente
      customerName,
      customerEmail,
      customerPhone: customerPhone || undefined,
      shippingAddress: shippingAddress || undefined,
    });
    await sale.save();

    res.status(201).json({ message: 'Venta registrada y stock actualizado.', sale });
  } catch (error) {
    console.error('Error en createSale:', error);
    // Verificar si es un error de validación de Mongoose para los campos del cliente
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: `Error de validación: ${messages.join(', ')}` });
    }
    res.status(500).json({ message: 'Error al registrar la venta.', error: error.message });
  }
};

// Obtener todas las ventas
const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('product', 'name type category'); // Añadido type y category para más detalle
    res.json(sales);
  } catch (error) {
    console.error('Error en getAllSales:', error); // Especificar función en log
    res.status(500).json({ message: 'Error al obtener las ventas.' });
  }
};

//Obtener todas las ventas de un producto especifico
const getSalesByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    //Verificar que el producto existe primero
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    const sales = await Sale.find({ product: productId })
      .populate('product', 'name type category') //Detalles del producto
      .sort({date: -1}); // Ordenar por fecha de venta descendente (más reciente primero)

    if (!sales || sales.length === 0) {       //Verificar si hay ventas
      return res.status(404).json({ message: 'No se encontraron ventas para este producto.' });
    }

    // Si hay ventas, devolverlas
    res.json(sales);
  } catch (error) {
    console.error('Error en getSalesByProduct:', error); // Especificar función en log
    res.status(500).json({ message: 'Error al obtener las ventas del producto.' });
  }
};

module.exports = {
  createSale,
  getAllSales,
  getSalesByProduct,
};

// Este controlador maneja las operaciones CRUD para las ventas
// y actualiza el stock de los productos después de cada venta.