import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Calendar,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Package,
  Clock,
  Target,
  Percent,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { toast } from 'react-toastify';
import * as salesService from '../services/salesService';

const SalesReportsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [salesData, setSalesData] = useState(null);
  
  const [showFilters, setShowFilters] = useState(false);

  const loadSalesData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await salesService.getSalesData(dateRange);
      setSalesData(data);
    } catch (error) {
      console.error('Error al cargar datos de ventas:', error);
      toast.error('Error al cargar datos de ventas. Intenta de nuevo más tarde.');
      setSalesData(null); // Asegurarse de que salesData sea null en caso de error
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadSalesData();
  }, [loadSalesData]);

  const handleRefresh = useCallback(() => {
    loadSalesData();
  }, [loadSalesData]);





  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const dateRangeOptions = [
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' },
    { value: '90d', label: 'Últimos 3 meses' },
    { value: '1y', label: 'Último año' }
  ];

  const KPICard = ({ title, value, change, format = 'currency' }) => {
    const isPositive = change >= 0;
    const formattedValue = format === 'currency' ? formatCurrency(value) : 
                          format === 'percentage' ? `${value}%` : 
                          value.toLocaleString();

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{formattedValue}</p>
          </div>
          <div className={`p-3 rounded-full ${
            isPositive ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <Icon className={`h-6 w-6 ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`} />
          </div>
        </div>
        <div className="flex items-center mt-4">
          {isPositive ? (
            <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
          )}
          <span className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatPercentage(change)}
          </span>
          <span className="text-sm text-gray-500 ml-2">vs período anterior</span>
        </div>
      </div>
    );
  };

  const ChartCard = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!salesData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-lg text-red-600 font-semibold mb-4">Error al cargar los datos de ventas.</p>
          <p className="text-gray-600">Por favor, intenta recargar la página o verifica tu conexión.</p>
          <button
            onClick={handleRefresh}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="inline-block w-4 h-4 mr-2" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Análisis de Ventas</h1>
              <p className="mt-2 text-gray-600">
                Monitor del rendimiento y tendencias de ventas en tiempo real
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center space-x-3">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {dateRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  title="Filtros avanzados"
                >
                  <Filter className="h-5 w-5" />
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  title="Actualizar datos"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
                
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Ingresos Totales"
            value={salesData.overview.totalRevenue}
            change={salesData.overview.growthRate}
            icon={DollarSign}
            format="currency"
          />
          <KPICard
            title="Pedidos Totales"
            value={salesData.overview.totalOrders}
            change={8.3}
            icon={ShoppingBag}
            format="number"
          />
          <KPICard
            title="Valor Promedio del Pedido"
            value={salesData.overview.averageOrderValue}
            change={4.7}
            icon={TrendingUp}
            format="currency"
          />
          <KPICard
            title="Clientes Únicos"
            value={salesData.overview.totalCustomers}
            change={15.2}
            icon={Users}
            format="number"
          />
        </div>

        {/* Gráficos Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Tendencia de Ingresos */}
          <ChartCard title="Tendencia de Ingresos">
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600">Gráfico de tendencia de ingresos</p>
                <p className="text-xs text-gray-500 mt-1">
                  Integración con biblioteca de gráficos pendiente
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(salesData.trends.revenue.reduce((a, b) => a + b.value, 0))}
                </p>
                <p className="text-sm text-gray-600">Total período</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">+12.5%</p>
                <p className="text-sm text-gray-600">Crecimiento</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(salesData.trends.revenue.reduce((a, b) => a + b.value, 0) / salesData.trends.revenue.length)}
                </p>
                <p className="text-sm text-gray-600">Promedio diario</p>
              </div>
            </div>
          </ChartCard>

          {/* Distribución por Categorías */}
          <ChartCard title="Ventas por Categoría">
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600">Distribución por categorías</p>
                <p className="text-xs text-gray-500 mt-1">
                  Gráfico circular interactivo pendiente
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {salesData.salesByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(category.revenue)}</p>
                    <p className="text-xs text-gray-500">{category.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Tablas de Datos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Productos */}
          <ChartCard title="Productos Más Vendidos">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                      Producto
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                      Ventas
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                      Ingresos
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                      Tendencia
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {salesData.topProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <Package className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                              {product.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-sm font-medium text-gray-900">{product.sales}</span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(product.revenue)}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end">
                          {product.growth >= 0 ? (
                            <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
                          )}
                          <span className={`text-sm font-medium ${
                            product.growth >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPercentage(product.growth)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>

          {/* Ventas por Región */}
          <ChartCard title="Ventas por Región">
            <div className="space-y-4">
              {salesData.salesByRegion.map((region, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{region.region}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(region.revenue)}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({region.sales} pedidos)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${region.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{region.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Métricas Adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Métodos de Pago */}
          <ChartCard title="Métodos de Pago">
            <div className="space-y-3">
              {salesData.paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">{method.method}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">{method.count}</span>
                    <span className="text-xs text-gray-500 ml-1">({method.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Métricas de Conversión */}
          <ChartCard title="Métricas de Conversión">
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{salesData.overview.conversionRate}%</p>
                <p className="text-sm text-gray-600">Tasa de Conversión</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">2.8 días</p>
                  <p className="text-xs text-gray-500">Tiempo promedio de compra</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">4.2</p>
                  <p className="text-xs text-gray-500">Productos por pedido</p>
                </div>
              </div>
            </div>
          </ChartCard>

          {/* Resumen Tiempo Real */}
          <ChartCard title="Actividad en Tiempo Real">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Ventas Hoy</span>
                </div>
                <span className="text-sm font-bold text-green-600">18 pedidos</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Última venta:</span>
                  <span className="font-medium">hace 5 min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Visitantes activos:</span>
                  <span className="font-medium">12 usuarios</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Carros abandonados:</span>
                  <span className="font-medium text-yellow-600">7 carros</span>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default SalesReportsPage;
