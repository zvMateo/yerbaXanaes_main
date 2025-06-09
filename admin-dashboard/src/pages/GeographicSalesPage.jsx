import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign,
  Package,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Search,
  Eye,
  BarChart3,
  PieChart,
  Navigation,
  Building,
  Truck,
  Target,
  Activity,
  Zap
} from 'lucide-react';

const GeographicSalesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [regionFilter, setRegionFilter] = useState('all');
  const [geoData, setGeoData] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [mapView, setMapView] = useState('sales'); // sales, customers, growth
  const [searchTerm, setSearchTerm] = useState('');

  // Simular carga de datos geográficos
  useEffect(() => {
    const loadGeoData = () => {
      setTimeout(() => {
        setGeoData(getMockGeoData());
        setIsLoading(false);
      }, 1000);
    };

    loadGeoData();
  }, [dateRange, regionFilter]);

  const getMockGeoData = () => ({
    overview: {
      totalRegions: 24,
      activeRegions: 18,
      topRegion: 'Buenos Aires',
      totalDistanceKm: 15420,
      avgDeliveryTime: 3.2,
      shippingCoverage: 89.5
    },
    provinces: [
      {
        id: 'buenos-aires',
        name: 'Buenos Aires',
        capital: 'La Plata',
        customers: 342,
        orders: 567,
        revenue: 847500,
        growth: 15.3,
        avgOrderValue: 1495,
        topCity: 'La Plata',
        deliveryTime: 2.1,
        shippingCost: 850,
        coordinates: { lat: -34.921, lng: -57.954 },
        coverage: 95.2,
        lastOrder: '2025-01-08',
        cities: [
          { name: 'La Plata', orders: 234, revenue: 349500 },
          { name: 'Mar del Plata', orders: 145, revenue: 217500 },
          { name: 'Tandil', orders: 89, revenue: 133500 },
          { name: 'Bahía Blanca', orders: 67, revenue: 100500 },
          { name: 'Olavarría', orders: 32, revenue: 48000 }
        ]
      },
      {
        id: 'cordoba',
        name: 'Córdoba',
        capital: 'Córdoba',
        customers: 198,
        orders: 324,
        revenue: 486000,
        growth: 8.7,
        avgOrderValue: 1500,
        topCity: 'Córdoba Capital',
        deliveryTime: 3.5,
        shippingCost: 1200,
        coordinates: { lat: -31.420, lng: -64.188 },
        coverage: 87.3,
        lastOrder: '2025-01-08',
        cities: [
          { name: 'Córdoba Capital', orders: 189, revenue: 283500 },
          { name: 'Villa Carlos Paz', orders: 76, revenue: 114000 },
          { name: 'Río Cuarto', orders: 45, revenue: 67500 },
          { name: 'San Francisco', orders: 14, revenue: 21000 }
        ]
      },
      {
        id: 'santa-fe',
        name: 'Santa Fe',
        capital: 'Santa Fe',
        customers: 156,
        orders: 267,
        revenue: 400500,
        growth: 12.1,
        avgOrderValue: 1500,
        topCity: 'Rosario',
        deliveryTime: 2.8,
        shippingCost: 950,
        coordinates: { lat: -31.633, lng: -60.700 },
        coverage: 91.7,
        lastOrder: '2025-01-07',
        cities: [
          { name: 'Rosario', orders: 134, revenue: 201000 },
          { name: 'Santa Fe Capital', orders: 89, revenue: 133500 },
          { name: 'Rafaela', orders: 28, revenue: 42000 },
          { name: 'Venado Tuerto', orders: 16, revenue: 24000 }
        ]
      },
      {
        id: 'mendoza',
        name: 'Mendoza',
        capital: 'Mendoza',
        customers: 123,
        orders: 189,
        revenue: 283500,
        growth: 22.4,
        avgOrderValue: 1500,
        topCity: 'Mendoza Capital',
        deliveryTime: 4.2,
        shippingCost: 1450,
        coordinates: { lat: -32.889, lng: -68.845 },
        coverage: 78.9,
        lastOrder: '2025-01-06',
        cities: [
          { name: 'Mendoza Capital', orders: 123, revenue: 184500 },
          { name: 'San Rafael', orders: 34, revenue: 51000 },
          { name: 'Godoy Cruz', orders: 21, revenue: 31500 },
          { name: 'Maipú', orders: 11, revenue: 16500 }
        ]
      },
      {
        id: 'tucuman',
        name: 'Tucumán',
        capital: 'San Miguel de Tucumán',
        customers: 87,
        orders: 134,
        revenue: 201000,
        growth: 5.8,
        avgOrderValue: 1500,
        topCity: 'San Miguel de Tucumán',
        deliveryTime: 5.1,
        shippingCost: 1650,
        coordinates: { lat: -26.808, lng: -65.220 },
        coverage: 82.4,
        lastOrder: '2025-01-05',
        cities: [
          { name: 'San Miguel de Tucumán', orders: 98, revenue: 147000 },
          { name: 'Yerba Buena', orders: 23, revenue: 34500 },
          { name: 'Banda del Río Salí', orders: 13, revenue: 19500 }
        ]
      },
      {
        id: 'entre-rios',
        name: 'Entre Ríos',
        capital: 'Paraná',
        customers: 76,
        orders: 123,
        revenue: 184500,
        growth: -2.3,
        avgOrderValue: 1500,
        topCity: 'Paraná',
        deliveryTime: 3.7,
        shippingCost: 1100,
        coordinates: { lat: -31.732, lng: -60.529 },
        coverage: 75.6,
        lastOrder: '2025-01-04',
        cities: [
          { name: 'Paraná', orders: 67, revenue: 100500 },
          { name: 'Concordia', orders: 34, revenue: 51000 },
          { name: 'Gualeguaychú', orders: 22, revenue: 33000 }
        ]
      }
    ],
    shippingZones: [
      {
        zone: 'Zona Metropolitana',
        provinces: ['Buenos Aires Capital', 'GBA Norte', 'GBA Sur', 'GBA Oeste'],
        cost: 500,
        deliveryTime: '24-48hs',
        coverage: 98.5,
        orders: 423,
        revenue: 634500
      },
      {
        zone: 'Pampeana',
        provinces: ['Buenos Aires Interior', 'Córdoba', 'Santa Fe', 'Entre Ríos', 'La Pampa'],
        cost: 850,
        deliveryTime: '48-72hs',
        coverage: 89.2,
        orders: 789,
        revenue: 1183500
      },
      {
        zone: 'Cuyo',
        provinces: ['Mendoza', 'San Juan', 'San Luis'],
        cost: 1200,
        deliveryTime: '72-96hs',
        coverage: 76.8,
        orders: 234,
        revenue: 351000
      },
      {
        zone: 'Norte',
        provinces: ['Tucumán', 'Salta', 'Jujuy', 'Santiago del Estero', 'Catamarca'],
        cost: 1450,
        deliveryTime: '96-120hs',
        coverage: 68.4,
        orders: 189,
        revenue: 283500
      },
      {
        zone: 'Patagonia',
        provinces: ['Neuquén', 'Río Negro', 'Chubut', 'Santa Cruz', 'Tierra del Fuego'],
        cost: 1800,
        deliveryTime: '120-168hs',
        coverage: 45.2,
        orders: 67,
        revenue: 100500
      }
    ],
    topCities: [
      { name: 'Buenos Aires Capital', province: 'CABA', orders: 234, revenue: 351000, growth: 12.3 },
      { name: 'Córdoba', province: 'Córdoba', orders: 189, revenue: 283500, growth: 8.7 },
      { name: 'Rosario', province: 'Santa Fe', orders: 134, revenue: 201000, growth: 15.2 },
      { name: 'La Plata', province: 'Buenos Aires', orders: 123, revenue: 184500, growth: 10.4 },
      { name: 'Mendoza', province: 'Mendoza', orders: 98, revenue: 147000, growth: 22.1 },
      { name: 'Tucumán', province: 'Tucumán', orders: 87, revenue: 130500, growth: 5.8 },
      { name: 'Mar del Plata', province: 'Buenos Aires', orders: 76, revenue: 114000, growth: 7.2 },
      { name: 'Salta', province: 'Salta', orders: 65, revenue: 97500, growth: 18.9 }
    ],
    deliveryMetrics: {
      avgNationalDelivery: 3.8,
      onTimeDelivery: 87.3,
      delayedDeliveries: 12.7,
      cancelledDeliveries: 2.1,
      returnRate: 1.8,
      customerSatisfaction: 4.6
    },
    seasonalTrends: [
      { month: 'Enero', orders: 1234, revenue: 1851000 },
      { month: 'Febrero', orders: 1456, revenue: 2184000 },
      { month: 'Marzo', orders: 1789, revenue: 2683500 },
      { month: 'Abril', orders: 1543, revenue: 2314500 },
      { month: 'Mayo', orders: 1398, revenue: 2097000 },
      { month: 'Junio', orders: 1687, revenue: 2530500 }
    ]
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

  const regionOptions = [
    { value: 'all', label: 'Todas las regiones' },
    { value: 'metropolitana', label: 'Zona Metropolitana' },
    { value: 'pampeana', label: 'Región Pampeana' },
    { value: 'cuyo', label: 'Región de Cuyo' },
    { value: 'norte', label: 'Región Norte' },
    { value: 'patagonia', label: 'Patagonia' }
  ];

  const GeoCard = ({ title, value, change, icon: Icon, format = 'number', color = 'blue' }) => {
    const isPositive = change >= 0;
    const formattedValue = format === 'currency' ? formatCurrency(value) : 
                          format === 'percentage' ? `${value}%` : 
                          format === 'time' ? `${value} días` :
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
        {change !== undefined && (
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
        )}
      </div>
    );
  };

  const ChartCard = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  const filteredProvinces = geoData?.provinces.filter(province => {
    const matchesSearch = searchTerm === '' || 
      province.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      province.capital.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

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
              <h1 className="text-3xl font-bold text-gray-900">Análisis Geográfico</h1>
              <p className="mt-2 text-gray-600">
                Distribución y rendimiento de ventas por ubicación geográfica
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
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {regionOptions.map(option => (
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

        {/* Métricas Geográficas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GeoCard
            title="Regiones Activas"
            value={geoData.overview.activeRegions}
            change={8.3}
            icon={Globe}
            color="blue"
          />
          <GeoCard
            title="Tiempo Promedio Entrega"
            value={geoData.overview.avgDeliveryTime}
            change={-5.2}
            icon={Truck}
            format="time"
            color="green"
          />
          <GeoCard
            title="Cobertura Nacional"
            value={geoData.overview.shippingCoverage}
            change={2.1}
            icon={Target}
            format="percentage"
            color="purple"
          />
          <GeoCard
            title="Distancia Total (Km)"
            value={geoData.overview.totalDistanceKm}
            change={12.4}
            icon={Navigation}
            color="indigo"
          />
        </div>

        {/* Mapa Interactivo Mock y Top Regiones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Mapa Simulado */}
          <ChartCard title="Mapa de Ventas por Región">
            <div className="mb-4 flex items-center space-x-3">
              <button
                onClick={() => setMapView('sales')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  mapView === 'sales' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Ventas
              </button>
              <button
                onClick={() => setMapView('customers')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  mapView === 'customers' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Clientes
              </button>
              <button
                onClick={() => setMapView('growth')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  mapView === 'growth' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Crecimiento
              </button>
            </div>
            
            <div className="h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Mapa Interactivo de Argentina</p>
                <p className="text-sm text-gray-500 mt-2">
                  Visualización de {mapView === 'sales' ? 'ventas' : mapView === 'customers' ? 'clientes' : 'crecimiento'} por provincia
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Integración con mapas pendiente (Leaflet/Google Maps)
                </p>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                🔥 <strong>{geoData.overview.topRegion}</strong> es la región con mejor rendimiento
              </p>
            </div>
          </ChartCard>

          {/* Top Provincias */}
          <ChartCard title="Ranking de Provincias">
            <div className="space-y-4">
              {geoData.provinces.slice(0, 6).map((province, index) => (
                <div 
                  key={province.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors duration-200 hover:bg-gray-50 cursor-pointer ${
                    selectedRegion?.id === province.id ? 'border-blue-300 bg-blue-50' : 'border-gray-100'
                  }`}
                  onClick={() => setSelectedRegion(selectedRegion?.id === province.id ? null : province)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      index < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{province.name}</p>
                      <p className="text-sm text-gray-500">{province.orders} pedidos • {province.customers} clientes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(province.revenue)}</p>
                    <div className="flex items-center justify-end mt-1">
                      {province.growth >= 0 ? (
                        <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
                      )}
                      <span className={`text-xs font-medium ${
                        province.growth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(province.growth)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Detalle de Región Seleccionada */}
        {selectedRegion && (
          <ChartCard title={`Detalle: ${selectedRegion.name}`} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(selectedRegion.revenue)}</p>
                <p className="text-sm text-blue-600">Ingresos Totales</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">{selectedRegion.orders}</p>
                <p className="text-sm text-green-600">Pedidos</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-900">{selectedRegion.customers}</p>
                <p className="text-sm text-purple-600">Clientes</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Truck className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-900">{selectedRegion.deliveryTime} días</p>
                <p className="text-sm text-yellow-600">Tiempo Entrega</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Principales Ciudades</h4>
                <div className="space-y-2">
                  {selectedRegion.cities.map((city, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{city.name}</span>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(city.revenue)}</p>
                        <p className="text-xs text-gray-500">{city.orders} pedidos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Métricas de Entrega</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiempo promedio:</span>
                    <span className="font-medium">{selectedRegion.deliveryTime} días</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Costo de envío:</span>
                    <span className="font-medium">{formatCurrency(selectedRegion.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cobertura:</span>
                    <span className="font-medium">{selectedRegion.coverage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Último pedido:</span>
                    <span className="font-medium">{new Date(selectedRegion.lastOrder).toLocaleDateString('es-AR')}</span>
                  </div>
                </div>
              </div>
            </div>
          </ChartCard>
        )}

        {/* Zonas de Envío y Ciudades Top */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Zonas de Envío */}
          <ChartCard title="Análisis por Zonas de Envío">
            <div className="space-y-4">
              {geoData.shippingZones.map((zone, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{zone.zone}</h4>
                    <span className="text-sm font-medium text-blue-600">{formatCurrency(zone.cost)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Tiempo: </span>
                      <span className="font-medium">{zone.deliveryTime}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Cobertura: </span>
                      <span className="font-medium">{zone.coverage}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Pedidos: </span>
                      <span className="font-medium">{zone.orders}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Ingresos: </span>
                      <span className="font-medium">{formatCurrency(zone.revenue)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${zone.coverage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Top Ciudades */}
          <ChartCard title="Ciudades con Mayor Volumen">
            <div className="mb-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar ciudad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {geoData.topCities.filter(city => 
                city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                city.province.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((city, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{city.name}</p>
                      <p className="text-xs text-gray-500">{city.province}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(city.revenue)}</p>
                    <div className="flex items-center justify-end">
                      {city.growth >= 0 ? (
                        <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
                      )}
                      <span className={`text-xs ${city.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(city.growth)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Métricas de Entrega */}
        <ChartCard title="Métricas de Entrega Nacional" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-green-900">{geoData.deliveryMetrics.onTimeDelivery}%</p>
              <p className="text-sm text-green-600 font-medium">Entregas a Tiempo</p>
              <p className="text-xs text-gray-500 mt-2">Meta: 90%</p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-900">{geoData.deliveryMetrics.customerSatisfaction}</p>
              <p className="text-sm text-blue-600 font-medium">Satisfacción Cliente</p>
              <p className="text-xs text-gray-500 mt-2">Escala 1-5</p>
            </div>
            
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Building className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-yellow-900">{geoData.deliveryMetrics.returnRate}%</p>
              <p className="text-sm text-yellow-600 font-medium">Tasa de Devolución</p>
              <p className="text-xs text-gray-500 mt-2">Meta: Menor al 3%</p>
            </div>
          </div>
        </ChartCard>

        {/* Lista Detallada de Provincias */}
        <ChartCard title="Detalle Completo por Provincia">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Provincia</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Clientes</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Pedidos</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Ingresos</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3">AOV</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Entrega</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Tendencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProvinces.map((province) => (
                  <tr key={province.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-gray-900">{province.name}</p>
                        <p className="text-sm text-gray-500">{province.capital}</p>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-sm font-medium text-gray-900">{province.customers}</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-sm font-medium text-gray-900">{province.orders}</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(province.revenue)}</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(province.avgOrderValue)}</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-sm text-gray-600">{province.deliveryTime} días</span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end">
                        {province.growth >= 0 ? (
                          <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          province.growth >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatPercentage(province.growth)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default GeographicSalesPage;
