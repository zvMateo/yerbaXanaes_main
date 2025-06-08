import Customer from '../models/Customer.js';
import Sale from '../models/Sale.js';
import logger from '../config/logger.js';

// ✨ Obtener todos los clientes (admin)
export const getAllCustomers = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      segment = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    let filter = {};
    
    // Filtro por búsqueda (nombre o email)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filtro por segmento de marketing
    if (segment) {
      filter['marketing.customerSegment'] = segment;
    }

    // Configurar ordenamiento
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const customers = await Customer.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Customer.countDocuments(filter);

    // Estadísticas generales
    const stats = {
      total: total,
      segments: await Customer.aggregate([
        { $group: { _id: '$marketing.customerSegment', count: { $sum: 1 } } }
      ]),
      totalRevenue: await Customer.aggregate([
        { $group: { _id: null, total: { $sum: '$stats.totalSpent' } } }
      ])
    };

    res.json({
      customers,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalCustomers: total,
      stats
    });
  } catch (error) {
    logger.error('Error en getAllCustomers:', { message: error.message, stack: error.stack });
    next(error);
  }
};

// ✨ Obtener cliente por ID con historial completo
export const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const customer = await Customer.findById(id);
    if (!customer) {
      const err = new Error('Cliente no encontrado.');
      return next(err);
    }

    // Obtener historial de compras del cliente
    const orders = await Sale.find({ 'customer.email': customer.email })
      .populate('product', 'name category type imageUrl')
      .sort({ createdAt: -1 });

    // Calcular métricas adicionales
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const recentOrders = orders.filter(order => order.createdAt >= thirtyDaysAgo);
    const favoriteCategories = orders.reduce((acc, order) => {
      const category = order.product?.category;
      if (category) {
        acc[category] = (acc[category] || 0) + 1;
      }
      return acc;
    }, {});

    const analytics = {
      totalOrders: orders.length,
      recentOrders: recentOrders.length,
      totalSpent: customer.stats.totalSpent,
      averageOrderValue: customer.stats.averageOrderValue,
      lastOrderDate: customer.stats.lastOrderDate,
      favoriteCategories: Object.entries(favoriteCategories)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([category, count]) => ({ category, count })),
      daysSinceLastOrder: customer.stats.lastOrderDate 
        ? Math.floor((now - customer.stats.lastOrderDate) / (1000 * 60 * 60 * 24))
        : null
    };

    res.json({
      customer,
      orders,
      analytics
    });
  } catch (error) {
    logger.error('Error en getCustomerById:', { message: error.message, stack: error.stack });
    next(error);
  }
};

// ✨ Obtener cliente por email (para buscar historial)
export const getCustomerByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    
    const customer = await Customer.findOne({ email });
    if (!customer) {
      const err = new Error('Cliente no encontrado.');
      return next(err);
    }

    // Obtener solo los últimos 10 pedidos para respuesta rápida
    const recentOrders = await Sale.find({ 'customer.email': email })
      .populate('product', 'name category imageUrl')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      customer,
      recentOrders
    });
  } catch (error) {
    logger.error('Error en getCustomerByEmail:', { message: error.message, stack: error.stack });
    next(error);
  }
};

// ✨ Actualizar segmento de cliente manualmente
export const updateCustomerSegment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { segment, notes } = req.body;
    
    const customer = await Customer.findById(id);
    if (!customer) {
      const err = new Error('Cliente no encontrado.');
      return next(err);
    }

    customer.marketing.customerSegment = segment;
    if (notes) {
      customer.marketing.notes = notes;
    }
    
    await customer.save();
    
    logger.info(`Segmento del cliente ${customer.email} actualizado a: ${segment}`);
    
    res.json({
      message: 'Segmento del cliente actualizado.',
      customer
    });
  } catch (error) {
    logger.error('Error en updateCustomerSegment:', { message: error.message, stack: error.stack });
    next(error);
  }
};

// ✨ Obtener analytics de clientes
export const getCustomerAnalytics = async (req, res, next) => {
  try {
    const { period = '30' } = req.query; // días
    const daysAgo = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Nuevos clientes en el período
    const newCustomers = await Customer.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Distribución por segmentos
    const segmentDistribution = await Customer.aggregate([
      {
        $group: {
          _id: '$marketing.customerSegment',
          count: { $sum: 1 },
          totalSpent: { $sum: '$stats.totalSpent' },
          avgOrderValue: { $avg: '$stats.averageOrderValue' }
        }
      }
    ]);

    // Top clientes por valor
    const topCustomers = await Customer.find()
      .sort({ 'stats.totalSpent': -1 })
      .limit(10)
      .select('name email stats.totalSpent stats.totalOrders marketing.customerSegment');

    // Clientes inactivos (sin compras en 60 días)
    const inactiveDate = new Date();
    inactiveDate.setDate(inactiveDate.getDate() - 60);
    
    const inactiveCustomers = await Customer.countDocuments({
      'stats.lastOrderDate': { $lt: inactiveDate }
    });

    // Valor total de clientes
    const totalValue = await Customer.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$stats.totalSpent' },
          totalCustomers: { $sum: 1 },
          avgCustomerValue: { $avg: '$stats.totalSpent' }
        }
      }
    ]);

    res.json({
      period: `${daysAgo} días`,
      newCustomers,
      segmentDistribution,
      topCustomers,
      inactiveCustomers,
      totalValue: totalValue[0] || { totalRevenue: 0, totalCustomers: 0, avgCustomerValue: 0 }
    });
  } catch (error) {
    logger.error('Error en getCustomerAnalytics:', { message: error.message, stack: error.stack });
    next(error);
  }
};

// ✨ Recalcular estadísticas de todos los clientes
export const recalculateAllStats = async (req, res, next) => {
  try {
    const customers = await Customer.find();
    let updated = 0;

    for (const customer of customers) {
      await customer.updateStats();
      updated++;
    }

    logger.info(`Estadísticas recalculadas para ${updated} clientes`);
    
    res.json({
      message: `Estadísticas actualizadas para ${updated} clientes.`
    });
  } catch (error) {
    logger.error('Error en recalculateAllStats:', { message: error.message, stack: error.stack });
    next(error);
  }
};

export default {
  getAllCustomers,
  getCustomerById,
  getCustomerByEmail,
  updateCustomerSegment,
  getCustomerAnalytics,
  recalculateAllStats
};