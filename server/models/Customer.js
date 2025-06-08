import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  // === INFORMACIÓN BÁSICA ===
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio.'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres.']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Formato de email inválido.']
  },
  phone: {
    type: String,
    required: [true, 'El teléfono es obligatorio.'],
    trim: true,
    maxlength: [20, 'El teléfono no puede tener más de 20 caracteres.']
  },
  document: {
    type: String,
    trim: true,
    maxlength: [20, 'El documento no puede tener más de 20 caracteres.']
  },
  
  // === DIRECCIÓN MÁS RECIENTE ===
  address: {
    street: {
      type: String,
      required: [true, 'La dirección es obligatoria.'],
      trim: true,
      maxlength: [200, 'La dirección no puede tener más de 200 caracteres.']
    },
    city: {
      type: String,
      required: [true, 'La ciudad es obligatoria.'],
      trim: true,
      maxlength: [100, 'La ciudad no puede tener más de 100 caracteres.']
    },
    province: {
      type: String,
      required: [true, 'La provincia es obligatoria.'],
      trim: true,
      maxlength: [100, 'La provincia no puede tener más de 100 caracteres.']
    },
    postalCode: {
      type: String,
      required: [true, 'El código postal es obligatorio.'],
      trim: true,
      maxlength: [10, 'El código postal no puede tener más de 10 caracteres.']
    },
    country: {
      type: String,
      default: 'Argentina',
      trim: true,
      maxlength: [50, 'El país no puede tener más de 50 caracteres.']
    }
  },

  // === ESTADÍSTICAS CALCULADAS ===
  stats: {
    totalOrders: {
      type: Number,
      default: 0,
      min: [0, 'El total de pedidos no puede ser negativo.']
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: [0, 'El total gastado no puede ser negativo.']
    },
    lastOrderDate: {
      type: Date
    },
    averageOrderValue: {
      type: Number,
      default: 0,
      min: [0, 'El valor promedio del pedido no puede ser negativo.']
    },
    firstOrderDate: {
      type: Date
    }
  },

  // === INFORMACIÓN PARA MARKETING ===
  marketing: {
    customerSegment: {
      type: String,
      enum: {
        values: ['new', 'regular', 'vip', 'inactive', 'at_risk'],
        message: 'Segmento de cliente inválido.'
      },
      default: 'new'
    },
    preferredCategories: [{
      type: String,
      enum: ['yerba', 'mates', 'accesorios', 'yuyos'],
      trim: true
    }],
    lastEmailSent: {
      type: Date
    },
    emailOptIn: {
      type: Boolean,
      default: false
    },
    smsOptIn: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Las notas no pueden tener más de 500 caracteres.']
    }
  },

  // === METADATOS ===
  isGuest: {
    type: Boolean,
    default: true // Siempre true porque no hay registro
  },
  
  isActive: {
    type: Boolean,
    default: true
  },

  source: {
    type: String,
    enum: ['web', 'admin', 'phone', 'whatsapp'],
    default: 'web'
  }
}, { 
  timestamps: true,
  indexes: [
    { email: 1 },
    { 'marketing.customerSegment': 1 },
    { 'stats.totalSpent': -1 },
    { 'stats.lastOrderDate': -1 }
  ]
});

// === MÉTODOS DE INSTANCIA ===
customerSchema.methods.updateStats = async function() {
  const Sale = mongoose.model('Sale');
  
  const orders = await Sale.find({ 'customer.email': this.email })
    .where('payment.status').equals('completed')
    .sort({ createdAt: 1 });
  
  if (orders.length === 0) {
    this.stats = {
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: null,
      averageOrderValue: 0,
      firstOrderDate: null
    };
  } else {
    this.stats.totalOrders = orders.length;
    this.stats.totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    this.stats.averageOrderValue = this.stats.totalSpent / orders.length;
    this.stats.firstOrderDate = orders[0].createdAt;
    this.stats.lastOrderDate = orders[orders.length - 1].createdAt;
  }
  
  // Actualizar segmento automáticamente
  this.updateSegment();
  
  return this.save();
};

customerSchema.methods.updateSegment = function() {
  const now = new Date();
  const daysSinceLastOrder = this.stats.lastOrderDate 
    ? Math.floor((now - this.stats.lastOrderDate) / (1000 * 60 * 60 * 24))
    : null;

  // Lógica de segmentación automática
  if (!this.stats.lastOrderDate) {
    this.marketing.customerSegment = 'new';
  } else if (daysSinceLastOrder > 180) {
    this.marketing.customerSegment = 'inactive';
  } else if (daysSinceLastOrder > 90) {
    this.marketing.customerSegment = 'at_risk';
  } else if (this.stats.totalSpent >= 50000) {
    this.marketing.customerSegment = 'vip';
  } else if (this.stats.totalOrders >= 3) {
    this.marketing.customerSegment = 'regular';
  } else {
    this.marketing.customerSegment = 'new';
  }
};

customerSchema.methods.getPreferredCategories = async function() {
  const Sale = mongoose.model('Sale');
  
  const categoryData = await Sale.aggregate([
    { $match: { 'customer.email': this.email } },
    { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'productInfo' } },
    { $unwind: '$productInfo' },
    { $group: { _id: '$productInfo.category', count: { $sum: '$quantity' } } },
    { $sort: { count: -1 } },
    { $limit: 3 }
  ]);

  return categoryData.map(cat => cat._id);
};

// === MÉTODOS ESTÁTICOS ===
customerSchema.statics.getCustomersBySegment = function(segment) {
  return this.find({ 'marketing.customerSegment': segment })
    .sort({ 'stats.totalSpent': -1 });
};

customerSchema.statics.getTopCustomers = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ 'stats.totalSpent': -1 })
    .limit(limit);
};

customerSchema.statics.getInactiveCustomers = function(days = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.find({
    'stats.lastOrderDate': { $lt: cutoffDate },
    isActive: true
  });
};

// === VIRTUAL FIELDS ===
customerSchema.virtual('fullAddress').get(function() {
  if (!this.address) return '';
  return `${this.address.street}, ${this.address.city}, ${this.address.province} ${this.address.postalCode}`;
});

customerSchema.virtual('daysSinceLastOrder').get(function() {
  if (!this.stats.lastOrderDate) return null;
  const now = new Date();
  return Math.floor((now - this.stats.lastOrderDate) / (1000 * 60 * 60 * 24));
});

customerSchema.virtual('customerLifetimeDays').get(function() {
  if (!this.stats.firstOrderDate) return 0;
  const now = new Date();
  return Math.floor((now - this.stats.firstOrderDate) / (1000 * 60 * 60 * 24));
});

// Incluir virtuals en JSON
customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;