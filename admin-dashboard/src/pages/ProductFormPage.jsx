import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify'; // <--- IMPORTAR TOAST
import productService from '../services/productService';
import { ArrowUpTrayIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

const initialFormData = {
  name: '',
  description: '',
  category: '',
  type: '',
  price: '',
  stock: '',
  stockInKg: '',
  packageSizes: [{ sizeInKg: '', price: '' }],
  isActive: true,
  image: null,
};

function ProductFormPage() { // Eliminado 'mode' prop, se infiere de productId
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(''); // Reemplazado por toasts
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditMode = Boolean(productId); // Determina si es modo edición

  useEffect(() => {
    if (isEditMode && productId) {
      setLoading(true);
      productService.getProductById(productId)
        .then(product => {
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
            image: null,
          };
          setFormData(productData);
          if (product.imageUrl) {
            setCurrentImageUrl(product.imageUrl);
          }
        })
        .catch(err => {
          const errorMessage = err.response?.data?.message || err.message || 'Error al cargar el producto.';
          toast.error(errorMessage); // <--- NOTIFICACIÓN DE ERROR
          navigate('/admin/products'); // Opcional: redirigir si no se puede cargar
        })
        .finally(() => setLoading(false));
    } else {
      setFormData(initialFormData);
      setImagePreview(null);
      setCurrentImageUrl('');
    }
  }, [isEditMode, productId, navigate]);

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
      setCurrentImageUrl('');
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
    if (formData.packageSizes.length <= 1 && (formData.type === 'yerba' || formData.type === 'yuyo')) {
        toast.warn('Debe haber al menos una presentación para yerbas/yuyos.');
        return;
    }
    const updatedPackageSizes = formData.packageSizes.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, packageSizes: updatedPackageSizes }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'packageSizes' && (formData.type === 'yerba' || formData.type === 'yuyo')) {
        formData.packageSizes.forEach((pkg, index) => {
          dataToSubmit.append(`packageSizes[${index}][sizeInKg]`, pkg.sizeInKg);
          dataToSubmit.append(`packageSizes[${index}][price]`, pkg.price);
        });
      } else if (key === 'image' && formData.image) {
        dataToSubmit.append('image', formData.image);
      } else if (key !== 'packageSizes' && key !== 'image' && formData[key] !== null && formData[key] !== undefined) {
        dataToSubmit.append(key, String(formData[key]));
      }
    });

    if (formData.type === 'yerba' || formData.type === 'yuyo') {
      dataToSubmit.delete('price');
      dataToSubmit.delete('stock');
    } else {
      dataToSubmit.delete('stockInKg');
      // No es necesario eliminar packageSizes explícitamente si no se añaden para estos tipos
    }

    try {
      if (isEditMode) {
        await productService.updateProduct(productId, dataToSubmit);
        toast.success('¡Producto actualizado exitosamente!'); // <--- NOTIFICACIÓN
      } else {
        await productService.createProduct(dataToSubmit);
        toast.success('¡Producto creado exitosamente!'); // <--- NOTIFICACIÓN
      }
      navigate('/admin/products');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el producto.`;
      toast.error(errorMessage); // <--- NOTIFICACIÓN DE ERROR
    } finally {
      setLoading(false);
    }
  };

  // ... (resto del JSX, asegurándote de que las clases Tailwind usen los nombres de tu config)
  // Por ejemplo: text-[--primary-color], focus:ring-[--accent-color]

  if (loading && isEditMode && !formData.name) {
    return <p className="text-center text-gray-600 mt-10">Cargando datos del producto...</p>;
  }

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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-(--accent-color) focus:border-(--accent-color) bg-white">
              <option value="">Seleccione una categoría</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Tipo */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select name="type" id="type" value={formData.type} onChange={handleChange} required disabled={!formData.category}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-(--accent-color) focus:border-(--accent-color) bg-white disabled:bg-gray-100">
              <option value="">{formData.category ? 'Seleccione un tipo' : 'Seleccione categoría primero'}</option>
              {availableTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        {(formData.type === 'yerba' || formData.type === 'yuyo') ? (
          <>
            <div>
              <label htmlFor="stockInKg" className="block text-sm font-medium text-gray-700 mb-1">Stock (en Kg)</label>
              <input type="number" name="stockInKg" id="stockInKg" value={formData.stockInKg} onChange={handleChange} step="0.01" min="0" required
                     className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-(--accent-color) focus:border-(--accent-color)"/>
            </div>
            <div className="space-y-4 border border-gray-200 p-4 rounded-md">
              <h3 className="text-md font-medium text-gray-800">Presentaciones</h3>
              {formData.packageSizes.map((pkg, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-3 bg-gray-50 rounded">
                  <div>
                    <label htmlFor={`sizeInKg-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Tamaño (Kg)</label>
                    <input type="number" name="sizeInKg" id={`sizeInKg-${index}`} value={pkg.sizeInKg}
                           onChange={(e) => handlePackageSizeChange(index, 'sizeInKg', e.target.value)}
                           step="0.01" min="0.01" required
                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-(--accent-color) focus:border-(--accent-color)"/>
                  </div>
                  <div>
                    <label htmlFor={`price-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Precio ($)</label>
                    <input type="number" name="price" id={`price-${index}`} value={pkg.price}
                           onChange={(e) => handlePackageSizeChange(index, 'price', e.target.value)}
                           step="0.01" min="0.01" required
                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-(--accent-color) focus:border-(--accent-color)"/>
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
                      className="mt-2 flex items-center text-sm text-yrbx-olive hover:text-yrbx-green-dark font-medium">
                <PlusCircleIcon className="h-5 w-5 mr-1" /> Añadir Presentación
              </button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
              <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} step="0.01" min="0.01" required={!(formData.type === 'yerba' || formData.type === 'yuyo')}
                     className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-(--accent-color) focus:border-(--accent-color)"/>
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock (unidades)</label>
              <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} step="1" min="0" required={!(formData.type === 'yerba' || formData.type === 'yuyo')}
                     className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-(--accent-color) focus:border-(--accent-color)"/>
            </div>
          </div>
        )}

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
                   className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--accent-color) transition-colors duration-150">
              <span>{formData.image || currentImageUrl ? 'Cambiar' : 'Subir'} imagen</span>
              <input id="image" name="image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>
        </div>

        <div className="flex items-center">
          <input id="isActive" name="isActive" type="checkbox" checked={formData.isActive} onChange={handleChange}
                 className="h-4 w-4 text-(--accent-color) border-gray-300 rounded focus:ring-(--accent-color)"/>
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Producto Activo</label>
        </div>

        {/* El estado 'error' local ya no es necesario si se maneja con toasts */}
        <div className="pt-2">
          <button type="submit" disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white 
                            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-(--accent-color) hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--accent-color)'}`}>
            {loading ? 'Guardando...' : (isEditMode ? 'Actualizar Producto' : 'Crear Producto')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductFormPage;