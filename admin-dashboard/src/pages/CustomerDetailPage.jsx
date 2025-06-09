import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Package,
  Eye,
  Edit,
  Star,
  Users,
  UserCheck,
  AlertTriangle,
  Clock,
  Activity,
  BarChart3,
  FileText,
  Download,
  Send
} from 'lucide-react';
import { toast } from 'react-toastify';
import { mockCustomers, customerSegments } from '../data/mockData';

const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        setLoading(true);
        
        // Simular carga de datos
        setTimeout(() => {
          const foundCustomer = mockCustomers.find(c => c._id === id || c.email === id);
          
          if (foundCustomer) {
            setCustomer(foundCustomer);
            // Simular pedidos del cliente
            setOrders([
              {
                id: 'ORD-001',
                date: '2025-06-01',
                status: 'delivered',
                total: 3250,
                items: 3
              },
              {
                id: 'ORD-002',
                date: '2025-05-15',
                status: 'delivered',
                total: 1850,
                items: 2
              }
            ]);
          }
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading customer:', error);
        toast.error('Error al cargar los datos del cliente');
        setLoading(false);
      }
    };

    loadCustomerData();
  }, [id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getSegmentInfo = (segment) => {
    return customerSegments[segment] || customerSegments.new;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="bg-white rounded-xl p-6">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Cliente no encontrado</h3>
          <p className="text-gray-600 mb-6">El cliente solicitado no existe o ha sido eliminado.</p>
          <Link
            to="/admin/customers"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a clientes
          </Link>
        </div>
      </div>
    );
  }

  const segmentInfo = getSegmentInfo(customer.marketing.customerSegment);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header mejorado */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/customers')}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
              <p className="text-gray-600">Cliente desde {formatDate(customer.createdAt)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${segmentInfo.color}`}>
              {segmentInfo.label}
            </span>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Send className="h-4 w-4 mr-2" />
              Contactar
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Pedidos</p>
                <p className="text-2xl font-semibold text-gray-900">{customer.stats.totalOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Gastado</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(customer.stats.totalSpent)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Valor Promedio</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(customer.stats.averageOrderValue)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Última Compra</p>
                <p className="text-2xl font-semibold text-gray-900">{customer.daysSinceLastOrder}d</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Información General', icon: Eye },
              { id: 'orders', label: 'Historial de Pedidos', icon: Package },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información Personal */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{customer.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="text-sm font-medium text-gray-900">{customer.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Dirección</p>
                    <p className="text-sm font-medium text-gray-900">
                      {customer.address.street}, {customer.address.city}, {customer.address.province}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Registro</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(customer.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Marketing */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Marketing y Preferencias</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Segmento</p>
                  <div className="mt-1">
                    {getSegmentBadge(customer.marketing.customerSegment)}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Categorías Preferidas</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {customer.marketing.preferredCategories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Subscripciones</p>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm">
                      Email: {customer.marketing.emailOptIn ? '✅ Activo' : '❌ Inactivo'}
                    </p>
                    <p className="text-sm">
                      SMS: {customer.marketing.smsOptIn ? '✅ Activo' : '❌ Inactivo'}
                    </p>
                  </div>
                </div>
                
                {customer.marketing.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Notas</p>
                    <p className="text-sm text-gray-900 mt-1">{customer.marketing.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Historial de Pedidos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pedido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Productos
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(order.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index}>
                              {item.quantity}x {item.name}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics del Cliente</h3>
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Los gráficos de analytics estarán disponibles próximamente
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailPage;