import Product from '../models/Product.js'; // Asumiendo que Product.js usa export default
import cloudinary from '../config/cloudinaryConfig.js'; // Asumiendo que cloudinaryConfig.js usa export default
import logger from '../config/logger.js';

// --- Funciones Auxiliares para Cloudinary ---
const uploadToCloudinary = async (fileBuffer, folderName = 'ecommerce-yerbaxanaes/products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folderName, resource_type: 'image' },
      (error, result) => {
        if (error) {
          logger.error('Error al subir a Cloudinary:', { message: error.message, stack: error.stack });
          return reject(new Error('Error al subir la imagen a Cloudinary'));
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  return new Promise((resolve, reject) => {
    if (!publicId) {
      logger.debug('No hay publicId para eliminar de Cloudinary.');
      return resolve({ message: 'No publicId provided for deletion.' });
    }
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        logger.warn('Error al eliminar de Cloudinary:', { publicId, message: error.message, result });
        // Resolvemos para no detener la operación principal, pero con un warning.
        return resolve({ warning: 'Error al eliminar la imagen antigua de Cloudinary.', errorDetails: error });
      }
      logger.info('Imagen eliminada de Cloudinary:', { publicId, result });
      resolve(result);
    });
  });
};

// --- Controladores CRUD ---

// Crear un nuevo producto
export const createProduct = async (req, res, next) => {
  try {
    logger.debug('--- Inicio createProduct ---');
    logger.debug({ message: 'req.body original en createProduct:', body: req.body });

    let {
      name, description, category, type,
      stockInKg, packageSizes, price, stock, isActive
    } = req.body;

    // Conversión de tipos
    if (stockInKg !== undefined) stockInKg = parseFloat(stockInKg);
    if (price !== undefined) price = parseFloat(price);
    if (stock !== undefined) stock = parseInt(stock, 10);
    if (isActive !== undefined) isActive = String(isActive).toLowerCase() === 'true';

    if (packageSizes && typeof packageSizes === 'string') { // Si llega como string JSON
        try {
            packageSizes = JSON.parse(packageSizes);
        } catch (parseError) {
            logger.warn('Error al parsear packageSizes como JSON', { packageSizesString: packageSizes, error: parseError.message });
            const err = new Error('Formato de packageSizes inválido.');
            // err.statusCode = 400; // Opcional
            return next(err);
        }
    }

    if (packageSizes && Array.isArray(packageSizes)) {
      packageSizes = packageSizes.map(pkg => ({
        sizeInKg: pkg.sizeInKg !== undefined ? parseFloat(pkg.sizeInKg) : undefined,
        price: pkg.price !== undefined ? parseFloat(pkg.price) : undefined,
      }));
    } else if (packageSizes !== undefined) { // Si se envió pero no es un array después de intentar parsear
        const err = new Error('packageSizes debe ser un array.');
        // err.statusCode = 400;
        return next(err);
    }


    logger.debug({ message: 'Valores después de conversión en createProduct:', data: { name, description, category, type, stockInKg, price, stock, isActive, packageSizes }});

    // Validaciones básicas
    if (!name || !category || !type || !description) {
      const err = new Error('Nombre, categoría, tipo y descripción son obligatorios.');
      // err.statusCode = 400;
      return next(err);
    }

    const bodyForSave = { name, description, category, type, isActive };

    if (type === 'yerba' || type === 'yuyo') {
      if (stockInKg === undefined || isNaN(stockInKg) || stockInKg < 0) {
        const err = new Error('Para yerba/yuyo, stockInKg es obligatorio y debe ser un número no negativo.');
        return next(err);
      }
      bodyForSave.stockInKg = stockInKg;

      if (!packageSizes || !Array.isArray(packageSizes) || packageSizes.length === 0) {
        const err = new Error('Para yerba/yuyo, packageSizes es obligatorio y debe ser un array con al menos un paquete.');
        return next(err);
      }
      for (const pkg of packageSizes) {
        if (pkg.sizeInKg === undefined || isNaN(pkg.sizeInKg) || pkg.sizeInKg <= 0) {
          const err = new Error('Cada paquete debe tener un sizeInKg numérico y mayor a cero.');
          return next(err);
        }
        if (pkg.price === undefined || isNaN(pkg.price) || pkg.price <= 0) {
          const err = new Error('Cada paquete debe tener un precio numérico y mayor que cero.');
          return next(err);
        }
      }
      bodyForSave.packageSizes = packageSizes;
    } else {
      if (price === undefined || isNaN(price) || price <= 0) {
        const err = new Error('Para este tipo de producto, precio es obligatorio y debe ser un número mayor que cero.');
        return next(err);
      }
      if (stock === undefined || isNaN(stock) || stock < 0) {
        const err = new Error('Para este tipo de producto, stock es obligatorio y debe ser un número no negativo.');
        return next(err);
      }
      bodyForSave.price = price;
      bodyForSave.stock = stock;
    }

    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        bodyForSave.imageUrl = result.secure_url;
        bodyForSave.imagePublicId = result.public_id;
      } catch (uploadError) {
        logger.error('Error al subir imagen durante la creación:', { message: uploadError.message, stack: uploadError.stack });
        return next(uploadError);
      }
    }

    const product = new Product(bodyForSave);
    const createdProduct = await product.save();
    logger.info(`Producto creado: ${createdProduct.name} (ID: ${createdProduct._id}) por usuario ${req.user ? req.user.id : 'desconocido'}`);
    res.status(201).json(createdProduct);

  } catch (error) {
    logger.error(`Error general en createProduct: ${error.message}`, {
      stack: error.stack,
      requestBody: req.body // Considera filtrar datos sensibles
    });
    next(error);
  }
};

// Listar todos los productos (para admin, sin filtro de isActive)
export const getAllProductsAdmin = async (req, res, next) => {
  try {
    // Aquí podrías añadir lógica de paginación, filtros, búsqueda si es necesario
    // const { page = 1, limit = 10, category, type, search } = req.query;
    // const queryOptions = {};
    // if (category) queryOptions.category = category;
    // ...
    // const products = await Product.find(queryOptions).limit(limit * 1).skip((page - 1) * limit).exec();
    // const count = await Product.countDocuments(queryOptions);
    // res.json({ products, totalPages: Math.ceil(count / limit), currentPage: page });

    const products = await Product.find().lean();
    res.json(products);
  } catch (error) {
    logger.error('Error al obtener todos los productos (admin):', { message: error.message, stack: error.stack });
    next(error);
  }
};

// Obtener un producto por ID (para admin, sin filtro de isActive)
export const getProductByIdAdmin = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      const err = new Error('Producto no encontrado.');
      // err.statusCode = 404;
      return next(err);
    }
    res.json(product);
  } catch (error) {
    logger.error(`Error al obtener producto por ID (admin) ${req.params.id}:`, { message: error.message, stack: error.stack });
    if (error.name === 'CastError') {
        const err = new Error('ID de producto inválido.');
        // err.statusCode = 400;
        return next(err);
    }
    next(error);
  }
};


// Eliminar un producto por ID
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      const err = new Error('Producto no encontrado para eliminar.');
      // err.statusCode = 404;
      return next(err);
    }

    if (product.imagePublicId) {
      try {
        await deleteFromCloudinary(product.imagePublicId);
      } catch (cloudinaryError) {
        // Logueado dentro de deleteFromCloudinary, no es necesario detener la operación.
      }
    }
    logger.info(`Producto eliminado: ${product.name} (ID: ${product._id})`);
    res.json({ message: 'Producto eliminado correctamente.' });
  } catch (error) {
    logger.error(`Error al eliminar producto ${req.params.id}:`, { message: error.message, stack: error.stack });
    next(error);
  }
};

// Actualizar un producto por ID
export const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    logger.debug(`--- Inicio updateProduct para ID: ${productId} ---`);
    logger.debug({ message: 'req.body original para update:', body: req.body });

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      const err = new Error('Producto no encontrado para actualizar.');
      // err.statusCode = 404;
      return next(err);
    }

    let {
      name, description, category, type,
      stockInKg, packageSizes, price, stock, isActive
    } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (type !== undefined) updateData.type = type;

    if (stockInKg !== undefined) updateData.stockInKg = parseFloat(stockInKg);
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock, 10);
    if (isActive !== undefined) updateData.isActive = String(isActive).toLowerCase() === 'true';

    if (packageSizes && typeof packageSizes === 'string') {
        try {
            packageSizes = JSON.parse(packageSizes);
        } catch (parseError) {
            logger.warn('Error al parsear packageSizes en update', { packageSizesString: packageSizes, error: parseError.message });
            const err = new Error('Formato de packageSizes inválido para actualizar.');
            return next(err);
        }
    }

    if (packageSizes && Array.isArray(packageSizes)) {
      updateData.packageSizes = packageSizes.map(pkg => ({
        sizeInKg: pkg.sizeInKg !== undefined ? parseFloat(pkg.sizeInKg) : undefined,
        price: pkg.price !== undefined ? parseFloat(pkg.price) : undefined,
      })).filter(pkg => pkg.sizeInKg !== undefined && pkg.price !== undefined); // Asegurar que los paquetes tengan datos válidos
    } else if (packageSizes !== undefined) {
        const err = new Error('packageSizes debe ser un array para actualizar.');
        return next(err);
    }

    logger.debug({ message: 'Valores para updateData después de conversión:', data: updateData });

    const productTypeToValidate = updateData.type || existingProduct.type;
    const isTypeChanging = updateData.type && updateData.type !== existingProduct.type;

    // Validaciones y limpieza de campos según el tipo
    if (productTypeToValidate === 'yerba' || productTypeToValidate === 'yuyo') {
      if (updateData.hasOwnProperty('stockInKg')) {
        if (isNaN(updateData.stockInKg) || updateData.stockInKg < 0) {
          const err = new Error('Para yerba/yuyo, stockInKg debe ser un número no negativo.');
          return next(err);
        }
      }
      if (updateData.hasOwnProperty('packageSizes')) {
        if (!Array.isArray(updateData.packageSizes) || updateData.packageSizes.length === 0) {
          const err = new Error('Para yerba/yuyo, packageSizes debe ser un array con al menos un paquete.');
          return next(err);
        }
        for (const pkg of updateData.packageSizes) {
          if (pkg.sizeInKg === undefined || isNaN(pkg.sizeInKg) || pkg.sizeInKg <= 0) {
            const err = new Error('Cada paquete debe tener un sizeInKg numérico y mayor a cero.');
            return next(err);
          }
          if (pkg.price === undefined || isNaN(pkg.price) || pkg.price <= 0) {
            const err = new Error('Cada paquete debe tener un precio numérico y mayor que cero.');
            return next(err);
          }
        }
      }
      // Si el tipo es yerba/yuyo (o se está cambiando a él), asegurar que price y stock generales no estén
      if (updateData.hasOwnProperty('price')) delete updateData.price;
      if (updateData.hasOwnProperty('stock')) delete updateData.stock;
      if (isTypeChanging || (productTypeToValidate === 'yerba' || productTypeToValidate === 'yuyo')) {
        updateData.$unset = { ...updateData.$unset, price: "", stock: "" };
      }

    } else { // Para otros tipos de productos
      if (updateData.hasOwnProperty('price')) {
        if (isNaN(updateData.price) || updateData.price <= 0) {
          const err = new Error('Para este tipo de producto, precio debe ser un número mayor que cero.');
          return next(err);
        }
      }
      if (updateData.hasOwnProperty('stock')) {
        if (isNaN(updateData.stock) || updateData.stock < 0) {
          const err = new Error('Para este tipo de producto, stock debe ser un número no negativo.');
          return next(err);
        }
      }
      // Si el tipo es otro (o se está cambiando a él), asegurar que stockInKg y packageSizes no estén
      if (updateData.hasOwnProperty('stockInKg')) delete updateData.stockInKg;
      if (updateData.hasOwnProperty('packageSizes')) delete updateData.packageSizes;
      if (isTypeChanging || !(productTypeToValidate === 'yerba' || productTypeToValidate === 'yuyo')) {
         updateData.$unset = { ...updateData.$unset, stockInKg: "", packageSizes: "" };
      }
    }

    if (req.file) {
      try {
        if (existingProduct.imagePublicId) {
          await deleteFromCloudinary(existingProduct.imagePublicId);
        }
        const result = await uploadToCloudinary(req.file.buffer);
        updateData.imageUrl = result.secure_url;
        updateData.imagePublicId = result.public_id;
      } catch (uploadError) {
        logger.error('Error al subir/actualizar imagen:', { message: uploadError.message, stack: uploadError.stack });
        return next(uploadError);
      }
    }

    if (Object.keys(updateData).length === 0 && !req.file) {
        const err = new Error('No se proporcionaron datos para actualizar.');
        // err.statusCode = 400;
        return next(err);
    }
    // Si $unset está vacío, eliminarlo para evitar problemas con Mongoose si no hay nada que "unsetear"
    if (updateData.$unset && Object.keys(updateData.$unset).length === 0) {
        delete updateData.$unset;
    }


    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true, omitUndefined: false } // omitUndefined: false para que $unset funcione correctamente
    );

    if (!updatedProduct) { // Doble verificación por si acaso
        const err = new Error('Producto no encontrado después de intentar actualizar.');
        // err.statusCode = 404;
        return next(err);
    }

    logger.info(`Producto actualizado: ${updatedProduct.name} (ID: ${updatedProduct._id})`);
    res.json(updatedProduct);

  } catch (error) {
    logger.error(`Error general en updateProduct para ID ${req.params.id}:`, { message: error.message, stack: error.stack, requestBody: req.body });
    next(error);
  }
};