import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; // <--- IMPORTAR useAuth

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // <--- OBTENER ESTADO DEL CONTEXTO
  const location = useLocation();

  // Mostrar spinner mientras carga la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, renderizar el contenido protegido (Outlet o children)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;