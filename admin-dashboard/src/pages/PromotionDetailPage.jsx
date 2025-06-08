import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Users,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Percent,
  Tag,
  Package,
  Play,
  Pause,
  Square,
  BarChart3,
  Activity
} from 'lucide-react';
import { toast } from 'react-toastify';

const PromotionDetailPage = () => {
  const { promotionId } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Estados de las promociones
  const promotionStatuses = {
    draft: { label: 'Borrador', color: 'bg-gray-100 text-gray-800', icon: Clock },
    active: { label: 'Activa', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    scheduled: { label: 'Programada', color: 'bg-blue-100 text-blue-800', icon: Calendar },
    expired: { label: 'Expirada', color: 'bg-red-100 text-red-800', icon: XCircle },
    paused: { label: 'Pausada', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle }
  };

  // Tipos de promociones
  const promotionTypes = {
    percentage: { label: 'Porcentaje', icon: Percent, symbol: '%' },
    fixed: { label: 'Monto Fijo', icon: DollarSign, symbol: '$' },
    bogo: { label: '2x1', icon: Tag, symbol: '2x1' },
    shipping: { label: 'Envío Gratis', icon: Users, symbol: 'FREE' }
  };

  // Cargar datos de la promoción
  useEffect(() => {
    const loadPromotion = async () => {
      setIsLoading(true);
      try {
        // Simular carga de datos (en producción sería una llamada a la API)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockPromotion = {
          id: 'PROMO-001',
          name: 'Descuento de Verano',
          description: '20% de descuento en todas las yerbas mate premium para celebrar el verano',
          type: 'percentage',
          value: 20,
          code: 'VERANO20',
          status: 'active',
          startDate: '2025-06-01T00:00:00',
          endDate: '2025-06-30T23:59:59',
          usageLimit: 100,
          usageCount: 47,
          minOrderAmount: 1000,
          applicableProducts: 'all',
          createdAt: '2025-05-28T10:00:00',
          updatedAt: '2025-06-05T14:30:00',
          // Estadísticas adicionales
          stats: {
            totalRevenue: 85400,
            totalOrders: 47,
            avgOrderValue: 1817,
            conversionRate: 12.5,
            totalViews: 1247,
            uniqueUsers: 876,
            savedAmount: 14200
          },
          recentUsage: [
            { date: '2025-06-05', uses: 8, revenue: 12400 },
            { date: '2025-06-04', uses: 12, revenue: 18600 },
            { date: '2025-06-03', uses: 6, revenue: 9800 },
            { date: '2025-06-02', uses: 15, revenue: 22100 },
            { date: '2025-06-01', uses: 6, revenue: 11500 }
          ],
          topProducts: [
            { id: 'prod001', name: 'Yerba Mate Amanda', sales: 23, revenue: 34500 },
            { id: 'prod002', name: 'Yerba Mate Taragüi', sales: 18, revenue: 25200 },
            { id: 'prod003', name: 'Yerba Cruz de Malta', sales: 15, revenue: 24000 }
          ]
        };

        setPromotion(mockPromotion);
      } catch (error) {
        toast.error('Error al cargar la promoción');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (promotionId) {
      loadPromotion();
    }
  }, [promotionId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const getPromotionValue = (promotion) => {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.value}%`;
      case 'fixed':
        return formatCurrency(promotion.value);
      case 'shipping':
        return 'Gratis';
      case 'bogo':
        return '2x1';
      default:
        return promotion.value;
    }
  };

  const getStatusBadge = (status) => {
    const statusInfo = promotionStatuses[status];
    if (!statusInfo) return null;
    
    const Icon = statusInfo.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
        <Icon className="h-4 w-4 mr-2" />
        {statusInfo.label}
      </span>
    );
  };

  const getUsagePercentage = (used, limit) => {
    return limit > 0 ? Math.round((used / limit) * 100) : 0;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promotion.code);
    toast.success(`Código ${promotion.code} copiado al portapapeles`);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      // Simular cambio de estado
      setPromotion(prev => ({ ...prev, status: newStatus }));
      toast.success(`Promoción ${newStatus === 'active' ? 'activada' : newStatus === 'paused' ? 'pausada' : 'detenida'}`);
    } catch (err) {
      console.error('Error al cambiar el estado:', err);
      toast.error('Error al cambiar el estado');
    }
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta promoción? Esta acción no se puede deshacer.')) {
      toast.success('Promoción eliminada exitosamente');
      navigate('/admin/promotions');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando promoción...</p>
        </div>
      </div>
    );
  }

  if (!promotion) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Promoción no encontrada</h3>
        <p className="text-gray-600 mb-4">La promoción que buscas no existe o ha sido eliminada.</p>
        <Link
          to="/admin/promotions"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a promociones
        </Link>
      </div>
    );
  }

  const typeInfo = promotionTypes[promotion.type];
  const TypeIcon = typeInfo.icon;
  const usagePercentage = getUsagePercentage(promotion.usageCount, promotion.usageLimit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/promotions')}
            className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{promotion.name}</h1>
            <p className="text-gray-600 mt-1">Código: {promotion.code}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Control de estado */}
          {promotion.status === 'active' && (
            <button
              onClick={() => handleStatusChange('paused')}
              className="inline-flex items-center px-3 py-2 border border-yellow-300 text-yellow-700 rounded-md hover:bg-yellow-50"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pausar
            </button>
          )}
          
          {promotion.status === 'paused' && (
            <button
              onClick={() => handleStatusChange('active')}
              className="inline-flex items-center px-3 py-2 border border-green-300 text-green-700 rounded-md hover:bg-green-50"
            >
              <Play className="h-4 w-4 mr-2" />
              Activar
            </button>
          )}
          
          {(promotion.status === 'active' || promotion.status === 'paused') && (
            <button
              onClick={() => handleStatusChange('expired')}
              className="inline-flex items-center px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
            >
              <Square className="h-4 w-4 mr-2" />
              Detener
            </button>
          )}

          <Link
            to={`/admin/promotions/edit/${promotion.id}`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Link>
          
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Información Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info de la Promoción */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detalles Básicos */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Información de la Promoción</h3>
              {getStatusBadge(promotion.status)}
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tipo y Valor */}
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-blue-100">
                    <TypeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tipo y Valor</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {getPromotionValue(promotion)} - {typeInfo.label}
                    </p>
                  </div>
                </div>

                {/* Código */}
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-gray-100">
                    <Tag className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Código de Promoción</p>
                    <div className="flex items-center space-x-2">
                      <code className="text-lg font-mono font-semibold bg-gray-100 px-2 py-1 rounded">
                        {promotion.code}
                      </code>
                      <button
                        onClick={handleCopyCode}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Período */}
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-purple-100">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Período de Validez</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(promotion.startDate)}
                    </p>
                    <p className="text-sm text-gray-600">
                      hasta {formatDate(promotion.endDate)}
                    </p>
                  </div>
                </div>

                {/* Uso */}
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-green-100">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Uso</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {promotion.usageCount} / {promotion.usageLimit || '∞'}
                    </p>
                    {promotion.usageLimit > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all" 
                          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Descripción</p>
                <p className="text-gray-900">{promotion.description}</p>
              </div>

              {/* Monto mínimo */}
              {promotion.minOrderAmount > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-1">Monto mínimo de compra</p>
                  <p className="text-lg font-medium text-gray-900">
                    {formatCurrency(promotion.minOrderAmount)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tabs de Estadísticas */}
          <div className="bg-white shadow rounded-lg">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <BarChart3 className="h-4 w-4 inline mr-2" />
                  Resumen
                </button>
                <button
                  onClick={() => setActiveTab('usage')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'usage'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Activity className="h-4 w-4 inline mr-2" />
                  Uso Diario
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'products'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Package className="h-4 w-4 inline mr-2" />
                  Productos
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Tab Overview */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Ingresos Totales</span>
                      <span className="text-lg font-semibold text-green-600">
                        {formatCurrency(promotion.stats.totalRevenue)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Pedidos Totales</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {promotion.stats.totalOrders}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Valor Promedio del Pedido</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatCurrency(promotion.stats.avgOrderValue)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Tasa de Conversión</span>
                      <span className="text-lg font-semibold text-blue-600">
                        {promotion.stats.conversionRate}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Usuarios Únicos</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {promotion.stats.uniqueUsers}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Ahorro Total</span>
                      <span className="text-lg font-semibold text-red-600">
                        {formatCurrency(promotion.stats.savedAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Usage */}
              {activeTab === 'usage' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Uso en los últimos 5 días</h4>
                  {promotion.recentUsage.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{day.date}</p>
                        <p className="text-sm text-gray-500">{day.uses} usos</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{formatCurrency(day.revenue)}</p>
                        <p className="text-sm text-gray-500">ingresos</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab Products */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Productos más vendidos</h4>
                  {promotion.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sales} ventas</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{formatCurrency(product.revenue)}</p>
                        <p className="text-sm text-gray-500">ingresos</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar de Métricas */}
        <div className="space-y-6">
          {/* Métricas Principales */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Métricas Principales</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Ingresos</span>
                </div>
                <span className="text-lg font-semibold text-green-600">
                  {formatCurrency(promotion.stats.totalRevenue)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Pedidos</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {promotion.stats.totalOrders}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-sm text-gray-600">Vistas</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {promotion.stats.totalViews.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-indigo-500 mr-2" />
                  <span className="text-sm text-gray-600">Conversión</span>
                </div>
                <span className="text-lg font-semibold text-indigo-600">
                  {promotion.stats.conversionRate}%
                </span>
              </div>
            </div>
          </div>

          {/* Información Técnica */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Creada:</span>
                <p className="font-medium">{formatDate(promotion.createdAt)}</p>
              </div>
              <div>
                <span className="text-gray-500">Última modificación:</span>
                <p className="font-medium">{formatDate(promotion.updatedAt)}</p>
              </div>
              <div>
                <span className="text-gray-500">Productos aplicables:</span>
                <p className="font-medium capitalize">{promotion.applicableProducts === 'all' ? 'Todos' : 'Específicos'}</p>
              </div>
              <div>
                <span className="text-gray-500">ID:</span>
                <p className="font-mono text-xs">{promotion.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionDetailPage;