// filepath: c:\Users\Usuario\OneDrive\Escritorio\ecommerce-yerbaxanaes\admin-dashboard\src\App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './pages/DashboardLayout';
import ProductListPage from './pages/ProductListPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProductFormPage from './pages/ProductFormPage'; // Descomentar cuando la crees

// Quita la importación de App.css si no la usas directamente aquí
// import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<DashboardLayout />}>
          {/* Redirige /admin a /admin/products por defecto */}
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<ProductListPage />} />
          {/* Rutas para crear y editar productos (se añadirán después) */}
          <Route path="products/new" element={<ProductFormPage mode="create" />} />
          <Route path="products/edit/:productId" element={<ProductFormPage mode="edit" />} /> 
          
          {/* Otras rutas del dashboard (ej. orders) irían aquí */}
        </Route>
      </Route>

      {/* Redirección para cualquier ruta no encontrada */}
      {/* Si el usuario no está autenticado, ProtectedRoute lo enviará a /login */}
      {/* Si está autenticado y la ruta no es /admin/*, puedes decidir a dónde enviarlo.
          Aquí lo enviamos a /admin como punto de entrada a las rutas protegidas. */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default App;