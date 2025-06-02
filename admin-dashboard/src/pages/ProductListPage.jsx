import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import productService from '../services/productService';
import { PencilSquareIcon, TrashIcon, PlusCircleIcon, CubeIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import ConfirmationModal from '../components/ConfirmationModal';

// Función de utilidad Debounce
function debounce(func, delay) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
}

function ProductListPage() {
  const [products, setProducts] = useState([]); // Todos los productos originales
  const [filteredProducts, setFilteredProducts] = useState([]); // Productos después de aplicar filtros y búsqueda
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Estado para el modal de confirmación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // O tu preferencia, ej: 3 para probar con pocos datos

  // Estados para los filtros
  const [selectedCategory, setSelectedCategory] = useState(''); // '' significa todas las categorías
  const [selectedType, setSelectedType] = useState('');       // '' significa todos los tipos

// Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState(''); // Para el input de búsqueda
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
      // setFilteredProducts(data); // Se manejará por el useEffect de filtros
      setCurrentPage(1);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar productos.';
      toast.error(errorMessage);
      setProducts([]);
      // setFilteredProducts([]); // Se manejará por el useEffect de filtros
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto para cargar productos iniciales
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Efecto para manejar el debounce de la búsqueda
  const debouncedSetSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
    }, 300), // 300 ms de debounce
    [] // setDebouncedSearchTerm es estable, debounce es externa y estable.
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value); // Actualiza el valor del input inmediatamente
    debouncedSetSearch(value); // Llama a la función debounced para actualizar el término de filtrado
  };

  // Efecto para aplicar filtros cuando cambian los productos o los valores de los filtros
  useEffect(() => {
    let tempProducts = [...products];

    if (selectedCategory) {
      tempProducts = tempProducts.filter(product => product.category === selectedCategory);
    }

    if (selectedType) {
      tempProducts = tempProducts.filter(product => product.type === selectedType);
    }
    
    // Aplicar filtro de búsqueda por nombre usando el término "debounced"
    if (debouncedSearchTerm) {
      tempProducts = tempProducts.filter(product =>
        product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    setFilteredProducts(tempProducts);
    setCurrentPage(1); // Resetear a la primera página cuando los filtros cambian
  }, [products, selectedCategory, selectedType, debouncedSearchTerm]);


  const handleEdit = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const openDeleteConfirmationModal = (product) => {
    setProductToDelete(product);
    setIsModalOpen(true);
  };

  const closeDeleteConfirmationModal = () => {
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!productToDelete) return;
    setIsDeleting(true); //MODO CARGANDO
    try {
      await productService.deleteProduct(productToDelete._id);
      toast.success(`¡Producto "${productToDelete.name}" eliminado exitosamente!`);
      // Actualizar la lista original de productos. 
      // El useEffect [products, selectedCategory, selectedType] se encargará de actualizar filteredProducts.
      setProducts(prevProducts => prevProducts.filter(p => p._id !== productToDelete._id));
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar el producto.';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false); // DESACTIVAR MODO CARGANDO
      closeDeleteConfirmationModal();
    }
  };

  // Calcular productos para la página actual A PARTIR DE filteredProducts
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || (pageNumber > totalPages && totalPages > 0)) return;
    if (totalPages === 0 && pageNumber === 1) {
        setCurrentPage(1);
        return;
    }
    setCurrentPage(pageNumber);
  };
  
  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(p => p.category).filter(Boolean)); // filter(Boolean) para quitar nulos/undefined si los hubiera
    return ['', ...Array.from(uniqueCategories).sort()];
  }, [products]);

  const types = useMemo(() => {
    const uniqueTypes = new Set(products.map(p => p.type).filter(Boolean));
    return ['', ...Array.from(uniqueTypes).sort()];
  }, [products]);


  if (loading && products.length === 0) return <p className="text-center text-gray-600 mt-10">Cargando productos...</p>;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-(--text-color)">Gestión de Productos</h1>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center bg-(--secondary-color) hover:bg-(--primary-color) text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Añadir Producto
        </button>
      </div>

      {/* Sección de Filtros */}
      <div className="mb-6 p-4 bg-white shadow rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
           {/* Campo de Búsqueda */}
          <div className="md:col-span-1"> {/* Ocupa 1 columna en MD, puedes ajustar */}
            <label htmlFor="search-filter" className="block text-sm font-medium text-yrbx-charcoal mb-1">
              Buscar por Nombre:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search-filter"
                className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yrbx-olive focus:border-yrbx-olive sm:text-sm"
                placeholder="Ej: Yerba Clásica"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-(--text-color) mb-1">
              Categoría:
            </label>
            <select
              id="category-filter"
              name="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-(--secondary-color) focus:border-(--secondary-color) sm:text-sm rounded-md shadow-sm"
            >
              {categories.map(category => (
                <option key={category || 'all-cat'} value={category}>
                  {category === '' ? 'Todas las Categorías' : category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-(--text-color) mb-1">
              Tipo:
            </label>
            <select
              id="type-filter"
              name="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-(--secondary-color) focus:border-(--secondary-color) sm:text-sm rounded-md shadow-sm"
            >
              {types.map(type => (
                <option key={type || 'all-type'} value={type}>
                  {type === '' ? 'Todos los Tipos' : type}
                </option>
              ))}
            </select>
          </div>
          <div className="md:mt-auto">
            {(selectedCategory || selectedType || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedType('');
                  setSearchTerm('');
                }}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-(--text-color) bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
              >
                <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
                Limpiar Filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 && !loading ? (
         <div className="text-center py-10">
            <CubeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">
              {selectedCategory || selectedType ? "No hay productos que coincidan con los filtros." : "No hay productos para mostrar."}
            </p>
            <p className="text-gray-400 mb-6">
              {selectedCategory || selectedType ? "Intenta ajustar o limpiar los filtros." : "¡Comienza añadiendo tu primer producto!"}
            </p>
            {!(selectedCategory || selectedType) && (
              <button
                onClick={() => navigate('/admin/products/new')}
                className="bg-(--accent-color) hover:opacity-90 text-white font-semibold py-2.5 px-6 rounded-lg shadow hover:shadow-md transition-all duration-150"
              >
                Añadir Nuevo Producto
              </button>
            )}
         </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-(--secondary-color)/30 text-left text-(--text-color) uppercase text-sm">
                <th className="px-5 py-3 border-b-2 border-gray-200">Nombre</th>
                <th className="px-5 py-3 border-b-2 border-gray-200">Categoría</th>
                <th className="px-5 py-3 border-b-2 border-gray-200">Tipo</th>
                <th className="px-5 py-3 border-b-2 border-gray-200">Stock</th>
                <th className="px-5 py-3 border-b-2 border-gray-200">Estado</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map(product => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-100">
                  <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-900">{product.name}</td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-700">{product.category}</td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-700">{product.type}</td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-700">
                    {product.type === 'yerba' || product.type === 'yuyo' ? `${product.stockInKg || 0} kg` : (product.stock || 0)}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">
                    <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full 
                                     ${product.isActive ? 'bg-(--secondary-color)/20 text-(--primary-color)' : 'bg-(--warm-color)/20 text-(--warm-color)'}`}>
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm text-center">
                    <button
                      onClick={() => handleEdit(product._id)}
                      title="Editar Producto"
                      className="p-1.5 rounded text-(--secondary-color) hover:bg-(--secondary-color)/20 hover:text-(--primary-color) focus:outline-none focus:ring-2 focus:ring-(--secondary-color) focus:ring-opacity-50 transition-colors duration-150 mr-2"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => openDeleteConfirmationModal(product)}
                      title="Eliminar Producto"
                      className="p-1.5 rounded text-(--accent-color) hover:bg-(--accent-color)/20 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-(--accent-color) focus:ring-opacity-50 transition-colors duration-150"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredProducts.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg shadow-md">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{filteredProducts.length > 0 ? indexOfFirstItem + 1 : 0}</span>
                {' '}a <span className="font-medium">{Math.min(indexOfLastItem, filteredProducts.length)}</span>
                {' '}de <span className="font-medium">{filteredProducts.length}</span>
                {' '}resultados
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Paginación">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    aria-current={pageNumber === currentPage ? 'page' : undefined}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold 
                                ${pageNumber === currentPage 
                                  ? 'z-10 bg-(--secondary-color)/20 text-yrbx-green-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--secondary-color)' 
                                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                                } focus:z-20`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Siguiente</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteConfirmationModal}
        onConfirm={handleDeleteConfirmed}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que quieres eliminar el producto "${productToDelete?.name || ''}"? Esta acción no se puede deshacer.`}
        confirmButtonText="Eliminar"
        confirmButtonColor="red"
        isConfirming={isDeleting}
      />
    </div>
  );
}

export default ProductListPage;