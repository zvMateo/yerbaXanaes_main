import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import productService from "../services/productService";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductDetailModal from "../components/ProductDetailModal"; // ✅ Importar el modal
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  XMarkIcon,
  ChevronUpDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const ProductListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Estados principales
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  // ✅ Estados del modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Estados de filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);

  // ✅ Categorías disponibles
  const categories = ["Yerbas", "Mates", "Bombillas", "Accesorios", "Yuyos"];

  // ✅ Función de carga optimizada SIN toasts repetitivos
  const loadProducts = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const data = await productService.getAllProducts(forceRefresh);
      console.log(`📦 Productos cargados: ${data?.length || 0} productos`);
      setProducts(data || []);

      // ✅ Solo mostrar toast en refresh manual
      if (forceRefresh && data?.length) {
        toast.success(`${data.length} productos actualizados`, {
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("❌ Error loading products:", error.message);

      // ✅ Solo mostrar error si no es un error de conexión esperado
      if (
        !error.message.includes("Network Error") &&
        !error.message.includes("servidor no disponible")
      ) {
        toast.error(`Error al cargar productos`, {
          autoClose: 4000,
        });
      }
      setProducts([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // ✅ Función de refresh faltante
  const handleRefresh = useCallback(() => {
    loadProducts(true);
  }, [loadProducts]);

  // ✅ Función de edición con mejor feedback
  const handleEditProduct = useCallback(
    (productId) => {
      console.log(`Navegando a editar producto: ${productId}`);

      toast.info("Cargando editor de producto...", {
        autoClose: 2000,
      });

      navigate(`/admin/products/edit/${productId}`);
    },
    [navigate]
  );

  // ✅ Función de eliminación con UX mejorada
  const handleDeleteProduct = useCallback(
    async (product) => {
      const confirmed = window.confirm(
        `¿Estás seguro de que quieres eliminar "${product.name}"?\n\nEsta acción no se puede deshacer.`
      );

      if (!confirmed) return;

      setIsDeleting(product._id);

      try {
        await productService.deleteProduct(product._id);

        // ✅ Actualizar estado inmediatamente para mejor UX
        setProducts((prev) => prev.filter((p) => p._id !== product._id));

        // ✅ Toast simple y claro
        toast.success(`"${product.name}" eliminado`, {
          autoClose: 3000,
        });
      } catch (error) {
        console.error("Error deleting product:", error);

        toast.error(`No se pudo eliminar "${product.name}"`, {
          autoClose: 4000,
        });

        // ✅ Solo recargar en caso de error real
        loadProducts(true);
      } finally {
        setIsDeleting(null);
      }
    },
    [loadProducts]
  );

  // ✅ Función para activar/desactivar producto
  const handleToggleProductStatus = useCallback(
    async (productId, newStatus) => {
      try {
        // ✅ Actualizar inmediatamente para mejor UX
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId
              ? { ...product, isActive: newStatus }
              : product
          )
        );

        // ✅ Toast simple
        toast.success(`Producto ${newStatus ? "activado" : "desactivado"}`, {
          autoClose: 2000,
        });

        // TODO: Integrar con API real cuando esté disponible
        // await productService.updateProductStatus(productId, { isActive: newStatus });
      } catch (error) {
        console.error("Error toggling product status:", error);

        // ✅ Revertir cambio en caso de error
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId
              ? { ...product, isActive: !newStatus }
              : product
          )
        );

        toast.error(`Error al cambiar estado del producto`, {
          autoClose: 4000,
        });
      }
    },
    []
  );

  // ✅ Función para duplicar producto
  const handleDuplicateProduct = useCallback(async (product) => {
    try {
      // ✅ Crear producto duplicado con nueva estructura
      const duplicatedProduct = {
        ...product,
        _id: `dup_${Date.now()}`, // Nuevo ID único
        name: `${product.name} (Copia)`,
        isActive: false, // Los duplicados inician inactivos
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // ✅ Actualizar lista inmediatamente
      setProducts((prevProducts) => [...prevProducts, duplicatedProduct]);

      toast.success(
        `"${product.name}" duplicado como "${duplicatedProduct.name}"`,
        {
          autoClose: 3000,
        }
      );

      // TODO: Integrar con API real cuando esté disponible
      // await productService.duplicateProduct(product._id);
    } catch (error) {
      console.error("Error duplicating product:", error);
      toast.error(`Error al duplicar "${product.name}"`, {
        autoClose: 4000,
      });
    }
  }, []);

  // ✅ Función para crear nuevo producto
  const handleCreateProduct = useCallback(() => {
    navigate("/admin/products/new");
  }, [navigate]);

  // ✅ Función para ver detalles con modal
  const handleViewProduct = useCallback((product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  // ✅ Función para editar desde el modal
  const handleEditFromModal = useCallback(
    (product) => {
      setIsModalOpen(false);
      setSelectedProduct(null);

      toast.info("Cargando editor de producto...", {
        autoClose: 2000,
      });

      navigate(`/admin/products/edit/${product._id}`);
    },
    [navigate]
  );

  // ✅ Función para cerrar modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  // ✅ Función para manejar actualización del producto
  const handleProductUpdated = useCallback(() => {
    // Recargar productos después de una actualización
    loadProducts(true);
  }, [loadProducts]);

  // ✅ Funciones de filtrado y ordenado
  const handleSortChange = useCallback(
    (field) => {
      if (sortBy === field) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(field);
        setSortOrder("asc");
      }
    },
    [sortBy]
  );

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setSortBy("name");
    setSortOrder("asc");
  }, []);

  // ✅ Productos filtrados y ordenados
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    // Filtrar por estado
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter((product) => product.isActive === isActive);
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "price") {
        aValue = a.price || a.packageSizes?.[0]?.price || 0;
        bValue = b.price || b.packageSizes?.[0]?.price || 0;
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [products, searchTerm, categoryFilter, statusFilter, sortBy, sortOrder]);

  // ✅ Carga inicial
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ✅ Manejar estado de navegación con toasts ÚNICOS
  useEffect(() => {
    if (location.state?.updated || location.state?.created) {
      const productName = location.state?.productName;

      // ✅ Toast único basado en la acción
      if (location.state?.updated) {
        toast.success(`✅ "${productName}" actualizado correctamente`, {
          autoClose: 4000,
        });
      } else if (location.state?.created) {
        toast.success(`🎉 "${productName}" creado exitosamente`, {
          autoClose: 4000,
        });
      }

      // ✅ Limpiar estado de navegación
      window.history.replaceState({}, document.title);

      // ✅ Recargar productos SIN toast adicional
      setTimeout(() => {
        loadProducts(); // Sin forceRefresh para evitar toast duplicado
      }, 500);
    }
  }, [location.state, loadProducts]);

  // ✅ Función para obtener precio de producto
  const getProductPrice = useCallback((product) => {
    if (product.price) return product.price;
    if (product.packageSizes && product.packageSizes[0]) {
      return product.packageSizes[0].price;
    }
    return 0;
  }, []);

  // ✅ Función para obtener stock de producto
  const getProductStock = useCallback((product) => {
    if (product.stock !== undefined) return `${product.stock} unidades`;
    if (product.stockInKg !== undefined) return `${product.stockInKg} kg`;
    return "Sin stock";
  }, []);

  // ✅ Función para formatear moneda
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  }, []);

  // ✅ Loading inicial
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Cargando productos
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Obteniendo la lista de productos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Productos
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Administra tu catálogo de productos
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <ArrowPathIcon
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Actualizando..." : "Actualizar"}
          </button>
          <button
            onClick={handleCreateProduct}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Botón de filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filtros
            {(categoryFilter !== "all" || statusFilter !== "all") && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Activos
              </span>
            )}
          </button>
        </div>

        {/* Panel de filtros expandible */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por
                </label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name-asc">Nombre (A-Z)</option>
                  <option value="name-desc">Nombre (Z-A)</option>
                  <option value="category-asc">Categoría (A-Z)</option>
                  <option value="price-asc">Precio (Menor a Mayor)</option>
                  <option value="price-desc">Precio (Mayor a Menor)</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {filteredAndSortedProducts.length}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total productos
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredAndSortedProducts.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Activos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {products.filter((p) => p.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-8 w-8 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Inactivos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {products.filter((p) => !p.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Stock bajo</p>
              <p className="text-2xl font-semibold text-gray-900">
                {
                  products.filter((p) => {
                    if (p.stock !== undefined) return p.stock < 10;
                    if (p.stockInKg !== undefined) return p.stockInKg < 5;
                    return false;
                  }).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <ExclamationTriangleIcon />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No se encontraron productos
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza creando tu primer producto"}
            </p>
            <div className="mt-6">
              {searchTerm ||
              categoryFilter !== "all" ||
              statusFilter !== "all" ? (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Limpiar filtros
                </button>
              ) : (
                <button
                  onClick={handleCreateProduct}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Crear primer producto
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSortChange("name")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Producto</span>
                      <ChevronUpDownIcon className="h-4 w-4" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSortChange("category")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Categoría</span>
                      <ChevronUpDownIcon className="h-4 w-4" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSortChange("price")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Precio</span>
                      <ChevronUpDownIcon className="h-4 w-4" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Stock
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estado
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {product.imageUrl ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={product.imageUrl}
                              alt={product.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">
                                {product.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(getProductPrice(product))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getProductStock(product)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                          title="Ver detalles"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditProduct(product._id)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
                          title="Editar"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          disabled={isDeleting === product._id}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 disabled:opacity-50"
                          title="Eliminar"
                        >
                          {isDeleting === product._id ? (
                            <LoadingSpinner size="small" showDots={false} />
                          ) : (
                            <TrashIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ Modal con funciones completas */}
      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        onEdit={handleEditFromModal}
        onProductUpdated={handleProductUpdated}
        onToggleStatus={handleToggleProductStatus}
        onDuplicate={handleDuplicateProduct}
      />
    </div>
  );
};

export default ProductListPage;
