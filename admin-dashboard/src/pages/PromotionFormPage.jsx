import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Save,
  X,
  Calendar,
  Percent,
  DollarSign,
  Tag,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Eye,
  EyeOff,
  Copy,
  Shuffle
} from 'lucide-react';
import { toast } from 'react-toastify';
import ProductSelectionModal from '../components/ProductSelectionModal';

const PromotionFormPage = () => {
  const { promotionId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!!promotionId);
  
  // ✅ NUEVOS ESTADOS PARA EL MODAL
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProductsData, setSelectedProductsData] = useState([]);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'percentage',
    value: '',
    code: '',
    status: 'draft',
    startDate: '',
    endDate: '',
    usageLimit: '',
    minOrderAmount: '',
    applicableProducts: 'all',
    selectedProducts: [],
    isCodeVisible: true
  });

  const [errors, setErrors] = useState({});

  // Estados de las promociones
  const promotionStatuses = {
    draft: { label: 'Borrador', color: 'bg-gray-100 text-gray-800', icon: Clock },
    active: { label: 'Activa', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    scheduled: { label: 'Programada', color: 'bg-blue-100 text-blue-800', icon: Calendar },
    paused: { label: 'Pausada', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle }
  };

  // Tipos de promociones
  const promotionTypes = {
    percentage: { 
      label: 'Porcentaje', 
      icon: Percent, 
      symbol: '%',
      description: 'Descuento por porcentaje del total',
      placeholder: 'Ej: 20 para 20%'
    },
    fixed: { 
      label: 'Monto Fijo', 
      icon: DollarSign, 
      symbol: '$',
      description: 'Descuento de monto fijo',
      placeholder: 'Ej: 500 para $500'
    },
    bogo: { 
      label: '2x1', 
      icon: Tag, 
      symbol: '2x1',
      description: 'Llevá 2 productos y pagá 1',
      placeholder: ''
    },
    shipping: { 
      label: 'Envío Gratis', 
      icon: Users, 
      symbol: 'FREE',
      description: 'Envío sin costo',
      placeholder: ''
    }
  };

  // Cargar datos si es edición
  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      
      // Simular carga de datos (en producción vendría de API)
      setTimeout(() => {
        const mockPromotion = {
          id: 'PROMO-001',
          name: 'Descuento de Verano',
          description: '20% de descuento en todas las yerbas',
          type: 'percentage',
          value: 20,
          code: 'VERANO20',
          status: 'active',
          startDate: '2025-06-01',
          endDate: '2025-06-30',
          usageLimit: 100,
          minOrderAmount: 1000,
          applicableProducts: 'specific', // Ejemplo con productos específicos
          selectedProducts: ['prod001', 'prod002']
        };

        setFormData({
          ...mockPromotion,
          startDate: mockPromotion.startDate,
          endDate: mockPromotion.endDate,
          usageLimit: mockPromotion.usageLimit.toString(),
          minOrderAmount: mockPromotion.minOrderAmount.toString(),
          value: mockPromotion.value.toString(),
          isCodeVisible: true
        });

        // Simular carga de productos seleccionados para edición
        if (mockPromotion.applicableProducts === 'specific') {
          const mockSelectedProducts = [
            {
              _id: 'prod001',
              name: 'Yerba Mate Amanda Tradicional',
              imageUrl: '/api/placeholder/300/200'
            },
            {
              _id: 'prod002',
              name: 'Yerba Mate Taragüi',
              imageUrl: '/api/placeholder/300/200'
            }
          ];
          setSelectedProductsData(mockSelectedProducts);
        }
        
        setIsLoading(false);
      }, 500);
    } else {
      // Configurar fechas por defecto para nueva promoción
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      setFormData(prev => ({
        ...prev,
        startDate: today.toISOString().split('T')[0],
        endDate: nextWeek.toISOString().split('T')[0]
      }));
    }
  }, [isEditing]);

  // Generar código automáticamente
  const generateCode = () => {
    const prefix = formData.name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 6);
    
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newCode = `${prefix}${suffix}`;
    
    setFormData(prev => ({
      ...prev,
      code: newCode
    }));
    
    toast.success('Código generado automáticamente');
  };

  // ✅ NUEVA FUNCIÓN: Manejar selección de productos
  const handleProductsSelect = (productIds, productsData) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: productIds
    }));
    setSelectedProductsData(productsData);
  };

  // ✅ NUEVA FUNCIÓN: Obtener valor interno para procesamiento
  const getInternalValue = () => {
    switch (formData.type) {
      case 'bogo':
        return '50'; // Valor interno para 2x1
      case 'shipping':
        return '0'; // Valor interno para envío gratis
      default:
        return formData.value; // Valor ingresado por el usuario
    }
  };

  // ✅ NUEVA FUNCIÓN: Obtener valor para mostrar en el resumen
  const getDisplayValue = () => {
    switch (formData.type) {
      case 'percentage':
        return formData.value ? `${formData.value}%` : '';
      case 'fixed':
        return formData.value ? `$${formData.value}` : '';
      case 'bogo':
        return '2x1'; // ✅ Mostrar 2x1 en el resumen
      case 'shipping':
        return 'Gratis'; // ✅ Mostrar Gratis en el resumen
      default:
        return formData.value;
    }
  };

  // ✅ ACTUALIZAR handleInputChange para abrir modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error específico
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // ✅ ABRIR MODAL cuando se selecciona "specific"
    if (name === 'applicableProducts') {
      if (value === 'specific') {
        setIsProductModalOpen(true);
      } else if (value === 'all') {
        // Limpiar productos seleccionados si cambia a "todos"
        setFormData(prev => ({
          ...prev,
          selectedProducts: []
        }));
        setSelectedProductsData([]);
      }
    }

    // ✅ LÓGICA CORREGIDA: Campo vacío visualmente, valor interno automático
    if (name === 'type') {
      let newValue = '';
      
      switch (value) {
        case 'bogo':
          newValue = ''; // ✅ Campo vacío visualmente, pero procesaremos como 50%
          break;
        case 'shipping':
          newValue = ''; // ✅ Campo vacío visualmente, pero procesaremos como 0
          break;
        case 'percentage':
        case 'fixed':
        default:
          newValue = ''; // ✅ Campo vacío para que el usuario ingrese
          break;
      }
      
      setFormData(prev => ({
        ...prev,
        type: value,
        value: newValue
      }));
    }
  };

  // Validar formulario - ACTUALIZADO
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'El código es obligatorio';
    }

    // ✅ VALIDACIÓN CORREGIDA: Usar valor interno
    const internalValue = getInternalValue();
    if (!internalValue || parseFloat(internalValue) < 0) {
      // Solo validar para tipos que requieren input del usuario
      if (formData.type === 'percentage' || formData.type === 'fixed') {
        if (!formData.value || parseFloat(formData.value) <= 0) {
          newErrors.value = 'El valor debe ser mayor a 0';
        }
      }
    }

    if (formData.type === 'percentage' && formData.value && parseFloat(formData.value) > 100) {
      newErrors.value = 'El porcentaje no puede ser mayor a 100%';
    }

    // ✅ VALIDAR PRODUCTOS ESPECÍFICOS
    if (formData.applicableProducts === 'specific' && formData.selectedProducts.length === 0) {
      newErrors.selectedProducts = 'Debes seleccionar al menos un producto';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es obligatoria';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de fin es obligatoria';
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la de inicio';
    }

    if (formData.minOrderAmount && parseFloat(formData.minOrderAmount) < 0) {
      newErrors.minOrderAmount = 'El monto mínimo no puede ser negativo';
    }

    if (formData.usageLimit && parseInt(formData.usageLimit) <= 0) {
      newErrors.usageLimit = 'El límite de uso debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guardar promoción - ACTUALIZADO
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setIsLoading(true);

    try {
      // ✅ USAR VALOR INTERNO para el guardado
      const dataToSave = {
        ...formData,
        value: getInternalValue() // Valor real para guardar
      };

      // Log para debugging
      console.log('Datos a guardar:', {
        ...dataToSave,
        selectedProductsCount: dataToSave.selectedProducts.length
      });

      // Simular guardado (en producción sería una llamada a API)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const action = isEditing ? 'actualizada' : 'creada';
      toast.success(`Promoción ${action} exitosamente`);
      
      navigate('/admin/promotions');
    } catch (err) {
      console.error('Error al guardar promoción:', err);
      toast.error('Error al guardar la promoción');
    } finally {
      setIsLoading(false);
    }
  };

  // Copiar código
  const handleCopyCode = () => {
    navigator.clipboard.writeText(formData.code);
    toast.success('Código copiado al portapapeles');
  };

  const currentType = promotionTypes[formData.type];
  const currentStatus = promotionStatuses[formData.status];

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
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Promoción' : 'Nueva Promoción'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'Modifica los datos de la promoción' : 'Crea una nueva promoción para tus productos'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Básica */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
              </div>
              <div className="p-6 space-y-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la promoción *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Descuento de Verano"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-(--accent-color) ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe los detalles de la promoción..."
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-(--accent-color) ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Tipo de Promoción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de promoción *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(promotionTypes).map(([key, type]) => {
                      const Icon = type.icon;
                      const isSelected = formData.type === key;
                      
                      return (
                        <label key={key} className="cursor-pointer">
                          <input
                            type="radio"
                            name="type"
                            value={key}
                            checked={isSelected}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`p-4 border-2 rounded-lg transition-all ${
                            isSelected 
                              ? 'border-(--accent-color) bg-(--accent-color) bg-opacity-5' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className="flex items-center space-x-3">
                              <Icon className={`h-5 w-5 ${isSelected ? 'text-(--accent-color)' : 'text-gray-400'}`} />
                              <div>
                                <div className="font-medium text-gray-900">{type.label}</div>
                                <div className="text-sm text-gray-500">{type.description}</div>
                              </div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Valor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor del descuento *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        {currentType.symbol}
                      </span>
                    </div>
                    <input
                      type="number"
                      name="value"
                      value={formData.value}
                      onChange={handleInputChange}
                      placeholder={currentType.placeholder}
                      disabled={formData.type === 'bogo' || formData.type === 'shipping'}
                      className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-(--accent-color) ${
                        errors.value ? 'border-red-300' : 'border-gray-300'
                      } ${
                        formData.type === 'bogo' || formData.type === 'shipping' ? 'bg-gray-50' : ''
                      }`}
                      min="0"
                      max={formData.type === 'percentage' ? "100" : undefined}
                      step={formData.type === 'fixed' ? "0.01" : "1"}
                    />
                  </div>
                  {errors.value && (
                    <p className="mt-1 text-sm text-red-600">{errors.value}</p>
                  )}
                  {(formData.type === 'bogo' || formData.type === 'shipping') && (
                    <p className="mt-1 text-sm text-gray-500">
                      <Info className="h-4 w-4 inline mr-1" />
                      Valor automático para este tipo de promoción
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Configuración Avanzada */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Configuración Avanzada</h3>
              </div>
              <div className="p-6 space-y-4">
                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de inicio *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-(--accent-color) ${
                        errors.startDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de fin *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-(--accent-color) ${
                        errors.endDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                    )}
                  </div>
                </div>

                {/* Límites */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Límite de usos
                    </label>
                    <input
                      type="number"
                      name="usageLimit"
                      value={formData.usageLimit}
                      onChange={handleInputChange}
                      placeholder="Dejar vacío para ilimitado"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-(--accent-color) ${
                        errors.usageLimit ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="1"
                    />
                    {errors.usageLimit && (
                      <p className="mt-1 text-sm text-red-600">{errors.usageLimit}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto mínimo de compra
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="minOrderAmount"
                        value={formData.minOrderAmount}
                        onChange={handleInputChange}
                        placeholder="0 para sin mínimo"
                        className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-(--accent-color) ${
                          errors.minOrderAmount ? 'border-red-300' : 'border-gray-300'
                        }`}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {errors.minOrderAmount && (
                      <p className="mt-1 text-sm text-red-600">{errors.minOrderAmount}</p>
                    )}
                  </div>
                </div>

                {/* ✅ PRODUCTOS APLICABLES CON MODAL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Productos aplicables
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="applicableProducts"
                        value="all"
                        checked={formData.applicableProducts === 'all'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-(--accent-color) focus:ring-(--accent-color) border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Todos los productos</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="applicableProducts"
                        value="specific"
                        checked={formData.applicableProducts === 'specific'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-(--accent-color) focus:ring-(--accent-color) border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Productos específicos</span>
                    </label>
                  </div>
                  
                  {/* ✅ MOSTRAR PRODUCTOS SELECCIONADOS */}
                  {formData.applicableProducts === 'specific' && (
                    <div className="mt-3">
                      {selectedProductsData.length > 0 ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Productos seleccionados ({selectedProductsData.length})
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsProductModalOpen(true)}
                              className="text-sm text-(--accent-color) hover:text-(--accent-color-dark) font-medium"
                            >
                              Modificar selección
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                            {selectedProductsData.map(product => (
                              <div 
                                key={product._id}
                                className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md text-sm"
                              >
                                <img
                                  src={product.imageUrl || '/api/placeholder/40/40'}
                                  alt={product.name}
                                  className="w-8 h-8 object-cover rounded"
                                />
                                <span className="flex-1 truncate">{product.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-600 mb-2">
                            <Info className="h-4 w-4 inline mr-1" />
                            No hay productos seleccionados
                          </p>
                          <button
                            type="button"
                            onClick={() => setIsProductModalOpen(true)}
                            className="text-sm text-(--accent-color) hover:text-(--accent-color-dark) font-medium"
                          >
                            Seleccionar productos
                          </button>
                        </div>
                      )}
                      
                      {/* Error de validación */}
                      {errors.selectedProducts && (
                        <p className="mt-1 text-sm text-red-600">{errors.selectedProducts}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Código de Promoción */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Código de Promoción</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="CODIGO123"
                      className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-(--accent-color) ${
                        errors.code ? 'border-red-300' : 'border-gray-300'
                      }`}
                      style={{ textTransform: 'uppercase' }}
                    />
                    <button
                      type="button"
                      onClick={generateCode}
                      className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      title="Generar código automático"
                    >
                      <Shuffle className="h-4 w-4" />
                    </button>
                  </div>
                  {errors.code && (
                    <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                  )}
                  
                  {formData.code && (
                    <div className="mt-2 flex items-center space-x-2">
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                        {formData.code}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Estado */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Estado</h3>
              </div>
              <div className="p-6">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-(--accent-color)"
                >
                  {Object.entries(promotionStatuses).map(([key, status]) => (
                    <option key={key} value={key}>{status.label}</option>
                  ))}
                </select>
                
                {currentStatus && (
                  <div className="mt-3 flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStatus.color}`}>
                      <currentStatus.icon className="h-3 w-3 mr-1" />
                      {currentStatus.label}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ✅ RESUMEN ACTUALIZADO CON PRODUCTOS */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Resumen</h3>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium">{currentType.label}</span>
                </div>
                
                {/* ✅ USAR getDisplayValue() PARA MOSTRAR CORRECTAMENTE */}
                {(formData.value || formData.type === 'bogo' || formData.type === 'shipping') && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Descuento:</span>
                    <span className="font-medium">{getDisplayValue()}</span>
                  </div>
                )}

                {formData.minOrderAmount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mínimo:</span>
                    <span className="font-medium">${formData.minOrderAmount}</span>
                  </div>
                )}

                {formData.usageLimit && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Límite:</span>
                    <span className="font-medium">{formData.usageLimit} usos</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Productos:</span>
                  <span className="font-medium">
                    {formData.applicableProducts === 'all' 
                      ? 'Todos' 
                      : `${selectedProductsData.length} específicos`
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/promotions')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-(--accent-color) text-white rounded-md hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Actualizar' : 'Crear'} Promoción
              </>
            )}
          </button>
        </div>
      </form>

      {/* ✅ MODAL DE SELECCIÓN DE PRODUCTOS */}
      <ProductSelectionModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        selectedProducts={formData.selectedProducts}
        onProductsSelect={handleProductsSelect}
      />
    </div>
  );
};

export default PromotionFormPage;