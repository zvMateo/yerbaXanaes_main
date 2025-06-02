import { Routes, Route, Navigate, Outlet } from 'react-router-dom'; // Asegúrate de importar Outlet si no lo tienes
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './pages/DashboardLayout'; // Asumo que esta es la ruta correcta
import ProductListPage from './pages/ProductListPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProductFormPage from './pages/ProductFormPage';
import { useAuth } from './contexts/AuthContext';

// Quita la importación de App.css si no la usas directamente aquí
// import './App.css'

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Cargando aplicación...</p>;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas Protegidas bajo /admin */}
        {/* ProtectedRoute envuelve a DashboardLayout y sus rutas hijas */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <DashboardLayout /> {/* DashboardLayout debe tener un <Outlet /> para renderizar las rutas hijas */}
            </ProtectedRoute>
          }
        >
          {/* Estas rutas se renderizarán donde DashboardLayout tenga su <Outlet /> */}
          <Route index element={<Navigate to="products" replace />} /> {/* /admin -> /admin/products */}
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/new" element={<ProductFormPage />} /> {/* Eliminado 'mode' prop, ProductFormPage lo infiere */}
          <Route path="products/edit/:productId" element={<ProductFormPage />} /> {/* Eliminado 'mode' prop */}
          
          {/* Otras rutas del dashboard (ej. sales, settings) irían aquí como hijas de la ruta /admin */}
          {/* <Route path="sales" element={<SalesAnalyticsPage />} /> */}
          {/* <Route path="settings" element={<SettingsPage />} /> */}
        </Route>
      
        {/* Redirección para cualquier ruta no encontrada */}
        <Route 
          path="*" 
          element={
            isAuthenticated ? <Navigate to="/admin" replace /> : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </>
  );
}

export default App;