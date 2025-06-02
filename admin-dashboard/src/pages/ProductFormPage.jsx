import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
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

const Spinner = () => (
  // Tu componente Spinner (sin cambios, solo asegúrate de que las clases de color funcionen si el fondo del botón cambia)
  // Si el botón de guardado es oscuro, 'text-white' para el spinner está bien.
  // Si el botón fuera claro en estado de carga, necesitarías ajustar el color del spinner.
  <svg className='animate-spin h-5 w-5 mr-2 text-white' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

function ProductFormPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false); // Para la carga inicial de datos en modo edición
  const [isSaving, setIsSaving] = useState(false); // Estado para el proceso de guardado
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditMode = Boolean(productId);

  useEffect(() => {
    if (isEditMode && productId) {
      setIsLoadingInitialData(true); // Inicia carga de datos del producto
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
            image: null, // La imagen se maneja por separado, no se carga aquí
          };
          setFormData(productData);
          if (product.imageUrl) {
            setCurrentImageUrl(product.imageUrl);
          }
        })
        .catch(err => {
          const errorMessage = err.response?.data?.message || err.message || 'Error al cargar el producto.';
          toast.error(errorMessage);
          navigate('/admin/products');
        })
        .finally(() => setIsLoadingInitialData(false)); // Finaliza carga de datos del producto
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
      setCurrentImageUrl(''); // Limpiar la URL actual si se selecciona un nuevo archivo
    } else {
      // Opcional: restaurar la imagen actual si se cancela la selección de archivo
      // setFormData(prev => ({ ...prev, image: null }));
      // setImagePreview(null);
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
    // Aquí puedes añadir validaciones más exhaustivas antes de setIsSaving(true)
    // Ejemplo:
    if (!formData.name.trim() || !formData.category || !formData.type) {
        toast.error("Nombre, categoría y tipo son campos obligatorios.");
        return;
    }
    // Más validaciones...

    setIsSaving(true); // Inicia el estado de guardado

    const dataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'packageSizes' && (formData.type === 'yerba' || formData.type === 'yuyo')) {
        // Asegurarse de que los packageSizes son válidos antes de enviarlos
        const validPackageSizes = formData.packageSizes.filter(pkg => pkg.sizeInKg && pkg.price);
        if (validPackageSizes.length === 0) {
            // No enviar packageSizes si no hay ninguno válido, o manejar como error
            return; 
        }
        validPackageSizes.forEach((pkg, index) => {
          dataToSubmit.append(`packageSizes[${index}][sizeInKg]`, pkg.sizeInKg);
          dataToSubmit.append(`packageSizes[${index}][price]`, pkg.price);
        });
      } else if (key === 'image' && formData.image) {
        dataToSubmit.append('image', formData.image);
      } else if (key !== 'packageSizes' && key !== 'image' && formData[key] !== null && formData[key] !== undefined) {
        // Convertir booleano isActive a string explícitamente si es necesario por el backend
        if (key === 'isActive') {
            dataToSubmit.append(key, String(formData[key]));
        } else {
            dataToSubmit.append(key, formData[key]);
        }
      }
    });

    if (formData.type === 'yerba' || formData.type === 'yuyo') {
      dataToSubmit.delete('price'); // El precio viene de packageSizes
      dataToSubmit.delete('stock'); // El stock es stockInKg
    } else {
      dataToSubmit.delete('stockInKg');
      // No es necesario eliminar packageSizes explícitamente si no se añaden para estos tipos
      // o si el backend lo ignora si no es el tipo correcto.
    }

    try {
      if (isEditMode) {
        await productService.updateProduct(productId, dataToSubmit);
        toast.success('¡Producto actualizado exitosamente!');
      } else {
        await productService.createProduct(dataToSubmit);
        toast.success('¡Producto creado exitosamente!');
      }
      navigate('/admin/products');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el producto.`;
      toast.error(errorMessage);
      setIsSaving(false); // Importante: Reactivar el formulario en caso de error
    } 
    // No es necesario setIsSaving(false) en el success si hay navegación,
    // pero si no hubiera navegación, se pondría en un finally o aquí.
    // Como ya está en el catch, y el success navega, está bien.
  };


  if (isLoadingInitialData && isEditMode) { // Usar el nuevo estado para la carga inicial
    return (
      <div className="flex justify-center items-center h-screen">
        {/* Podrías poner un spinner más grande aquí para la carga de página */}
        <p className="text-center text-gray-600 text-xl">Cargando datos del producto...</p>
      </div>
    );
  }

  const categories = ['Yerbas', 'Mates', 'Bombillas', 'Accesorios', 'Yuyos'];
  const productTypes = {
    Yerbas: ['yerba'], // Asumiendo que 'yerba' es un tipo específico dentro de la categoría 'Yerbas'
    Mates: ['mate calabaza', 'mate torpedo', 'mate camionero', 'mate acero', 'mate vidrio'],
    Bombillas: ['bombilla acero', 'bombilla alpaca', 'bombilla pico de loro'],
    Accesorios: ['termo', 'matero', 'limpia bombilla', 'cepillo mate'],
    Yuyos: ['yuyo medicinal', 'yuyo aromático'], // Asumiendo que 'yuyo' es un tipo específico
  };
  const availableTypes = formData.category ? productTypes[formData.category] || [] : [];

  // Clases para los inputs y selects para DRY
  const inputBaseClasses = "w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-(--secondary-color) focus:border-(--secondary-color) disabled:bg-gray-100 disabled:cursor-not-allowed";
  const labelBaseClasses = "block text-sm font-medium text-gray-700 mb-1";


  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <h1 className="text-3xl font-semibold text-(--text-color) mb-8"> {/* Usando (--text-color) */}
        {isEditMode ? 'Editar Producto' : 'Añadir Nuevo Producto'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-lg shadow-xl space-y-6">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className={labelBaseClasses}>Nombre del Producto</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required disabled={isSaving}
                 className={inputBaseClasses}/>
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className={labelBaseClasses}>Descripción</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="4" disabled={isSaving}
                    className={inputBaseClasses}/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categoría */}
          <div>
            <label htmlFor="category" className={labelBaseClasses}>Categoría</label>
            <select name="category" id="category" value={formData.category} onChange={handleChange} required disabled={isSaving}
                    className={`${inputBaseClasses} bg-white`}>
              <option value="">Seleccione una categoría</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Tipo */}
          <div>
            <label htmlFor="type" className={labelBaseClasses}>Tipo</label>
            <select name="type" id="type" value={formData.type} onChange={handleChange} required disabled={!formData.category || isSaving}
                    className={`${inputBaseClasses} bg-white`}>
              <option value="">{formData.category ? 'Seleccione un tipo' : 'Seleccione categoría primero'}</option>
              {availableTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        {(formData.type === 'yerba' || formData.type === 'yuyo') ? (
          <>
            <div>
              <label htmlFor="stockInKg" className={labelBaseClasses}>Stock (en Kg)</label>
              <input type="number" name="stockInKg" id="stockInKg" value={formData.stockInKg} onChange={handleChange} step="0.01" min="0" required disabled={isSaving}
                     className={inputBaseClasses}/>
            </div>
            <div className="space-y-4 border border-gray-200 p-4 rounded-md">
              <h3 className="text-md font-medium text-gray-800 mb-3">Presentaciones</h3>
              {formData.packageSizes.map((pkg, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-3 bg-gray-50 rounded">
                  <div>
                    <label htmlFor={`sizeInKg-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Tamaño (Kg)</label>
                    <input type="number" name="sizeInKg" id={`sizeInKg-${index}`} value={pkg.sizeInKg}
                           onChange={(e) => handlePackageSizeChange(index, 'sizeInKg', e.target.value)}
                           step="0.01" min="0.01" required disabled={isSaving}
                           className={`${inputBaseClasses} text-sm`}/>
                  </div>
                  <div>
                    <label htmlFor={`price-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Precio ($)</label>
                    <input type="number" name="price" id={`price-${index}`} value={pkg.price}
                           onChange={(e) => handlePackageSizeChange(index, 'price', e.target.value)}
                           step="0.01" min="0.01" required disabled={isSaving}
                           className={`${inputBaseClasses} text-sm`}/>
                  </div>
                  {formData.packageSizes.length > 1 && (
                    <button type="button" onClick={() => removePackageSize(index)} title="Eliminar presentación" disabled={isSaving}
                            className="p-2 text-red-500 hover:text-red-700 self-center md:self-end mb-1 md:mb-0 disabled:opacity-50 disabled:cursor-not-allowed">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addPackageSize} disabled={isSaving}
                      className="mt-2 flex items-center text-sm text-(--secondary-color) hover:text-(--primary-color) font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                <PlusCircleIcon className="h-5 w-5 mr-1" /> Añadir Presentación
              </button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className={labelBaseClasses}>Precio ($)</label>
              <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} step="0.01" min="0.01" 
                     required={!(formData.type === 'yerba' || formData.type === 'yuyo')} disabled={isSaving}
                     className={inputBaseClasses}/>
            </div>
            <div>
              <label htmlFor="stock" className={labelBaseClasses}>Stock (unidades)</label>
              <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} step="1" min="0" 
                     required={!(formData.type === 'yerba' || formData.type === 'yuyo')} disabled={isSaving}
                     className={inputBaseClasses}/>
            </div>
          </div>
        )}

        <div>
          <label className={labelBaseClasses}>Imagen del Producto</label>
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
                   className={`cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--secondary-color) transition-colors duration-150 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <span>{formData.image || currentImageUrl ? 'Cambiar' : 'Subir'} imagen</span>
              <input id="image" name="image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={isSaving} />
            </label>
          </div>
        </div>

        <div className="flex items-center">
          <input id="isActive" name="isActive" type="checkbox" checked={formData.isActive} onChange={handleChange} disabled={isSaving}
                 className="h-4 w-4 text-(--secondary-color) border-gray-300 rounded focus:ring-(--secondary-color) disabled:opacity-50 disabled:cursor-not-allowed"/>
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Producto Activo</label>
        </div>
        
        <div className="pt-5 flex flex-col sm:flex-row sm:justify-end sm:space-x-3">
            <button
                type="button"
                onClick={() => navigate('/admin/products')}
                disabled={isSaving}
                className="w-full sm:w-auto mb-3 sm:mb-0 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--secondary-color) disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Cancelar
            </button>
            <button type="submit" disabled={isSaving}
                    className={`w-full sm:w-auto flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                              ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-(--secondary-color) hover:bg-(--primary-color) focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--secondary-color)'}`}>
              {isSaving ? (
                <>
                  <Spinner />
                  <span>{isEditMode ? 'Actualizando...' : 'Creando...'}</span>
                </>
              ) : (
                isEditMode ? 'Actualizar Producto' : 'Crear Producto'
              )}
            </button>
        </div>
      </form>
    </div>
  );
}

export default ProductFormPage;