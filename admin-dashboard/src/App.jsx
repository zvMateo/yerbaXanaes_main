import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";


const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const DashboardLayout = React.lazy(() => import("./pages/DashboardLayout"));
const DashboardMain = React.lazy(() => import("./pages/DashboardMain"));
const ProductListPage = React.lazy(() => import("./pages/ProductListPage"));
const ProductFormPage = React.lazy(() => import("./pages/ProductFormPage"));
const OrderListPage = React.lazy(() => import("./pages/OrderListPage"));
const OrderDetailPage = React.lazy(() => import("./pages/OrderDetailPage"));
const OrderFormPage = React.lazy(() => import("./pages/OrderFormPage"));
const CustomerListPage = React.lazy(() => import("./pages/CustomerListPage"));
const CustomerAnalyticsPage = React.lazy(() =>import("./pages/CustomerAnalyticsPage"));

const CustomerDetailPage = React.lazy(() =>import("./pages/CustomerDetailPage"));

const PromotionListPage = React.lazy(() => import("./pages/PromotionListPage"));
const PromotionFormPage = React.lazy(() => import("./pages/PromotionFormPage"));

const PromotionDetailPage = React.lazy(() =>import("./pages/PromotionDetailPage"));

const SalesReportsPage = React.lazy(() => import("./pages/SalesReportsPage"));

const ProductAnalyticsPage = React.lazy(() =>import("./pages/ProductAnalyticsPage"));

const GeographicSalesPage = React.lazy(() =>import("./pages/GeographicSalesPage"));

const InventoryPage = React.lazy(() => import("./pages/InventoryPage"));

const SettingsPage = React.lazy(() => import("./pages/SettingsPage"));

const ReportsPage = React.lazy(() => import("./pages/ReportsPage"));

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullscreen message="Inicializando aplicación..." />;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000} // ✅ Aumentado de 2500ms a 4000ms
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={true}
        pauseOnHover={true}
        theme="light" // ✅ Cambiar a light para mejor visibilidad
        closeButton={true}
        enableMultiContainer={false}
        limit={3} // ✅ Reducir límite para menos saturación
        className="custom-toast-container"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        progressClassName="custom-toast-progress"
      />

      <Suspense fallback={<LoadingSpinner fullscreen message="Cargando..." />}>
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
            <Route
              index
              element={
                <Suspense
                  fallback={<LoadingSpinner message="Cargando dashboard..." />}
                >
                  <DashboardMain />
                </Suspense>
              }
            />

            {/* ✅ Rutas de Productos simplificadas */}
            <Route
              path="products"
              element={
                <Suspense
                  fallback={<LoadingSpinner message="Cargando productos..." />}
                >
                  <ProductListPage />
                </Suspense>
              }
            />
            <Route
              path="products/new"
              element={
                <Suspense
                  fallback={
                    <LoadingSpinner message="Preparando formulario..." />
                  }
                >
                  <ProductFormPage />
                </Suspense>
              }
            />
            <Route
              path="products/edit/:productId"
              element={
                <Suspense
                  fallback={<LoadingSpinner message="Cargando producto..." />}
                >
                  <ProductFormPage />
                </Suspense>
              }
            />

            {/* ✅ Rutas de Pedidos con suspense específico */}
            <Route
              path="orders"
              element={
                <Suspense
                  fallback={<LoadingSpinner message="Cargando pedidos..." />}
                >
                  <OrderListPage />
                </Suspense>
              }
            />
            <Route
              path="orders/new"
              element={
                <Suspense
                  fallback={
                    <LoadingSpinner message="Preparando nuevo pedido..." />
                  }
                >
                  <OrderFormPage />
                </Suspense>
              }
            />
            <Route
              path="orders/edit/:orderId"
              element={
                <Suspense
                  fallback={<LoadingSpinner message="Cargando pedido..." />}
                >
                  <OrderFormPage />
                </Suspense>
              }
            />
            <Route
              path="orders/:orderId"
              element={
                <Suspense
                  fallback={<LoadingSpinner message="Cargando detalles..." />}
                >
                  <OrderDetailPage />
                </Suspense>
              }
            />

            {/* ✅ Resto de rutas con suspense */}
            <Route
              path="customers"
              element={
                <Suspense
                  fallback={<LoadingSpinner message="Cargando clientes..." />}
                >
                  <CustomerListPage />
                </Suspense>
              }
            />
            <Route
              path="customers/analytics"
              element={
                <Suspense
                  fallback={<LoadingSpinner message="Generando analytics..." />}
                >
                  <CustomerAnalyticsPage />
                </Suspense>
              }
            />
            <Route
              path="customers/:id"
              element={
                <Suspense
                  fallback={<LoadingSpinner message="Cargando perfil..." />}
                >
                  <CustomerDetailPage />
                </Suspense>
              }
            />

            <Route
              path="promotions"
              element={
                <Suspense
                  fallback={
                    <LoadingSpinner message="Cargando promociones..." />
                  }
                >
                  <PromotionListPage />
                </Suspense>
              }
            />
            <Route
              path="promotions/new"
              element={
                <Suspense
                  fallback={
                    <LoadingSpinner message="Preparando promoción..." />
                  }
                >
                  <PromotionFormPage />
                </Suspense>
              }
            />
            <Route
              path="promotions/edit/:promotionId"
              element={
                <Suspense
                  fallback={<LoadingSpinner message="Cargando promoción..." />}
                >
                  <PromotionFormPage />
                </Suspense>
              }
            />
            <Route
              path="promotions/:promotionId"
              element={
                <Suspense
                  fallback={<LoadingSpinner message="Cargando detalles..." />}
                >
                  <PromotionDetailPage />
                </Suspense>
              }
            />

            <Route
              path="sales-reports"
              element={
                <Suspense
                  fallback={<LoadingSpinner message="Generando reportes..." />}
                >
                  <SalesReportsPage />
                </Suspense>
              }
            />
            <Route
              path="product-analytics"
              element={
                <Suspense
                  fallback={
                    <LoadingSpinner message="Analizando productos..." />
                  }
                >
                  <ProductAnalyticsPage />
                </Suspense>
              }
            />
            <Route
              path="geographic-sales"
              element={
                <Suspense
                  fallback={<LoadingSpinner message="Cargando mapa..." />}
                >
                  <GeographicSalesPage />
                </Suspense>
              }
            />
            <Route
              path="inventory"
              element={
                <Suspense
                  fallback={
                    <LoadingSpinner message="Verificando inventario..." />
                  }
                >
                  <InventoryPage />
                </Suspense>
              }
            />

            <Route
              path="settings"
              element={
                <Suspense
                  fallback={
                    <LoadingSpinner message="Cargando configuración..." />
                  }
                >
                  <SettingsPage />
                </Suspense>
              }
            />
            <Route
              path="reports"
              element={
                <Suspense
                  fallback={<LoadingSpinner message="Preparando reportes..." />}
                >
                  <ReportsPage />
                </Suspense>
              }
            />
          </Route>

          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
