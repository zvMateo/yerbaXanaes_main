import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../services/productService';
import { ArrowUpTrayIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

const initialFormData = {
  name: '',
  description: '',
  category: '',
  type: '', // 'yerba', 'yuyo', 'mate', 'accesorio', etc.
  price: '', // Para productos que no son yerba/yuyo
  stock: '', // Para productos que no son yerba/yuyo
  stockInKg: '', // Para yerbas/yuyos
  packageSizes: [{ sizeInKg: '', price: '' }], // Para yerbas/yuyos
  isActive: true,
  image: null, // Para el archivo de imagen
};

function ProductFormPage({ mode }) { // mode puede ser "create" o "edit"
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(''); // Para mostrar la imagen actual en modo edición

  const navigate = useNavigate();
  const { productId } = useParams(); // Obtiene el productId de la URL si estamos en modo edición

  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (isEditMode && productId) {
      setLoading(true);
      productService.getProductById(productId)
        .then(product => {
          // Adaptar los datos del producto al estado del formulario
          const productData = {
            name: product.name || '',
            description: product.description || '',
            category: product.category || '',
            type: product.type || '',
            price: product.price || '',
            stock: product.stock || '',
            stockInKg: product.stockInKg || '',
            packageSizes: product.packageSizes && product.packageSizes.length > 0
              ? product.packageSizes.map(pkg => ({ sizeInKg: pkg.sizeInKg || '', price: pkg.price || '' }))
              : [{ sizeInKg: '', price: '' }],
            isActive: product.isActive !== undefined ? product.isActive : true,
            image: null, // La imagen se maneja por separado
          };
          setFormData(productData);
          if (product.imageUrl) {
            setCurrentImageUrl(product.imageUrl);
          }
        })
        .catch(err => {
          setError(`Error al cargar el producto: ${err.message || 'Error desconocido'}`);
          console.error(err);
        })
        .finally(() => setLoading(false));
    } else {
      // Si es modo creación, reseteamos el formulario (aunque ya está con initialFormData)
      setFormData(initialFormData);
      setImagePreview(null);
      setCurrentImageUrl('');
    }
  }, [isEditMode, productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setCurrentImageUrl(''); // Limpiar la imagen actual si se selecciona una nueva
    } else {
      setFormData(prev => ({ ...prev, image: null }));
      setImagePreview(null);
    }
  };

  const handlePackageSizeChange = (index, field, value) => {
    const updatedPackageSizes = formData.packageSizes.map((pkg, i) =>
      i === index ? { ...pkg, [field]: value } : pkg
    );
    setFormData(prev => ({ ...prev, packageSizes: updatedPackageSizes }));
  };

  const addPackageSize = () => {
    setFormData(prev => ({
      ...prev,
      packageSizes: [...prev.packageSizes, { sizeInKg: '', price: '' }],
    }));
  };

  const removePackageSize = (index) => {
    if (formData.packageSizes.length <= 1) return; // No permitir eliminar el último
    const updatedPackageSizes = formData.packageSizes.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, packageSizes: updatedPackageSizes }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const dataToSubmit = new FormData();
    // Añadir todos los campos del estado formData al objeto FormData
    // Los campos que son arrays (como packageSizes) necesitan un manejo especial
    // si el backend espera índices (ej. packageSizes[0][sizeInKg])
    // Por ahora, asumimos que el backend puede manejar el array de objetos directamente
    // o que el servicio lo adaptará.

    Object.keys(formData).forEach(key => {
      if (key === 'packageSizes') {
        // Para enviar un array de objetos, a menudo se serializa cada objeto
        // o se envían con índices. Aquí un ejemplo simple:
        formData.packageSizes.forEach((pkg, index) => {
          dataToSubmit.append(`packageSizes[${index}][sizeInKg]`, pkg.sizeInKg);
          dataToSubmit.append(`packageSizes[${index}][price]`, pkg.price);
        });
      } else if (key === 'image' && formData.image) {
        dataToSubmit.append('image', formData.image);
      } else if (formData[key] !== null && formData[key] !== undefined) {
        // Asegurarse de que isActive se envíe como string "true" o "false" si el backend lo espera así
        if (key === 'isActive') {
          dataToSubmit.append(key, String(formData[key]));
        } else {
          dataToSubmit.append(key, formData[key]);
        }
      }
    });

    // Limpieza condicional de campos antes de enviar, basado en el tipo
    // Esto debería coincidir con la lógica del backend
    if (formData.type === 'yerba' || formData.type === 'yuyo') {
      dataToSubmit.delete('price');
      dataToSubmit.delete('stock');
    } else {
      dataToSubmit.delete('stockInKg');
      // Si packageSizes se añadió, hay que eliminarlo si no es yerba/yuyo
      // Esto es más complejo con FormData, es mejor no añadirlo si no es el tipo correcto.
      // O asegurarse que el backend lo ignore.
      // Por ahora, la lógica de no añadirlo si no es el tipo correcto es más segura.
      // (Revisar la lógica de construcción de dataToSubmit para packageSizes)
    }


    try {
      if (isEditMode) {
        await productService.updateProduct(productId, dataToSubmit);
      } else {
        await productService.createProduct(dataToSubmit);
      }
      navigate('/admin/products'); // Redirigir a la lista después de éxito
    } catch (err) {
      setError(err.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el producto.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !formData.name) { // Muestra carga solo si está cargando datos para editar
    return <p className="text-center text-gray-600 mt-10">Cargando datos del producto...</p>;
  }

  // Definición de categorías y tipos (podrías obtenerlos de una API en el futuro)
  const categories = ['Yerbas', 'Mates', 'Bombillas', 'Accesorios', 'Yuyos'];
  const productTypes = {
    Yerbas: ['yerba'],
    Mates: ['mate calabaza', 'mate torpedo', 'mate camionero', 'mate acero', 'mate vidrio'],
    Bombillas: ['bombilla acero', 'bombilla alpaca', 'bombilla pico de loro'],
    Accesorios: ['termo', 'matero', 'limpia bombilla', 'cepillo mate'],
    Yuyos: ['yuyo medicinal', 'yuyo aromático'],
  };

  const availableTypes = formData.category ? productTypes[formData.category] || [] : [];

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <h1 className="text-3xl font-semibold text-(--primary-color) mb-8">
        {isEditMode ? 'Editar Producto' : 'Añadir Nuevo Producto'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-lg shadow-xl space-y-6">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required
                 className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-(--accent-color) focus:border-(--accent-color)"/>
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-(--accent-color) focus:border-(--accent-color)"/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categoría */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select name="category" id="category" value={formData.category} onChange={handleChange} required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-(--accent-color) focus:border-(--accent-color)  bg-white">
              <option value="">Seleccione una categoría</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Tipo */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select name="type" id="type" value={formData.type} onChange={handleChange} required disabled={!formData.category}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-(--accent-color)  focus:border-(--accent-color)  bg-white disabled:bg-gray-100">
              <option value="">{formData.category ? 'Seleccione un tipo' : 'Seleccione categoría primero'}</option>
              {availableTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        {/* Campos condicionales según el tipo */}
        {(formData.type === 'yerba' || formData.type === 'yuyo') ? (
          <>
            {/* Stock en KG */}
            <div>
              <label htmlFor="stockInKg" className="block text-sm font-medium text-gray-700 mb-1">Stock (en Kg)</label>
              <input type="number" name="stockInKg" id="stockInKg" value={formData.stockInKg} onChange={handleChange} step="0.01" min="0" required
                     className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-(--accent-color) focus:border-(--accent-color) "/>
            </div>

            {/* Presentaciones (Package Sizes) */}
            <div className="space-y-4 border border-gray-200 p-4 rounded-md">
              <h3 className="text-md font-medium text-gray-800">Presentaciones</h3>
              {formData.packageSizes.map((pkg, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-3 bg-gray-50 rounded">
                  <div>
                    <label htmlFor={`sizeInKg-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Tamaño (Kg)</label>
                    <input type="number" name="sizeInKg" id={`sizeInKg-${index}`} value={pkg.sizeInKg}
                           onChange={(e) => handlePackageSizeChange(index, 'sizeInKg', e.target.value)}
                           step="0.01" min="0.01" required
                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-(--accent-color) focus:border-(--accent-color) "/>
                  </div>
                  <div>
                    <label htmlFor={`price-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Precio ($)</label>
                    <input type="number" name="price" id={`price-${index}`} value={pkg.price}
                           onChange={(e) => handlePackageSizeChange(index, 'price', e.target.value)}
                           step="0.01" min="0.01" required
                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-(--accent-color) focus:border-(--accent-color) "/>
                  </div>
                  {formData.packageSizes.length > 1 && (
                    <button type="button" onClick={() => removePackageSize(index)} title="Eliminar presentación"
                            className="p-2 text-red-500 hover:text-red-700 self-center md:self-end mb-1 md:mb-0">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addPackageSize}
                      className="mt-2 flex items-center text-sm text-(--primary-color)  hover:text-(--secondary-color)  font-medium">
                <PlusCircleIcon className="h-5 w-5 mr-1" /> Añadir Presentación
              </button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Precio (para otros productos) */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
              <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} step="0.01" min="0.01" required={!(formData.type === 'yerba' || formData.type === 'yuyo')}
                     className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-(--accent-color) focus:border-(--accent-color) "/>
            </div>

            {/* Stock (para otros productos) */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock (unidades)</label>
              <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} step="1" min="0" required={!(formData.type === 'yerba' || formData.type === 'yuyo')}
                     className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-(--accent-color)  focus:border-(--accent-color) "/>
            </div>
          </div>
        )}

        {/* Imagen del Producto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del Producto</label>
          <div className="mt-1 flex items-center space-x-4">
            <span className="inline-block h-20 w-20 rounded-md overflow-hidden bg-gray-100">
              {imagePreview ? (
                <img src={imagePreview} alt="Vista previa" className="h-full w-full object-cover" />
              ) : currentImageUrl ? (
                <img src={currentImageUrl} alt="Imagen actual" className="h-full w-full object-cover" />
              ) : (
                <ArrowUpTrayIcon className="h-full w-full text-gray-300 p-4" />
              )}
            </span>
            <label htmlFor="image"
                   className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--accent-color) ">
              <span>{formData.image || currentImageUrl ? 'Cambiar' : 'Subir'} imagen</span>
              <input id="image" name="image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>
        </div>

        {/* Estado (Activo/Inactivo) */}
        <div className="flex items-center">
          <input id="isActive" name="isActive" type="checkbox" checked={formData.isActive} onChange={handleChange}
                 className="h-4 w-4 text-(--accent-color)  border-gray-300 rounded focus:ring-(--accent-color) "/>
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Producto Activo</label>
        </div>

        {/* Mensaje de Error */}
        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

        {/* Botón de Envío */}
        <div className="pt-2">
          <button type="submit" disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white 
                            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-(--accent-color)  hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--accent-color) '}`}>
            {loading ? 'Guardando...' : (isEditMode ? 'Actualizar Producto' : 'Crear Producto')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductFormPage;