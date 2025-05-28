const Product = require('../models/Product');
const cloudinary = require('../config/cloudinaryConfig'); // Asegúrate de que tienes configurado Cloudinary si lo necesitas

const uploadToCloudinary = async (fileBuffer,folderName = 'ecommerce-yerbaxanaes/products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folderName, resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error('Error al subir a Cloudinary:', error);
          return reject(new Error('Error al subir la imagen a Cloudinary'));
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer); // Terminar el stream con el buffer de la imagen
  });
};

const deleteFromCloudinary = async (publicId) => {
  return new Promise((resolve, reject) => {
    if (!publicId) return resolve(); // Si no hay publicId, no hay nada que borrar
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error('Error al eliminar de Cloudinary:', error);
        return resolve({ warning: 'Error al eliminar la imagen antigua de cloudinary.', error });
      }
      console.log('Imagen eliminada de Cloudinary:', result);
      resolve(result);
    });
  });
};

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
        if (pkg.price === undefined || typeof pkg.price !== 'number' || pkg.price <= 0) {
          return res.status(400).json({ message: 'Cada paquete debe tener un precio numérico y mayor que cero.' });
        }
      }
      // Para yerba/yuyo, no necesitamos price ni stock a nivel de producto general
      delete bodyForSave.price; // Eliminar para que no se guarde si se envió por error
      delete bodyForSave.stock;
    } else { 
      // Para otros tipos de productos (mates, accesorios, etc.)
      if (price === undefined || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ message: 'Para este tipo de producto, precio es obligatorio y debe ser un número mayor que cero.' });
      }
      if (stock === undefined || typeof stock !== 'number' || stock < 0) {
        return res.status(400).json({ message: 'Para este tipo de producto, stock es obligatorio y debe ser un número no negativo.' });
      }
      // Para estos productos, no necesitamos stockInKg ni packageSizes
      delete bodyForSave.stockInKg;
      delete bodyForSave.packageSizes;
    }

    // Manejo de la imagen
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        bodyForSave.imageUrl = result.secure_url; // URL de la imagen
        bodyForSave.imagePublicId = result.public_id; // ID público de la imagen en Cloudinary
      } catch (error) {
        //Falla la creación del producto si no se puede subir la imagen
        console.error('Error al subir la imagen durante la creación:', uploadError);
        return res.status(500).json({ message: 'Error al subir la imagen. No se creó el producto.', error: uploadError.message});
      }
    } else {
            return res.status(400).json({ message: 'La imagen es obligatoria para crear un producto.' });
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

// Obtener un producto por ID (para vista pública)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) { // Solo productos activos para el público
      return res.status(404).json({ message: 'Producto no encontrado o no disponible.' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error en getProductById:', error);
    // Si el ID tiene un formato inválido para MongoDB, Mongoose puede lanzar un CastError
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'ID de producto inválido.' });
    }
    res.status(500).json({ message: 'Error al obtener el producto.' });
  }
};

// Eliminar un producto por ID
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    //Eliminar imagen de Cloudinary si existe
    if (product.imagePublicId) {
      await deleteFromCloudinary(product.imagePublicId);
      console.log('Imagen eliminada de Cloudinary.');
    }

    await Product.findByIdAndDelete(req.params.id); // Asegurarse de que se elimine el producto de la base de datos

    res.json({ message: 'Producto eliminado correctamente.' });
  } catch (error) {
    console.error('Error en deleteProduct',error);
    res.status(500).json({ message: 'Error al eliminar el producto.', error: error.message });
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
          if (pkg.price === undefined || typeof pkg.price !== 'number' || pkg.price <= 0) {
            return res.status(400).json({ message: 'Cada paquete debe tener un precio numérico y no negativo.' });
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
      if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
        return res.status(400).json({ message: 'Para este tipo de producto, precio debe ser un número no negativo.' });
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



    // Manejo de la imagen en la actualización
    if (req.file) {
      try {
        // 1. Eliminar la imagen antigua de Cloudinary si existe
        if (existingProduct.imagePublicId) {
          await deleteFromCloudinary(existingProduct.imagePublicId);
          console.log('Imagen antigua eliminada de Cloudinary.');
        }
        // 2. Subir la nueva imagen a Cloudinary
        const result = await uploadToCloudinary(req.file.buffer);
        updateData.imageUrl = result.secure_url; // URL de la nueva imagen
        updateData.imagePublicId = result.public_id; // ID público de la nueva imagen en Cloudinary
      } catch (uploadError) {
        console.error('Error al subir/actualizar imagen:', uploadError);

        return res.status(500).json({ message: 'Error al subir la imagen. No se actualizó el producto.', error: uploadError.message });
      }
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
  getProductById,
  deleteProduct,
  updateProduct,
};
// Este controlador maneja las operaciones CRUD para los productos generales

