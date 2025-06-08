import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  // === INFORMACIÓN DEL PRODUCTO ===
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'El producto es obligatorio.']
  },
  packageSize: {
    type: Number,
    min: [0.1, 'El tamaño del paquete debe ser mayor a 0.1kg.']
  },
  quantity: {
    type: Number,
    required: [true, 'La cantidad es obligatoria.'],
    min: [1, 'La cantidad debe ser al menos 1.']
  },
  totalKg: {
    type: Number,
    min: [0.1, 'El total en kg debe ser mayor a 0.1.']
  },
  priceAtSale: {
    type: Number,
    required: [true, 'El precio al momento de la venta es obligatorio.'],
    min: [0.01, 'El precio de venta debe ser mayor que cero.']
  },
  totalAmount: {
    type: Number,
    required: [true, 'El monto total de la venta es obligatorio.'],
    min: [0.01, 'El monto total debe ser mayor que cero.']
  },

  // === INFORMACIÓN DEL CLIENTE ===
  customer: {
    name: {
      type: String,
      required: [true, 'El nombre del cliente es obligatorio.'],
      trim: true,
      maxlength: [100, 'El nombre no puede tener más de 100 caracteres.']
    },
    email: {
      type: String,
      required: [true, 'El email del cliente es obligatorio.'],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Formato de email inválido.']
    },
    phone: {
      type: String,
      required: [true, 'El teléfono del cliente es obligatorio.'],
      trim: true,
      maxlength: [20, 'El teléfono no puede tener más de 20 caracteres.']
    },
    document: {
      type: String,
      trim: true,
      maxlength: [20, 'El documento no puede tener más de 20 caracteres.']
    }
  },

  // ✅ === INFORMACIÓN DE ENVÍO ACTUALIZADA ===
  shipping: {
    address: {
      street: {
        type: String,
        required: function() {
          return this.shipping.method === 'courier' || this.shipping.method === 'whatsapp_delivery';
        },
        trim: true,
        maxlength: [200, 'La dirección no puede tener más de 200 caracteres.']
      },
      city: {
        type: String,
        required: function() {
          return this.shipping.method === 'courier' || this.shipping.method === 'whatsapp_delivery';
        },
        trim: true,
        maxlength: [100, 'La ciudad no puede tener más de 100 caracteres.']
      },
      province: {
        type: String,
        required: function() {
          return this.shipping.method === 'courier' || this.shipping.method === 'whatsapp_delivery';
        },
        trim: true,
        maxlength: [100, 'La provincia no puede tener más de 100 caracteres.']
      },
      postalCode: {
        type: String,
        required: function() {
          return this.shipping.method === 'courier';
        },
        trim: true,
        maxlength: [10, 'El código postal no puede tener más de 10 caracteres.']
      },
      country: {
        type: String,
        default: 'Argentina',
        trim: true,
        maxlength: [50, 'El país no puede tener más de 50 caracteres.']
      },
      reference: {
        type: String,
        trim: true,
        maxlength: [200, 'La referencia no puede tener más de 200 caracteres.']
      }
    },
    // ✅ Métodos de entrega actualizados
    method: {
      type: String,
      enum: {
        values: ['pickup', 'courier', 'whatsapp_delivery'],
        message: 'El método de envío debe ser "pickup" (retiro en local), "courier" (correo) o "whatsapp_delivery" (acordar por WhatsApp).'
      },
      required: [true, 'El método de envío es obligatorio.'],
      default: 'pickup'
    },
    cost: {
      type: Number,
      default: 0,
      min: [0, 'El costo de envío no puede ser negativo.']
    },
    // ✅ Información específica del courier
    courierInfo: {
      company: {
        type: String,
        trim: true,
        maxlength: [50, 'El nombre de la empresa no puede tener más de 50 caracteres.']
      },
      trackingNumber: {
        type: String,
        trim: true,
        maxlength: [100, 'El número de seguimiento no puede tener más de 100 caracteres.']
      },
      estimatedDelivery: {
        type: Date
      },
      deliveredAt: {
        type: Date
      }
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Las notas de envío no pueden tener más de 500 caracteres.']
    },
    scheduledDate: {
      type: Date
    },
    scheduledTime: {
      type: String,
      trim: true,
      maxlength: [50, 'El horario no puede tener más de 50 caracteres.']
    },
    // ✅ Estado específico de coordinación por WhatsApp
    whatsappCoordination: {
      status: {
        type: String,
        enum: ['pending', 'contacted', 'arranged', 'completed'],
        default: 'pending'
      },
      contactedAt: {
        type: Date
      },
      arrangedAt: {
        type: Date
      },
      coordinationNotes: {
        type: String,
        trim: true,
        maxlength: [300, 'Las notas de coordinación no pueden tener más de 300 caracteres.']
      }
    }
  },

  // === INFORMACIÓN DE PAGO ===
  payment: {
    method: {
      type: String,
      enum: {
        values: ['cash', 'card', 'transfer', 'mercadopago'],
        message: 'Método de pago inválido.'
      },
      required: [true, 'El método de pago es obligatorio.']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'completed', 'failed', 'refunded'],
        message: 'Estado de pago inválido.'
      },
      default: 'pending'
    },
    transactionId: {
      type: String,
      trim: true
    },
    paidAt: {
      type: Date
    }
  },

  // ✅ === METADATOS DE LA VENTA ACTUALIZADOS ===
  orderType: {
    type: String,
    enum: {
      values: ['online', 'presencial'],
      message: 'El tipo de pedido debe ser "online" (página web) o "presencial" (carga manual).'
    },
    required: [true, 'El tipo de pedido es obligatorio.'],
    default: 'online'
  },
  
  // Estados simplificados (solo 3)
  orderStatus: {
    type: String,
    enum: {
      values: ['pending', 'delivered', 'cancelled'],
      message: 'Estado de pedido inválido. Debe ser: pending, delivered o cancelled.'
    },
    default: 'pending'
  },

  orderNumber: {
    type: String,
    unique: true,
    trim: true
  },

  // === FECHAS Y TRACKING ===
  date: {
    type: Date,
    default: Date.now
  },
  
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'delivered', 'cancelled']
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, 'Las notas del cambio de estado no pueden tener más de 300 caracteres.']
    }
  }],

  // === INFORMACIÓN ADICIONAL ===
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Las notas no pueden tener más de 1000 caracteres.']
  },

  priority: {
    type: String,
    enum: {
      values: ['normal', 'high'],
      message: 'La prioridad debe ser "normal" o "high".'
    },
    default: 'normal'
  },

  // === CAMPOS DE AUDITORÍA ===
  createdBy: {
    type: String,
    trim: true
  },
  
  source: {
    type: String,
    enum: ['web', 'admin', 'whatsapp'],
    default: 'web'
  },

  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String,
    trim: true,
    maxlength: [200, 'La razón de cancelación no puede tener más de 200 caracteres.']
  }
}, { 
  timestamps: true,
  indexes: [
    { 'customer.email': 1 },
    { 'customer.phone': 1 },
    { orderNumber: 1 },
    { orderStatus: 1 },
    { orderType: 1 },
    { 'shipping.method': 1 },
    { 'payment.status': 1 },
    { createdAt: -1 },
    { priority: 1 }
  ]
});

// === MIDDLEWARE PRE-SAVE ACTUALIZADO ===
saleSchema.pre('save', async function(next) {
  // Generar número de pedido único si no existe
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const todayStart = new Date(date.setHours(0, 0, 0, 0));
    const todayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    const todayOrders = await this.constructor.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd }
    });
    
    this.orderNumber = `ORD-${year}${month}${day}-${String(todayOrders + 1).padStart(3, '0')}`;
  }

  // Registrar cambio de estado
  if (this.isModified('orderStatus') && !this.isNew) {
    this.statusHistory.push({
      status: this.orderStatus,
      changedAt: new Date(),
      changedBy: this.updatedBy || 'system'
    });

    if (this.orderStatus === 'delivered' && !this.deliveredAt) {
      this.deliveredAt = new Date();
    }
    
    if (this.orderStatus === 'cancelled' && !this.cancelledAt) {
      this.cancelledAt = new Date();
    }
  }

  // ✅ Validaciones específicas por método de envío
  if (this.shipping.method === 'pickup') {
    // Retiro en local - limpiar campos innecesarios
    this.shipping.address.street = 'Retiro en local';
    this.shipping.address.city = 'No aplica';
    this.shipping.address.province = 'No aplica';
    this.shipping.address.postalCode = 'No aplica';
    this.shipping.cost = 0;
    this.shipping.courierInfo = undefined;
  } else if (this.shipping.method === 'whatsapp_delivery') {
    // Acordar por WhatsApp - inicializar coordinación
    if (!this.shipping.whatsappCoordination.status) {
      this.shipping.whatsappCoordination.status = 'pending';
    }
    this.shipping.courierInfo = undefined;
  }

  next();
});

// ✅ === MÉTODOS ACTUALIZADOS ===
saleSchema.methods.updateShippingCoordination = function(status, notes) {
  const validStatuses = ['pending', 'contacted', 'arranged', 'completed'];
  
  if (!validStatuses.includes(status)) {
    throw new Error('Estado de coordinación inválido');
  }
  
  this.shipping.whatsappCoordination.status = status;
  this.shipping.whatsappCoordination.coordinationNotes = notes;
  
  if (status === 'contacted' && !this.shipping.whatsappCoordination.contactedAt) {
    this.shipping.whatsappCoordination.contactedAt = new Date();
  }
  
  if (status === 'arranged' && !this.shipping.whatsappCoordination.arrangedAt) {
    this.shipping.whatsappCoordination.arrangedAt = new Date();
  }
  
  return this.save();
};

saleSchema.methods.updateCourierTracking = function(trackingNumber, company, estimatedDelivery) {
  if (this.shipping.method !== 'courier') {
    throw new Error('Este pedido no es por correo');
  }
  
  this.shipping.courierInfo.trackingNumber = trackingNumber;
  this.shipping.courierInfo.company = company;
  this.shipping.courierInfo.estimatedDelivery = estimatedDelivery;
  
  return this.save();
};

// ✅ Virtual para información de entrega
saleSchema.virtual('deliveryInfo').get(function() {
  const methodLabels = {
    pickup: 'Retiro en Local',
    courier: 'Envío por Correo',
    whatsapp_delivery: 'Acordar por WhatsApp'
  };
  
  let details = methodLabels[this.shipping.method];
  
  if (this.shipping.method === 'courier' && this.shipping.courierInfo.company) {
    details += ` (${this.shipping.courierInfo.company})`;
  }
  
  if (this.shipping.method === 'whatsapp_delivery') {
    const coordStatus = {
      pending: 'Pendiente contacto',
      contacted: 'Cliente contactado',
      arranged: 'Entrega coordinada',
      completed: 'Coordinación completada'
    };
    details += ` - ${coordStatus[this.shipping.whatsappCoordination.status]}`;
  }
  
  return details;
});

// ✅ Método para WhatsApp actualizado
saleSchema.methods.getWhatsAppSummary = function() {
  const products = `${this.quantity}x ${this.product.name || 'Producto'}`;
  const total = this.totalAmount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
  
  let delivery = '';
  switch (this.shipping.method) {
    case 'pickup':
      delivery = 'Retiro en local';
      break;
    case 'courier':
      delivery = `Envío por correo (+$${this.shipping.cost})`;
      break;
    case 'whatsapp_delivery':
      delivery = 'Coordinemos la entrega 📞';
      break;
  }
  
  return `*Pedido ${this.orderNumber}*\n${products}\nTotal: ${total}\nEntrega: ${delivery}\nEstado: ${this.orderStatus.toUpperCase()}`;
};

// === MÉTODOS ESTÁTICOS ACTUALIZADOS ===
saleSchema.statics.getOrdersRequiringCoordination = function() {
  return this.find({ 
    'shipping.method': 'whatsapp_delivery',
    'shipping.whatsappCoordination.status': { $in: ['pending', 'contacted'] },
    orderStatus: 'pending'
  })
  .populate('product', 'name category type')
  .sort({ createdAt: 1 });
};

saleSchema.statics.getCourierOrders = function(status = null) {
  const query = { 'shipping.method': 'courier' };
  
  if (status) {
    query.orderStatus = status;
  }
  
  return this.find(query)
    .populate('product', 'name category type')
    .sort({ createdAt: -1 });
};

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;