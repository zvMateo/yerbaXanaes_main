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
  Edit3,
  Users,
  UserCheck
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
      category: 'Clientes',
      items: [
        { name: 'Lista de Clientes', path: '/admin/customers', icon: Users },
        { name: 'Analytics Clientes', path: '/admin/customers/analytics', icon: UserCheck },
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
    <aside className="w-64 bg-(--dark-color) text-gray-300 flex flex-col shadow-xl h-full border-r border-gray-800">
      {/* ✅ Header más compacto */}
      <div className="p-4 border-b border-gray-700">
        <Link 
          to="/admin" 
          className="text-xl font-bold text-white hover:text-gray-100 transition-colors duration-150 block text-center mb-4"
        >
          YerbaXanaes
        </Link>
        
        {/* ✅ Menú de Perfil más elegante */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-full flex items-center p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-(--accent-color)/50 backdrop-blur-sm border border-gray-700/50"
          >
            {/* ✅ Foto más pequeña */}
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-(--accent-color) to-(--secondary-color) flex items-center justify-center flex-shrink-0 ring-2 ring-gray-600/50">
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
            
            {/* ✅ Info más elegante */}
            <div className="ml-3 flex-1 text-left">
              <p className="text-sm font-medium text-white">Yerba Xanaes</p>
              <p className="text-xs text-gray-400">Administrador</p>
            </div>
            
            {/* ✅ Flecha más sutil */}
            <ChevronDown 
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                isProfileMenuOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {/* Menú Desplegable mejorado */}
          {isProfileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-sm">
              <div className="py-2">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigate('/admin/profile');
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-150"
                >
                  <User className="h-4 w-4 mr-3" />
                  Ver Perfil
                </button>
                
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigate('/admin/settings');
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-150"
                >
                  <Edit3 className="h-4 w-4 mr-3" />
                  Configuración
                </button>
                
                <div className="border-t border-gray-700 my-1"></div>
                
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all duration-150"
                >
                  <PowerIcon className="h-4 w-4 mr-3" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* ✅ Navegación optimizada */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              {/* ✅ Headers de categoría más sutiles */}
              <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wide px-3 mb-2 py-1">
                {category.category}
              </h3>
              <ul className="space-y-1 mb-4">
                {category.items.map((item, itemIndex) => {
                  const isItemActive = isActive(item.path);
                  return (
                    <li key={itemIndex}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium
                          ${isItemActive
                            ? 'bg-(--accent-color) text-white shadow-lg shadow-(--accent-color)/25'
                            : 'text-gray-300 hover:bg-(--secondary-color)/50 hover:text-white'
                          }`}
                      >
                        {item.icon && (
                          <item.icon
                            className={`h-4 w-4 mr-3 transition-colors duration-200 flex-shrink-0 ${
                              isItemActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                            }`}
                          />
                        )}
                        <span className="truncate">{item.name}</span>
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