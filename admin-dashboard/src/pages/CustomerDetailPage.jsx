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

// ✅ MOVER LOS DATOS MOCK FUERA DEL COMPONENTE
const mockCustomers = [
  {
    _id: '1',
    name: 'María González',
    email: 'maria@email.com',
    phone: '11-2345-6789',
    document: '12.345.678',
    address: {
      street: 'Av. Corrientes 1234',
      city: 'Buenos Aires',
      province: 'CABA',
      postalCode: '1043',
      country: 'Argentina'
    },
    stats: {
      totalOrders: 8,
      totalSpent: 24750,
      averageOrderValue: 3093.75,
      lastOrderDate: '2024-06-01',
      firstOrderDate: '2024-02-15'
    },
    marketing: {
      customerSegment: 'regular',
      preferredCategories: ['yerba', 'mates'],
      emailOptIn: true,
      smsOptIn: false,
      lastEmailSent: '2024-05-28',
      notes: 'Cliente muy fiel, siempre compra yerba La Merced.'
    },
    createdAt: '2024-02-15',
    isActive: true,
    daysSinceLastOrder: 5,
    customerLifetimeDays: 107
  },
  {
    _id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos@email.com',
    phone: '11-3456-7890',
    document: '23.456.789',
    address: {
      street: 'San Martín 567',
      city: 'Córdoba',
      province: 'Córdoba',
      postalCode: '5000',
      country: 'Argentina'
    },
    stats: {
      totalOrders: 12,
      totalSpent: 67800,
      averageOrderValue: 5650,
      lastOrderDate: '2024-06-05',
      firstOrderDate: '2024-01-10'
    },
    marketing: {
      customerSegment: 'vip',
      preferredCategories: ['yerba', 'mates', 'accesorios'],
      emailOptIn: true,
      smsOptIn: true,
      lastEmailSent: '2024-06-04',
      notes: 'Cliente VIP, compras grandes y frecuentes. Muy buen pagador.'
    },
    createdAt: '2024-01-10',
    isActive: true,
    daysSinceLastOrder: 1,
    customerLifetimeDays: 147
  },
  {
    _id: '3',
    name: 'Ana López',
    email: 'ana@email.com',
    phone: '11-4567-8901',
    document: '34.567.890',
    address: {
      street: 'Mitre 890',
      city: 'Rosario',
      province: 'Santa Fe',
      postalCode: '2000',
      country: 'Argentina'
    },
    stats: {
      totalOrders: 1,
      totalSpent: 1850,
      averageOrderValue: 1850,
      lastOrderDate: '2024-06-04',
      firstOrderDate: '2024-06-04'
    },
    marketing: {
      customerSegment: 'new',
      preferredCategories: ['yerba'],
      emailOptIn: true,
      smsOptIn: false,
      lastEmailSent: '2024-06-04',
      notes: 'Cliente nuevo, primera compra. Potencial para crecimiento.'
    },
    createdAt: '2024-06-04',
    isActive: true,
    daysSinceLastOrder: 2,
    customerLifetimeDays: 2
  }
];

// Mock orders data
const mockOrders = {
  '1': [
    {
      _id: 'ord-001',
      orderNumber: 'YX-001',
      date: '2024-06-01',
      status: 'completed',
      total: 2500,
      items: [
        { name: 'Yerba La Merced 1kg', quantity: 2, price: 1200 },
        { name: 'Mate de Calabaza', quantity: 1, price: 300 }
      ]
    },
    {
      _id: 'ord-002',
      orderNumber: 'YX-002',
      date: '2024-05-20',
      status: 'completed',
      total: 3200,
      items: [
        { name: 'Yerba Amanda 1kg', quantity: 3, price: 1000 },
        { name: 'Bombilla Alpaca', quantity: 1, price: 200 }
      ]
    }
  ],
  '2': [
    {
      _id: 'ord-003',
      orderNumber: 'YX-003',
      date: '2024-06-05',
      status: 'completed',
      total: 5650,
      items: [
        { name: 'Yerba La Merced 1kg', quantity: 5, price: 1200 },
        { name: 'Set Matero Premium', quantity: 1, price: 1200 }
      ]
    }
  ],
  '3': [
    {
      _id: 'ord-004',
      orderNumber: 'YX-004',
      date: '2024-06-04',
      status: 'completed',
      total: 1850,
      items: [
        { name: 'Yerba Taragui 1kg', quantity: 1, price: 950 },
        { name: 'Mate Madera', quantity: 1, price: 900 }
      ]
    }
  ]
};

const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
//   const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        
        // TODO: Reemplazar con llamada real a la API
        // const response = await customerService.getCustomerById(id);
        
        // ✅ BUSCAR EL CLIENTE POR ID
        setTimeout(() => {
          const foundCustomer = mockCustomers.find(c => c._id === id);
          
          if (!foundCustomer) {
            toast.error('Cliente no encontrado');
            navigate('/admin/customers');
            return;
          }
          
          setCustomer(foundCustomer);
          setOrders(mockOrders[id] || []);
          
          // Mock analytics data
        //   setAnalytics({
        //     monthlySpending: [
        //       { month: 'Ene', amount: 2400 },
        //       { month: 'Feb', amount: 3200 },
        //       { month: 'Mar', amount: 1800 },
        //       { month: 'Abr', amount: 4100 },
        //       { month: 'May', amount: 3200 },
        //       { month: 'Jun', amount: foundCustomer.stats.totalSpent }
        //     ]
        //   });
          
          setLoading(false);
        }, 800);
        
      } catch (error) {
        console.error('Error fetching customer:', error);
        toast.error('Error al cargar el cliente');
        navigate('/admin/customers');
      }
    };

    if (id) {
      fetchCustomerData();
    }
  }, [id, navigate]);

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

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: 'Completado', color: 'bg-green-100 text-green-800' },
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
      cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del cliente...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Cliente no encontrado</h2>
        <p className="text-gray-600 mt-2">El cliente que buscas no existe.</p>
        <Link
          to="/admin/customers"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Clientes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/customers"
            className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-600">
              Cliente desde {formatDate(customer.createdAt)} • {getSegmentBadge(customer.marketing.customerSegment)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => toast.success('Email enviado correctamente')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar Email
          </button>
          
          <button
            onClick={() => toast.info('Función de edición próximamente')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Cliente
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
  );
};

export default CustomerDetailPage;