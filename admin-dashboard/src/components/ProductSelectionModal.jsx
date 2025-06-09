import React, { useState, useEffect, useRef } from "react";
import { X, Search, Package, Check } from "lucide-react";
import productService from "../services/productService";

const ProductSelectionModal = ({
  isOpen,
  onClose,
  selectedProducts = [],
  onProductsSelect,
}) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tempSelected, setTempSelected] = useState([]);

  // Referencias para accesibilidad
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Manejar foco y escape key
  useEffect(() => {
    if (isOpen) {
      // Guardar elemento activo anterior
      previousActiveElement.current = document.activeElement;

      // Hacer focus en el input de búsqueda
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);

      // Prevenir scroll del body
      document.body.style.overflow = "hidden";

      // Manejar tecla Escape
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";

        // Restaurar foco anterior
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  // Manejar click fuera del modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Trap focus dentro del modal
  const handleKeyDown = (e) => {
    if (!modalRef.current) return;

    if (e.key === "Tab") {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

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
      console.error("Error loading products:", error);
      // Usar datos mock si falla la API
      const mockProducts = [
        {
          _id: "1",
          name: "Yerba Amanda 1kg",
          category: "Yerbas",
          type: "yerba",
          packageSizes: [{ sizeInKg: 1, price: 1500 }],
          stockInKg: 50,
          isActive: true,
          imageUrl: "",
        },
        {
          _id: "2",
          name: "Yerba Taragüi 500g",
          category: "Yerbas",
          type: "yerba",
          packageSizes: [{ sizeInKg: 0.5, price: 1250 }],
          stockInKg: 30,
          isActive: true,
          imageUrl: "",
        },
        {
          _id: "3",
          name: "Mate Calabaza Natural",
          category: "Mates",
          type: "mate calabaza",
          price: 2500,
          stock: 15,
          isActive: true,
          imageUrl: "",
        },
      ];
      setProducts(mockProducts);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products.filter((product) => product.isActive);

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    setFilteredProducts(filtered);
  };

  const toggleProductSelection = (product) => {
    setTempSelected((prev) => {
      const isSelected = prev.some((p) => p._id === product._id);
      if (isSelected) {
        return prev.filter((p) => p._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isProductSelected = (productId) => {
    return (
      tempSelected.some((p) => p._id === productId) ||
      selectedProducts.some((p) => p.id === productId)
    );
  };

  const handleConfirm = () => {
    onProductsSelect(tempSelected);
    onClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
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
    return "Sin stock";
  };

  const categories = [...new Set(products.map((p) => p.category))];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-fade-in-up"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <div>
            <h2
              id="modal-title"
              className="text-xl font-semibold text-gray-900"
            >
              Seleccionar Productos
            </h2>
            <p id="modal-description" className="text-sm text-gray-600 mt-1">
              Elige los productos que deseas agregar al pedido
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filtros */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search-products" className="sr-only">
                Buscar productos
              </label>
              <div className="relative">
                <Search
                  className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  ref={searchInputRef}
                  id="search-products"
                  type="text"
                  placeholder="Buscar productos por nombre o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
              </div>
            </div>
            <div className="lg:w-48">
              <label htmlFor="category-filter" className="sr-only">
                Filtrar por categoría
              </label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <option value="all">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-32 space-y-4">
              <div className="spinner h-8 w-8 border-blue-600"></div>
              <p className="text-gray-600 font-medium">Cargando productos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || categoryFilter !== "all"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "No hay productos disponibles en este momento"}
              </p>
              {(searchTerm || categoryFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("all");
                  }}
                  className="btn-outline"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                const selected = isProductSelected(product._id);
                const tempSelectedOnly = tempSelected.some(
                  (p) => p._id === product._id
                );
                const isAlreadySelected = selectedProducts.some(
                  (p) => p.id === product._id
                );

                return (
                  <div
                    key={product._id}
                    className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selected
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:border-gray-300 hover:bg-gray-50"
                    } ${isAlreadySelected ? "opacity-75" : ""}`}
                    onClick={() =>
                      !isAlreadySelected && toggleProductSelection(product)
                    }
                    role="button"
                    tabIndex={isAlreadySelected ? -1 : 0}
                    aria-pressed={tempSelectedOnly}
                    aria-disabled={isAlreadySelected}
                    aria-describedby={`product-${product._id}-description`}
                    onKeyDown={(e) => {
                      if (
                        (e.key === "Enter" || e.key === " ") &&
                        !isAlreadySelected
                      ) {
                        e.preventDefault();
                        toggleProductSelection(product);
                      }
                    }}
                  >
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4
                            className="font-medium text-gray-900 mb-1 truncate"
                            title={product.name}
                          >
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {product.category}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-green-600">
                              {formatCurrency(getProductPrice(product))}
                            </span>
                            <span className="text-xs text-gray-500">
                              {getProductStock(product)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3 flex-shrink-0">
                          {isAlreadySelected ? (
                            <div
                              className="w-5 h-5 bg-gray-400 rounded border flex items-center justify-center"
                              aria-label="Ya agregado"
                            >
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          ) : (
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-150 ${
                                tempSelectedOnly
                                  ? "bg-blue-500 border-blue-500"
                                  : "border-gray-300 hover:border-blue-400"
                              }`}
                            >
                              {tempSelectedOnly && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        id={`product-${product._id}-description`}
                        className="sr-only"
                      >
                        Producto: {product.name}, Categoría: {product.category},
                        Precio: {formatCurrency(getProductPrice(product))},
                        Stock: {getProductStock(product)}
                        {isAlreadySelected && ". Ya agregado al pedido"}
                      </div>

                      {isAlreadySelected && (
                        <div
                          className="text-xs text-gray-500 italic mt-2"
                          aria-hidden="true"
                        >
                          Ya agregado al pedido
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{tempSelected.length}</span> producto
            {tempSelected.length !== 1 ? "s" : ""} seleccionado
            {tempSelected.length !== 1 ? "s" : ""}
            {tempSelected.length > 0 && (
              <span className="hidden sm:inline">
                {" "}
                • Presiona Enter para confirmar
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button onClick={onClose} className="btn-outline sm:order-1">
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={tempSelected.length === 0}
              className="btn-primary sm:order-2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && tempSelected.length > 0) {
                  handleConfirm();
                }
              }}
            >
              {tempSelected.length === 0
                ? "Selecciona productos"
                : `Agregar ${tempSelected.length} producto${
                    tempSelected.length !== 1 ? "s" : ""
                  }`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSelectionModal;
