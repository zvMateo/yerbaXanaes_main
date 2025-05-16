const mongoose = require('mongoose');


// Definición del esquema para los tamaños de paquete
// Este esquema se usará como subdocumento dentro del esquema de producto
const packageSizeSchema = new mongoose.Schema({
  sizeInKg: Number,   // Ej: 0.5, 1
  price: Number
}, { _id: false });

// Definición del esquema para el producto
// Este esquema define la estructura de los documentos de producto en la base de datos
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: String, required: true }, 
  type: { type: String, required: true },     
  price: Number,                              
  stock: { type: Number, min: 0 },            
  stockInKg: { type: Number, min: 0 },        
  packageSizes: [packageSizeSchema],          
  imageUrl: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

// Este modelo se usará para interactuar con la colección de productos en la base de datos