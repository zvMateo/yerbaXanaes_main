import mongoose from 'mongoose';

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
  priceAtSale: { // Precio unitario del producto/paquete al momento de la venta
    type: Number,
    required: [true, 'El precio al momento de la venta es obligatorio.'],
    min: [0.01, 'El precio de venta debe ser mayor que cero.']
  },
  totalAmount: { // Monto total de esta línea de venta (priceAtSale * quantity)
    type: Number,
    required: [true, 'El monto total de la venta es obligatorio.'],
    min: [0.01, 'El monto total debe ser mayor que cero.']
  },

  // Información del cliente (para compras como invitado)
  customerName: {
    type: String,
    required: [true, 'El nombre del cliente es obligatorio.'],
    trim: true,
  },
  customerEmail: {
    type: String,
    required: [true, 'El email del cliente es obligatorio.'],
    trim: true,
    lowercase: true,
    // Podrías añadir una validación de formato de email simple si quieres
    // match: [/\S+@\S+\.\S+/, 'El formato del email no es válido.']
  },
  customerPhone: { // Opcional
    type: String,
    trim: true,
  },
  shippingAddress: { // Opcional, si aplica
    street: String,
    city: String,
    province: String,
    postalCode: String,
    country: String,
  },
  // Podrías añadir billingAddress si es necesario

  type: { // online o presencial
    type: String,
    enum: ['online', 'presencial'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // Considera si necesitas un campo para el estado del pedido (ej: 'pendiente', 'procesando', 'enviado', 'completado')
  // orderStatus: { type: String, enum: ['pendiente', 'procesando', 'enviado', 'completado', 'cancelado'], default: 'pendiente' }
}, { timestamps: true });

// Podrías considerar agrupar múltiples productos en un "Pedido" (Order)
// y que cada "Pedido" tenga múltiples "Sale" items.
// Por ahora, mantenemos la estructura simple de una venta por producto/paquete.
const Sale = mongoose.model('Sale', saleSchema);

export default Sale;

// Este modelo se usará para interactuar con la colección de ventas en la base de datos