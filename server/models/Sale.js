const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  product: { // Referencia al producto general (yerba, mate, accesorio, etc.)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  packageSize: Number, // Solo para yerba/yuyo (opcional)
  quantity: { // Cantidad de paquetes o unidades vendidos
    type: Number,
    required: true,
    min: 1,
  },
  totalKg: Number, // Solo para yerba/yuyo (opcional)
  type: { // online o presencial
    type: String,
    enum: ['online', 'presencial'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;

// Este modelo se usará para interactuar con la colección de ventas en la base de datos