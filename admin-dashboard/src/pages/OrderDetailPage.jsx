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
  X
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

  // Estados posibles de los pedidos - SIMPLIFICADOS
  const orderStatuses = {
    pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
    delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle }
  };

  // Timeline del pedido - SIMPLIFICADO
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

  // Cargar datos del pedido
  useEffect(() => {
    const loadOrder = () => {
      // Simulación de datos (en producción vendría de una API)
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: {
            name: 'María González',
            email: 'maria@email.com',
            phone: '+54 9 11 1234-5678',
            document: '12.345.678'
          },
          date: '2025-06-05T10:30:00',
          status: 'pending',
          total: 3250.00,
          subtotal: 3000.00,
          shipping: 250.00,
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
              price: 1250,
              image: '/images/yerba-taragui.jpg',
              sku: 'YER-TAR-500G'
            }
          ],
          shippingAddress: {
            street: 'Av. Corrientes 1234',
            city: 'CABA',
            state: 'Buenos Aires',
            zipCode: '1043',
            country: 'Argentina'
          },
          billingAddress: {
            street: 'Av. Corrientes 1234',
            city: 'CABA',
            state: 'Buenos Aires',
            zipCode: '1043',
            country: 'Argentina'
          },
          paymentMethod: 'Tarjeta de Crédito (**** 1234)',
          trackingNumber: '',
          notes: 'Entregar en horario de oficina preferentemente'
        },
        {
          id: 'ORD-002',
          customer: {
            name: 'Juan Pérez',
            email: 'juan@email.com',
            phone: '+54 9 11 9876-5432',
            document: '23.456.789'
          },
          date: '2025-06-04T15:45:00',
          status: 'delivered',
          total: 2800.00,
          subtotal: 2600.00,
          shipping: 200.00,
          items: [
            { 
              id: 3,
              name: 'Yerba La Merced 1kg', 
              quantity: 2, 
              price: 1400,
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
          trackingNumber: 'TR123456789AR',
          notes: ''
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

  const handleStatusUpdate = () => {
    if (newStatus !== order.status) {
      setOrder({ ...order, status: newStatus, trackingNumber, notes });
      toast.success(`Estado actualizado a ${orderStatuses[newStatus].label}`);
    }
    setIsEditing(false);
  };

  const handlePrint = () => {
    window.print();
    toast.info('Preparando para imprimir...');
  };

  const handleContact = () => {
    window.open(`mailto:${order.customer.email}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--accent-color) mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles del pedido...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Pedido no encontrado</h3>
        <p className="text-gray-600 mb-4">El pedido {orderId} no existe o ha sido eliminado.</p>
        <Link
          to="/admin/orders"
          className="inline-flex items-center px-4 py-2 bg-(--accent-color) text-white rounded-md hover:opacity-90"
        >
          <ArrowLeft className=" h-4 w-4 mr-2" />
          Volver a pedidos
        </Link>
      </div>
    );
  }

  const timeline = getOrderTimeline(order);
  const statusInfo = orderStatuses[order.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 " />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pedido {order.id}</h1>
            <p className="text-gray-600 mt-1">
              Realizado el {formatDate(order.date)}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={handleContact}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            <MessageCircle className="h-4 w-4 mr-2 cursor-pointer" />
            Contactar
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            <Printer className="h-4 w-4 mr-2 " />
            Imprimir
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-4 py-2 bg-(--accent-color) text-white rounded-md hover:opacity-90 cursor-pointer"
          >
            <Edit className="h-4 w-4 mr-2 " />
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>
        </div>
      </div>

      {/* Estado Actual */}
      <div className={`bg-white p-6 rounded-lg shadow border-l-4 ${statusInfo.color.replace('bg-', 'border-').replace('text-', 'border-')}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <StatusIcon className="h-8 w-8 mr-3 text-gray-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Estado: {statusInfo.label}
              </h3>
              <p className="text-gray-600">
                {order.status === 'pending' && 'El pedido está pendiente de entrega'}
                {order.status === 'delivered' && 'El pedido ha sido entregado exitosamente'}
                {order.status === 'cancelled' && 'El pedido ha sido cancelado'}
              </p>
            </div>
          </div>
          {isEditing && (
            <div className="flex items-center space-x-2">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-(--accent-color)"
              >
                {Object.entries(orderStatuses).map(([key, status]) => (
                  <option key={key} value={key}>{status.label}</option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Productos */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Productos</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                      <p className="text-sm text-gray-600">
                        Cantidad: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(item.quantity * item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Totales */}
              <div className="mt-6 border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío:</span>
                  <span className="font-medium">{formatCurrency(order.shipping)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Historial del Pedido</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {timeline.map((step, index) => {
                  const StepIcon = orderStatuses[step.status].icon;
                  const isLast = index === timeline.length - 1;
                  
                  return (
                    <div key={index} className="relative">
                      {!isLast && (
                        <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-200"></div>
                      )}
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${orderStatuses[step.status].color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 ')} border-2 ${orderStatuses[step.status].color.replace('text-', 'border-')}`}>
                          <StepIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">{step.label}</p>
                            <p className="text-sm text-gray-500">
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
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Información del Cliente */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Cliente</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{order.customer.name}</p>
                  <p className="text-sm text-gray-600">DNI: {order.customer.document}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <a 
                  href={`mailto:${order.customer.email}`}
                  className="text-sm text-(--accent-color) hover:underline"
                >
                  {order.customer.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <a 
                  href={`tel:${order.customer.phone}`}
                  className="text-sm text-(--accent-color) hover:underline"
                >
                  {order.customer.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Dirección de Envío */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Dirección de Envío</h3>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>CP: {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información de Pago */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Pago</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600">{order.paymentMethod}</p>
            </div>
          </div>

          {/* Número de Seguimiento - SIEMPRE VISIBLE */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Seguimiento</h3>
            </div>
            <div className="p-6">
              {isEditing ? (
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Número de tracking (opcional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-(--accent-color)"
                />
              ) : (
                <p className="text-sm font-mono text-gray-900">
                  {trackingNumber || 'No asignado'}
                </p>
              )}
            </div>
          </div>

          {/* Notas */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Notas</h3>
            </div>
            <div className="p-6">
              {isEditing ? (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Agregar notas..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-(--accent-color)"
                />
              ) : (
                <p className="text-sm text-gray-600">
                  {notes || 'Sin notas adicionales'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;