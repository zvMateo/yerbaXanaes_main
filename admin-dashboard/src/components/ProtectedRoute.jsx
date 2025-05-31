// filepath: c:\Users\Usuario\OneDrive\Escritorio\ecommerce-yerbaxanaes\admin-dashboard\src\components\ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const token = authService.getCurrentUserToken();

  if (!token) {
    // Si no hay token, redirigir a la página de login
    return <Navigate to="/login" replace />;
  }

  // Si hay token, renderizar el contenido protegido (Outlet o children)
  // Aquí podrías añadir una verificación de validez del token si lo deseas
  return children ? children : <Outlet />;
};

export default ProtectedRoute;