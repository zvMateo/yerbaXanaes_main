import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus,
  Search, 
  Filter, 
  Edit,
  Trash2,
  Eye,
  Copy,
  Calendar,
  Percent,
  DollarSign,
  Tag,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-toastify';

const PromotionListPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

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

  // Cargar promociones
  useEffect(() => {
    setTimeout(() => {
      const mockPromotions = [
        {
          id: 'PROMO-001',
          name: 'Descuento de Verano',
          description: '20% de descuento en todas las yerbas',
          type: 'percentage',
          value: 20,
          code: 'VERANO20',
          status: 'active',
          startDate: '2025-06-01T00:00:00',
          endDate: '2025-06-30T23:59:59',
          usageLimit: 100,
          usageCount: 23,
          minOrderAmount: 1000,
          applicableProducts: 'all',
          createdAt: '2025-05-28T10:00:00'
        },
        {
          id: 'PROMO-002',
          name: 'Envío Gratis Junio',
          description: 'Envío gratuito en compras superiores a $2000',
          type: 'shipping',
          value: 0,
          code: 'ENVIOGRATIS',
          status: 'active',
          startDate: '2025-06-01T00:00:00',
          endDate: '2025-06-30T23:59:59',
          usageLimit: 200,
          usageCount: 45,
          minOrderAmount: 2000,
          applicableProducts: 'all',
          createdAt: '2025-05-25T14:30:00'
        },
        {
          id: 'PROMO-003',
          name: '$500 off en Amanda',
          description: '$500 de descuento en yerbas Amanda',
          type: 'fixed',
          value: 500,
          code: 'AMANDA500',
          status: 'scheduled',
          startDate: '2025-07-01T00:00:00',
          endDate: '2025-07-15T23:59:59',
          usageLimit: 50,
          usageCount: 0,
          minOrderAmount: 1500,
          applicableProducts: 'specific',
          createdAt: '2025-06-02T09:15:00'
        },
        {
          id: 'PROMO-004',
          name: '2x1 en Taragüi',
          description: 'Llevá 2 yerbas Taragüi y pagá 1',
          type: 'bogo',
          value: 50,
          code: 'TARAGUI2X1',
          status: 'draft',
          startDate: '2025-06-15T00:00:00',
          endDate: '2025-06-25T23:59:59',
          usageLimit: 30,
          usageCount: 0,
          minOrderAmount: 0,
          applicableProducts: 'specific',
          createdAt: '2025-06-05T16:45:00'
        },
        {
          id: 'PROMO-005',
          name: 'Black Friday 2024',
          description: '40% de descuento en todo',
          type: 'percentage',
          value: 40,
          code: 'BLACKFRIDAY',
          status: 'expired',
          startDate: '2024-11-24T00:00:00',
          endDate: '2024-11-26T23:59:59',
          usageLimit: 500,
          usageCount: 312,
          minOrderAmount: 500,
          applicableProducts: 'all',
          createdAt: '2024-11-20T12:00:00'
        }
      ];

      setPromotions(mockPromotions);
      setFilteredPromotions(mockPromotions);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtrar promociones
  useEffect(() => {
    let filtered = promotions;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(promo =>
        promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(promo => promo.status === statusFilter);
    }

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(promo => promo.type === typeFilter);
    }

    setFilteredPromotions(filtered);
  }, [promotions, searchTerm, statusFilter, typeFilter]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusInfo = promotionStatuses[status];
    if (!statusInfo) return null;
    
    const Icon = statusInfo.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {statusInfo.label}
      </span>
    );
  };

  const getPromotionValue = (promotion) => {
    // const typeInfo = promotionTypes[promotion.type];
    
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

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Código ${code} copiado al portapapeles`);
  };

  const handleDeletePromotion = (promotionId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta promoción?')) {
      setPromotions(promotions.filter(p => p.id !== promotionId));
      toast.success('Promoción eliminada exitosamente');
    }
  };

  const getUsagePercentage = (used, limit) => {
    return limit > 0 ? Math.round((used / limit) * 100) : 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--accent-color) mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando promociones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promociones</h1>
          <p className="text-gray-600 mt-1">
            {filteredPromotions.length} promoción{filteredPromotions.length !== 1 ? 'es' : ''} encontrada{filteredPromotions.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Link
            to="/admin/promotions/new"
            className="inline-flex items-center px-4 py-2 bg-(--accent-color) text-white rounded-md hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Promoción
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar promoción
            </label>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nombre, código, descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-(--accent-color) focus:border-transparent"
              />
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-(--accent-color) focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              {Object.entries(promotionStatuses).map(([key, status]) => (
                <option key={key} value={key}>{status.label}</option>
              ))}
            </select>
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-(--accent-color) focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              {Object.entries(promotionTypes).map(([key, type]) => (
                <option key={key} value={key}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Promociones */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredPromotions.length === 0 ? (
          <div className="text-center py-12">
            <Percent className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay promociones</h3>
            <p className="text-gray-600 mb-4">No se encontraron promociones con los filtros aplicados.</p>
            <Link
              to="/admin/promotions/new"
              className="inline-flex items-center px-4 py-2 bg-(--accent-color) text-white rounded-md hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear primera promoción
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promoción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo & Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPromotions.map((promotion) => {
                  const typeInfo = promotionTypes[promotion.type];
                  const TypeIcon = typeInfo.icon;
                  const usagePercentage = getUsagePercentage(promotion.usageCount, promotion.usageLimit);
                  
                  return (
                    <tr key={promotion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {promotion.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {promotion.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-gray-100 mr-3">
                            <TypeIcon className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {getPromotionValue(promotion)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {typeInfo.label}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                            {promotion.code}
                          </code>
                          <button
                            onClick={() => handleCopyCode(promotion.code)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex flex-col">
                          <div>{formatDate(promotion.startDate)}</div>
                          <div className="text-gray-500">
                            al {formatDate(promotion.endDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {promotion.usageCount} / {promotion.usageLimit || '∞'}
                          </div>
                          {promotion.usageLimit > 0 && (
                            <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-(--accent-color) h-2 rounded-full" 
                                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(promotion.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          to={`/admin/promotions/${promotion.id}`}
                          className="text-(--accent-color) hover:text-(--accent-color-dark)"
                        >
                          <Eye className="h-4 w-4 inline" />
                        </Link>
                        <Link
                          to={`/admin/promotions/edit/${promotion.id}`}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Edit className="h-4 w-4 inline" />
                        </Link>
                        <button
                          onClick={() => handleDeletePromotion(promotion.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(promotionStatuses).map(([status, statusInfo]) => {
          const count = promotions.filter(promo => promo.status === status).length;
          const Icon = statusInfo.icon;
          
          return (
            <div key={status} className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className={`p-2 rounded-md ${statusInfo.color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 text-')}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">{statusInfo.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PromotionListPage;