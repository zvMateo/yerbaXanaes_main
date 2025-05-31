// filepath: c:\Users\Usuario\OneDrive\Escritorio\ecommerce-yerbaxanaes\admin-dashboard\src\services\authService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/auth/admin'; // URL base de tu API

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
      // Opcional: guardar info del usuario si la API la devuelve
      // localStorage.setItem('adminUser', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    // Lanza el mensaje de error del backend si está disponible, o un mensaje genérico
    const errorMessage = error.response?.data?.message || error.message || 'Error de inicio de sesión. Verifique sus credenciales.';
    throw new Error(errorMessage);
  }
};

const logout = () => {
  localStorage.removeItem('adminToken');
  // localStorage.removeItem('adminUser');
  // Considera redirigir aquí o dejar que el componente que llama a logout lo haga.
  // window.location.href = '/login'; // Esto fuerza un refresh, useNavigate es más SPA-friendly
};

const getCurrentUserToken = () => {
  return localStorage.getItem('adminToken');
};

// Podrías añadir una función para verificar la validez del token con el backend si es necesario
// const verifyToken = async (token) => { ... }

export default {
  login,
  logout,
  getCurrentUserToken,
};