import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Search,
  Calculator,
  User,
  MapPin,
  CreditCard,
  Package,
  Phone,
  Globe,
  Home,
  Truck,
  MessageCircle,
  Save,
  X
} from 'lucide-react';
import ProductSelectionModal from '../components/ProductSelectionModal';

// Esquemas de validación
const customerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Teléfono debe tener al menos 10 dígitos'),
  document: z.string().min(7, 'Documento inválido')
});

const addressSchema = z.object({
  street: z.string().min(5, 'Dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'Ciudad requerida'),
  state: z.string().min(2, 'Provincia requerida'),
  zipCode: z.string().min(4, 'Código postal inválido'),
  country: z.string().default('Argentina')
});

const orderSchema = z.object({
  customer: customerSchema,
  type: z.enum(['online', 'presencial']),
  deliveryMethod: z.enum(['pickup', 'courier', 'whatsapp_delivery']),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
    sku: z.string()
  })).min(1, 'Debe agregar al menos un producto'),
  shippingAddress: addressSchema.optional(),
  paymentMethod: z.string().min(1, 'Método de pago requerido'),
  notes: z.string().optional(),
  shippingCost: z.number().min(0).default(0)
});

const initialFormData = {
  customer: {
    name: '',
    email: '',
    phone: '',
    document: ''
  },
  type: 'presencial',
  deliveryMethod: 'pickup',
  items: [],
  shippingAddress: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Argentina'
  },
  paymentMethod: '',
  notes: '',
  shippingCost: 0
};

const OrderFormPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const isEditMode = Boolean(orderId);

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [suggestedCustomers, setSuggestedCustomers] = useState([]);

  // Datos mock de clientes existentes
  const mockCustomers = [
    {
      name: 'María González',
      email: 'maria@email.com',
      phone: '+54 9 11 1234-5678',
      document: '12.345.678'
    },
    {
      name: 'Juan Pérez',
      email: 'juan@email.com',
      phone: '+54 9 11 9876-5432',
      document: '23.456.789'
    }
  ];

  // Métodos de entrega
  const deliveryMethods = {
    pickup: { 
      label: 'Retiro en Local', 
      icon: Home,
      requiresAddress: false,
      shippingCost: 0
    },
    courier: { 
      label: 'Envío por Correo', 
      icon: Truck,
      requiresAddress: true,
      shippingCost: 850
    },
    whatsapp_delivery: { 
      label: 'Acordar por WhatsApp', 
      icon: MessageCircle,
      requiresAddress: false,
      shippingCost: 0
    }
  };

  const paymentMethods = [
    'Efectivo',
    'Tarjeta de Débito',
    'Tarjeta de Crédito',
    'Transferencia Bancaria',
    'MercadoPago',
    'Otro'
  ];

  // Cargar datos si es modo edición
  useEffect(() => {
    if (isEditMode && orderId) {
      setIsLoading(true);
      // Simular carga de datos
      setTimeout(() => {
        // Aquí iría la carga real del pedido
        setIsLoading(false);
      }, 1000);
    }
  }, [isEditMode, orderId]);

  // Buscar clientes
  useEffect(() => {
    if (searchCustomer.length > 2) {
      const filtered = mockCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchCustomer.toLowerCase()) ||
        customer.phone.includes(searchCustomer)
      );
      setSuggestedCustomers(filtered);
    } else {
      setSuggestedCustomers([]);
    }
  }, [searchCustomer]);

  // Calcular totales
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = formData.shippingCost;
    const tax = 0; // Por ahora sin impuestos
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Limpiar errores
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${section}.${field}`]: undefined
      }));
    }
  };

  const handleDirectChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Actualizar costo de envío según método de entrega
    if (field === 'deliveryMethod') {
      const method = deliveryMethods[value];
      setFormData(prev => ({
        ...prev,
        shippingCost: method.shippingCost
      }));
    }

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleCustomerSelect = (customer) => {
    setFormData(prev => ({
      ...prev,
      customer
    }));
    setSearchCustomer(customer.name);
    setSuggestedCustomers([]);
  };

  const handleProductsSelect = (selectedProducts) => {
    const items = selectedProducts.map(product => ({
      id: product._id,
      name: product.name,
      price: product.price || (product.packageSizes && product.packageSizes[0]?.price) || 0,
      quantity: 1,
      sku: product.sku || `SKU-${product._id}`
    }));

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, ...items]
    }));
  };

  const updateItemQuantity = (index, quantity) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }

    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, quantity: parseInt(quantity) } : item
      )
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validar formulario
      const validationResult = orderSchema.safeParse(formData);
      
      if (!validationResult.success) {
        const formattedErrors = {};
        validationResult.error.errors.forEach(error => {
          const path = error.path.join('.');
          formattedErrors[path] = error.message;
        });
        setErrors(formattedErrors);
        toast.error('Por favor, corrige los errores en el formulario');
        return;
      }

      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (isEditMode) {
        toast.success('¡Pedido actualizado exitosamente!');
      } else {
        toast.success('¡Pedido creado exitosamente!');
      }

      navigate('/admin/orders');

    } catch (error) {
      toast.error('Error al procesar el pedido');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const { subtotal, shipping, tax, total } = calculateTotals();
  const selectedMethod = deliveryMethods[formData.deliveryMethod];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Editar Pedido' : 'Nuevo Pedido'}
            </h1>
            <p className="text-gray-600">
              {isEditMode ? `Editando pedido ${orderId}` : 'Crear un nuevo pedido manualmente'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información del Cliente */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Información del Cliente
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {/* Búsqueda de cliente */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buscar Cliente Existente
                  </label>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchCustomer}
                      onChange={(e) => setSearchCustomer(e.target.value)}
                      placeholder="Buscar por nombre, email o teléfono..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {suggestedCustomers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                      {suggestedCustomers.map((customer, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleCustomerSelect(customer)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                        >
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-600">{customer.email} • {customer.phone}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.customer.name}
                      onChange={(e) => handleInputChange('customer', 'name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors['customer.name'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors['customer.name'] && (
                      <p className="mt-1 text-xs text-red-600">{errors['customer.name']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.customer.email}
                      onChange={(e) => handleInputChange('customer', 'email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors['customer.email'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors['customer.email'] && (
                      <p className="mt-1 text-xs text-red-600">{errors['customer.email']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={formData.customer.phone}
                      onChange={(e) => handleInputChange('customer', 'phone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors['customer.phone'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors['customer.phone'] && (
                      <p className="mt-1 text-xs text-red-600">{errors['customer.phone']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento *
                    </label>
                    <input
                      type="text"
                      value={formData.customer.document}
                      onChange={(e) => handleInputChange('customer', 'document', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors['customer.document'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors['customer.document'] && (
                      <p className="mt-1 text-xs text-red-600">{errors['customer.document']}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tipo y Método de Entrega */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Tipo y Entrega
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Pedido
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleDirectChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="presencial">Presencial (Manual)</option>
                      <option value="online">Página Web</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Método de Entrega
                    </label>
                    <select
                      value={formData.deliveryMethod}
                      onChange={(e) => handleDirectChange('deliveryMethod', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(deliveryMethods).map(([key, method]) => (
                        <option key={key} value={key}>{method.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dirección si es necesaria */}
                {selectedMethod.requiresAddress && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Dirección de Envío
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dirección *
                        </label>
                        <input
                          type="text"
                          value={formData.shippingAddress.street}
                          onChange={(e) => handleInputChange('shippingAddress', 'street', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors['shippingAddress.street'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ciudad *
                        </label>
                        <input
                          type="text"
                          value={formData.shippingAddress.city}
                          onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors['shippingAddress.city'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Provincia *
                        </label>
                        <input
                          type="text"
                          value={formData.shippingAddress.state}
                          onChange={(e) => handleInputChange('shippingAddress', 'state', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors['shippingAddress.state'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Código Postal *
                        </label>
                        <input
                          type="text"
                          value={formData.shippingAddress.zipCode}
                          onChange={(e) => handleInputChange('shippingAddress', 'zipCode', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors['shippingAddress.zipCode'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Productos */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Productos ({formData.items.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowProductModal(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar Productos
                  </button>
                </div>
              </div>
              <div className="p-6">
                {formData.items.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No hay productos agregados</p>
                    <button
                      type="button"
                      onClick={() => setShowProductModal(true)}
                      className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Agregar el primer producto
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(index, e.target.value)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          />
                          <span className="text-sm text-gray-600">×</span>
                          <span className="w-20 text-sm font-medium">{formatCurrency(item.price)}</span>
                          <span className="w-20 text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {errors.items && (
                  <p className="mt-2 text-xs text-red-600">{errors.items}</p>
                )}
              </div>
            </div>

            {/* Método de Pago y Notas */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pago y Notas
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método de Pago *
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => handleDirectChange('paymentMethod', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.paymentMethod ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar método de pago</option>
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                  {errors.paymentMethod && (
                    <p className="mt-1 text-xs text-red-600">{errors.paymentMethod}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas del Pedido
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleDirectChange('notes', e.target.value)}
                    rows={3}
                    placeholder="Notas adicionales sobre el pedido..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg sticky top-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Resumen del Pedido
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío ({selectedMethod.label}):</span>
                    <span className="font-medium">{formatCurrency(shipping)}</span>
                  </div>
                  {tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">IVA:</span>
                      <span className="font-medium">{formatCurrency(tax)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-green-600">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || formData.items.length === 0}
                    className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isSubmitting || formData.items.length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isEditMode ? 'Actualizando...' : 'Creando...'}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isEditMode ? 'Actualizar Pedido' : 'Crear Pedido'}
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate('/admin/orders')}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Modal de Selección de Productos */}
      <ProductSelectionModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        selectedProducts={formData.items}
        onProductsSelect={handleProductsSelect}
      />
    </div>
  );
};

export default OrderFormPage;
