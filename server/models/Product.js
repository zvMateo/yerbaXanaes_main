import mongoose from 'mongoose';

// Definición del esquema para los tamaños de paquete
const packageSizeSchema = new mongoose.Schema({
  sizeInKg: {
    type: Number,
    required: [true, 'El tamaño del paquete es obligatorio.'],
    min: [0.01, 'El tamaño del paquete debe ser mayor que cero.']
  },
  price: {
    type: Number,
    required: [true, 'El precio del paquete es obligatorio.'],
    min: [0.01, 'El precio del paquete debe ser mayor que cero.']
  }
}, { _id: false });

// Definición del esquema para el producto
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio.'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria.'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'El tipo de producto es obligatorio.'],
    trim: true
  },
  // Precio unitario para productos que no son yerba/yuyo
  price: {
    type: Number,
    min: [0.01, 'El precio debe ser mayor que cero.']
    // La obligatoriedad de este campo se maneja en el controlador según el 'type'
  },
  // Stock en unidades para productos que no son yerba/yuyo
  stock: {
    type: Number,
    min: [0, 'El stock no puede ser negativo.']
    // La obligatoriedad de este campo se maneja en el controlador según el 'type'
  },
  // Stock en Kg para yerbas/yuyos
  stockInKg: {
    type: Number,
    min: [0, 'El stock en Kg no puede ser negativo.']
    // La obligatoriedad de este campo se maneja en el controlador según el 'type'
  },
  packageSizes: [packageSizeSchema], // Array de presentaciones para yerbas/yuyos
  imageUrl: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String
  },
  imagePublicId: {
    type: String,   
  }
}, { timestamps: true });

// Middleware para limpiar campos no relevantes ANTES de la validación y guardado
productSchema.pre('validate', function(next) { // Cambiado a 'validate' para que se ejecute antes de las validaciones del schema
  if (this.type === 'yerba' || this.type === 'yuyo') {
    this.price = undefined;
    this.stock = undefined;
    if (!this.packageSizes || this.packageSizes.length === 0) {
      // Si es yerba/yuyo, y packageSizes es requerido por el schema (como lo es ahora),
      // esta condición podría ser redundante o causar un error si se intenta guardar sin ellos.
      // La validación 'required' en el schema de packageSizes y la lógica del controlador son más directas.
      // Considera si esta lógica específica es necesaria aquí o si las validaciones del schema son suficientes.
    }
  } else { // Para otros tipos de productos (mates, accesorios, etc.)
    this.stockInKg = undefined;
    this.packageSizes = undefined; // o this.packageSizes = []; si prefieres un array vacío y el schema lo permite
    // La obligatoriedad de price y stock para estos tipos se maneja en el controlador
    // y el schema tiene 'min' para ellos.
  }
  next();
});

// Índices para mejorar el rendimiento de las búsquedas
productSchema.index({ name: 'text', description: 'text', category: 'text', type: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ type: 1 });
productSchema.index({ isActive: 1 });

const Product = mongoose.model('Product', productSchema);



export default Product;

// Este modelo se usará para interactuar con la colección de productos en la base de datos