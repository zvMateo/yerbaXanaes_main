import axios from 'axios';

// ✅ Configuración de base URL dinámica
const getBaseURL = () => {
  // En producción, usar variable de entorno
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://api.yerbaxanaes.com';
  }
  
  // En desarrollo, intentar localhost primero
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, // ✅ Timeout más generoso
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Interceptor de request mejorado
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // ✅ Log solo en desarrollo
    if (import.meta.env.DEV) {
      console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Error en request:', error);
    return Promise.reject(error);
  }
);

// ✅ Interceptor de response optimizado
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  (error) => {
    // ✅ Manejo de errores específicos sin logs excesivos
    if (error.code === 'ERR_NETWORK') {
      error.message = 'Error de conexión. Verifica tu internet.';
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Tiempo de espera agotado. Intenta nuevamente.';
    } else if (error.response?.status === 401) {
      error.message = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
      // ✅ Auto-logout en 401
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    } else if (error.response?.status >= 500) {
      error.message = 'Error del servidor. Intenta más tarde.';
    }
    
    // ✅ Log mínimo para debugging
    console.warn(`⚠️ API Error:`, error.message);
    
    return Promise.reject(error);
  }
);

export default apiClient;