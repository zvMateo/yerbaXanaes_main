import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
// Asegúrate de tener instalados los iconos: npm install @heroicons/react
import { CubeIcon, PowerIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Productos', path: '/admin/products', icon: CubeIcon },
     { name: 'Pedidos', path: '/admin/orders', icon: ShoppingCartIcon }, // Ejemplo futuro
    // Añade más items aquí cuando tengas más secciones
  ];

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const currentNavItem = navItems.find(item => currentPath.startsWith(item.path));

    if (currentNavItem) {
      if (currentPath.endsWith('/new')) return `Nuevo ${currentNavItem.name.slice(0, -1)}`;
      if (currentPath.includes('/edit/')) return `Editar ${currentNavItem.name.slice(0, -1)}`;
      return currentNavItem.name;
    }
    if (currentPath === '/admin' || currentPath === '/admin/') return 'Dashboard Principal'; // Título para la raíz del admin
    return 'Administración'; // Título por defecto más genérico
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans"> {/* Fondo general claro como la inspiración */}
      {/* Sidebar */}
      <aside className="w-64 bg-(--dark-color) text-gray-300 p-4 flex flex-col shadow-lg">
        <div className="p-3 mb-5 text-center">
          <Link to="/admin" className="text-2xl font-bold text-white hover:text-gray-100 transition-colors duration-150">
            YerbaXanaes
          </Link>
        </div>
        <nav className="flex-grow space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-2.5 rounded-md transition-colors duration-150 group
                  ${isActive
                    ? 'bg-(--accent-color) text-white font-semibold shadow-sm' // Estilo activo con naranja
                    : 'text-gray-300 hover:bg-(--secondary-color) hover:text-white' // Hover con verde oliva
                  }`}
              >
                {item.icon && (
                  <item.icon
                    className={`h-5 w-5 mr-3 transition-colors duration-150 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                    }`}
                  />
                )}
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-700"> {/* Línea divisora sutil */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-(--accent-color) hover:opacity-90 text-white font-medium py-2.5 px-4 rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-(--accent-color) focus:ring-opacity-70 group"
          >
            <PowerIcon className="h-5 w-5 mr-2 text-white" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header del Contenido */}
        <header className="bg-white shadow-sm p-4 sticky top-0 z-10 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-(--primary-color)">{getPageTitle()}</h1>
        </header>

        {/* Área de Contenido Desplazable */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-gray-100">
          <Outlet /> {/* Aquí se renderizarán tus páginas como ProductListPage */}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;