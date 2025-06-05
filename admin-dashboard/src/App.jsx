import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './pages/DashboardLayout';
import DashboardMain from './pages/DashboardMain'; // 🆕 AGREGAR IMPORT
import ProductListPage from './pages/ProductListPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProductFormPage from './pages/ProductFormPage';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';
import { useAuth } from './contexts/AuthContext';

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
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          
          <Route index element={<DashboardMain />} /> 
          
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/edit/:productId" element={<ProductFormPage />} />
          <Route path="orders" element={<OrderListPage />} />
          <Route path="orders/:orderId" element={<OrderDetailPage />} />
          
          {/* Otras rutas protegidas pueden ir aquí */}
        </Route>
        
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