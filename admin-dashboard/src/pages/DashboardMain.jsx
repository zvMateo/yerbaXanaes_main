import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  TrendingUp, 
  Package, 
  AlertTriangle,
  DollarSign,
  MapPin,
  Eye,
  Edit,
  Percent,
  RefreshCw,
  Download,
  Bell,
  X,
  Clock,
  Users
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// ✅ DATOS OPTIMIZADOS CON MÁS REALISMO
const salesData = [
  { date: '2024-06-01', ventas: 24750, pedidos: 8, nuevosClientes: 3 },
  { date: '2024-06-02', ventas: 18200, pedidos: 6, nuevosClientes: 1 },
  { date: '2024-06-03', ventas: 32100, pedidos: 12, nuevosClientes: 4 },
  { date: '2024-06-04', ventas: 28500, pedidos: 9, nuevosClientes: 2 },
  { date: '2024-06-05', ventas: 41300, pedidos: 15, nuevosClientes: 6 },
  { date: '2024-06-06', ventas: 35800, pedidos: 11, nuevosClientes: 3 },
  { date: '2024-06-07', ventas: 29600, pedidos: 10, nuevosClientes: 2 },
];

const topProducts = [
  { name: 'Yerba Mate Premium 1kg', sold: 45, revenue: 67500, stock: 12, category: 'Yerbas', trend: '+12%' },
  { name: 'Mate Calabaza Tradicional', sold: 32, revenue: 48000, stock: 8, category: 'Mates', trend: '+8%' },
  { name: 'Yerba Suave 500g', sold: 28, revenue: 33600, stock: 25, category: 'Yerbas', trend: '+5%' },
  { name: 'Mate Acero Inoxidable', sold: 22, revenue: 44000, stock: 3, category: 'Mates', trend: '+15%' },
  { name: 'Yuyo Mix Digestivo', sold: 18, revenue: 27000, stock: 15, category: 'Yuyos', trend: '+3%' },
];

const geographicData = [
  { region: 'Buenos Aires', pedidos: 45, percentage: 35 },
  { region: 'Córdoba', pedidos: 28, percentage: 22 },
  { region: 'Santa Fe', pedidos: 20, percentage: 16 },
  { region: 'Mendoza', pedidos: 15, percentage: 12 },
  { region: 'Otros', pedidos: 19, percentage: 15 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const DashboardMain = () => {
  const [timeFilter, setTimeFilter] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [_refreshKey, setRefreshKey] = useState(0);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    productsCount: 0,
    lowStockAlerts: 0,
    activePromotions: 0,
    newCustomers: 0,
    conversionRate: 0,
    pendingOrders: 0
  });

  // ✅ CÁLCULOS OPTIMIZADOS CON useMemo
  const calculatedData = useMemo(() => {
    const totalSales = salesData.reduce((sum, day) => sum + day.ventas, 0);
    const totalOrders = salesData.reduce((sum, day) => sum + day.pedidos, 0);
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const newCustomers = salesData.reduce((sum, day) => sum + day.nuevosClientes, 0);
    const lowStockAlerts = topProducts.filter(p => p.stock < 10).length;
    
    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      newCustomers,
      lowStockAlerts,
      activePromotions: 3,
      productsCount: 127,
      conversionRate: 3.2,
      pendingOrders: 5
    };
  }, []);

  // ✅ FUNCIÓN DE REFRESH OPTIMIZADA
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
    
    setTimeout(() => {
      setDashboardData(calculatedData);
      setIsLoading(false);
    }, 1000);
  }, [calculatedData]);

  // ✅ CARGAR DATOS INICIAL
  useEffect(() => {
    const timer = setTimeout(() => {
      setDashboardData(calculatedData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeFilter, calculatedData]);

  // ✅ COMPONENTE STATCARD MEJORADO
  const StatCard = ({ title, value, icon, change, color = "blue", isCurrency = false, urgent = false }) => {
    const Icon = icon;
    
    const colorClasses = {
      green: { 
        bg: 'bg-emerald-50', 
        border: 'border-emerald-200', 
        icon: 'text-emerald-600', 
        iconBg: 'bg-emerald-100',
        text: 'text-emerald-800'
      },
      blue: { 
        bg: 'bg-blue-50', 
        border: 'border-blue-200', 
        icon: 'text-blue-600', 
        iconBg: 'bg-blue-100',
        text: 'text-blue-800'
      },
      red: { 
        bg: urgent ? 'bg-red-100' : 'bg-red-50', 
        border: urgent ? 'border-red-300' : 'border-red-200', 
        icon: 'text-red-600', 
        iconBg: 'bg-red-100',
        text: 'text-red-800'
      },
      purple: { 
        bg: 'bg-purple-50', 
        border: 'border-purple-200', 
        icon: 'text-purple-600', 
        iconBg: 'bg-purple-100',
        text: 'text-purple-800'
      },
      yellow: { 
        bg: 'bg-yellow-50', 
        border: 'border-yellow-200', 
        icon: 'text-yellow-600', 
        iconBg: 'bg-yellow-100',
        text: 'text-yellow-800'
      },
      indigo: { 
        bg: 'bg-indigo-50', 
        border: 'border-indigo-200', 
        icon: 'text-indigo-600', 
        iconBg: 'bg-indigo-100',
        text: 'text-indigo-800'
      }
    };

    const classes = colorClasses[color] || colorClasses.blue;
    
    const formatValue = (val) => {
      if (isCurrency) {
        return new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS',
          maximumFractionDigits: 0
        }).format(val);
      }
      return val.toLocaleString('es-AR');
    };

    return (
      <div className={`${classes.bg} border-2 ${classes.border} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 ${urgent ? 'animate-pulse' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${urgent ? 'text-red-700' : classes.text}`}>
              {formatValue(value)}
            </p>
            
            {change !== undefined && (
              <div className="flex items-center mt-2">
                <TrendingUp className={`h-4 w-4 mr-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change >= 0 ? '+' : ''}{change}% vs anterior
                </span>
              </div>
            )}
          </div>
          
          <div className={`${classes.iconBg} rounded-full p-3 ${urgent ? 'animate-bounce' : ''}`}>
            <Icon className={`h-6 w-6 ${classes.icon}`} />
          </div>
        </div>
        
        {urgent && (
          <div className="mt-3 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md">
            ⚠️ Requiere atención inmediata
          </div>
        )}
      </div>
    );
  };

  // ✅ COMPONENTE DE ALERTAS RÁPIDAS
  const QuickAlerts = () => {
    const alerts = [
      { 
        id: 'stock-mate-acero',
        type: 'stock', 
        message: 'Mate Acero tiene stock bajo (3 unidades)', 
        urgent: true,
        action: () => console.log('Navigate to product')
      },
      { 
        id: 'pending-orders',
        type: 'order', 
        message: '2 pedidos pendientes de más de 24h', 
        urgent: true,
        action: () => console.log('Navigate to orders')
      },
      { 
        id: 'promo-expiring',
        type: 'promo', 
        message: 'Promoción "VERANO2024" expira en 3 días', 
        urgent: false,
        action: () => console.log('Navigate to promotions')
      }
    ].filter(alert => !dismissedAlerts.has(alert.id));

    const dismissAlert = (alertId) => {
      setDismissedAlerts(prev => new Set([...prev, alertId]));
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Alertas Rápidas</h3>
          <div className="flex items-center space-x-1">
            <Bell className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">{alerts.length} pendientes</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-500">No hay alertas pendientes</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.urgent 
                    ? 'bg-red-50 border-red-400 text-red-800' 
                    : 'bg-yellow-50 border-yellow-400 text-yellow-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={alert.action}
                        className="text-xs px-2 py-1 bg-white rounded border hover:bg-gray-50"
                      >
                        Ver detalles
                      </button>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800"
                      >
                        Descartar
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600 ml-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <Link 
          to="/admin/alerts" 
          className="block text-center text-sm text-blue-600 hover:text-blue-800 mt-4 font-medium"
        >
          Ver todas las alertas →
        </Link>
      </div>
    );
  };

  // ✅ FUNCIÓN DE EXPORTAR DATOS
  const exportData = useCallback(() => {
    const data = { 
      salesData, 
      topProducts, 
      geographicData, 
      dashboardData,
      timestamp: new Date().toISOString(),
      timeFilter
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-yerba-xanaes-${format(new Date(), 'yyyy-MM-dd-HHmm')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [dashboardData, timeFilter]);

  // ✅ COMPONENTES AUXILIARES OPTIMIZADOS
  const LowStockAlert = ({ product }) => (
    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-150">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-red-900">{product.name}</p>
          <p className="text-xs text-red-600">
            Stock actual: {product.stock} {product.unit}
          </p>
        </div>
      </div>
      <Link
        to={`/admin/products/${product.id}`}
        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-200 transition-colors duration-150"
      >
        <Edit className="h-4 w-4" />
      </Link>
    </div>
  );

  const ProductRow = ({ product, index }) => (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500">{product.category}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center">
          <Package className="h-4 w-4 text-gray-400 mr-2" />
          <span>{product.sold} unidades</span>
          <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
            product.trend.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.trend}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
        ${product.revenue.toLocaleString('es-AR')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          product.stock <= 5 ? 'bg-red-100 text-red-800' : 
          product.stock <= 10 ? 'bg-yellow-100 text-yellow-800' : 
          'bg-green-100 text-green-800'
        }`}>
          Stock: {product.stock}
          {product.stock <= 5 && <AlertTriangle className="h-3 w-3 ml-1" />}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center space-x-2">
          <Link
            to={`/admin/products/${product.id}`}
            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100 transition-colors duration-150"
            title="Ver producto"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            to={`/admin/products/${product.id}/edit`}
            className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100 transition-colors duration-150"
            title="Editar producto"
          >
            <Edit className="h-4 w-4" />
          </Link>
        </div>
      </td>
    </tr>
  );

  // ✅ LOADING SKELETON MEJORADO
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="flex space-x-3">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-10"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        
        {/* Charts skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* ✅ HEADER MEJORADO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Yerba Xanaes</h1>
          <p className="text-gray-600 mt-1">
            Resumen de tu ecommerce - {format(new Date(), 'dd MMMM yyyy', { locale: es })}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1d">Hoy</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="1y">Este año</option>
          </select>
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors"
            title="Actualizar datos"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualizando...' : 'Actualizar'}
          </button>
          
          <button 
            onClick={exportData}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
            title="Exportar datos"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* ✅ GRID DE KPIs MEJORADO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title="Ventas Totales"
          value={dashboardData.totalSales}
          icon={DollarSign}
          change={12.5}
          color="green"
          isCurrency
        />
        <StatCard
          title="Pedidos"
          value={dashboardData.totalOrders}
          icon={ShoppingBag}
          change={8.2}
          color="blue"
        />
        <StatCard
          title="Ticket Promedio"
          value={dashboardData.averageOrderValue}
          icon={TrendingUp}
          change={-2.1}
          color="purple"
          isCurrency
        />
        <StatCard
          title="Productos"
          value={dashboardData.productsCount}
          icon={Package}
          change={5.4}
          color="indigo"
        />
        <StatCard
          title="Stock Bajo"
          value={dashboardData.lowStockAlerts}
          icon={AlertTriangle}
          color="red"
          urgent={dashboardData.lowStockAlerts > 3}
        />
        <StatCard
          title="Promociones Activas"
          value={dashboardData.activePromotions}
          icon={Percent}
          color="yellow"
        />
      </div>

      {/* ✅ GRID PRINCIPAL MEJORADO */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Gráfico de ventas - Más espacio */}
        <div className="xl:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tendencia de Ventas</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Período: {timeFilter}</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Ventas</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Pedidos</span>
                </div>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => format(new Date(value), 'dd/MM')}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'ventas' ? `$${value.toLocaleString('es-AR')}` : value,
                  name === 'ventas' ? 'Ventas' : 'Pedidos'
                ]}
                labelFormatter={(value) => format(new Date(value), 'dd MMMM yyyy', { locale: es })}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="ventas" 
                stroke="#3B82F6" 
                fill="url(#colorVentas)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="pedidos" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Panel de alertas */}
        <div className="xl:col-span-1">
          <QuickAlerts />
        </div>
      </div>

      {/* ✅ SECCIÓN INFERIOR MEJORADA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top productos mejorado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h3>
              <Link 
                to="/admin/products" 
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Ver todos →
              </Link>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendidos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingresos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.map((product, index) => (
                  <ProductRow key={index} product={product} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gráfico geográfico y acciones rápidas */}
        <div className="space-y-6">
          {/* Ventas por región */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Ventas por Región</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={geographicData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="pedidos"
                  label={({ percentage }) => `${percentage}%`}
                >
                  {geographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [`${value} pedidos`, props.payload.region]}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {geographicData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-gray-700">{entry.region}</span>
                  </div>
                  <span className="font-medium text-gray-900">{entry.pedidos}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/admin/products/new"
                className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
              >
                <Package className="h-6 w-6 text-gray-400 group-hover:text-blue-500 mb-2" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  Nuevo Producto
                </span>
              </Link>
              
              <Link
                to="/admin/orders/new"
                className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 group"
              >
                <ShoppingBag className="h-6 w-6 text-gray-400 group-hover:text-green-500 mb-2" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">
                  Nueva Venta
                </span>
              </Link>
              
              <Link
                to="/admin/promotions/new"
                className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group"
              >
                <Percent className="h-6 w-6 text-gray-400 group-hover:text-purple-500 mb-2" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">
                  Nueva Promoción
                </span>
              </Link>
              
              <Link
                to="/admin/reports"
                className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 group"
              >
                <TrendingUp className="h-6 w-6 text-gray-400 group-hover:text-orange-500 mb-2" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                  Ver Reportes
                </span>
              </Link>
            </div>
            
            {/* Estadísticas adicionales */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-gray-900">{dashboardData.newCustomers}</p>
                  <p className="text-xs text-gray-600">Nuevos Clientes</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{dashboardData.conversionRate}%</p>
                  <p className="text-xs text-gray-600">Conversión</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">95%</p>
                  <p className="text-xs text-gray-600">Satisfacción</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ ALERTAS DE STOCK BAJO */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Alertas de Stock Bajo</h3>
            <Link 
              to="/admin/inventory"
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Ver inventario completo →
            </Link>
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { id: 1, name: 'Yerba Mate Premium 1kg', stock: 3, unit: 'kg' },
            { id: 2, name: 'Mate Acero Inoxidable', stock: 2, unit: 'unidades' },
            { id: 3, name: 'Yuyo Digestivo', stock: 1, unit: 'kg' },
            { id: 4, name: 'Mate Calabaza Chico', stock: 4, unit: 'unidades' },
            { id: 5, name: 'Yerba Suave Sin Palo', stock: 2, unit: 'kg' },
            { id: 6, name: 'Bombilla Alpaca', stock: 3, unit: 'unidades' },
          ].map((product) => (
            <LowStockAlert key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;