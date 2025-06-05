import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import { 
  Home, 
  Package, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  Percent,
  TrendingUp,
  MapPin,
  AlertTriangle,
  FileText,
  PowerIcon,
  ChevronDown,
  User,
  Edit3
} from 'lucide-react';
import { CubeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    {
      category: 'Principal',
      items: [
        { name: 'Dashboard', path: '/admin', icon: Home },
        { name: 'Productos', path: '/admin/products', icon: CubeIcon },
      ]
    },
    {
      category: 'Ventas',
      items: [
        { name: 'Pedidos', path: '/admin/orders', icon: ShoppingBag },
        { name: 'Promociones', path: '/admin/promotions', icon: Percent },
      ]
    },
    {
      category: 'Análisis',
      items: [
        { name: 'Ventas', path: '/admin/sales-reports', icon: BarChart3 },
        { name: 'Productos', path: '/admin/product-analytics', icon: TrendingUp },
        { name: 'Geografía', path: '/admin/geographic-sales', icon: MapPin },
        { name: 'Inventario', path: '/admin/inventory', icon: AlertTriangle },
      ]
    },
    {
      category: 'Sistema',
      items: [
        { name: 'Configuración', path: '/admin/settings', icon: Settings },
        { name: 'Reportes', path: '/admin/reports', icon: FileText },
      ]
    }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };


return (
  <aside className="w-64 bg-(--dark-color) text-gray-300 flex flex-col shadow-lg h-full">
    {/* Header Compacto */}
    <div className="p-3 border-b border-gray-700">
      <Link to="/admin" className="text-xl font-bold text-white hover:text-gray-100 transition-colors duration-150 block text-center mb-4">
        YerbaXanaes
      </Link>
      
      {/* Menú de Perfil Compacto */}
      <div className="relative" ref={profileMenuRef}>
        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="w-full flex items-center p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-(--accent-color)"
        >
          {/* Foto más pequeña */}
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-(--accent-color) to-(--secondary-color) flex items-center justify-center flex-shrink-0">
            {!imageError ? (
              <img 
                src="/images/logoYerbaXanaes.png"
                alt="Yerba Xanaes Logo" 
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-(--accent-color) to-(--secondary-color) flex items-center justify-center text-white font-bold text-sm">
                YX
              </div>
            )}
          </div>
          
          {/* Info compacta */}
          <div className="ml-3 flex-1 text-left">
            <p className="text-sm font-medium text-white">Yerba Xanaes</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
          
          {/* Flecha pequeña */}
          <ChevronDown 
            className={`h-4 w-4 text-gray-400 transition-transform duration-150 ${
              isProfileMenuOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Menú Desplegable */}
        {isProfileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="py-2">
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  navigate('/admin/profile');
                }}
                className="w-full flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
              >
                <User className="h-4 w-4 mr-3" />
                Ver Perfil
              </button>
              
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  navigate('/admin/settings');
                }}
                className="w-full flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
              >
                <Edit3 className="h-4 w-4 mr-3" />
                Editar Perfil
              </button>
              
              <div className="border-t border-gray-700 my-2"></div>
              
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-900 hover:text-red-300 transition-colors duration-150"
              >
                <PowerIcon className="h-4 w-4 mr-3" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    
    {/* Navegación con Más Espaciado */}
    <nav className="flex-1 p-3">
      <div className="space-y-1">
        {menuItems.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h3 className="text-xs uppercase text-gray-400 font-semibold tracking-wider px-2 mb-3 py-1">
              {category.category}
            </h3>
            <ul className="space-y-1">
              {category.items.map((item, itemIndex) => {
                const isItemActive = isActive(item.path);
                return (
                  <li key={itemIndex}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-150 group text-sm font-medium
                        ${isItemActive
                          ? 'bg-(--accent-color) text-white font-semibold shadow-sm'
                          : 'text-gray-300 hover:bg-(--secondary-color) hover:text-white'
                        }`}
                    >
                      {item.icon && (
                        <item.icon
                          className={`h-5 w-5 mr-3 transition-colors duration-150 ${
                            isItemActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                          }`}
                        />
                      )}
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  </aside>
);
};

export default Sidebar;