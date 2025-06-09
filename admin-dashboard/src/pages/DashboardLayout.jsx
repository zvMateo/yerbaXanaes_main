import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ChevronRight, Home, Menu, X } from "lucide-react";
import Sidebar from "../components/Layout/Sidebar";
import DevelopmentBanner from "../components/DevelopmentBanner";

function DashboardLayout() {
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cerrar sidebar móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  // Prevenir scroll del body cuando el sidebar móvil está abierto
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileSidebarOpen]);

  const getPageInfo = () => {
    const currentPath = location.pathname;

    // Mapeo de rutas con información más completa
    const pageMap = {
      "/admin": {
        title: "Dashboard",
        breadcrumb: [{ name: "Inicio", path: "/admin" }],
        description: "Resumen general del negocio",
      },
      "/admin/products": {
        title: "Productos",
        breadcrumb: [
          { name: "Inicio", path: "/admin" },
          { name: "Productos", path: "/admin/products" },
        ],
        description: "Gestiona tu catálogo de productos",
      },
      "/admin/products/new": {
        title: "Nuevo Producto",
        breadcrumb: [
          { name: "Inicio", path: "/admin" },
          { name: "Productos", path: "/admin/products" },
          { name: "Nuevo", path: "/admin/products/new" },
        ],
        description: "Agrega un nuevo producto al catálogo",
      },
      "/admin/orders": {
        title: "Pedidos",
        breadcrumb: [
          { name: "Inicio", path: "/admin" },
          { name: "Pedidos", path: "/admin/orders" },
        ],
        description: "Administra todos los pedidos",
      },
      "/admin/orders/new": {
        title: "Nuevo Pedido",
        breadcrumb: [
          { name: "Inicio", path: "/admin" },
          { name: "Pedidos", path: "/admin/orders" },
          { name: "Nuevo", path: "/admin/orders/new" },
        ],
        description: "Crear un pedido manualmente",
      },
      "/admin/customers": {
        title: "Clientes",
        breadcrumb: [
          { name: "Inicio", path: "/admin" },
          { name: "Clientes", path: "/admin/customers" },
        ],
        description: "Base de datos de clientes",
      },
      "/admin/customers/analytics": {
        title: "Analytics de Clientes",
        breadcrumb: [
          { name: "Inicio", path: "/admin" },
          { name: "Clientes", path: "/admin/customers" },
          { name: "Analytics", path: "/admin/customers/analytics" },
        ],
        description: "Análisis del comportamiento de clientes",
      },
      "/admin/promotions": {
        title: "Promociones",
        breadcrumb: [
          { name: "Inicio", path: "/admin" },
          { name: "Promociones", path: "/admin/promotions" },
        ],
        description: "Gestiona ofertas y descuentos",
      },
      "/admin/sales-reports": {
        title: "Análisis de Ventas",
        breadcrumb: [
          { name: "Inicio", path: "/admin" },
          { name: "Análisis", path: "/admin/sales-reports" },
          { name: "Ventas", path: "/admin/sales-reports" },
        ],
        description: "Monitor y análisis del rendimiento de ventas",
      },
      "/admin/product-analytics": {
        title: "Análisis de Productos",
        breadcrumb: [
          { name: "Inicio", path: "/admin" },
          { name: "Análisis", path: "/admin/product-analytics" },
          { name: "Productos", path: "/admin/product-analytics" },
        ],
        description: "Insights detallados sobre el rendimiento de productos",
      },
      "/admin/geographic-sales": {
        title: "Análisis Geográfico",
        breadcrumb: [
          { name: "Inicio", path: "/admin" },
          { name: "Análisis", path: "/admin/geographic-sales" },
          { name: "Geografía", path: "/admin/geographic-sales" },
        ],
        description: "Distribución y rendimiento por ubicación geográfica",
      },
      "/admin/inventory": {
        title: "Gestión de Inventario",
        breadcrumb: [
          { name: "Inicio", path: "/admin" },
          { name: "Análisis", path: "/admin/inventory" },
          { name: "Inventario", path: "/admin/inventory" },
        ],
        description: "Control completo de stock y movimientos de inventario",
      },
      "/admin/settings": {
        title: "Configuración del Sistema",
        breadcrumb: [
          { name: "Inicio", path: "/admin" },
          { name: "Sistema", path: "/admin/settings" },
          { name: "Configuración", path: "/admin/settings" },
        ],
        description: "Administra la configuración general del sistema",
      },
      "/admin/reports": {
        title: "Centro de Reportes",
        breadcrumb: [
          { name: "Inicio", path: "/admin" },
          { name: "Sistema", path: "/admin/reports" },
          { name: "Reportes", path: "/admin/reports" },
        ],
        description: "Genera y gestiona todos los reportes del negocio",
      },
    };

    // Manejo especial para rutas dinámicas
    if (currentPath.includes("/edit/")) {
      const basePath = currentPath.substring(
        0,
        currentPath.lastIndexOf("/edit")
      );
      const baseInfo = pageMap[basePath];

      if (baseInfo) {
        return {
          title: `Editar ${baseInfo.title.slice(0, -1)}`, // Remover 's' del final
          breadcrumb: [
            ...baseInfo.breadcrumb,
            { name: "Editar", path: currentPath },
          ],
          description: `Modificar información del ${baseInfo.title
            .slice(0, -1)
            .toLowerCase()}`,
        };
      }
    }

    if (
      currentPath.includes("/orders/") &&
      currentPath !== "/admin/orders/new"
    ) {
      return {
        title: "Detalle del Pedido",
        breadcrumb: [
          { name: "Inicio", path: "/admin" },
          { name: "Pedidos", path: "/admin/orders" },
          { name: "Detalle", path: currentPath },
        ],
        description: "Información completa del pedido",
      };
    }

    if (
      currentPath.includes("/customers/") &&
      !currentPath.includes("/analytics")
    ) {
      return {
        title: "Perfil del Cliente",
        breadcrumb: [
          { name: "Inicio", path: "/admin" },
          { name: "Clientes", path: "/admin/customers" },
          { name: "Perfil", path: currentPath },
        ],
        description: "Información detallada del cliente",
      };
    }

    // Retorno por defecto
    return (
      pageMap[currentPath] || {
        title: "Administración",
        breadcrumb: [{ name: "Inicio", path: "/admin" }],
        description: "Panel de administración",
      }
    );
  };

  const pageInfo = getPageInfo();

  return (
    <div className="fixed inset-0 bg-gray-50 font-sans flex flex-col">
      {/* ✅ Banner de desarrollo */}
      <DevelopmentBanner />

      <div className="flex flex-1 min-h-0">
        {/* Overlay para móvil */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
        ${isMobile ? "fixed" : "relative"} 
        ${
          isMobile && !isMobileSidebarOpen
            ? "-translate-x-full"
            : "translate-x-0"
        }
        transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 lg:z-auto
      `}
        >
          <Sidebar />
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 flex flex-col min-h-0 w-full lg:w-auto">
          {/* Header Responsive */}
          <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-30 shadow-sm">
            <div className="px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                {/* Botón de menú móvil */}
                {isMobile && (
                  <button
                    onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 lg:hidden"
                    aria-label="Abrir menú de navegación"
                  >
                    {isMobileSidebarOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </button>
                )}

                {/* Breadcrumb y título */}
                <div className="flex-1 min-w-0 ml-4 lg:ml-0">
                  {/* Breadcrumb - Solo en desktop */}
                  <nav
                    className="hidden sm:flex items-center space-x-1 text-sm mb-1"
                    aria-label="Breadcrumb"
                  >
                    {pageInfo.breadcrumb.map((item, index) => (
                      <div key={item.path} className="flex items-center">
                        {index === 0 ? (
                          <Home className="h-3.5 w-3.5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-gray-300 mx-1" />
                        )}
                        <span
                          className={`${
                            index === pageInfo.breadcrumb.length - 1
                              ? "text-gray-900 font-medium"
                              : "text-gray-500 hover:text-gray-700"
                          } transition-colors duration-150 truncate`}
                        >
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </nav>

                  {/* Título responsive */}
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 tracking-tight truncate">
                    {pageInfo.title}
                  </h1>

                  {/* Descripción - Solo en desktop */}
                  {pageInfo.description && (
                    <p className="hidden lg:block text-sm text-gray-600 mt-0.5 font-normal">
                      {pageInfo.description}
                    </p>
                  )}
                </div>

                {/* Indicadores de estado - Responsive */}
                <div className="flex items-center space-x-3 ml-4">
                  {location.pathname === "/admin" && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="hidden sm:inline text-xs text-gray-500 font-medium">
                        Sistema activo
                      </span>
                    </div>
                  )}

                  {location.pathname.includes("/orders") &&
                    !location.pathname.includes("/new") && (
                      <div className="text-right">
                        <div className="hidden sm:block text-xs text-gray-500">
                          Última actualización
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date().toLocaleTimeString("es-AR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </header>

          {/* Área de Contenido Desplazable */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
