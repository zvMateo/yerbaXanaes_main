import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Search, 
  Filter, 
  Download,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Edit,
  MessageCircle,
  Plus,
  MapPin,
  Home,
  Smartphone,
  Globe,
  Truck,
  Phone
} from 'lucide-react';
import { toast } from 'react-toastify';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // ✅ Estados simplificados
  const orderStatuses = {
    pending: { 
      label: 'Pendiente', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      icon: Clock,
      description: 'Pedido recibido, pendiente de entrega'
    },
    delivered: { 
      label: 'Entregado', 
      color: 'bg-green-100 text-green-800 border-green-200', 
      icon: CheckCircle,
      description: 'Pedido entregado exitosamente'
    },
    cancelled: { 
      label: 'Cancelado', 
      color: 'bg-red-100 text-red-800 border-red-200', 
      icon: AlertCircle,
      description: 'Pedido cancelado'
    }
  };

  // ✅ Tipos de pedido actualizados
  const orderTypes = {
    online: { 
      label: 'Página Web', 
      color: 'bg-blue-100 text-blue-800', 
      icon: Globe,
      description: 'Pedido realizado desde la página web'
    },
    presencial: { 
      label: 'Presencial', 
      color: 'bg-green-100 text-green-800', 
      icon: Smartphone,
      description: 'Pedido cargado manualmente'
    }
  };

  // ✅ Métodos de entrega actualizados (3 opciones)
  const deliveryMethods = {
    pickup: { 
      label: 'Retiro en Local', 
      color: 'bg-purple-100 text-purple-800', 
      icon: Home,
      description: 'Cliente retira en el local'
    },
    courier: { 
      label: 'Envío por Correo', 
      color: 'bg-indigo-100 text-indigo-800', 
      icon: Truck,
      description: 'Envío por servicio de correo'
    },
    whatsapp_delivery: { 
      label: 'Acordar por WhatsApp', 
      color: 'bg-green-100 text-green-800', 
      icon: Phone,
      description: 'Coordinar entrega por WhatsApp'
    }
  };

  // ✅ Datos mock actualizados con los nuevos métodos
  useEffect(() => {
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: {
            name: 'María González',
            email: 'maria@email.com',
            phone: '+54 9 11 1234-5678'
          },
          date: '2025-06-07T10:30:00',
          status: 'pending',
          type: 'presencial',
          deliveryMethod: 'pickup',
          total: 3250.00,
          shippingCost: 0,
          items: [
            { name: 'Yerba Amanda 1kg', quantity: 2, price: 1500 },
            { name: 'Yerba Taragüi 500g', quantity: 1, price: 1250 }
          ],
          shippingAddress: 'Retiro en local',
          notes: 'Cliente prefiere retirar en horario de tarde',
          priority: 'normal'
        },
        {
          id: 'ORD-002',
          customer: {
            name: 'Juan Pérez',
            email: 'juan@email.com',
            phone: '+54 9 11 9876-5432'
          },
          date: '2025-06-06T15:45:00',
          status: 'delivered',
          type: 'online',
          deliveryMethod: 'courier',
          total: 2800.00,
          shippingCost: 850.00,
          items: [
            { name: 'Yerba La Merced 1kg', quantity: 2, price: 1400 }
          ],
          shippingAddress: 'San Martín 567, Rosario, Santa Fe (CP: 2000)',
          courierInfo: {
            company: 'Correo Argentino',
            trackingNumber: 'AR123456789',
            estimatedDelivery: '2025-06-08T00:00:00'
          },
          notes: 'Entregado por Correo Argentino el 06/06',
          priority: 'normal'
        },
        {
          id: 'ORD-003',
          customer: {
            name: 'Ana López',
            email: 'ana@email.com',
            phone: '+54 9 351 123-4567'
          },
          date: '2025-06-05T09:15:00',
          status: 'pending',
          type: 'online',
          deliveryMethod: 'whatsapp_delivery',
          total: 4150.00,
          shippingCost: 0,
          items: [
            { name: 'Yerba Playadito 1kg', quantity: 3, price: 1350 },
            { name: 'Mate de Madera', quantity: 1, price: 650 }
          ],
          shippingAddress: 'Córdoba, Córdoba - Coordinar por WhatsApp',
          whatsappCoordination: {
            status: 'contacted',
            contactedAt: '2025-06-05T14:30:00',
            notes: 'Cliente contactado, esperando respuesta'
          },
          notes: 'Cliente prefiere coordinar horario y lugar',
          priority: 'high'
        },
        {
          id: 'ORD-004',
          customer: {
            name: 'Carlos Rodríguez',
            email: 'carlos@email.com',
            phone: '+54 9 261 555-1234'
          },
          date: '2025-06-04T14:20:00',
          status: 'delivered',
          type: 'presencial',
          deliveryMethod: 'pickup',
          total: 1850.00,
          shippingCost: 0,
          items: [
            { name: 'Yerba Rosamonte 500g', quantity: 2, price: 925 }
          ],
          shippingAddress: 'Retiro en local',
          notes: 'Retirado el 04/06 a las 16:00',
          priority: 'normal'
        },
        {
          id: 'ORD-005',
          customer: {
            name: 'Sofía Martinez',
            email: 'sofia@email.com',
            phone: '+54 9 223 777-8888'
          },
          date: '2025-06-03T11:00:00',
          status: 'pending',
          type: 'online',
          deliveryMethod: 'whatsapp_delivery',
          total: 2100.00,
          shippingCost: 0,
          items: [
            { name: 'Yerba Union 1kg', quantity: 1, price: 1400 },
            { name: 'Bombilla Alpaca', quantity: 1, price: 700 }
          ],
          shippingAddress: 'Mar del Plata, Buenos Aires - Coordinar entrega',
          whatsappCoordination: {
            status: 'pending',
            notes: 'Pendiente contactar cliente'
          },
          notes: 'Cliente solicita coordinación para entrega',
          priority: 'normal'
        },
        {
          id: 'ORD-006',
          customer: {
            name: 'Diego Fernández',
            email: 'diego@email.com',
            phone: '+54 9 341 444-5555'
          },
          date: '2025-06-02T16:30:00',
          status: 'cancelled',
          type: 'online',
          deliveryMethod: 'courier',
          total: 3500.00,
          shippingCost: 950.00,
          items: [
            { name: 'Yerba Cruz de Malta 1kg', quantity: 2, price: 1200 },
            { name: 'Set Matero Completo', quantity: 1, price: 1100 }
          ],
          shippingAddress: 'Rosario, Santa Fe (CP: 2000)',
          cancellationReason: 'Cliente canceló antes del envío',
          notes: 'Cancelado por solicitud del cliente',
          priority: 'normal'
        },
        {
          id: 'ORD-007',
          customer: {
            name: 'Lucia Ramírez',
            email: 'lucia@email.com',
            phone: '+54 9 11 333-2222'
          },
          date: '2025-06-01T08:45:00',
          status: 'pending',
          type: 'online',
          deliveryMethod: 'courier',
          total: 2750.00,
          shippingCost: 675.00,
          items: [
            { name: 'Yerba Taragüi 1kg', quantity: 1, price: 1350 },
            { name: 'Mate Imperial', quantity: 1, price: 1400 }
          ],
          shippingAddress: 'Mendoza, Mendoza (CP: 5500)',
          courierInfo: {
            company: 'OCA',
            trackingNumber: 'OCA987654321',
            estimatedDelivery: '2025-06-09T00:00:00'
          },
          notes: 'Envío programado para entrega en Mendoza',
          priority: 'normal'
        },
        {
          id: 'ORD-008',
          customer: {
            name: 'Roberto Silva',
            email: 'roberto@email.com',
            phone: '+54 9 387 456-7890'
          },
          date: '2025-05-31T16:20:00',
          status: 'delivered',
          type: 'online',
          deliveryMethod: 'whatsapp_delivery',
          total: 1950.00,
          shippingCost: 0,
          items: [
            { name: 'Yerba Rosamonte 1kg', quantity: 1, price: 1200 },
            { name: 'Bombilla de Acero', quantity: 1, price: 750 }
          ],
          shippingAddress: 'Salta, Salta - Entregado en encuentro coordinado',
          whatsappCoordination: {
            status: 'completed',
            contactedAt: '2025-05-31T18:00:00',
            arrangedAt: '2025-06-01T10:00:00',
            notes: 'Entregado en Plaza 9 de Julio, Salta'
          },
          notes: 'Entrega exitosa en punto de encuentro',
          priority: 'normal'
        }
      ];
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  // ✅ Filtros actualizados
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.phone.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(order => order.type === typeFilter);
    }

    if (deliveryFilter !== 'all') {
      filtered = filtered.filter(order => order.deliveryMethod === deliveryFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date);
        
        switch (dateFilter) {
          case 'today':
            return orderDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, searchTerm, statusFilter, typeFilter, deliveryFilter, dateFilter]);

  // ✅ Funciones helpers actualizadas
  const getTypeBadge = (type) => {
    const typeInfo = orderTypes[type];
    const Icon = typeInfo.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {typeInfo.label}
      </span>
    );
  };

  // ✅ Badge de entrega mejorado con información adicional
  const getDeliveryBadge = (delivery, order) => {
    const deliveryInfo = deliveryMethods[delivery];
    const Icon = deliveryInfo.icon;
    
    let extraInfo = '';
    let colorClass = deliveryInfo.color;
    
    if (delivery === 'courier' && order.courierInfo) {
      extraInfo = ` (${order.courierInfo.company})`;
    }
    
    if (delivery === 'whatsapp_delivery' && order.whatsappCoordination) {
      const statusIcons = {
        pending: '⏳',
        contacted: '📞',
        arranged: '✅',
        completed: '🎯'
      };
      extraInfo = ` ${statusIcons[order.whatsappCoordination.status]}`;
      
      // Cambiar color según el estado de coordinación
      if (order.whatsappCoordination.status === 'pending') {
        colorClass = 'bg-yellow-100 text-yellow-800';
      } else if (order.whatsappCoordination.status === 'contacted') {
        colorClass = 'bg-blue-100 text-blue-800';
      } else if (order.whatsappCoordination.status === 'arranged') {
        colorClass = 'bg-green-100 text-green-800';
      }
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        <Icon className="h-3 w-3 mr-1" />
        {deliveryInfo.label}{extraInfo}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusInfo = orderStatuses[status];
    const Icon = statusInfo.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {statusInfo.label}
      </span>
    );
  };

  // ✅ Función para mostrar total con envío
  const formatTotalWithShipping = (order) => {
    const baseTotal = order.total;
    const shippingCost = order.shippingCost || 0;
    const grandTotal = baseTotal + shippingCost;
    
    if (shippingCost > 0) {
      return (
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">
            {formatCurrency(grandTotal)}
          </div>
          <div className="text-xs text-gray-500">
            (+ {formatCurrency(shippingCost)} envío)
          </div>
        </div>
      );
    }
    
    return (
      <div className="text-sm font-medium text-gray-900">
        {formatCurrency(grandTotal)}
      </div>
    );
  };

  // ✅ Resto de funciones sin cambios
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Pedidos actualizados correctamente');
    }, 1000);
  };

  const handleExport = () => {
    const exportData = filteredOrders.map(order => ({
      id: order.id,
      cliente: order.customer.name,
      telefono: order.customer.phone,
      fecha: formatDate(order.date),
      estado: orderStatuses[order.status].label,
      tipo: orderTypes[order.type].label,
      entrega: deliveryMethods[order.deliveryMethod].label,
      total: order.total,
      envio: order.shippingCost || 0,
      totalConEnvio: order.total + (order.shippingCost || 0),
      productos: order.items.length,
      notas: order.notes
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `pedidos-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Datos exportados correctamente');
  };

  const handleQuickAction = (orderId, action) => {
    const order = orders.find(o => o.id === orderId);
    switch (action) {
      case 'contact':
        const phone = order.customer.phone.replace(/[^\d]/g, '');
        let message = `Hola ${order.customer.name}, te contacto sobre tu pedido ${orderId}.`;
        
        if (order.deliveryMethod === 'whatsapp_delivery') {
          message += ' Necesitamos coordinar la entrega. ¿Cuándo y dónde te resulta conveniente?';
        }
        
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        toast.info('Abriendo WhatsApp...');
        break;
      case 'edit':
        toast.info('Redirigiendo a edición...');
        break;
      default:
        break;
    }
  };

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

  const getPriorityIndicator = (priority) => {
    if (priority === 'high') {
      return <div className="w-2 h-2 bg-red-500 rounded-full" title="Alta prioridad" />;
    }
    return null;
  };

  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/8"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/8"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ✅ Header actualizado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h1>
          <p className="text-gray-600 mt-1">
            {filteredOrders.length} de {orders.length} pedidos • Página {currentPage} de {totalPages || 1}
          </p>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Link
            to="/admin/orders/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-150"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Pedido
          </Link>
          <button 
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button 
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 ${showFilters ? 'bg-gray-50' : ''}`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-150 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* ✅ Filtros expandidos */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar pedido
              </label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="ID, cliente, teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                {Object.entries(orderStatuses).map(([key, status]) => (
                  <option key={key} value={key}>{status.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Pedido
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los tipos</option>
                {Object.entries(orderTypes).map(([key, type]) => (
                  <option key={key} value={key}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Entrega
              </label>
              <select
                value={deliveryFilter}
                onChange={(e) => setDeliveryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los métodos</option>
                {Object.entries(deliveryMethods).map(([key, method]) => (
                  <option key={key} value={key}>{method.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las fechas</option>
                <option value="today">Hoy</option>
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
              </select>
            </div>
          </div>
          
          {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || deliveryFilter !== 'all' || dateFilter !== 'all') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                  setDeliveryFilter('all');
                  setDateFilter('all');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* ✅ Lista de Pedidos actualizada */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pedidos</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || deliveryFilter !== 'all' || dateFilter !== 'all' 
                ? 'No se encontraron pedidos con los filtros aplicados.' 
                : 'Aún no tienes pedidos registrados.'
              }
            </p>
            <Link
              to="/admin/orders/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar primer pedido
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pedido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo / Entrega
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
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getPriorityIndicator(order.priority)}
                          <div className={`${order.priority === 'high' ? 'ml-2' : ''}`}>
                            <div className="text-sm font-medium text-gray-900">
                              {order.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {order.customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          {getTypeBadge(order.type)}
                          {getDeliveryBadge(order.deliveryMethod, order)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(order.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatTotalWithShipping(order)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Link>
                          
                          <div className="relative group">
                            <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-150">
                              <MoreVertical className="h-4 w-4 text-gray-400" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                              <button
                                onClick={() => handleQuickAction(order.id, 'contact')}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <MessageCircle className="h-3 w-3 mr-2" />
                                WhatsApp
                              </button>
                              <button
                                onClick={() => handleQuickAction(order.id, 'edit')}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <Edit className="h-3 w-3 mr-2" />
                                Editar
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                      <span className="font-medium">{Math.min(endIndex, filteredOrders.length)}</span> de{' '}
                      <span className="font-medium">{filteredOrders.length}</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        return (
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
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ✅ Estadísticas actualizadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Estados */}
        {Object.entries(orderStatuses).map(([status, statusInfo]) => {
          const count = orders.filter(order => order.status === status).length;
          const percentage = orders.length > 0 ? ((count / orders.length) * 100).toFixed(1) : 0;
          const Icon = statusInfo.icon;
          
          return (
            <div key={status} className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow duration-150">
              <div className="flex items-center">
                <div className={`p-2 rounded-md ${statusInfo.color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 text-')}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">{statusInfo.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500">{percentage}%</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Métodos de entrega */}
        {Object.entries(deliveryMethods).map(([method, methodInfo]) => {
          const count = orders.filter(order => order.deliveryMethod === method).length;
          const percentage = orders.length > 0 ? ((count / orders.length) * 100).toFixed(1) : 0;
          const Icon = methodInfo.icon;
          
          return (
            <div key={method} className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow duration-150">
              <div className="flex items-center">
                <div className={`p-2 rounded-md ${methodInfo.color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 text-')}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">{methodInfo.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500">{percentage}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderListPage;