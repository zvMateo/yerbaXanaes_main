import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; // <--- IMPORTAR useAuth

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // <--- OBTENER ESTADO DEL CONTEXTO

  if (loading) {
    // Mientras se verifica el estado de autenticación (desde localStorage),
    // puedes mostrar un spinner o simplemente no renderizar nada para evitar un parpadeo.
    // Esto es importante para que no redirija a /login prematuramente si el token existe.
    return <p className="text-center text-gray-600 mt-10">Verificando autenticación...</p>; // O un spinner
  }

  if (!isAuthenticated) {
    // Si no está autenticado después de cargar, redirigir a la página de login
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizar el contenido protegido (Outlet o children)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;