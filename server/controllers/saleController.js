import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import logger from '../config/logger.js';

// ✨ NUEVO: Registrar una venta con datos completos del checkout
export const createSale = async (req, res, next) => {
  try {
    const {
      // Datos del producto
      productId, 
      packageSize, 
      quantity, 
      type = 'online',
      
      // ✨ NUEVO: Datos del cliente (checkout)
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        document: customerDocument
      },
      
      // ✨ NUEVO: Datos de envío (checkout)
      shipping: {
        address: shippingAddress,
        method: shippingMethod = 'delivery',
        cost: shippingCost = 0,
        notes: shippingNotes
      },
      
      // ✨ NUEVO: Datos de pago (checkout)
      payment: {
        method: paymentMethod = 'mercadopago'
      },
      
      // Notas adicionales
      notes
    } = req.body;

    // Validaciones básicas
    if (!customerName || !customerEmail || !customerPhone) {
      const err = new Error('El nombre, email y teléfono del cliente son obligatorios.');
      return next(err);
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      const err = new Error('La dirección de envío completa es obligatoria.');
      return next(err);
    }

    // Validar producto
    const product = await Product.findById(productId);
    if (!product) {
      const err = new Error('Producto no encontrado.');
      return next(err);
    }
    if (!product.isActive) {
      const err = new Error('Este producto no está disponible actualmente.');
      return next(err);
    }

    // Lógica de precios y stock (mantener la existente)
    let totalKgCalculated = 0;
    let priceAtSale = 0;
    let selectedPackageDetails = null;

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
      const err = new Error('Error en la configuración de precios del producto.');
      return next(err);
    }

    await product.save();
    const totalAmount = priceAtSale * quantity;

    // ✨ NUEVO: Crear o actualizar cliente invitado
    let customer = await Customer.findOne({ email: customerEmail });
    
    if (!customer) {
      // Crear nuevo cliente invitado
      customer = new Customer({
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        document: customerDocument,
        address: shippingAddress,
        isGuest: true
      });
    } else {
      // Actualizar datos más recientes del cliente
      customer.name = customerName;
      customer.phone = customerPhone;
      customer.document = customerDocument || customer.document;
      customer.address = shippingAddress;
    }
    
    await customer.save();

    // ✨ NUEVO: Crear venta con estructura completa
    const saleData = new Sale({
      // Datos del producto (mantener estructura existente)
      product: productId,
      packageSize: (product.type === 'yerba' || product.type === 'yuyo') ? parseFloat(packageSize) : undefined,
      quantity,
      totalKg: (product.type === 'yerba' || product.type === 'yuyo') ? totalKgCalculated : undefined,
      priceAtSale,
      totalAmount,
      type,
      
      // ✨ NUEVO: Datos del cliente estructurados
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        document: customerDocument
      },
      
      // ✨ NUEVO: Datos de envío estructurados
      shipping: {
        address: shippingAddress,
        method: shippingMethod,
        cost: shippingCost,
        notes: shippingNotes
      },
      
      // ✨ NUEVO: Datos de pago
      payment: {
        method: paymentMethod,
        status: 'pending'
      },
      
      // ✨ NUEVO: Estado inicial
      orderStatus: 'pending',
      
      notes
    });

    const newSale = await saleData.save();
    
    // ✨ NUEVO: Actualizar estadísticas del cliente
    await customer.updateStats();
    
    logger.info(`Venta creada: ${newSale.orderNumber} para cliente ${customerEmail}`);
    
    res.status(201).json({ 
      message: 'Venta registrada exitosamente.', 
      sale: newSale,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email
      }
    });

  } catch (error) {
    logger.error('Error en createSale:', { message: error.message, stack: error.stack, body: req.body });
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      const err = new Error(`Error de validación: ${messages.join(', ')}`);
      return next(err);
    }
    next(error);
  }
};

// ✨ MEJORADO: Obtener todas las ventas con información del cliente
export const getAllSales = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, orderStatus, customerEmail } = req.query;
    
    let filter = {};
    
    // Filtros opcionales
    if (status) filter['payment.status'] = status;
    if (orderStatus) filter.orderStatus = orderStatus;
    if (customerEmail) filter['customer.email'] = { $regex: customerEmail, $options: 'i' };
    
    const sales = await Sale.find(filter)
      .populate('product', 'name type category imageUrl')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Sale.countDocuments(filter);
    
    res.json({
      sales,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalSales: total
    });
  } catch (error) {
    logger.error('Error en getAllSales:', { message: error.message, stack: error.stack });
    next(error);
  }
};

// ✨ NUEVO: Obtener venta por número de pedido
export const getSaleByOrderNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    
    const sale = await Sale.findOne({ orderNumber })
      .populate('product', 'name type category imageUrl');
    
    if (!sale) {
      const err = new Error('Pedido no encontrado.');
      return next(err);
    }
    
    res.json(sale);
  } catch (error) {
    logger.error('Error en getSaleByOrderNumber:', { message: error.message, stack: error.stack });
    next(error);
  }
};

// ✨ NUEVO: Actualizar estado del pedido
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { saleId } = req.params;
    const { orderStatus, paymentStatus, notes } = req.body;
    
    const sale = await Sale.findById(saleId);
    if (!sale) {
      const err = new Error('Pedido no encontrado.');
      return next(err);
    }
    
    if (orderStatus) sale.orderStatus = orderStatus;
    if (paymentStatus) sale.payment.status = paymentStatus;
    if (notes) sale.notes = notes;
    
    await sale.save();
    
    logger.info(`Estado del pedido ${sale.orderNumber} actualizado a: ${orderStatus || 'sin cambio'}`);
    
    res.json({ 
      message: 'Estado del pedido actualizado.',
      sale 
    });
  } catch (error) {
    logger.error('Error en updateOrderStatus:', { message: error.message, stack: error.stack });
    next(error);
  }
};

// Mantener función existente con mejoras
export const getSalesByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const productExists = await Product.findById(productId);
    if (!productExists) {
      const err = new Error('Producto no encontrado.');
      return next(err);
    }
    
    const sales = await Sale.find({ product: productId })
      .populate('product', 'name type category')
      .sort({ createdAt: -1 });
    
    res.json(sales);
  } catch (error) {
    logger.error('Error en getSalesByProduct:', { message: error.message, stack: error.stack, params: req.params });
    next(error);
  }
};

// ✨ NUEVO: Obtener ventas por cliente (email)
export const getSalesByCustomer = async (req, res, next) => {
  try {
    const { customerEmail } = req.params;
    
    const sales = await Sale.find({ 'customer.email': customerEmail })
      .populate('product', 'name type category imageUrl')
      .sort({ createdAt: -1 });
    
    res.json(sales);
  } catch (error) {
    logger.error('Error en getSalesByCustomer:', { message: error.message, stack: error.stack });
    next(error);
  }
};

export default {
  createSale,
  getAllSales,
  getSaleByOrderNumber,
  updateOrderStatus,
  getSalesByProduct,
  getSalesByCustomer
};