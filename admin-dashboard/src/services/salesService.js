import apiClient from './api';

const API_ROUTE = '/sales';

export const getSalesData = async (dateRange = '30d') => {
  try {
    const response = await apiClient.get(`${API_ROUTE}/reports`, {
      params: { dateRange }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos de ventas:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al cargar datos de ventas');
  }
};

export default {
  getSalesData
};