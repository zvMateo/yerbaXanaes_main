// filepath: c:\Users\Usuario\OneDrive\Escritorio\ecommerce-yerbaxanaes\admin-dashboard\src\pages\ProductListPage.jsx
import React, { useEffect, useState } from 'react';
import productService from '../services/productService'; // Descomentar cuando implementes el servicio
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';


function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
  // Función para manejar la edición de un producto
  const handleEdit = (productId) => {
    navigate(`/admin/products/edit/${productId}`); // Redirige a la página de edición del producto
  };

  // Función para manejar la eliminación de un producto
  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        setLoading(true);
        await productService.deleteProduct(productId); // Descomentar cuando implementes el servicio
        setProducts(prevproducts => prevproducts.filter(p => p._id !== productId));
        } catch (err) {
        setError(err.message || 'Error al eliminar el producto.');
        } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
     setLoading(true);
     productService.getAllProducts()
       .then(data => {
         setProducts(data);
         setError('');
       })
       .catch(err => {
         setError(err.message || 'Error al cargar productos.');
         setProducts([]);
       })
       .finally(() => setLoading(false));
    console.log("ProductListPage montado - Aquí se cargarían los productos.");
     //Placeholder data:
     setProducts([{ _id: '1', name: 'Yerba Mate CBSé', category: 'Yerbas', type: 'yerba', stockInKg: 10, isActive: true }]);
  }, []);

  if (loading) return <p className="text-center text-gray-600">Cargando productos...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Gestión de Productos</h1>
        <button
           onClick={() => navigate('/admin/products/new')} // Cuando tengas la ruta de nuevo producto
          className="bg-(--primary-color) hover:bg-(--secondary-color) text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Añadir Nuevo Producto
        </button>
      </div>

      {products.length === 0 && !loading ? (
        <p className="text-center text-gray-500">No hay productos para mostrar. ¡Añade el primero!</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-(--secondary-color)/10 text-left text-gray-600 uppercase text-sm">
                <th className="px-5 py-3 border-b-2 border-gray-200">Nombre</th>
                <th className="px-5 py-3 border-b-2 border-gray-200">Categoría</th>
                <th className="px-5 py-3 border-b-2 border-gray-200">Tipo</th>
                <th className="px-5 py-3 border-b-2 border-gray-200">Stock</th>
                <th className="px-5 py-3 border-b-2 border-gray-200">Estado</th>
                <th className="px-5 py-3 border-b-2 border-gray-200">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Aquí mapearías tus productos */}
              {/* /* Ejemplo de fila (descomentar y adaptar cuando tengas datos): */}
              {products.map(product => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">{product.name}</td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">{product.category}</td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">{product.type}</td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">
                    {product.type === 'yerba' || product.type === 'yuyo' ? `${product.stockInKg} kg` : product.stock}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive ? 'bg-(--secondary-color)/20 text-(--primary-color)' : 'bg-(--warm-color)/20 text-(--warm-color)'}`}>
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">
                    <button
                      onClick={() => handleEdit(product._id)}
                      title="Editar Producto"
                      className="p-2 rounded-full text-(--primary-color) hover:bg-(--secondary-color)/20 hover:text-(--dark-color) focus:outline-none focus:ring-2 focus:ring-(--secondary-color) focus:ring-opacity-50 transition-colors duration-150 mr-2"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      title="Eliminar Producto"
                      className="p-2 rounded-full text-(--accent-color) hover:bg-(--accent-color)/20 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-(--accent-color) focus:ring-opacity-50 transition-colors duration-150"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {/* Placeholder si no hay productos y no está cargando */}
              {products.length === 0 && !loading && (
                 <tr>
                   <td colSpan="6" className="text-center py-10 text-gray-400">
                       (Tabla de productos se mostrará aquí cuando haya datos)
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductListPage;