// filepath: c:\Users\Usuario\OneDrive\Escritorio\ecommerce-yerbaxanaes\admin-dashboard\src\services\productService.js
import apiClient from './api';

const API_ROUTE = '/products-general'; // Ruta base para los productos en el backend
const getAllProducts = async () => {
  try {
    const response = await apiClient.get(API_ROUTE);
    return response.data; // Asume que el backend devuelve un array de productos
  } catch (error) {
    console.error('Error al obtener todos los productos:', error.response?.data || error.message);
    throw error.response?.data || new Error('No se pudieron obtener los productos.');
  }
};

const getProductById = async (productId) => {
  try {
    const response = await apiClient.get(`${API_ROUTE}/${productId}`);
    return response.data; // Asume que el backend devuelve un solo producto
  } catch (error) {
    console.error(`Error al obtener el producto ${productId}:`, error.response?.data || error.message);
    throw error.response?.data || new Error(`No se pudo obtener el producto ${productId}.`);
  }
};

// Para crear y actualizar productos, necesitarás enviar FormData si incluyes imágenes.
const createProduct = async (productData) => { // productData debe ser un objeto FormData
  try {
    const response = await apiClient.post(API_ROUTE, productData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Importante para la subida de archivos
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear el producto:', error.response?.data || error.message);
    throw error.response?.data || new Error('No se pudo crear el producto.');
  }
};

const updateProduct = async (productId, productData) => { // productData debe ser un objeto FormData
  try {
    const response = await apiClient.put(`${API_ROUTE}/${productId}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Importante si se actualiza la imagen
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el producto ${productId}:`, error.response?.data || error.message);
    throw error.response?.data || new Error(`No se pudo actualizar el producto ${productId}.`);
  }
};

const deleteProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`${API_ROUTE}/${productId}`);
    return response.data; // Usualmente un mensaje de éxito o el item eliminado
  } catch (error) {
    console.error(`Error al eliminar el producto ${productId}:`, error.response?.data || error.message);
    throw error.response?.data || new Error(`No se pudo eliminar el producto ${productId}.`);
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};