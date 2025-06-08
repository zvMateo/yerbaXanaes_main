import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/LoginPage';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './pages/DashboardLayout';
import DashboardMain from './pages/DashboardMain';
import ProductListPage from './pages/ProductListPage';
import ProductFormPage from './pages/ProductFormPage';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrderFormPage from './pages/OrderFormPage';
import CustomerListPage from './pages/CustomerListPage';
import CustomerAnalyticsPage from './pages/CustomerAnalyticsPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import PromotionListPage from './pages/PromotionListPage';
import PromotionFormPage from './pages/PromotionFormPage';
import PromotionDetailPage from './pages/PromotionDetailPage';

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
          {/* Dashboard Principal */}
          <Route index element={<DashboardMain />} /> 
          
          {/* Rutas de Productos */}
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/edit/:productId" element={<ProductFormPage />} />
          
          {/* Rutas de Pedidos/Órdenes */}
          <Route path="orders" element={<OrderListPage />} />
          <Route path="orders/new" element={<OrderFormPage />} />
          <Route path="orders/edit/:orderId" element={<OrderFormPage />} />
          <Route path="orders/:orderId" element={<OrderDetailPage />} />
          
          {/* ✨ NUEVAS RUTAS: Clientes */}
          <Route path="customers" element={<CustomerListPage />} />
          <Route path="customers/analytics" element={<CustomerAnalyticsPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          
          {/* Rutas de Promociones */}
          <Route path="promotions" element={<PromotionListPage />} />
          <Route path="promotions/new" element={<PromotionFormPage />} />
          <Route path="promotions/edit/:promotionId" element={<PromotionFormPage />} />
          <Route path="promotions/:promotionId" element={<PromotionDetailPage />} />
          
          {/* Futuras rutas de análisis/reportes */}
          {/* <Route path="sales-reports" element={<SalesReportsPage />} />
          <Route path="product-analytics" element={<ProductAnalyticsPage />} />
          <Route path="geographic-sales" element={<GeographicSalesPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="reports" element={<ReportsPage />} /> */}
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