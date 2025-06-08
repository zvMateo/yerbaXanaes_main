import React, { useState, useEffect } from 'react';
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
  Download
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

// ✅ DATOS MEJORADOS CON MÁS DETALLE
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
  { name: 'Yerba Mate Premium 1kg', sold: 45, revenue: 67500, stock: 12, category: 'Yerbas' },
  { name: 'Mate Calabaza Tradicional', sold: 32, revenue: 48000, stock: 8, category: 'Mates' },
  { name: 'Yerba Suave 500g', sold: 28, revenue: 33600, stock: 25, category: 'Yerbas' },
  { name: 'Mate Acero Inoxidable', sold: 22, revenue: 44000, stock: 3, category: 'Mates' },
  { name: 'Yuyo Mix Digestivo', sold: 18, revenue: 27000, stock: 15, category: 'Yuyos' },
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
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    productsCount: 0,
    lowStockAlerts: 0,
    activePromotions: 0
  });

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setDashboardData({
        totalSales: 125430,
        totalOrders: 284,
        averageOrderValue: 441.65,
        productsCount: 156,
        lowStockAlerts: 12,
        activePromotions: 5
      });
      setIsLoading(false);
    }, 1000);
  }, [timeFilter]);

  // ✅ COMPONENTE STATCARD MEJORADO
  const StatCard = ({ title, value, icon, change, color = "blue", isCurrency = false, suffix = "" }) => {
    const Icon = icon;
    
    // ✅ COLORES MEJORADOS CON TU TEMA
    const colorClasses = {
      green: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', iconBg: 'bg-emerald-100' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', iconBg: 'bg-blue-100' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', iconBg: 'bg-purple-100' },
      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', icon: 'text-indigo-600', iconBg: 'bg-indigo-100' },
      red: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', iconBg: 'bg-red-100' },
      yellow: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', iconBg: 'bg-amber-100' },
    };

    const colors = colorClasses[color] || colorClasses.blue;
    
    return (
      <div className={`${colors.bg} rounded-xl shadow-sm p-6 border ${colors.border} hover:shadow-lg transition-all duration-200`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {isCurrency ? '$' : ''}{value.toLocaleString('es-AR')}{suffix}
            </p>
            {change !== undefined && (
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                change >= 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <TrendingUp className={`h-3 w-3 mr-1 ${change < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(change)}%
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colors.iconBg}`}>
            <Icon className={`h-6 w-6 ${colors.icon}`} />
          </div>
        </div>
      </div>
    );
  };

  // ✅ FUNCIONES ÚTILES AGREGADAS
  const exportData = () => {
    console.log('Exportando datos...');
    const data = { salesData, topProducts, geographicData, dashboardData };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

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
        <div>
          <div className="text-sm font-medium text-gray-900">{product.name}</div>
          <div className="text-sm text-gray-500">{product.category}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center">
          <Package className="h-4 w-4 text-gray-400 mr-2" />
          {product.sold} unidades
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
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center space-x-2">
          <Link
            to={`/admin/products/${product.id}`}
            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100 transition-colors duration-150"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            to={`/admin/products/${product.id}/edit`}
            className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100 transition-colors duration-150"
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
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        
        {/* Charts skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ✅ HEADER MEJORADO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Yerba Xanaes</h1>
          <p className="text-gray-600 mt-1">
            Resumen general de tu negocio • {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: es })}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1d">Hoy</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 3 meses</option>
            <option value="1y">Este año</option>
          </select>
          <button 
            onClick={refreshData}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150"
            title="Actualizar datos"
          >
            <RefreshCw className="h-4 w-4 text-gray-600" />
          </button>
          <button 
            onClick={exportData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* ✅ KPI CARDS MEJORADAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
        />
        <StatCard
          title="Promociones Activas"
          value={dashboardData.activePromotions}
          icon={Percent}
          color="yellow"
        />
      </div>

      {/* ✅ CHARTS SECTION MEJORADA */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sales Trend - Más grande */}
        <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tendencia de Ventas</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Ventas</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Pedidos</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'dd/MM', { locale: es })}
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelFormatter={(date) => format(new Date(date), 'dd MMMM yyyy', { locale: es })}
                formatter={(value, name) => [
                  name === 'ventas' ? `$${value.toLocaleString('es-AR')}` : `${value} pedidos`,
                  name === 'ventas' ? 'Ventas' : 'Pedidos'
                ]}
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
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Geographic Sales mejorado */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Ventas por Región</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={geographicData}
                cx="50%"
                cy="50%"
                outerRadius={80}
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
          
          {/* ✅ Leyenda personalizada */}
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
      </div>

      {/* ✅ PRODUCTS AND ALERTS SECTION MEJORADA */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Top Products - Ahora más ancho */}
        <div className="xl:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h3>
              <Link 
                to="/admin/products"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ver todos
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

        {/* Low Stock Alerts - Más compacto */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Alertas de Stock</h3>
              <Link 
                to="/admin/inventory"
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Ver inventario
              </Link>
            </div>
          </div>
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {[
              { id: 1, name: 'Yerba Mate Premium 1kg', stock: 3, unit: 'kg' },
              { id: 2, name: 'Mate Acero Inoxidable', stock: 2, unit: 'unidades' },
              { id: 3, name: 'Yuyo Digestivo', stock: 1, unit: 'kg' },
              { id: 4, name: 'Mate Calabaza Chico', stock: 4, unit: 'unidades' },
              { id: 5, name: 'Yerba Suave Sin Palo', stock: 2, unit: 'kg' },
            ].map((product) => (
              <LowStockAlert key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;