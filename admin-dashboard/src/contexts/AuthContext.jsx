import React, { createContext, useContext, useState, useEffect } from 'react';
// import authService from '../services/authService'; // Asumimos que tu authService puede verificar el token o parsearlo

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem('adminInfo')));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true); // Para manejar la carga inicial del estado de autenticación

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedAdminInfo = localStorage.getItem('adminInfo');

    if (storedToken) {
      // Opcional: Podrías querer verificar la validez del token aquí con una llamada al backend
      // Por ahora, asumimos que si hay token, es válido hasta que falle una llamada API protegida.
      setToken(storedToken);
      if (storedAdminInfo) {
        try {
          setAdmin(JSON.parse(storedAdminInfo));
        } catch (error) {
          console.error("Error al parsear adminInfo de localStorage:", error);
          localStorage.removeItem('adminInfo'); // Limpiar si está corrupto
          setAdmin(null);
        }
      }
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setToken(null);
      setAdmin(null);
    }
    setLoading(false); // Termina la carga inicial
  }, []);

  const login = (newToken, adminData) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('adminInfo', JSON.stringify(adminData));
    setToken(newToken);
    setAdmin(adminData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminInfo');
    setToken(null);
    setAdmin(null);
    setIsAuthenticated(false);
    // Opcional: podrías querer llamar a un endpoint de logout en el backend
    // authService.logout(); 
  };

  // Opcional: Función para actualizar la información del admin si cambia
  const updateAdminInfo = (newAdminData) => {
    localStorage.setItem('adminInfo', JSON.stringify(newAdminData));
    setAdmin(newAdminData);
  };

  return (
    <AuthContext.Provider value={{ token, admin, isAuthenticated, login, logout, updateAdminInfo, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};