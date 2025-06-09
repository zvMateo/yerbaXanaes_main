import React, { useState, useEffect } from 'react';
import { 
  Package,
  TrendingUp,
  TrendingDown,
  Star,
  Eye,
  ShoppingCart,
  AlertTriangle,
  DollarSign,
  Percent,
  BarChart3,
  Filter,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Calendar,
  Users,
  Activity,
  Target,
  Zap,
  Archive,
  Clock,
  CheckCircle
} from 'lucide-react';

const ProductAnalyticsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('sales');

  // Simular carga de datos
  useEffect(() => {
    const loadAnalyticsData = () => {
      setTimeout(() => {
        setAnalyticsData(getMockAnalyticsData());
        setIsLoading(false);
      }, 1000);
    };

    loadAnalyticsData();
  }, [dateRange, categoryFilter]);

  const getMockAnalyticsData = () => ({
    overview: {
      totalProducts: 156,
      activeProducts: 142,
      lowStockProducts: 8,
      outOfStockProducts: 6,
      totalViews: 25840,
      totalSales: 1847,
      conversionRate: 7.14,
      averageRating: 4.3
    },
    performance: {
      topPerformers: [
        { 
          id: 1, 
          name: 'Yerba Amanda 1kg', 
          category: 'Yerbas',
          sales: 126, 
          revenue: 189000, 
          views: 2340,
          conversionRate: 5.38,
          rating: 4.8,
          stock: 45,
          trend: 15.2
        },
        { 
          id: 2, 
          name: 'Mate Calabaza Premium', 
          category: 'Mates',
          sales: 89, 
          revenue: 223000, 
          views: 1876,
          conversionRate: 4.75,
          rating: 4.6,
          stock: 23,
          trend: 8.7
        },
        { 
          id: 3, 
          name: 'Bombilla Alpaca Artesanal', 
          category: 'Bombillas',
          sales: 67, 
          revenue: 134000, 
          views: 1654,
          conversionRate: 4.05,
          rating: 4.9,
          stock: 34,
          trend: 22.5
        },
        { 
          id: 4, 
          name: 'Termo Stanley 1L', 
          category: 'Accesorios',
          sales: 45, 
          revenue: 202500, 
          views: 1432,
          conversionRate: 3.14,
          rating: 4.7,
          stock: 18,
          trend: 31.8
        },
        { 
          id: 5, 
          name: 'Yerba Taragüi 500g', 
          category: 'Yerbas',
          sales: 134, 
          revenue: 167500, 
          views: 2890,
          conversionRate: 4.63,
          rating: 4.4,
          stock: 67,
          trend: -2.1
        }
      ],
      lowPerformers: [
        { 
          id: 6, 
          name: 'Mate Vidrio Transparente', 
          category: 'Mates',
          sales: 3, 
          revenue: 9000, 
          views: 234,
          conversionRate: 1.28,
          rating: 3.2,
          stock: 89,
          trend: -15.3
        },
        { 
          id: 7, 
          name: 'Bombilla Acero Simple', 
          category: 'Bombillas',
          sales: 5, 
          revenue: 7500, 
          views: 156,
          conversionRate: 3.21,
          rating: 3.8,
          stock: 45,
          trend: -8.7
        }
      ]
    },
    categoryAnalysis: [
      { 
        category: 'Yerbas', 
        products: 68, 
        sales: 456, 
        revenue: 684000,
        avgRating: 4.5,
        viewsToSales: 12.3,
        topProduct: 'Yerba Amanda 1kg',
        growth: 12.4
      },
      { 
        category: 'Mates', 
        products: 34, 
        sales: 234, 
        revenue: 468000,
        avgRating: 4.2,
        viewsToSales: 8.7,
        topProduct: 'Mate Calabaza Premium',
        growth: 8.9
      },
      { 
        category: 'Bombillas', 
        products: 28, 
        sales: 189, 
        revenue: 283500,
        avgRating: 4.6,
        viewsToSales: 15.2,
        topProduct: 'Bombilla Alpaca Artesanal',
        growth: 15.7
      },
      { 
        category: 'Accesorios', 
        products: 26, 
        sales: 156, 
        revenue: 468000,
        avgRating: 4.3,
        viewsToSales: 6.8,
        topProduct: 'Termo Stanley 1L',
        growth: 22.1
      }
    ],
    stockAnalysis: {
      lowStock: [
        { name: 'Yerba La Merced 1kg', category: 'Yerbas', stock: 3, minStock: 10, sales30d: 45 },
        { name: 'Mate Torpedo Cuero', category: 'Mates', stock: 2, minStock: 8, sales30d: 23 },
        { name: 'Bombilla Pico Loro', category: 'Bombillas', stock: 1, minStock: 5, sales30d: 18 },
        { name: 'Termo Lumilagro 1L', category: 'Accesorios', stock: 4, minStock: 12, sales30d: 34 }
      ],
      outOfStock: [
        { name: 'Yerba Rosamonte 500g', category: 'Yerbas', lastSold: '2025-01-05', sales30d: 67 },
        { name: 'Mate Camionero Premium', category: 'Mates', lastSold: '2025-01-04', sales30d: 12 },
        { name: 'Matero Cuero Premium', category: 'Accesorios', lastSold: '2025-01-03', sales30d: 8 }
      ]
    },
    priceAnalysis: {
      priceRanges: [
        { range: '$0 - $500', products: 23, sales: 234, percentage: 12.7 },
        { range: '$501 - $1500', products: 45, sales: 567, percentage: 30.7 },
        { range: '$1501 - $3000', products: 56, sales: 789, percentage: 42.7 },
        { range: '$3001 - $5000', products: 23, sales: 201, percentage: 10.9 },
        { range: '$5000+', products: 9, sales: 56, percentage: 3.0 }
      ],
      profitabilityTiers: [
        { tier: 'Alta Rentabilidad', products: 34, avgMargin: 45.2, revenue: 567000 },
        { tier: 'Rentabilidad Media', products: 78, avgMargin: 32.1, revenue: 834000 },
        { tier: 'Baja Rentabilidad', products: 44, avgMargin: 18.7, revenue: 234000 }
      ]
    },
    trends: {
      salesTrend: [
        { period: 'Sem 1', sales: 234, views: 4560 },
        { period: 'Sem 2', sales: 267, views: 5120 },
        { period: 'Sem 3', sales: 289, views: 5340 },
        { period: 'Sem 4', sales: 312, views: 5890 }
      ],
      seasonalTrends: [
        { season: 'Invierno', multiplier: 1.45, categories: ['Yerbas', 'Accesorios'] },
        { season: 'Primavera', multiplier: 1.12, categories: ['Mates', 'Bombillas'] },
        { season: 'Verano', multiplier: 0.87, categories: ['Yerbas'] },
        { season: 'Otoño', multiplier: 1.23, categories: ['Mates', 'Accesorios'] }
      ]
    }
  });

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

  const categoryOptions = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'Yerbas', label: 'Yerbas' },
    { value: 'Mates', label: 'Mates' },
    { value: 'Bombillas', label: 'Bombillas' },
    { value: 'Accesorios', label: 'Accesorios' }
  ];

  const MetricCard = ({ title, value, change, icon: Icon, trend, format = 'number', color = 'blue' }) => {
    const isPositive = change >= 0;
    const formattedValue = format === 'currency' ? formatCurrency(value) : 
                          format === 'percentage' ? `${value}%` : 
                          value.toLocaleString();

    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600',
      purple: 'bg-purple-100 text-purple-600',
      indigo: 'bg-indigo-100 text-indigo-600'
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{formattedValue}</p>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
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
                  <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded w-24 mb-4"></div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Análisis de Productos</h1>
              <p className="mt-2 text-gray-600">
                Insights detallados sobre el rendimiento y comportamiento de tus productos
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
                
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
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

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total de Productos"
            value={analyticsData.overview.totalProducts}
            change={3.2}
            icon={Package}
            color="blue"
          />
          <MetricCard
            title="Productos Activos"
            value={analyticsData.overview.activeProducts}
            change={1.8}
            icon={CheckCircle}
            color="green"
          />
          <MetricCard
            title="Tasa de Conversión"
            value={analyticsData.overview.conversionRate}
            change={0.4}
            icon={Target}
            format="percentage"
            color="purple"
          />
          <MetricCard
            title="Rating Promedio"
            value={analyticsData.overview.averageRating}
            change={0.2}
            icon={Star}
            format="number"
            color="yellow"
          />
        </div>

        {/* Alertas de Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Productos con Stock Bajo">
            <div className="space-y-4">
              {analyticsData.stockAnalysis.lowStock.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-yellow-600">{product.stock}</p>
                    <p className="text-xs text-gray-500">Min: {product.minStock}</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Productos Agotados">
            <div className="space-y-4">
              {analyticsData.stockAnalysis.outOfStock.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Archive className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">Agotado</p>
                    <p className="text-xs text-gray-500">Última venta: {new Date(product.lastSold).toLocaleDateString('es-AR')}</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Análisis por Categorías */}
        <ChartCard title="Rendimiento por Categoría" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.categoryAnalysis.map((category, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">{category.category}</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    category.growth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {formatPercentage(category.growth)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Productos:</span>
                    <span className="font-medium">{category.products}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ventas:</span>
                    <span className="font-medium">{category.sales}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ingresos:</span>
                    <span className="font-medium">{formatCurrency(category.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Rating:</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="font-medium">{category.avgRating}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Top: {category.topProduct}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Top y Peores Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Productos Mejor Performantes">
            <div className="space-y-4">
              {analyticsData.performance.topPerformers.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        <span className="text-xs text-gray-500">{product.rating}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-xs text-gray-500">{product.sales} ventas</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(product.revenue)}</p>
                    <div className="flex items-center justify-end mt-1">
                      <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                      <span className="text-xs text-green-600">{formatPercentage(product.trend)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Productos con Menor Rendimiento">
            <div className="space-y-4">
              {analyticsData.performance.lowPerformers.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        <span className="text-xs text-gray-500">{product.rating}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-xs text-gray-500">{product.sales} ventas</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{formatCurrency(product.revenue)}</p>
                    <div className="flex items-center justify-end mt-1">
                      <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
                      <span className="text-xs text-red-600">{formatPercentage(product.trend)}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">💡 Recomendaciones</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Revisar precios y promociones para productos con bajo rendimiento</li>
                  <li>• Analizar reseñas y feedback de clientes</li>
                  <li>• Considerar mejoras en imágenes y descripciones</li>
                </ul>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Análisis de Precios y Rentabilidad */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Distribución por Rangos de Precio">
            <div className="space-y-4">
              {analyticsData.priceAnalysis.priceRanges.map((range, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{range.range}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">{range.sales} ventas</span>
                      <span className="text-xs text-gray-500 ml-2">({range.products} productos)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${range.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{range.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Niveles de Rentabilidad">
            <div className="space-y-4">
              {analyticsData.priceAnalysis.profitabilityTiers.map((tier, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{tier.tier}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      index === 0 ? 'bg-green-100 text-green-800' :
                      index === 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {tier.avgMargin}% margen
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Productos:</span>
                      <span className="font-medium ml-2">{tier.products}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Ingresos:</span>
                      <span className="font-medium ml-2">{formatCurrency(tier.revenue)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default ProductAnalyticsPage;
