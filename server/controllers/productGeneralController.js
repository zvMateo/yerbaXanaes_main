const Product = require('../models/Product');

// Crear un nuevo producto
const createProduct = async (req, res) => {
  try {
    const { type, stockInKg, packageSizes, price, stock, name, category } = req.body;

    // Validaciones básicas
    if (!name || !category || !type) {
        return res.status(400).json({ message: 'Nombre, categoría y tipo son obligatorios.' });
    }

    const bodyForSave = { ...req.body }; // Clonar el body para modificarlo antes de guardar

    if (type === 'yerba' || type === 'yuyo') {
      if (stockInKg === undefined || typeof stockInKg !== 'number' || stockInKg < 0) {
        return res.status(400).json({ message: 'Para yerba/yuyo, stockInKg es obligatorio y debe ser un número no negativo.' });
      }
      if (!packageSizes || !Array.isArray(packageSizes) || packageSizes.length === 0) {
        return res.status(400).json({ message: 'Para yerba/yuyo, packageSizes es obligatorio y debe ser un array con al menos un paquete.' });
      }
      for (const pkg of packageSizes) {
        if (pkg.sizeInKg === undefined || typeof pkg.sizeInKg !== 'number' || pkg.sizeInKg <= 0) {
          return res.status(400).json({ message: 'Cada paquete debe tener un sizeInKg numérico y mayor a cero.' });
        }
        if (pkg.price === undefined || typeof pkg.price !== 'number' || pkg.price < 0) {
          return res.status(400).json({ message: 'Cada paquete debe tener un price numérico y no negativo.' });
        }
      }
      // Para yerba/yuyo, no necesitamos price ni stock a nivel de producto general
      delete bodyForSave.price; // Eliminar para que no se guarde si se envió por error
      delete bodyForSave.stock;
    } else { // Para otros tipos de productos (mates, accesorios, etc.)
      if (price === undefined || typeof price !== 'number' || price < 0) {
        return res.status(400).json({ message: 'Para este tipo de producto, price es obligatorio y debe ser un número no negativo.' });
      }
      if (stock === undefined || typeof stock !== 'number' || stock < 0) {
        return res.status(400).json({ message: 'Para este tipo de producto, stock es obligatorio y debe ser un número no negativo.' });
      }
      // Para estos productos, no necesitamos stockInKg ni packageSizes
      delete bodyForSave.stockInKg;
      delete bodyForSave.packageSizes;
    }

    const product = new Product(bodyForSave);
    const created = await product.save();
    res.status(201).json(created);
  } catch (error) {
    console.error('Error en createProduct:', error);
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: `Error de validación: ${messages.join(', ')}` });
    }
    // Para otros errores, mantenemos el mensaje genérico o el específico del error
    res.status(400).json({ message: 'Error al crear el producto.', error: error.message || error });
  }
};

// Listar todos los productos
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los productos.' });
  }
};

// Eliminar un producto por ID
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    res.json({ message: 'Producto eliminado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el producto.' });
  }
};

//  Actualizar un producto por ID
const updateProduct = async (req, res) => {
  try {
    const { type, stockInKg, packageSizes, price, stock } = req.body;
    const productId = req.params.id;

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
        return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    // Determinar el tipo del producto (el que se envía o el existente si no se envía)
    const productType = type || existingProduct.type;
    const updateData = { ...req.body }; // Clonar para modificar

    if (productType === 'yerba' || productType === 'yuyo') {
      if (stockInKg !== undefined && (typeof stockInKg !== 'number' || stockInKg < 0)) {
        return res.status(400).json({ message: 'Para yerba/yuyo, stockInKg debe ser un número no negativo.' });
      }
      if (packageSizes !== undefined) {
        if (!Array.isArray(packageSizes) || packageSizes.length === 0) {
          return res.status(400).json({ message: 'Para yerba/yuyo, packageSizes debe ser un array con al menos un paquete.' });
        }
        for (const pkg of packageSizes) {
          if (pkg.sizeInKg === undefined || typeof pkg.sizeInKg !== 'number' || pkg.sizeInKg <= 0) {
            return res.status(400).json({ message: 'Cada paquete debe tener un sizeInKg numérico y mayor a cero.' });
          }
          if (pkg.price === undefined || typeof pkg.price !== 'number' || pkg.price < 0) {
            return res.status(400).json({ message: 'Cada paquete debe tener un price numérico y no negativo.' });
          }
        }
      }
      // Asegurarse de que no se establezcan price o stock a nivel de producto general si se actualiza como yerba/yuyo
      // Si se envían explícitamente, los borramos del objeto de actualización.
      // Si no se envían, no pasa nada. Si se envían como null/undefined, Mongoose los podría borrar si no usamos $unset.
      // Para simplificar, si el tipo es yerba/yuyo, nos aseguramos que price y stock no estén en updateData.
      delete updateData.price;
      delete updateData.stock;
      // Si se está cambiando el tipo a yerba/yuyo, y antes no lo era, también hay que limpiar.
      // Y si se envían explícitamente, los borramos del objeto de actualización.
      if (updateData.hasOwnProperty('price')) delete updateData.price;
      if (updateData.hasOwnProperty('stock')) delete updateData.stock;


    } else { // Para otros tipos de productos
      if (price !== undefined && (typeof price !== 'number' || price < 0)) {
        return res.status(400).json({ message: 'Para este tipo de producto, price debe ser un número no negativo.' });
      }
      if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
        return res.status(400).json({ message: 'Para este tipo de producto, stock debe ser un número no negativo.' });
      }
      // Asegurarse de que no se establezcan stockInKg o packageSizes si se actualiza como otro tipo
      delete updateData.stockInKg;
      delete updateData.packageSizes;
      if (updateData.hasOwnProperty('stockInKg')) delete updateData.stockInKg;
      if (updateData.hasOwnProperty('packageSizes')) delete updateData.packageSizes;
    }
    
    // Si el tipo está cambiando, asegurarse de que los campos del tipo anterior se eliminen
    // Esto es un poco más complejo si queremos usar $unset para borrar campos de la BD.
    // Por ahora, simplemente no los incluimos en la actualización si no corresponden al nuevo tipo.
    // Si se quiere ser más estricto y borrar campos de la BD al cambiar de tipo, se necesitaría $unset.
    // Ejemplo: si type cambia de 'yerba' a 'mate', querríamos hacer $unset: { stockInKg: "", packageSizes: "" }
    // Pero para mantenerlo simple, el código actual solo actualiza con los campos válidos para el productType.

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData, // Usar el objeto modificado
      { new: true, runValidators: true }
    );

    // No es necesario verificar !updatedProduct aquí si existingProduct ya fue encontrado,
    // findByIdAndUpdate con new:true devolverá null solo si el ID no existe, lo cual ya cubrimos.
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error en updateProduct:', error);
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: `Error de validación: ${messages.join(', ')}` });
    }
    res.status(400).json({ message: 'Error al actualizar el producto.', error: error.message || error });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
};
// Este controlador maneja las operaciones CRUD para los productos generales

