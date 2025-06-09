// filepath: c:\Users\Usuario\OneDrive\Escritorio\ecommerce-yerbaxanaes\admin-dashboard\src\services\productService.js
import apiClient from './api';

const API_ROUTE = '/products-general';
const MOCK_STORAGE_KEY = 'yerba_mock_products';
const CACHE_KEY = 'products_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// ✅ Sistema de caché para optimizar rendimiento
let memoryCache = {
  products: null,
  lastFetch: null,
  isLoading: false
};

const isCacheValid = () => {
  if (!memoryCache.lastFetch) return false;
  return (Date.now() - memoryCache.lastFetch) < CACHE_DURATION;
};

const setCache = (data) => {
  memoryCache.products = data;
  memoryCache.lastFetch = Date.now();
  
  // También guardar en sessionStorage para persistencia entre navegación
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('⚠️ No se pudo guardar en sessionStorage:', error);
  }
};

const getFromSessionCache = () => {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if ((Date.now() - timestamp) < CACHE_DURATION) {
        memoryCache.products = data;
        memoryCache.lastFetch = timestamp;
        return data;
      }
    }
  } catch (error) {
    console.warn('⚠️ Error al leer sessionStorage cache:', error);
  }
  return null;
};

const clearCache = () => {
  memoryCache.products = null;
  memoryCache.lastFetch = null;
  sessionStorage.removeItem(CACHE_KEY);
};

// ✅ Datos mock con storage persistente
const getInitialMockProducts = () => [
  {
    _id: "1",
    name: "Yerba Amanda 1kg",
    description: "Yerba mate Amanda tradicional de 1kg con sabor intenso",
    category: "Yerbas",
    type: "yerba",
    packageSizes: [
      { sizeInKg: 1, price: 1500 },
      { sizeInKg: 0.5, price: 800 },
    ],
    stockInKg: 50.5,
    isActive: true,
    imageUrl: "",
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-12-01T14:20:00Z",
  },
  {
    _id: "2", 
    name: "Mate Calabaza Natural",
    description: "Mate de calabaza natural artesanal curado tradicionalmente",
    category: "Mates",
    type: "mate calabaza",
    price: 2500,
    stock: 15,
    isActive: true,
    imageUrl: "",
    createdAt: "2023-02-10T09:15:00Z",
    updatedAt: "2023-11-28T16:45:00Z",
  },
  {
    _id: "3",
    name: "Bombilla Alpaca Premium",
    description: "Bombilla de alpaca con virola de acero inoxidable",
    category: "Bombillas", 
    type: "bombilla alpaca",
    price: 3200,
    stock: 8,
    isActive: false,
    imageUrl: "",
    createdAt: "2023-03-05T11:20:00Z",
    updatedAt: "2023-10-15T13:30:00Z",
  },
];

// ✅ Sistema de persistencia mock
const getMockProducts = () => {
  try {
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('📦 Productos recuperados del storage:', parsed.length);
      return parsed;
    }
  } catch (error) {
    console.warn('⚠️ Error al leer storage, usando datos iniciales:', error);
  }
  
  const initial = getInitialMockProducts();
  saveMockProducts(initial);
  return initial;
};

const saveMockProducts = (products) => {
  try {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(products));
    console.log('💾 Productos guardados en storage:', products.length);
  } catch (error) {
    console.warn('⚠️ Error al guardar en storage:', error);
  }
};

// ✅ Función para limpiar storage (útil para development)
const clearMockProducts = () => {
  localStorage.removeItem(MOCK_STORAGE_KEY);
  console.log('🗑️ Storage de productos limpiado');
};

// ✅ Función para convertir File a base64 para persistencia mock
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const getAllProducts = async (forceRefresh = false) => {
  // ✅ Retornar caché si es válido y no se fuerza refresh
  if (!forceRefresh && isCacheValid() && memoryCache.products) {
    console.log('📦 Productos desde caché memoria');
    return memoryCache.products;
  }

  // ✅ Verificar caché de sesión
  if (!forceRefresh) {
    const sessionCached = getFromSessionCache();
    if (sessionCached) {
      console.log('📦 Productos desde caché sesión');
      return sessionCached;
    }
  }

  // ✅ Evitar múltiples requests simultáneos
  if (memoryCache.isLoading) {
    console.log('⏳ Request en progreso, esperando...');
    // Esperar hasta que termine el request actual
    while (memoryCache.isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (memoryCache.products) return memoryCache.products;
  }

  memoryCache.isLoading = true;

  try {
    const response = await apiClient.get(API_ROUTE);
    console.log('✅ Productos cargados desde API:', response.data.length);
    
    setCache(response.data);
    return response.data;
  } catch (error) {
    const errorType = error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED' 
      ? 'Servidor no disponible' 
      : 'Error de API';
    
    console.warn(`⚠️ ${errorType} - usando datos mock:`, error.message);
    
    // ✅ Delay reducido para mejor UX
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const mockData = getMockProducts();
    console.log('📦 Productos mock cargados:', mockData.length, 'productos');
    
    setCache(mockData);
    return mockData;
  } finally {
    memoryCache.isLoading = false;
  }
};

export const getProductById = async (productId) => {
  // ✅ Buscar primero en caché si existe
  if (memoryCache.products) {
    const cachedProduct = memoryCache.products.find(p => p._id === productId);
    if (cachedProduct) {
      console.log('📦 Producto encontrado en caché:', cachedProduct.name);
      return cachedProduct;
    }
  }

  try {
    const response = await apiClient.get(`${API_ROUTE}/${productId}`);
    console.log('✅ Producto cargado desde API:', response.data);
    return response.data;
  } catch (error) {
    console.warn(`⚠️ Error al obtener producto ${productId}, usando mock`);
    
    // ✅ Delay mínimo para mock
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const mockProducts = getMockProducts();
    const mockProduct = mockProducts.find(p => p._id === productId);
    if (mockProduct) {
      console.log('📦 Producto mock encontrado:', mockProduct.name);
      return mockProduct;
    }
    
    const errorMessage = `Producto con ID ${productId} no encontrado`;
    console.error('❌', errorMessage);
    throw new Error(errorMessage);
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await apiClient.post(API_ROUTE, productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('✅ Producto creado:', response.data);
    
    clearCache();
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear producto:', error.response?.data || error.message);
    
    if (import.meta.env.DEV) {
      console.warn('🔧 Modo desarrollo: simulando creación exitosa');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const mockProducts = getMockProducts();
      const newProduct = {
        _id: `prod_${Date.now()}`,
        name: productData.get('name') || 'Producto Mock',
        description: productData.get('description') || '',
        category: productData.get('category') || '',
        type: productData.get('type') || '',
        price: productData.get('price') ? parseFloat(productData.get('price')) : undefined,
        stock: productData.get('stock') ? parseInt(productData.get('stock')) : undefined,
        stockInKg: productData.get('stockInKg') ? parseFloat(productData.get('stockInKg')) : undefined,
        isActive: productData.get('isActive') === 'true',
        imageUrl: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // ✅ Manejar imagen con mejor validación
      const imageFile = productData.get('image');
      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        try {
          newProduct.imageUrl = await fileToBase64(imageFile);
          console.log('📷 Imagen procesada correctamente para:', newProduct.name);
        } catch (error) {
          console.warn('⚠️ Error al procesar imagen:', error);
          newProduct.imageUrl = '';
        }
      }

      // ✅ Manejar packageSizes para yerbas
      if (newProduct.type === 'yerba' || newProduct.type === 'yuyo') {
        newProduct.packageSizes = [];
        let index = 0;
        while (productData.get(`packageSizes[${index}][sizeInKg]`)) {
          const sizeInKg = parseFloat(productData.get(`packageSizes[${index}][sizeInKg]`));
          const price = parseFloat(productData.get(`packageSizes[${index}][price]`));
          
          if (sizeInKg > 0 && price > 0) {
            newProduct.packageSizes.push({ sizeInKg, price });
          }
          index++;
        }
      }

      const updatedProducts = [...mockProducts, newProduct];
      saveMockProducts(updatedProducts);
      clearCache();
      
      console.log('📝 Producto mock creado exitosamente:', newProduct.name);
      return newProduct;
    }
    
    throw error.response?.data || new Error('No se pudo crear el producto');
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await apiClient.put(`${API_ROUTE}/${productId}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('✅ Producto actualizado:', response.data);
    clearCache();
    return response.data;
  } catch (error) {
    console.error(`❌ Error al actualizar producto ${productId}:`, error.response?.data || error.message);
    
    if (import.meta.env.DEV) {
      console.warn('🔧 Modo desarrollo: simulando actualización exitosa');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockProducts = getMockProducts();
      const productIndex = mockProducts.findIndex(p => p._id === productId);
      
      if (productIndex === -1) {
        throw new Error(`Producto con ID ${productId} no encontrado`);
      }

      const currentProduct = mockProducts[productIndex];
      const updatedProduct = {
        ...currentProduct,
        name: productData.get('name') || currentProduct.name,
        description: productData.get('description') || currentProduct.description,
        category: productData.get('category') || currentProduct.category,
        type: productData.get('type') || currentProduct.type,
        isActive: productData.get('isActive') === 'true',
        updatedAt: new Date().toISOString()
      };

      // ✅ Manejar imagen mejorada
      const imageFile = productData.get('image');
      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        try {
          updatedProduct.imageUrl = await fileToBase64(imageFile);
          console.log('📷 Imagen actualizada para:', updatedProduct.name);
        } catch (error) {
          console.warn('⚠️ Error al procesar nueva imagen:', error);
          updatedProduct.imageUrl = currentProduct.imageUrl || '';
        }
      } else {
        // ✅ Mantener imagen anterior si no hay nueva
        updatedProduct.imageUrl = currentProduct.imageUrl || '';
      }

      // ✅ Manejar campos específicos por tipo
      if (updatedProduct.type === 'yerba' || updatedProduct.type === 'yuyo') {
        if (productData.get('stockInKg')) {
          updatedProduct.stockInKg = parseFloat(productData.get('stockInKg'));
        }
        
        // ✅ Reconstruir packageSizes con validación
        const newPackageSizes = [];
        let index = 0;
        while (productData.get(`packageSizes[${index}][sizeInKg]`)) {
          const sizeInKg = parseFloat(productData.get(`packageSizes[${index}][sizeInKg]`));
          const price = parseFloat(productData.get(`packageSizes[${index}][price]`));
          
          if (sizeInKg > 0 && price > 0) {
            newPackageSizes.push({ sizeInKg, price });
          }
          index++;
        }
        
        if (newPackageSizes.length > 0) {
          updatedProduct.packageSizes = newPackageSizes;
        }
        
        // ✅ Limpiar campos irrelevantes
        delete updatedProduct.price;
        delete updatedProduct.stock;
      } else {
        if (productData.get('price')) {
          updatedProduct.price = parseFloat(productData.get('price'));
        }
        if (productData.get('stock')) {
          updatedProduct.stock = parseInt(productData.get('stock'));
        }
        
        // ✅ Limpiar campos irrelevantes
        delete updatedProduct.stockInKg;
        delete updatedProduct.packageSizes;
      }

      mockProducts[productIndex] = updatedProduct;
      saveMockProducts(mockProducts);
      clearCache();
      
      console.log('📝 Producto mock actualizado:', updatedProduct.name);
      return updatedProduct;
    }
    
    throw error.response?.data || new Error(`No se pudo actualizar el producto ${productId}`);
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`${API_ROUTE}/${productId}`);
    console.log('✅ Producto eliminado:', productId);
    
    // ✅ Invalidar caché
    clearCache();
    
    return response.data;
  } catch (error) {
    console.error(`❌ Error al eliminar producto ${productId}:`, error.response?.data || error.message);
    
    if (import.meta.env.DEV) {
      console.warn('🔧 Modo desarrollo: simulando eliminación exitosa');
      // ✅ Delay reducido
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockProducts = getMockProducts();
      const filteredProducts = mockProducts.filter(p => p._id !== productId);
      saveMockProducts(filteredProducts);
      
      // ✅ Invalidar caché
      clearCache();
      
      console.log('🗑️ Producto mock eliminado:', productId);
      return { message: 'Producto eliminado exitosamente (simulado)' };
    }
    
    throw error.response?.data || new Error(`No se pudo eliminar el producto ${productId}`);
  }
};

// ✅ Funciones de utilidad para development
export const resetMockData = () => {
  clearMockProducts();
  return getMockProducts();
};

export const debugMockData = () => {
  const products = getMockProducts();
  console.table(products);
  return products;
};

// ✅ Función de utilidad para limpiar URLs blob obsoletas
export const cleanupBlobUrls = () => {
  const products = getMockProducts();
  let hasChanges = false;
  
  const cleanedProducts = products.map(product => {
    if (product.imageUrl && product.imageUrl.startsWith('blob:')) {
      // Verificar si la URL blob todavía es válida
      fetch(product.imageUrl)
        .catch(() => {
          // Si falla, limpiar la URL
          hasChanges = true;
          return { ...product, imageUrl: '' };
        });
    }
    return product;
  });
  
  if (hasChanges) {
    saveMockProducts(cleanedProducts);
    console.log('🧹 URLs blob obsoletas limpiadas');
  }
};

export const prefetchProducts = async () => {
  if (!isCacheValid()) {
    console.log('🚀 Prefetching productos...');
    await getAllProducts();
  }
};

export const invalidateCache = () => {
  console.log('🗑️ Cache invalidado manualmente');
  clearCache();
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  resetMockData,
  debugMockData,
  cleanupBlobUrls,
  prefetchProducts,
  invalidateCache,
};