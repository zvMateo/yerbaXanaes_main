import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import Sidebar from '../components/Layout/Sidebar';

function DashboardLayout() {
  const location = useLocation();

  const getPageInfo = () => {
    const currentPath = location.pathname;
    
    // Mapeo de rutas con información más completa
    const pageMap = {
      '/admin': { 
        title: 'Dashboard', 
        breadcrumb: [{ name: 'Inicio', path: '/admin' }],
        description: 'Resumen general del negocio'
      },
      '/admin/products': { 
        title: 'Productos', 
        breadcrumb: [
          { name: 'Inicio', path: '/admin' },
          { name: 'Productos', path: '/admin/products' }
        ],
        description: 'Gestiona tu catálogo de productos'
      },
      '/admin/products/new': { 
        title: 'Nuevo Producto', 
        breadcrumb: [
          { name: 'Inicio', path: '/admin' },
          { name: 'Productos', path: '/admin/products' },
          { name: 'Nuevo', path: '/admin/products/new' }
        ],
        description: 'Agrega un nuevo producto al catálogo'
      },
      '/admin/orders': { 
        title: 'Pedidos', 
        breadcrumb: [
          { name: 'Inicio', path: '/admin' },
          { name: 'Pedidos', path: '/admin/orders' }
        ],
        description: 'Administra todos los pedidos'
      },
      '/admin/orders/new': { 
        title: 'Nuevo Pedido', 
        breadcrumb: [
          { name: 'Inicio', path: '/admin' },
          { name: 'Pedidos', path: '/admin/orders' },
          { name: 'Nuevo', path: '/admin/orders/new' }
        ],
        description: 'Crear un pedido manualmente'
      },
      '/admin/customers': { 
        title: 'Clientes', 
        breadcrumb: [
          { name: 'Inicio', path: '/admin' },
          { name: 'Clientes', path: '/admin/customers' }
        ],
        description: 'Base de datos de clientes'
      },
      '/admin/customers/analytics': { 
        title: 'Analytics de Clientes', 
        breadcrumb: [
          { name: 'Inicio', path: '/admin' },
          { name: 'Clientes', path: '/admin/customers' },
          { name: 'Analytics', path: '/admin/customers/analytics' }
        ],
        description: 'Análisis del comportamiento de clientes'
      },
      '/admin/promotions': { 
        title: 'Promociones', 
        breadcrumb: [
          { name: 'Inicio', path: '/admin' },
          { name: 'Promociones', path: '/admin/promotions' }
        ],
        description: 'Gestiona ofertas y descuentos'
      }
    };

    // Manejo especial para rutas dinámicas
    if (currentPath.includes('/edit/')) {
      const basePath = currentPath.substring(0, currentPath.lastIndexOf('/edit'));
      const baseInfo = pageMap[basePath];
      
      if (baseInfo) {
        return {
          title: `Editar ${baseInfo.title.slice(0, -1)}`, // Remover 's' del final
          breadcrumb: [
            ...baseInfo.breadcrumb,
            { name: 'Editar', path: currentPath }
          ],
          description: `Modificar información del ${baseInfo.title.slice(0, -1).toLowerCase()}`
        };
      }
    }

    if (currentPath.includes('/orders/') && currentPath !== '/admin/orders/new') {
      return {
        title: 'Detalle del Pedido',
        breadcrumb: [
          { name: 'Inicio', path: '/admin' },
          { name: 'Pedidos', path: '/admin/orders' },
          { name: 'Detalle', path: currentPath }
        ],
        description: 'Información completa del pedido'
      };
    }

    if (currentPath.includes('/customers/') && !currentPath.includes('/analytics')) {
      return {
        title: 'Perfil del Cliente',
        breadcrumb: [
          { name: 'Inicio', path: '/admin' },
          { name: 'Clientes', path: '/admin/customers' },
          { name: 'Perfil', path: currentPath }
        ],
        description: 'Información detallada del cliente'
      };
    }

    // Retorno por defecto
    return pageMap[currentPath] || {
      title: 'Administración',
      breadcrumb: [{ name: 'Inicio', path: '/admin' }],
      description: 'Panel de administración'
    };
  };

  const pageInfo = getPageInfo();

  return (
    <div className="fixed inset-0 bg-gray-50 font-sans flex">
      {/* Sidebar - Ahora usando el componente separado */}
      <Sidebar />
      
      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* ✅ Header Minimalista Mejorado */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20">
          <div className="px-6 py-4">
            {/* Breadcrumb minimalista */}
            <nav className="flex items-center space-x-1 text-sm mb-2" aria-label="Breadcrumb">
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
                        ? 'text-gray-900 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    } transition-colors duration-150`}
                  >
                    {item.name}
                  </span>
                </div>
              ))}
            </nav>

            {/* Título y descripción */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                  {pageInfo.title}
                </h1>
                {pageInfo.description && (
                  <p className="text-sm text-gray-600 mt-0.5 font-normal">
                    {pageInfo.description}
                  </p>
                )}
              </div>

              {/* Indicador de estado opcional - solo para ciertas páginas */}
              {location.pathname === '/admin' && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="ml-2 text-xs text-gray-500 font-medium">Sistema activo</span>
                  </div>
                </div>
              )}

              {location.pathname.includes('/orders') && !location.pathname.includes('/new') && (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Última actualización</div>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date().toLocaleTimeString('es-AR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Área de Contenido Desplazable */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;