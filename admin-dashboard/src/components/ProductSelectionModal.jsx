import React, { useState, useEffect } from 'react';
import { X, Search, Package, Check } from 'lucide-react';
import productService from '../services/productService';

const ProductSelectionModal = ({ 
  isOpen, 
  onClose, 
  selectedProducts = [], 
  onProductsSelect 
}) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tempSelected, setTempSelected] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadProducts();
      setTempSelected([]);
    }
  }, [isOpen]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      // Usar datos mock si falla la API
      const mockProducts = [
        {
          _id: '1',
          name: 'Yerba Amanda 1kg',
          category: 'Yerbas',
          type: 'yerba',
          packageSizes: [{ sizeInKg: 1, price: 1500 }],
          stockInKg: 50,
          isActive: true,
          imageUrl: ''
        },
        {
          _id: '2',
          name: 'Yerba Taragüi 500g',
          category: 'Yerbas',
          type: 'yerba',
          packageSizes: [{ sizeInKg: 0.5, price: 1250 }],
          stockInKg: 30,
          isActive: true,
          imageUrl: ''
        },
        {
          _id: '3',
          name: 'Mate Calabaza Natural',
          category: 'Mates',
          type: 'mate calabaza',
          price: 2500,
          stock: 15,
          isActive: true,
          imageUrl: ''
        }
      ];
      setProducts(mockProducts);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products.filter(product => product.isActive);

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  };

  const toggleProductSelection = (product) => {
    setTempSelected(prev => {
      const isSelected = prev.some(p => p._id === product._id);
      if (isSelected) {
        return prev.filter(p => p._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isProductSelected = (productId) => {
    return tempSelected.some(p => p._id === productId) || 
           selectedProducts.some(p => p.id === productId);
  };

  const handleConfirm = () => {
    onProductsSelect(tempSelected);
    onClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const getProductPrice = (product) => {
    if (product.price) return product.price;
    if (product.packageSizes && product.packageSizes[0]) {
      return product.packageSizes[0].price;
    }
    return 0;
  };

  const getProductStock = (product) => {
    if (product.stock !== undefined) return `${product.stock} unidades`;
    if (product.stockInKg !== undefined) return `${product.stockInKg} kg`;
    return 'Sin stock';
  };

  const categories = [...new Set(products.map(p => p.category))];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Seleccionar Productos
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-150"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filtros */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'No se encontraron productos con los filtros aplicados'
                  : 'No hay productos disponibles'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                const selected = isProductSelected(product._id);
                const tempSelectedOnly = tempSelected.some(p => p._id === product._id);
                
                return (
                  <div
                    key={product._id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-150 ${
                      selected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => !selectedProducts.some(p => p.id === product._id) && toggleProductSelection(product)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-green-600">
                            {formatCurrency(getProductPrice(product))}
                          </span>
                          <span className="text-xs text-gray-500">
                            {getProductStock(product)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        {selectedProducts.some(p => p.id === product._id) ? (
                          <div className="w-5 h-5 bg-gray-400 rounded border flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        ) : (
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            tempSelectedOnly 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'border-gray-300'
                          }`}>
                            {tempSelectedOnly && <Check className="h-3 w-3 text-white" />}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedProducts.some(p => p.id === product._id) && (
                      <div className="text-xs text-gray-500 italic">
                        Ya agregado al pedido
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {tempSelected.length} producto{tempSelected.length !== 1 ? 's' : ''} seleccionado{tempSelected.length !== 1 ? 's' : ''}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={tempSelected.length === 0}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                tempSelected.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Agregar Productos ({tempSelected.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSelectionModal;