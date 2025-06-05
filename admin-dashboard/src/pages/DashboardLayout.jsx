import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';

function DashboardLayout() {
  const location = useLocation();

  const getPageTitle = () => {
    const currentPath = location.pathname;
    
    // Mapeo de rutas a títulos más específico
    const titleMap = {
      '/admin': 'Dashboard Principal',
      '/admin/products': 'Gestión de Productos',
      '/admin/orders': 'Gestión de Pedidos',
      '/admin/promotions': 'Promociones',
      '/admin/sales-reports': 'Reportes de Ventas',
      '/admin/product-analytics': 'Análisis de Productos',
      '/admin/geographic-sales': 'Ventas Geográficas',
      '/admin/inventory': 'Gestión de Inventario',
      '/admin/settings': 'Configuración',
      '/admin/reports': 'Reportes'
    };

    // Títulos especiales para formularios
    if (currentPath.endsWith('/new')) {
      if (currentPath.includes('/products/')) return 'Nuevo Producto';
      return 'Nuevo Elemento';
    }
    
    if (currentPath.includes('/edit/')) {
      if (currentPath.includes('/products/')) return 'Editar Producto';
      return 'Editar Elemento';
    }

    // Buscar título exacto o por inicio de ruta
    return titleMap[currentPath] || 
           Object.keys(titleMap).find(path => currentPath.startsWith(path) && path !== '/admin') 
           ? titleMap[Object.keys(titleMap).find(path => currentPath.startsWith(path) && path !== '/admin')] 
           : 'Administración';
  };

  return (
    <div className="fixed inset-0 bg-gray-100 font-sans flex">
      {/* Sidebar - Ahora usando el componente separado */}
      <Sidebar />
      
      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header del Contenido */}
        <header className="bg-white shadow-sm p-4 sticky top-0 z-10 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-(--primary-color)">{getPageTitle()}</h1>
        </header>

        {/* Área de Contenido Desplazable */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-gray-100">
          <Outlet /> {/* Aquí se renderizarán tus páginas */}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;