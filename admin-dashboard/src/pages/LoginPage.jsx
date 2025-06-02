import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // <--- IMPORTAR TOAST
import authService from '../services/authService';
import { useAuth } from '../contexts/AuthContext.jsx'; // Asumiendo que usas AuthContext

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtener la función login del contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // El servicio authService.login ahora debería devolver los datos del usuario/token
      // y el AuthContext se encargará de almacenarlos.
      const userData = await authService.login(email, password);
      login(userData.token, userData.admin); // Actualizar el estado de autenticación global
      toast.success('¡Inicio de sesión exitoso!'); // <--- NOTIFICACIÓN DE ÉXITO
      navigate('/admin/products');
    } catch (err) {
      // Intentar obtener el mensaje de error específico del backend
      const errorMessage = err.response?.data?.message || err.message || 'Error al iniciar sesión. Intente nuevamente.';
      toast.error(errorMessage); // <--- NOTIFICACIÓN DE ERROR
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-(--primary-color) mb-6">
          Admin YerbaXanaes
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-(--accent-color) focus:border-transparent"
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-(--accent-color) focus:border-transparent"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {/* El estado 'error' local ya no es necesario si se maneja con toasts */}
          <div className="flex items-center justify-between">
            <button
              className={`w-full bg-(--primary-color) hover:bg-(--secondary-color) text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;