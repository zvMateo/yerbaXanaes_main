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
    console.log('--- Inicio createProduct ---');
    console.log('req.body original:', JSON.stringify(req.body, null, 2));

    // Convertir campos relevantes de req.body
    let {
      name, description, category, type,
      stockInKg, packageSizes, price, stock, isActive // isActive como cadena "True" o "False"
    } = req.body;

    // Convertir a los tipos correctos
    if (stockInKg !== undefined) stockInKg = parseFloat(stockInKg);
    if (price !== undefined) price = parseFloat(price);
    if (stock !== undefined) stock = parseInt(stock, 10); // O parseFloat si puede tener decimales
    if (isActive !== undefined) isActive = isActive.toLowerCase() === 'true'; // Convertir "True"/"False" a booleano

    if (packageSizes && Array.isArray(packageSizes)) {
      packageSizes = packageSizes.map(pkg => ({
        sizeInKg: pkg.sizeInKg !== undefined ? parseFloat(pkg.sizeInKg) : undefined,
        price: pkg.price !== undefined ? parseFloat(pkg.price) : undefined,
        // Si tienes stockPackage, también conviértelo
        // stockPackage: pkg.stockPackage !== undefined ? parseInt(pkg.stockPackage, 10) : undefined,
      }));
    }

    console.log('Valores después de conversión:');
    console.log('  type:', type);
    console.log('  stockInKg:', stockInKg, '(tipo:', typeof stockInKg, ')');
    console.log('  price:', price, '(tipo:', typeof price, ')');
    console.log('  stock:', stock, '(tipo:', typeof stock, ')');
    console.log('  isActive:', isActive, '(tipo:', typeof isActive, ')');
    console.log('  packageSizes:', JSON.stringify(packageSizes, null, 2));


    // Validaciones básicas
    if (!name || !category || !type || !description) {
        return res.status(400).json({ message: 'Nombre, categoría, tipo y descripción son obligatorios.' });
    }

    const bodyForSave = { name, description, category, type, isActive }; // Empezar con los campos que no cambian mucho

    if (type === 'yerba' || type === 'yuyo') {
      console.log('Entrando a validación para tipo yerba/yuyo...');
      if (stockInKg === undefined || isNaN(stockInKg) || stockInKg < 0) { // Usar isNaN para verificar si la conversión fue exitosa
        console.log('--- FALLO VALIDACIÓN stockInKg ---');
        // ... (tus logs de depuración si quieres mantenerlos)
        return res.status(400).json({ message: 'Para yerba/yuyo, stockInKg es obligatorio y debe ser un número no negativo.' });
      }
      bodyForSave.stockInKg = stockInKg;

      if (!packageSizes || !Array.isArray(packageSizes) || packageSizes.length === 0) {
        return res.status(400).json({ message: 'Para yerba/yuyo, packageSizes es obligatorio y debe ser un array con al menos un paquete.' });
      }
      for (const pkg of packageSizes) {
        if (pkg.sizeInKg === undefined || isNaN(pkg.sizeInKg) || pkg.sizeInKg <= 0) {
          return res.status(400).json({ message: 'Cada paquete debe tener un sizeInKg numérico y mayor a cero.' });
        }
        if (pkg.price === undefined || isNaN(pkg.price) || pkg.price <= 0) {
          return res.status(400).json({ message: 'Cada paquete debe tener un precio numérico y mayor que cero.' });
        }
      }
      bodyForSave.packageSizes = packageSizes;
      // No incluir price y stock generales para yerba/yuyo
    } else { // Para otros tipos de producto
      if (price === undefined || isNaN(price) || price <= 0) {
        return res.status(400).json({ message: 'Para este tipo de producto, precio es obligatorio y debe ser un número mayor que cero.' });
      }
      if (stock === undefined || isNaN(stock) || stock < 0) {
        return res.status(400).json({ message: 'Para este tipo de producto, stock es obligatorio y debe ser un número no negativo.' });
      }
      bodyForSave.price = price;
      bodyForSave.stock = stock;
      // No incluir stockInKg y packageSizes para otros tipos
    }

    // Manejo de la imagen
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        bodyForSave.imageUrl = result.secure_url;
        bodyForSave.imagePublicId = result.public_id;
      } catch (uploadError) {
        console.error('Error al subir imagen durante la creación:', uploadError);
        return res.status(500).json({ message: 'Error al subir la imagen. No se creó el producto.', error: uploadError.message });
      }
    }

    const product = new Product(bodyForSave);
    const created = await product.save();
    console.log('--- Fin createProduct (éxito) ---');
    res.status(201).json(created);

  } catch (error) {
    console.error('Error en createProduct (catch general):', error);
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: `Error de validación: ${messages.join(', ')}` });
    }
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
    const productId = req.params.id;
    console.log(`--- Inicio updateProduct para ID: ${productId} ---`);
    console.log('req.body original para update:', JSON.stringify(req.body, null, 2));

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    // Desestructurar y convertir campos de req.body
    // Usamos 'let' para poder reasignar después de la conversión
    let {
      name, description, category, type,
      stockInKg, packageSizes, price, stock, isActive
    } = req.body;

    // Convertir a los tipos correctos (solo si los campos están presentes en req.body)
    // Si un campo no se envía en la actualización, no se intentará convertir ni se incluirá en updateData inicialmente.
    const updateData = {}; // Objeto para construir los datos de actualización

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (type !== undefined) updateData.type = type;

    if (stockInKg !== undefined) {
      updateData.stockInKg = parseFloat(stockInKg);
    }
    if (price !== undefined) {
      updateData.price = parseFloat(price);
    }
    if (stock !== undefined) {
      updateData.stock = parseInt(stock, 10); // O parseFloat
    }
    if (isActive !== undefined) {
      updateData.isActive = String(isActive).toLowerCase() === 'true';
    }

    if (packageSizes && Array.isArray(packageSizes)) {
      updateData.packageSizes = packageSizes.map(pkg => {
        const newPkg = {};
        if (pkg.sizeInKg !== undefined) newPkg.sizeInKg = parseFloat(pkg.sizeInKg);
        if (pkg.price !== undefined) newPkg.price = parseFloat(pkg.price);
        // Si tienes _id en los paquetes y quieres mantenerlos o actualizarlos, necesitas manejarlos.
        // Por ahora, si se reenvían todos los packageSizes, se reemplazarán.
        // Si solo se envía un paquete para actualizar, la lógica de Mongoose con arrays es más compleja.
        // Para una actualización simple de todo el array packageSizes:
        return newPkg;
      }).filter(pkg => pkg.sizeInKg !== undefined && pkg.price !== undefined); // Filtrar paquetes incompletos si es necesario
    } else if (packageSizes !== undefined) { // Si packageSizes se envía pero no es un array válido
        return res.status(400).json({ message: 'packageSizes debe ser un array.' });
    }


    console.log('Valores para updateData después de conversión:');
    console.log(JSON.stringify(updateData, null, 2));

    // Determinar el tipo del producto (el que se envía o el existente si no se envía)
    // Usamos updateData.type si se envió, sino existingProduct.type
    const productType = updateData.type || existingProduct.type;

    // Validaciones y limpieza de campos según el tipo
    if (productType === 'yerba' || productType === 'yuyo') {
      // Validar stockInKg si se está actualizando o si es el tipo actual y no se está cambiando
      if (updateData.hasOwnProperty('stockInKg')) { // Solo validar si se intenta actualizar stockInKg
        if (isNaN(updateData.stockInKg) || updateData.stockInKg < 0) {
          return res.status(400).json({ message: 'Para yerba/yuyo, stockInKg debe ser un número no negativo.' });
        }
      } else if (type === undefined && (existingProduct.stockInKg === undefined || existingProduct.stockInKg === null)) {
        // Si no se envía stockInKg y el producto es yerba/yuyo y no tiene stockInKg, podría ser un error si es obligatorio
        // Esta lógica puede volverse compleja. Por ahora, solo validamos si se envía.
      }


      if (updateData.packageSizes) { // Solo validar si se intenta actualizar packageSizes
        if (!Array.isArray(updateData.packageSizes) || updateData.packageSizes.length === 0) {
          return res.status(400).json({ message: 'Para yerba/yuyo, packageSizes debe ser un array con al menos un paquete.' });
        }
        for (const pkg of updateData.packageSizes) {
          if (pkg.sizeInKg === undefined || isNaN(pkg.sizeInKg) || pkg.sizeInKg <= 0) {
            return res.status(400).json({ message: 'Cada paquete debe tener un sizeInKg numérico y mayor a cero.' });
          }
          if (pkg.price === undefined || isNaN(pkg.price) || pkg.price <= 0) {
            return res.status(400).json({ message: 'Cada paquete debe tener un precio numérico y mayor que cero.' });
          }
        }
      }
      // Si el tipo es yerba/yuyo (o se está cambiando a él), eliminar price y stock generales
      delete updateData.price;
      delete updateData.stock;
      // Para forzar la eliminación en la BD si se cambia de tipo, se usaría $unset
      // if (existingProduct.type !== productType && (existingProduct.price !== undefined || existingProduct.stock !== undefined)) {
      //   if (!updateData.$unset) updateData.$unset = {};
      //   updateData.$unset.price = "";
      //   updateData.$unset.stock = "";
      // }

    } else { // Para otros tipos de productos
      if (updateData.hasOwnProperty('price')) { // Solo validar si se intenta actualizar price
        if (isNaN(updateData.price) || updateData.price <= 0) {
          return res.status(400).json({ message: 'Para este tipo de producto, precio debe ser un número mayor que cero.' });
        }
      }
      if (updateData.hasOwnProperty('stock')) { // Solo validar si se intenta actualizar stock
        if (isNaN(updateData.stock) || updateData.stock < 0) {
          return res.status(400).json({ message: 'Para este tipo de producto, stock debe ser un número no negativo.' });
        }
      }
      // Si el tipo es otro (o se está cambiando a él), eliminar stockInKg y packageSizes
      delete updateData.stockInKg;
      delete updateData.packageSizes;
      // Para forzar la eliminación en la BD si se cambia de tipo:
      // if (existingProduct.type !== productType && (existingProduct.stockInKg !== undefined || existingProduct.packageSizes.length > 0)) {
      //   if (!updateData.$unset) updateData.$unset = {};
      //   updateData.$unset.stockInKg = "";
      //   updateData.$unset.packageSizes = "";
      // }
    }

    // Manejo de la imagen en la actualización
    if (req.file) {
      try {
        if (existingProduct.imagePublicId) {
          await deleteFromCloudinary(existingProduct.imagePublicId);
          console.log('Imagen antigua eliminada de Cloudinary.');
        }
        const result = await uploadToCloudinary(req.file.buffer);
        updateData.imageUrl = result.secure_url;
        updateData.imagePublicId = result.public_id;
      } catch (uploadError) {
        console.error('Error al subir/actualizar imagen:', uploadError);
        return res.status(500).json({ message: 'Error al subir la imagen. No se actualizó el producto.', error: uploadError.message });
      }
    }

    if (Object.keys(updateData).length === 0 && !req.file) {
        return res.status(400).json({ message: 'No se proporcionaron datos para actualizar.' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData, // Usar el objeto modificado que solo contiene los campos a actualizar
      { new: true, runValidators: true, omitUndefined: true } // omitUndefined es útil para no sobreescribir con undefined
    );

    console.log('--- Fin updateProduct (éxito) ---');
    res.json(updatedProduct);

  } catch (error) {
    console.error('Error en updateProduct (catch general):', error);
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

