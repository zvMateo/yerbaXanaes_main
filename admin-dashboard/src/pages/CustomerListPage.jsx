import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  Download,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  UserCheck,
  AlertTriangle,
  Star,
  Clock
} from 'lucide-react';
import { toast } from 'react-toastify';

// ✅ DATOS MOCK MOVIDOS FUERA DEL COMPONENTE
const mockCustomers = [
  {
    _id: '1',
    name: 'María González',
    email: 'maria@email.com',
    phone: '11-2345-6789',
    address: {
      city: 'Buenos Aires',
      province: 'CABA'
    },
    stats: {
      totalOrders: 5,
      totalSpent: 12500,
      averageOrderValue: 2500,
      lastOrderDate: '2024-06-01'
    },
    marketing: {
      customerSegment: 'regular'
    },
    createdAt: '2024-05-15',
    daysSinceLastOrder: 5
  },
  {
    _id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos@email.com',
    phone: '11-3456-7890',
    address: {
      city: 'Córdoba',
      province: 'Córdoba'
    },
    stats: {
      totalOrders: 12,
      totalSpent: 67800,
      averageOrderValue: 5650,
      lastOrderDate: '2024-06-05'
    },
    marketing: {
      customerSegment: 'vip'
    },
    createdAt: '2024-02-20',
    daysSinceLastOrder: 1
  },
  {
    _id: '3',
    name: 'Ana López',
    email: 'ana@email.com',
    phone: '11-4567-8901',
    address: {
      city: 'Rosario',
      province: 'Santa Fe'
    },
    stats: {
      totalOrders: 1,
      totalSpent: 1850,
      averageOrderValue: 1850,
      lastOrderDate: '2024-06-04'
    },
    marketing: {
      customerSegment: 'new'
    },
    createdAt: '2024-06-04',
    daysSinceLastOrder: 2
  }
];

const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({});

  // ✅ FUNCIÓN OPTIMIZADA CON useCallback
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      // Simular carga de datos
      setTimeout(() => {
        const filtered = mockCustomers.filter(customer => {
          const matchesSearch = searchTerm === '' || 
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase());
          
          const matchesSegment = selectedSegment === 'all' || 
            customer.marketing.customerSegment === selectedSegment;
          
          return matchesSearch && matchesSegment;
        });

        setCustomers(filtered);
        setTotalPages(1);
        
        // ✅ ESTADÍSTICAS DINÁMICAS CALCULADAS CORRECTAMENTE
        setStats({
          total: filtered.length,
          segments: [
            { _id: 'new', count: mockCustomers.filter(c => c.marketing.customerSegment === 'new').length },
            { _id: 'regular', count: mockCustomers.filter(c => c.marketing.customerSegment === 'regular').length },
            { _id: 'vip', count: mockCustomers.filter(c => c.marketing.customerSegment === 'vip').length },
            { _id: 'at_risk', count: mockCustomers.filter(c => c.marketing.customerSegment === 'at_risk').length },
            { _id: 'inactive', count: mockCustomers.filter(c => c.marketing.customerSegment === 'inactive').length }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Error al cargar los clientes');
      setLoading(false);
    }
  }, [searchTerm, selectedSegment]); // Dependencias corregidas

  // ✅ useEffect CORRECTO SIN WARNINGS
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const getSegmentBadge = (segment) => {
    const segmentConfig = {
      new: { 
        label: 'Nuevo', 
        color: 'bg-blue-100 text-blue-800',
        icon: UserCheck 
      },
      regular: { 
        label: 'Regular', 
        color: 'bg-green-100 text-green-800',
        icon: Users 
      },
      vip: { 
        label: 'VIP', 
        color: 'bg-purple-100 text-purple-800',
        icon: Star 
      },
      inactive: { 
        label: 'Inactivo', 
        color: 'bg-gray-100 text-gray-800',
        icon: Clock 
      },
      at_risk: { 
        label: 'En Riesgo', 
        color: 'bg-yellow-100 text-yellow-800',
        icon: AlertTriangle 
      }
    };

    const config = segmentConfig[segment] || segmentConfig.new;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const exportCustomers = () => {
    toast.success('Exportación iniciada. Se descargará automáticamente.');
    // TODO: Implementar exportación real
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-1">
            Gestiona y analiza información de tus clientes
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={exportCustomers}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
          
          <Link
            to="/admin/customers/analytics"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Clientes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Clientes Activos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.segments?.reduce((sum, seg) => seg._id !== 'inactive' ? sum + seg.count : sum, 0) || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Clientes VIP</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.segments?.find(seg => seg._id === 'vip')?.count || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">En Riesgo</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.segments?.find(seg => seg._id === 'at_risk')?.count || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="sm:w-48">
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los segmentos</option>
              <option value="new">Nuevos</option>
              <option value="regular">Regulares</option>
              <option value="vip">VIP</option>
              <option value="at_risk">En Riesgo</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
          
          <div className="sm:w-48">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="createdAt-desc">Más recientes</option>
              <option value="createdAt-asc">Más antiguos</option>
              <option value="stats.totalSpent-desc">Mayor gasto</option>
              <option value="stats.totalSpent-asc">Menor gasto</option>
              <option value="name-asc">Nombre A-Z</option>
              <option value="name-desc">Nombre Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estadísticas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Segmento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Compra
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Cliente desde {formatDate(customer.createdAt)}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <div>
                        <div>{customer.address.city}</div>
                        <div className="text-gray-500">{customer.address.province}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <ShoppingCart className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">{customer.stats.totalOrders}</span>
                        <span className="text-gray-500 ml-1">pedidos</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium text-green-600">
                          {formatCurrency(customer.stats.totalSpent)}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getSegmentBadge(customer.marketing.customerSegment)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(customer.stats.lastOrderDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                      hace {customer.daysSinceLastOrder} días
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/customers/${customer._id}`}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Página <span className="font-medium">{currentPage}</span> de{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerListPage;