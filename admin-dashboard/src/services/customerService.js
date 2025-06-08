import apiClient from './api';

const API_ROUTE = '/customers';

export const getAllCustomers = async (params = {}) => {
  try {
    const response = await apiClient.get(API_ROUTE, { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener clientes:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al cargar clientes');
  }
};

export const getCustomerById = async (customerId) => {
  try {
    const response = await apiClient.get(`${API_ROUTE}/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener cliente:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al cargar cliente');
  }
};

export const getCustomerOrders = async (customerEmail) => {
  try {
    const response = await apiClient.get(`/sales/customer/${customerEmail}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener pedidos del cliente:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al cargar historial');
  }
};

export const getCustomerAnalytics = async () => {
  try {
    const response = await apiClient.get(`${API_ROUTE}/analytics`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener analytics:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al cargar analytics');
  }
};

export default {
  getAllCustomers,
  getCustomerById,
  getCustomerOrders,
  getCustomerAnalytics
};