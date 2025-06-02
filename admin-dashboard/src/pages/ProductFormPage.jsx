import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';
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

// Esquema de validación con Zod
const packageSizeSchema = z.object({
  sizeInKg: z.preprocess(
    (val) => (val === '' ? undefined : parseFloat(String(val))),
    z.number({ 
      required_error: 'Tamaño (Kg) es requerido', // <--- AÑADIR ESTO
      invalid_type_error: 'Tamaño (Kg) debe ser un número' 
    })
    .positive({ message: 'Tamaño (Kg) debe ser positivo' })
  ),
  price: z.preprocess(
    (val) => (val === '' ? undefined : parseFloat(String(val))),
    z.number({ 
      required_error: 'Precio es requerido', // <--- AÑADIR ESTO
      invalid_type_error: 'Precio debe ser un número' 
    })
    .positive({ message: 'Precio debe ser positivo' })
  ),
});

const productSchema = z.object({
  name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
  description: z.string().optional(),
  category: z.string().min(1, { message: 'Categoría es requerida' }),
  type: z.string().min(1, { message: 'Tipo es requerido' }),
  price: z.preprocess(
    (val) => (val === '' ? undefined : parseFloat(String(val))),
    z.number({ invalid_type_error: 'Precio debe ser un número' }).positive({ message: 'Precio debe ser positivo' }).optional()
  ),
  stock: z.preprocess(
    (val) => (val === '' ? undefined : parseInt(String(val), 10)),
    z.number({ invalid_type_error: 'Stock debe ser un número' }).int({ message: 'Stock debe ser entero' }).min(0, { message: 'Stock no puede ser negativo' }).optional()
  ),
  stockInKg: z.preprocess(
    (val) => (val === '' ? undefined : parseFloat(String(val))),
    z.number({ invalid_type_error: 'Stock (Kg) debe ser un número' }).positive({ message: 'Stock (Kg) debe ser positivo' }).optional()
  ),
  packageSizes: z.array(packageSizeSchema).optional(),
  isActive: z.boolean(),
  image: z.instanceof(File).optional().nullable(), // Permite File, null o undefined
})
.superRefine((data, ctx) => {
  // Validaciones condicionales
  if (data.type === 'yerba' || data.type === 'yuyo') {
    if (!data.stockInKg) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['stockInKg'],
        message: 'Stock (Kg) es requerido para este tipo de producto',
      });
    }
    if (!data.packageSizes || data.packageSizes.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['packageSizes'],
        message: 'Debe haber al menos una presentación para este tipo de producto',
      });
    } else {
        data.packageSizes.forEach((pkg, index) => {
            if (!pkg.sizeInKg || pkg.sizeInKg <= 0) {
                 ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: [`packageSizes.${index}.sizeInKg`],
                    message: 'Tamaño debe ser positivo',
                });
            }
            if (!pkg.price || pkg.price <= 0) {
                 ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: [`packageSizes.${index}.price`],
                    message: 'Precio debe ser positivo',
                });
            }
        });
    }
  } else { // Para otros tipos de productos
    if (data.price === undefined || data.price === null || data.price <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['price'],
        message: 'Precio es requerido y debe ser positivo para este tipo de producto',
      });
    }
    if (data.stock === undefined || data.stock === null || data.stock < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['stock'],
        message: 'Stock es requerido y no puede ser negativo para este tipo de producto',
      });
    }
  }
});


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
  const [formErrors, setFormErrors] = useState({});

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
            price: product.price !== undefined ? String(product.price) : '',
            stock: product.stock !== undefined ? String(product.stock) : '',
            stockInKg: product.stockInKg !== undefined ? String(product.stockInKg) : '',
            packageSizes: product.packageSizes && product.packageSizes.length > 0
              ? product.packageSizes.map(pkg => ({ 
                  sizeInKg: pkg.sizeInKg !== undefined ? String(pkg.sizeInKg) : '', 
                  price: pkg.price !== undefined ? String(pkg.price) : '' 
                }))
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
          toast.error(errorMessage);
          navigate('/admin/products');
        })
        .finally(() => setIsLoadingInitialData(false)); // Finaliza carga de datos del producto
    } else {
      setFormData(initialFormData);
      setImagePreview(null);
      setCurrentImageUrl('');
      setFormErrors({});
    }
  }, [isEditMode, productId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({ ...prevErrors, [name]: undefined })); // Limpiar error si el campo cambia
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setCurrentImageUrl(''); // Limpiar la URL actual si se selecciona un nuevo archivo
      if (formErrors.image) {
        setFormErrors(prevErrors => ({ ...prevErrors, image: undefined })); // Limpiar error si se selecciona un archivo
      }
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
    //Limpiar errores de packageSizes
    const errorPath = `packageSizes.${index}.${field}`;
    if (formErrors[errorPath]) {
      setFormErrors(prevErrors => ({ ...prevErrors, [errorPath]: undefined, packageSizes: undefined })); // Limpiar error si el campo cambia
    } else if (formErrors.packageSizes) { // Limpiar error general de packageSizes si existe
      setFormErrors(prevErrors => ({ ...prevErrors, packageSizes: undefined }));
    }
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
    setFormErrors({}); // Limpiar errores previos
 
      // Crear un objeto para validar, Zod espera los tipos correctos
    const dataToValidate = {
        ...formData,
        // Zod se encargará de la conversión con z.preprocess para números
    };
    
    const validationResult = productSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
      console.log('Zod Errors:', JSON.stringify(validationResult.error.errors, null, 2));
      const errors = {};
      validationResult.error.errors.forEach(error => {
        const path = error.path.join('.');
        errors[path] = error.message;
      });
      setFormErrors(errors);
      toast.error('Por favor, corrige los errores en el formulario.');
      return; // No continuar si hay errores de validación
    }

    // Si la validación es exitosa, validationResult.data contiene los datos parseados y tipados
    const validatedData = validationResult.data;


    setIsSaving(true); // Inicia el estado de guardado

    const dataToSubmit = new FormData();

    Object.keys(validatedData).forEach(key => {
      if (key === 'packageSizes' && (validatedData.type === 'yerba' || validatedData.type === 'yuyo')) {
        if (validatedData.packageSizes && validatedData.packageSizes.length > 0) {
          validatedData.packageSizes.forEach((pkg, index) => {
            dataToSubmit.append(`packageSizes[${index}][sizeInKg]`, String(pkg.sizeInKg));
            dataToSubmit.append(`packageSizes[${index}][price]`, String(pkg.price));
          });
        }
      } else if (key === 'image' && validatedData.image) {
        dataToSubmit.append('image', validatedData.image);
      } else if (key !== 'packageSizes' && key !== 'image' && validatedData[key] !== null && validatedData[key] !== undefined) {
        dataToSubmit.append(key, String(validatedData[key]));
      }
    });

    if (validatedData.type === 'yerba' || validatedData.type === 'yuyo') {
      dataToSubmit.delete('price');
      dataToSubmit.delete('stock');
    } else {
      dataToSubmit.delete('stockInKg');
      // No es necesario eliminar packageSizes explícitamente si no se añaden para estos tipos
      // o si el backend lo ignora si no es el tipo correcto.
      // También, si packageSizes está vacío, no se habrá añadido.
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
  const errorTextClasses = "mt-1 text-xs text-red-600";


  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <h1 className="text-3xl font-semibold text-(--text-color) mb-8"> {/* Usando (--text-color) */}
        {isEditMode ? 'Editar Producto' : 'Añadir Nuevo Producto'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-lg shadow-xl space-y-6" noValidate>
        {/* Nombre */}
        <div>
          <label htmlFor="name" className={labelBaseClasses}>Nombre del Producto</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} disabled={isSaving}
                 className={`${inputBaseClasses} ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}/>
          {formErrors.name && <p className={errorTextClasses}>{formErrors.name}</p>}
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className={labelBaseClasses}>Descripción</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="4" disabled={isSaving}
                    className={`${inputBaseClasses} ${formErrors.description ? 'border-red-500' : 'border-gray-300'}`}/>
          {formErrors.description && <p className={errorTextClasses}>{formErrors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Categoría */}
          <div>
            <label htmlFor="category" className={labelBaseClasses}>Categoría</label>
            <select name="category" id="category" value={formData.category} onChange={handleChange} disabled={isSaving}
                    className={`${inputBaseClasses} bg-white ${formErrors.category ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">Seleccione una categoría</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {formErrors.category && <p className={errorTextClasses}>{formErrors.category}</p>}
          </div>

          {/* Tipo */}
          <div>
            <label htmlFor="type" className={labelBaseClasses}>Tipo</label>
            <select name="type" id="type" value={formData.type} onChange={handleChange} disabled={!formData.category || isSaving}
                    className={`${inputBaseClasses} bg-white ${formErrors.type ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">{formData.category ? 'Seleccione un tipo' : 'Seleccione categoría primero'}</option>
              {availableTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            {formErrors.type && <p className={errorTextClasses}>{formErrors.type}</p>}
          </div>
        </div>

        {(formData.type === 'yerba' || formData.type === 'yuyo') ? (
          <>
            <div>
              <label htmlFor="stockInKg" className={labelBaseClasses}>Stock (en Kg)</label>
              <input type="number" name="stockInKg" id="stockInKg" value={formData.stockInKg} onChange={handleChange} step="0.01" min="0" disabled={isSaving}
                     className={`${inputBaseClasses} ${formErrors.stockInKg ? 'border-red-500' : 'border-gray-300'}`}/>
              {formErrors.stockInKg && <p className={errorTextClasses}>{formErrors.stockInKg}</p>}
            </div>
            <div className="space-y-4 border border-gray-200 p-4 rounded-md">
              <h3 className="text-md font-medium text-gray-800 mb-3">Presentaciones</h3>
              {formErrors.packageSizes && typeof formErrors.packageSizes === 'string' && <p className={errorTextClasses}>{formErrors.packageSizes}</p>}
              {formData.packageSizes.map((pkg, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-3 bg-gray-50 rounded">
                  <div>
                    <label htmlFor={`sizeInKg-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Tamaño (Kg)</label>
                    <input type="number" name="sizeInKg" id={`sizeInKg-${index}`} value={pkg.sizeInKg}
                           onChange={(e) => handlePackageSizeChange(index, 'sizeInKg', e.target.value)}
                           step="0.01" min="0.01" disabled={isSaving}
                           className={`${inputBaseClasses} text-sm ${formErrors[`packageSizes.${index}.sizeInKg`] ? 'border-red-500' : 'border-gray-300'}`}/>
                    {formErrors[`packageSizes.${index}.sizeInKg`] && <p className={errorTextClasses}>{formErrors[`packageSizes.${index}.sizeInKg`]}</p>}
                  </div>
                  <div>
                    <label htmlFor={`price-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Precio ($)</label>
                    <input type="number" name="price" id={`price-${index}`} value={pkg.price}
                           onChange={(e) => handlePackageSizeChange(index, 'price', e.target.value)}
                           step="0.01" min="0.01" disabled={isSaving}
                           className={`${inputBaseClasses} text-sm ${formErrors[`packageSizes.${index}.price`] ? 'border-red-500' : 'border-gray-300'}`}/>
                    {formErrors[`packageSizes.${index}.price`] && <p className={errorTextClasses}>{formErrors[`packageSizes.${index}.price`]}</p>}
                  </div>
                  {formData.packageSizes.length > 1 && ( // Solo mostrar si hay más de uno, o si no es requerido y hay uno
                     (formData.type !== 'yerba' && formData.type !== 'yuyo') || formData.packageSizes.length > 1) && (
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
                     disabled={isSaving}
                     className={`${inputBaseClasses} ${formErrors.price ? 'border-red-500' : 'border-gray-300'}`}/>
              {formErrors.price && <p className={errorTextClasses}>{formErrors.price}</p>}
            </div>
            <div>
              <label htmlFor="stock" className={labelBaseClasses}>Stock (unidades)</label>
              <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} step="1" min="0" 
                     disabled={isSaving}
                     className={`${inputBaseClasses} ${formErrors.stock ? 'border-red-500' : 'border-gray-300'}`}/>
              {formErrors.stock && <p className={errorTextClasses}>{formErrors.stock}</p>}
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
          {formErrors.image && <p className={errorTextClasses}>{formErrors.image}</p>}
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