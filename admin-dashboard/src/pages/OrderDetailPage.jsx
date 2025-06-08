import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit,
  Printer,
  MessageCircle,
  Save,
  X,
  CreditCard,
  FileText,
  Download,
  Copy,
  ExternalLink,
  Globe,
  Home,
  Smartphone,
  MoreVertical,
  Eye,
  ChevronDown,
  Badge
} from 'lucide-react';
import { toast } from 'react-toastify';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    products: true,
    timeline: true,
    customer: true,
    orderInfo: true,
    shipping: true,
    payment: true,
    tracking: true,
    notes: true
  });

  // ✅ Estados expandidos de los pedidos
  const orderStatuses = {
    pending: { label: 'Pendiente', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
    delivered: { label: 'Entregado', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
    cancelled: { label: 'Cancelado', color: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle }
  };

  // ✅ Tipos de pedido mejorados
  const orderTypes = {
    online: { 
      label: 'Página Web', 
      color: 'bg-blue-50 text-blue-700 border-blue-200', 
      icon: Globe,
      description: 'Pedido realizado desde la página web'
    },
    presencial: { 
      label: 'Presencial', 
      color: 'bg-green-50 text-green-700 border-green-200', 
      icon: Smartphone,
      description: 'Pedido cargado manualmente'
    }
  };

  // ✅ Métodos de entrega mejorados
  const deliveryMethods = {
    pickup: { 
      label: 'Retiro en Local', 
      color: 'bg-purple-50 text-purple-700 border-purple-200', 
      icon: Home,
      description: 'Cliente retira en el local'
    },
    courier: { 
      label: 'Envío por Correo', 
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200', 
      icon: Truck,
      description: 'Envío por servicio de correo'
    },
    whatsapp_delivery: { 
      label: 'Acordar por WhatsApp', 
      color: 'bg-green-50 text-green-700 border-green-200', 
      icon: Phone,
      description: 'Coordinar entrega por WhatsApp'
    }
  };

  // ✅ Timeline mejorado del pedido
  const getOrderTimeline = (order) => {
    const baseTimeline = [
      {
        status: 'pending',
        label: 'Pedido Recibido',
        date: order.date,
        completed: true,
        description: 'El pedido fue recibido y está siendo procesado'
      }
    ];

    if (order.status === 'delivered') {
      baseTimeline.push({
        status: 'delivered',
        label: 'Entregado',
        date: new Date(new Date(order.date).getTime() + 48 * 60 * 60 * 1000).toISOString(), // 2 días después
        completed: true,
        description: 'El pedido ha sido entregado exitosamente al cliente'
      });
    }

    if (order.status === 'cancelled') {
      baseTimeline.push({
        status: 'cancelled',
        label: 'Cancelado',
        date: new Date().toISOString(),
        completed: true,
        description: 'El pedido ha sido cancelado'
      });
    }

    return baseTimeline;
  };

  // ✅ Cargar datos expandidos del pedido
  useEffect(() => {
    const loadOrder = () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: {
            name: 'María González', 
            email: 'maria@email.com',
            phone: '+54 9 11 1234-5678',
            document: '12.345.678'
          },
          date: '2025-06-07T10:30:00',
          status: 'pending',
          type: 'presencial',
          deliveryMethod: 'pickup',
          total: 3250.00,
          subtotal: 3000.00,
          shipping: 250.00,
          tax: 0.00,
          items: [
            { 
              id: 1,
              name: 'Yerba Amanda 1kg', 
              quantity: 2, 
              price: 1500,
              image: '/images/yerba-amanda.jpg',
              sku: 'YER-AMA-1KG'
            },
            { 
              id: 2,
              name: 'Yerba Taragüi 500g', 
              quantity: 1, 
              price: 1500,
              image: '/images/yerba-taragui.jpg',
              sku: 'YER-TAR-500G'
            }
          ],
          shippingAddress: {
            street: 'Retiro en local',
            city: 'Local de Yerba Xanaes',
            state: 'Buenos Aires',
            zipCode: '-',
            country: 'Argentina'
          },
          billingAddress: {
            street: 'Av. Corrientes 1234',
            city: 'CABA',
            state: 'Buenos Aires',
            zipCode: '1043',
            country: 'Argentina'
          },
          paymentMethod: 'Efectivo',
          paymentStatus: 'pending',
          trackingNumber: '',
          notes: 'Cliente prefiere retirar en horario de tarde'
        },
        {
          id: 'ORD-002',
          customer: {
            name: 'Juan Pérez',
            email: 'juan@email.com',
            phone: '+54 9 11 9876-5432',
            document: '23.456.789'
          },
          date: '2025-06-06T15:45:00',
          status: 'shipped',
          type: 'online',
          deliveryMethod: 'courier',
          total: 2800.00,
          subtotal: 2600.00,
          shipping: 200.00,
          tax: 0.00,
          items: [
            { 
              id: 3,
              name: 'Yerba La Merced 1kg', 
              quantity: 2, 
              price: 1300,
              image: '/images/yerba-merced.jpg',
              sku: 'YER-MER-1KG'
            }
          ],
          shippingAddress: {
            street: 'San Martín 567',
            city: 'Rosario',
            state: 'Santa Fe',
            zipCode: '2000',
            country: 'Argentina'
          },
          billingAddress: {
            street: 'San Martín 567',
            city: 'Rosario',
            state: 'Santa Fe',
            zipCode: '2000',
            country: 'Argentina'
          },
          paymentMethod: 'Transferencia Bancaria',
          paymentStatus: 'paid',
          trackingNumber: 'TR123456789AR',
          courierInfo: {
            company: 'Correo Argentino',
            estimatedDelivery: '2025-06-09T00:00:00'
          },
          notes: 'Cliente prefiere entrega por la mañana'
        }
      ];

      const foundOrder = mockOrders.find(order => order.id === orderId);
      
      if (foundOrder) {
        setOrder(foundOrder);
        setNewStatus(foundOrder.status);
        setTrackingNumber(foundOrder.trackingNumber);
        setNotes(foundOrder.notes);
      }
      
      setIsLoading(false);
    };

    setTimeout(loadOrder, 500);
  }, [orderId]);

  // ✅ Funciones mejoradas
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
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

  const handleStatusUpdate = async () => {
    if (newStatus === order.status && trackingNumber === order.trackingNumber && notes === order.notes) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    
    setTimeout(() => {
      setOrder(prev => ({
        ...prev,
        status: newStatus,
        trackingNumber,
        notes
      }));
      
      toast.success(`Estado actualizado a ${orderStatuses[newStatus].label}`);
      setIsEditing(false);
      setIsSaving(false);
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
    toast.info('Preparando para imprimir...');
  };

  const handleContact = () => {
    const phone = order.customer.phone.replace(/[^\d]/g, '');
    let message = `Hola ${order.customer.name}, te contacto sobre tu pedido ${order.id}.`;
    
    if (order.status === 'pending') {
      message += ' Tu pedido ha sido confirmado y se está preparando. Te mantendremos informado del progreso.';
    } else if (order.status === 'shipped' && order.trackingNumber) {
      message += ` Tu pedido está en camino. Número de seguimiento: ${order.trackingNumber}`;
    }
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    toast.info('Abriendo WhatsApp...');
  };

  const handleEditOrder = () => {
    navigate(`/admin/orders/edit/${order.id}`);
  };

  const handleCopyTracking = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      toast.success('Número de tracking copiado');
    }
  };

  const handleDownloadInvoice = () => {
    toast.info('Descargando factura...');
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // ✅ Loading skeleton mejorado y responsive
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-6">
            {/* Header skeleton */}
            <div className="flex flex-col space-y-4">
              <div className="h-8 bg-gray-200 rounded-lg w-48"></div>
              <div className="h-5 bg-gray-200 rounded w-64"></div>
            </div>
            
            {/* Status card skeleton */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>

            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="flex space-x-4 p-4 border border-gray-100 rounded-lg">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-40"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="h-5 bg-gray-200 rounded w-24 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Pedido no encontrado</h3>
          <p className="text-gray-600 mb-6">El pedido {orderId} no existe o ha sido eliminado.</p>
          <Link
            to="/admin/orders"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a pedidos
          </Link>
        </div>
      </div>
    );
  }

  const timeline = getOrderTimeline(order);
  const statusInfo = orderStatuses[order.status];
  const StatusIcon = statusInfo.icon;
  const typeInfo = orderTypes[order.type];
  const deliveryInfo = deliveryMethods[order.deliveryMethod];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ✅ Header moderno y responsive */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Info principal */}
            <div className="flex items-start space-x-4">
              <button
                onClick={() => navigate('/admin/orders')}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              
              <div className="min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                    Pedido {order.id}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${typeInfo.color}`}>
                      <typeInfo.icon className="h-3 w-3 mr-1.5" />
                      {typeInfo.label}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${deliveryInfo.color}`}>
                      <deliveryInfo.icon className="h-3 w-3 mr-1.5" />
                      {deliveryInfo.label}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-1 sm:space-y-0 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    {formatDate(order.date)}
                  </div>
                  <div className="flex items-center font-semibold text-green-600">
                    <CreditCard className="h-4 w-4 mr-1.5" />
                    {formatCurrency(order.total)}
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center space-x-3">
              {/* Acciones desktop */}
              <div className="hidden lg:flex items-center space-x-3">
                <button
                  onClick={handleEditOrder}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </button>
                <button
                  onClick={handleContact}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </button>
                <button
                  onClick={handleDownloadInvoice}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Factura
                </button>
              </div>

              {/* Estado + Editar */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isEditing 
                    ? 'bg-gray-600 text-white hover:bg-gray-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                <span className="hidden sm:inline">{isEditing ? 'Cancelar' : 'Editar Estado'}</span>
                <span className="sm:hidden">{isEditing ? 'Cancelar' : 'Editar'}</span>
              </button>

              {/* Menú móvil */}
              <div className="lg:hidden relative">
                <button
                  onClick={() => setShowMobileActions(!showMobileActions)}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                
                {showMobileActions && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                      <button
                        onClick={() => { handleEditOrder(); setShowMobileActions(false); }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="h-4 w-4 mr-3" />
                        Editar Pedido
                      </button>
                      <button
                        onClick={() => { handleContact(); setShowMobileActions(false); }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <MessageCircle className="h-4 w-4 mr-3" />
                        Contactar Cliente
                      </button>
                      <button
                        onClick={() => { handleDownloadInvoice(); setShowMobileActions(false); }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4 mr-3" />
                        Descargar Factura
                      </button>
                      <button
                        onClick={() => { handlePrint(); setShowMobileActions(false); }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Printer className="h-4 w-4 mr-3" />
                        Imprimir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Estado Actual moderno */}
        <div className={`bg-white rounded-xl shadow-sm border-l-4 p-6 mb-6 ${statusInfo.color.replace('bg-', 'border-').replace('text-', 'border-')}`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${statusInfo.color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-10 ')}`}>
                <StatusIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Estado: {statusInfo.label}
                </h3>
                <p className="text-gray-600 text-sm">
                  {order.status === 'pending' && 'El pedido está pendiente de confirmación'}
                  {order.status === 'delivered' && 'El pedido ha sido entregado exitosamente'}
                  {order.status === 'cancelled' && 'El pedido ha sido cancelado'}
                </p>
              </div>
            </div>
            
            {isEditing && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(orderStatuses).map(([key, status]) => (
                    <option key={key} value={key}>{status.label}</option>
                  ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={isSaving}
                  className={`flex items-center justify-center px-4 py-2 text-white rounded-lg transition-colors duration-200 ${
                    isSaving 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span className="ml-2 hidden sm:inline">
                    {isSaving ? 'Guardando...' : 'Guardar'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ✅ Contenido principal responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="xl:col-span-2 space-y-6">
            {/* Productos - Sección plegable */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => toggleSection('products')}
                className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900">Productos Pedidos</h3>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSections.products ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedSections.products && (
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                          <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
                            <p className="text-sm text-gray-600">
                              Cantidad: <span className="font-medium">{item.quantity}</span> × {formatCurrency(item.price)}
                            </p>
                            <p className="font-bold text-gray-900 text-lg sm:text-base">
                              {formatCurrency(item.quantity * item.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Totales mejorados */}
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Envío:</span>
                        <span className="font-medium">{formatCurrency(order.shipping)}</span>
                      </div>
                      {order.tax > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">IVA:</span>
                          <span className="font-medium">{formatCurrency(order.tax)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between text-xl font-bold border-t border-gray-200 pt-4">
                      <span>Total:</span>
                      <span className="text-green-600">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline - Sección plegable */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => toggleSection('timeline')}
                className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900">Historial del Pedido</h3>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSections.timeline ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedSections.timeline && (
                <div className="p-6">
                  <div className="space-y-6">
                    {timeline.map((step, index) => {
                      const StepIcon = orderStatuses[step.status].icon;
                      const isLast = index === timeline.length - 1;
                      
                      return (
                        <div key={index} className="relative">
                          {!isLast && (
                            <div className="absolute left-5 top-12 w-0.5 h-8 bg-gray-200"></div>
                          )}
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-full ${orderStatuses[step.status].color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-10 ')} border-2 ${orderStatuses[step.status].color.replace('text-', 'border-')}`}>
                              <StepIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <p className="font-semibold text-gray-900">{step.label}</p>
                                <p className="text-sm text-gray-500 mt-1 sm:mt-0">
                                  {formatDate(step.date)}
                                </p>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ✅ Sidebar moderno y responsive */}
          <div className="space-y-6">
            {/* Información del Cliente */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => toggleSection('customer')}
                className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 xl:cursor-default xl:hover:bg-white"
                disabled={window.innerWidth >= 1280}
              >
                <h3 className="text-lg font-semibold text-gray-900">Cliente</h3>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 xl:hidden ${expandedSections.customer ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`${expandedSections.customer ? 'block' : 'hidden'} xl:block`}>
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate">{order.customer.name}</p>
                      <p className="text-sm text-gray-600">DNI: {order.customer.document}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-600" />
                    </div>
                    <a 
                      href={`mailto:${order.customer.email}`}
                      className="text-sm text-blue-600 hover:underline truncate"
                    >
                      {order.customer.email}
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-600" />
                    </div>
                    <a 
                      href={`tel:${order.customer.phone}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {order.customer.phone}
                    </a>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <Link
                      to={`/admin/customers/${order.customer.email}`}
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <ExternalLink className="h-4 w-4 mr-1.5" />
                      Ver perfil completo
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Información del Pedido */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => toggleSection('orderInfo')}
                className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 xl:cursor-default xl:hover:bg-white"
                disabled={window.innerWidth >= 1280}
              >
                <h3 className="text-lg font-semibold text-gray-900">Información del Pedido</h3>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 xl:hidden ${expandedSections.orderInfo ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`${expandedSections.orderInfo ? 'block' : 'hidden'} xl:block`}>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Tipo de Pedido:</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${typeInfo.color}`}>
                      <typeInfo.icon className="h-3 w-3 mr-1.5" />
                      {typeInfo.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Método de Entrega:</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${deliveryInfo.color}`}>
                      <deliveryInfo.icon className="h-3 w-3 mr-1.5" />
                      {deliveryInfo.label}
                    </span>
                  </div>

                  {/* Información adicional según método de entrega */}
                  {order.deliveryMethod === 'courier' && order.courierInfo && (
                    <div className="pt-3 border-t border-gray-200 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Empresa de Correo:</span>
                        <span className="text-sm font-medium text-gray-900">{order.courierInfo.company}</span>
                      </div>
                      {order.courierInfo.estimatedDelivery && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Entrega Estimada:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(order.courierInfo.estimatedDelivery)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 italic">
                      {deliveryInfo.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resto de las secciones del sidebar con el mismo patrón responsive... */}
            {/* Dirección de Envío, Información de Pago, Seguimiento, Notas */}
            
            {/* Dirección de Envío */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => toggleSection('shipping')}
                className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 xl:cursor-default xl:hover:bg-white"
                disabled={window.innerWidth >= 1280}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {order.deliveryMethod === 'pickup' ? 'Información de Retiro' : 'Dirección de Envío'}
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 xl:hidden ${expandedSections.shipping ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`${expandedSections.shipping ? 'block' : 'hidden'} xl:block`}>
                <div className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg mt-0.5">
                      <MapPin className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="text-sm text-gray-600 min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">{order.shippingAddress.street}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                      {order.shippingAddress.zipCode !== '-' && (
                        <p>CP: {order.shippingAddress.zipCode}</p>
                      )}
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Pago */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => toggleSection('payment')}
                className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 xl:cursor-default xl:hover:bg-white"
                disabled={window.innerWidth >= 1280}
              >
                <h3 className="text-lg font-semibold text-gray-900">Información de Pago</h3>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 xl:hidden ${expandedSections.payment ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`${expandedSections.payment ? 'block' : 'hidden'} xl:block`}>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{order.paymentMethod}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Estado:</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'paid' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    }`}>
                      {order.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seguimiento */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => toggleSection('tracking')}
                className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 xl:cursor-default xl:hover:bg-white"
                disabled={window.innerWidth >= 1280}
              >
                <h3 className="text-lg font-semibold text-gray-900">Seguimiento</h3>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 xl:hidden ${expandedSections.tracking ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`${expandedSections.tracking ? 'block' : 'hidden'} xl:block`}>
                <div className="p-6">
                  {isEditing ? (
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Número de tracking (opcional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div>
                      {trackingNumber ? (
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-mono text-gray-900 break-all">
                            {trackingNumber}
                          </p>
                          <button
                            onClick={handleCopyTracking}
                            className="ml-2 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            title="Copiar número de tracking"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No asignado</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => toggleSection('notes')}
                className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 xl:cursor-default xl:hover:bg-white"
                disabled={window.innerWidth >= 1280}
              >
                <h3 className="text-lg font-semibold text-gray-900">Notas del Pedido</h3>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 xl:hidden ${expandedSections.notes ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`${expandedSections.notes ? 'block' : 'hidden'} xl:block`}>
                <div className="p-6">
                  {isEditing ? (
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      placeholder="Agregar notas internas del pedido..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  ) : (
                    <div>
                      {notes ? (
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{notes}</p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Sin notas adicionales</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;