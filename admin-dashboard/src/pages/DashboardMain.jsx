import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  TrendingUp, 
  Package, 
  AlertTriangle,
  DollarSign,
  MapPin,
  Eye,
  Edit,
  Percent
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

// Datos de ejemplo - estos vendrán de tu API más adelante
const salesData = [
  { date: '2024-01-01', ventas: 4000, pedidos: 12 },
  { date: '2024-01-02', ventas: 3000, pedidos: 8 },
  { date: '2024-01-03', ventas: 5000, pedidos: 15 },
  { date: '2024-01-04', ventas: 2780, pedidos: 9 },
  { date: '2024-01-05', ventas: 1890, pedidos: 6 },
  { date: '2024-01-06', ventas: 2390, pedidos: 11 },
  { date: '2024-01-07', ventas: 3490, pedidos: 14 },
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

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

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

// ...existing code...

const StatCard = ({ title, value, icon, change, color = "blue", isCurrency = false, suffix = "" }) => {
  const Icon = icon;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: `var(--${color}-500, #3B82F6)` }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {isCurrency ? '$' : ''}{value.toLocaleString()}{suffix}
          </p>
          {change && (
            <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${change < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(change)}% vs período anterior
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );
};

// ...existing code....

  const LowStockAlert = ({ product }) => (
    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg mb-2">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
        <div>
          <p className="text-sm font-medium text-red-900">{product.name}</p>
          <p className="text-xs text-red-600">
            Stock actual: {product.stock} {product.unit}
          </p>
        </div>
      </div>
      <button className="text-red-600 hover:text-red-800">
        <Edit className="h-4 w-4" />
      </button>
    </div>
  );

  const ProductRow = ({ product, index }) => (
    <tr className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{product.name}</div>
          <div className="text-sm text-gray-500">{product.category}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {product.sold} unidades
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${product.revenue.toLocaleString()}
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
        <button className="text-blue-600 hover:text-blue-800 mr-2">
          <Eye className="h-4 w-4" />
        </button>
        <button className="text-green-600 hover:text-green-800">
          <Edit className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Yerba Xanaes</h1>
          <p className="text-gray-600">Resumen general de tu negocio</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1d">Hoy</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="1y">Este año</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Ventas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'dd/MM', { locale: es })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => format(new Date(date), 'dd MMMM yyyy', { locale: es })}
                formatter={(value, name) => [
                  name === 'ventas' ? `$${value.toLocaleString()}` : value,
                  name === 'ventas' ? 'Ventas' : 'Pedidos'
                ]}
              />
              <Area type="monotone" dataKey="ventas" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Geographic Sales */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Región</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={geographicData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="pedidos"
                label={({ region, percentage }) => `${region} ${percentage}%`}
              >
                {geographicData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Products and Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h3>
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
              <tbody>
                {topProducts.map((product, index) => (
                  <ProductRow key={index} product={product} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Alertas de Stock Bajo</h3>
          </div>
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
            {[
              { name: 'Yerba Mate Premium 1kg', stock: 3, unit: 'kg' },
              { name: 'Mate Acero Inoxidable', stock: 2, unit: 'unidades' },
              { name: 'Yuyo Digestivo', stock: 1, unit: 'kg' },
              { name: 'Mate Calabaza Chico', stock: 4, unit: 'unidades' },
            ].map((product, index) => (
              <LowStockAlert key={index} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;