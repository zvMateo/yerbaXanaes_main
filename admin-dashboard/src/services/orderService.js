import apiClient from './api';

const API_ROUTE = '/orders';

export const getAllOrders = async (params = {}) => {
  try {
    const response = await apiClient.get(API_ROUTE, { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener pedidos:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al cargar pedidos');
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await apiClient.get(`${API_ROUTE}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener pedido:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al cargar pedido');
  }
};

export const updateOrderStatus = async (orderId, updates) => {
  try {
    const response = await apiClient.patch(`${API_ROUTE}/${orderId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar pedido:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al actualizar pedido');
  }
};

export const getOrdersByCustomer = async (customerEmail) => {
  try {
    const response = await apiClient.get(`${API_ROUTE}/customer/${customerEmail}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener pedidos del cliente:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al cargar historial');
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post(API_ROUTE, orderData);
    return response.data;
  } catch (error) {
    console.error('Error al crear pedido:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al crear pedido');
  }
};

export default {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersByCustomer,
  createOrder
};