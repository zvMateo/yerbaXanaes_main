import axios from 'axios';
import authService from './authService'; // Asegúrate que la ruta sea correcta

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // URL base de tu API backend
  // timeout: 10000, // Opcional: tiempo de espera para las solicitudes
});

// Interceptor de Solicitud: Añade el token JWT a las cabeceras
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getCurrentUserToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respuesta: Maneja errores globales (ej. 401 No Autorizado)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Marca para evitar bucles de reintento infinitos
        console.error("Error 401: No autorizado o token expirado.");
        authService.logout(); // Cierra la sesión del usuario
        // Redirige a la página de login
        // Es importante asegurarse de que esto no cause un bucle si la página de login también hace llamadas API
        // que podrían fallar con 401 antes de que el usuario intente loguearse.
        // Una forma más robusta podría ser usar un estado global o un evento para manejar la redirección.
        window.location.href = '/login'; 
        return Promise.reject(new Error("Sesión expirada. Por favor, inicie sesión de nuevo."));
      }
      // Puedes manejar otros códigos de error globales aquí si es necesario
      // ej. if (error.response.status === 500) { console.error("Error interno del servidor"); }
    }
    return Promise.reject(error);
  }
);

export default apiClient;