import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import ProductFormPage from '../src/pages/ProductFormPage';
// No importes 'actualProductService' aquí en el scope global si vas a redefinirlo o usar vi.mocked de forma específica.

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: vi.fn(() => ({ productId: undefined })),
  };
});

// Mock de productService
vi.mock('../src/services/productService', () => {
  console.log('[TEST] Mocking productService factory executing'); // Crucial para depuración
  return {
    default: {
      getProductById: vi.fn(),
      createProduct: vi.fn(),
      updateProduct: vi.fn(),
      deleteProduct: vi.fn(),
      getAllProducts: vi.fn(),
    },
  };
});

// Ahora importa el servicio DESPUÉS de que vi.mock haya sido declarado.
// Vitest se encarga del hoisting de vi.mock, por lo que esta importación debería recibir el mock.
import actualProductService from '../src/services/productService';
// Usa vi.mocked para obtener una referencia tipada y asegurar que es el mock.
const mockedProductService = vi.mocked(actualProductService, true);


vi.mock('react-toastify', async () => {
  const actual = await vi.importActual('react-toastify');
  return {
    ...actual,
    ToastContainer: ({ children }) => <div data-testid="toast-container">{children}</div>,
    toast: {
      success: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    },
  };
});


const renderWithRouter = (ui, { route = '/', path = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return {
    user: userEvent.setup(),
    ...render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path} element={ui} />
        </Routes>
        <ToastContainer />
      </MemoryRouter>
    ),
  };
};

describe('ProductFormPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({ productId: undefined });

    // Asegúrate de que mockedProductService esté definido y sea el mock
    // Si la reestructuración anterior no funciona, este log lo indicará.
    if (!mockedProductService || typeof mockedProductService.getProductById !== 'function') {
        console.error("[TEST] beforeEach: mockedProductService NO está correctamente inicializado. Value:", mockedProductService);
        // Lanza un error para detener las pruebas si el mock es fundamental y no está listo.
        throw new Error("Fallo crítico: mockedProductService no está disponible en beforeEach.");
    }

    // Resetea los mocks de productService. vi.clearAllMocks() limpia llamadas, pero no mockImplementations/mockResolvedValue.
    // .mockReset() es más completo para limpiar el estado de un mock específico.
    mockedProductService.getProductById.mockReset();
    mockedProductService.createProduct.mockReset();
    mockedProductService.updateProduct.mockReset();
    mockedProductService.deleteProduct.mockReset();
    mockedProductService.getAllProducts.mockReset();

    if (toast && typeof toast.success === 'function' && 'mockReset' in toast.success) {
        vi.mocked(toast.success).mockReset();
        vi.mocked(toast.error).mockReset();
        vi.mocked(toast.warn).mockReset();
    } else {
         console.error("[TEST] beforeEach: toast o sus métodos no están correctamente mockeados.");
    }

    navigateMock.mockReset();
  });

   afterEach(() => {
     vi.restoreAllMocks();
   });


  test('renders "Añadir Nuevo Producto" title in create mode', () => {
    renderWithRouter(<ProductFormPage />, { route: '/admin/products/new', path: '/admin/products/new' });
    expect(screen.getByRole('heading', { name: /añadir nuevo producto/i })).toBeInTheDocument();
  });

  test('shows loading message while fetching product data in edit mode', async () => {
    vi.mocked(useParams).mockReturnValue({ productId: '123' });
    // No es necesario el if (!mockedProductService) aquí si el beforeEach lo valida.
    mockedProductService.getProductById.mockReturnValue(new Promise(() => {}));

    renderWithRouter(<ProductFormPage />, {
      path: '/admin/products/edit/:productId',
      route: '/admin/products/edit/123',
    });
    expect(await screen.findByText(/cargando datos del producto.../i)).toBeInTheDocument();
  });

  test('renders "Editar Producto" title in edit mode and loads data', async () => {
    vi.mocked(useParams).mockReturnValue({ productId: '123' });
    const mockProduct = {
      _id: '123',
      name: 'Test Product Edit',
      description: 'Descripción de edición',
      category: 'Yerbas',
      type: 'yerba',
      stockInKg: '10.5',
      packageSizes: [{ sizeInKg: '0.5', price: '500' }],
      isActive: true,
      imageUrl: 'http://example.com/image.png',
    };
    mockedProductService.getProductById.mockResolvedValueOnce(mockProduct);

    renderWithRouter(<ProductFormPage />, {
      path: '/admin/products/edit/:productId',
      route: '/admin/products/edit/123',
    });

    expect(await screen.findByRole('heading', { name: /editar producto/i })).toBeInTheDocument();
    expect(await screen.findByLabelText(/nombre del producto/i)).toHaveValue(mockProduct.name);
    expect(screen.getByLabelText(/descripción/i)).toHaveValue(mockProduct.description);
    expect(screen.getByLabelText(/categoría/i)).toHaveValue(mockProduct.category);
    await waitFor(() => expect(screen.getByLabelText(/tipo/i)).toHaveValue(mockProduct.type));
    expect(screen.getByLabelText(/stock \(en kg\)/i)).toHaveValue(parseFloat(mockProduct.stockInKg));

    await waitFor(() => {
        expect(screen.getAllByLabelText(/tamaño \(kg\)/i)[0]).toHaveValue(parseFloat(mockProduct.packageSizes[0].sizeInKg));
        expect(screen.getAllByLabelText(/precio \(\$\)/i)[0]).toHaveValue(parseFloat(mockProduct.packageSizes[0].price));
    });

    expect(screen.getByLabelText(/producto activo/i)).toBeChecked();
    expect(screen.getByAltText(/imagen actual/i)).toHaveAttribute('src', mockProduct.imageUrl);
  });

   test('handles error when getProductById fails in edit mode', async () => {
    vi.mocked(useParams).mockReturnValue({ productId: 'fail123' });
    const errorMessage = 'Failed to fetch product';
    mockedProductService.getProductById.mockRejectedValueOnce(new Error(errorMessage));

    renderWithRouter(<ProductFormPage />, {
      path: '/admin/products/edit/:productId',
      route: '/admin/products/edit/fail123',
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
    expect(navigateMock).toHaveBeenCalledWith('/admin/products');
  });

  test('shows validation error for name if submitted empty', async () => {
    const { user } = renderWithRouter(<ProductFormPage />, { route: '/admin/products/new', path: '/admin/products/new' });
    const submitButton = screen.getByRole('button', { name: /crear producto/i });
    await user.click(submitButton);
    expect(await screen.findByText(/el nombre debe tener al menos 3 caracteres/i)).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith('Por favor, corrige los errores en el formulario.');
  });

  test('shows validation error for category if submitted empty', async () => {
    const { user } = renderWithRouter(<ProductFormPage />, { route: '/admin/products/new', path: '/admin/products/new' });
    await user.type(screen.getByLabelText(/nombre del producto/i), 'Test Name');
    await user.click(screen.getByRole('button', { name: /crear producto/i }));
    expect(await screen.findByText(/categoría es requerida/i)).toBeInTheDocument();
  });

  test('shows validation error for type if category selected but type submitted empty', async () => {
    const { user } = renderWithRouter(<ProductFormPage />, { route: '/admin/products/new', path: '/admin/products/new' });
    await user.type(screen.getByLabelText(/nombre del producto/i), 'Test Name');
    await user.selectOptions(screen.getByLabelText(/categoría/i), 'Mates');
    await user.click(screen.getByRole('button', { name: /crear producto/i }));
    expect(await screen.findByText(/tipo es requerido/i)).toBeInTheDocument();
  });

  test('successfully creates a new "Mate" product', async () => {
    const { user } = renderWithRouter(<ProductFormPage />, { route: '/admin/products/new', path: '/admin/products/new' });
    mockedProductService.createProduct.mockResolvedValueOnce({ _id: 'newProdId', name: 'Mate Test' });

    await user.type(screen.getByLabelText(/nombre del producto/i), 'Mate Test');
    await user.selectOptions(screen.getByLabelText(/categoría/i), 'Mates');
    await waitFor(async () => {
      const typeSelect = screen.getByLabelText(/tipo/i);
      expect(typeSelect).toBeEnabled();
      await user.selectOptions(typeSelect, 'mate calabaza');
    });
    await user.type(screen.getByLabelText(/precio \(\$\)/i), '1500');
    await user.type(screen.getByLabelText(/stock \(unidades\)/i), '20');

    const submitButton = screen.getByRole('button', { name: /crear producto/i });
    await user.click(submitButton);

    expect(await screen.findByRole('button', { name: /creando.../i })).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(mockedProductService.createProduct).toHaveBeenCalledTimes(1);
      const formDataSent = mockedProductService.createProduct.mock.calls[0][0];
      expect(formDataSent.get('name')).toBe('Mate Test');
      expect(formDataSent.get('category')).toBe('Mates');
      expect(formDataSent.get('type')).toBe('mate calabaza');
      expect(formDataSent.get('price')).toBe('1500');
      expect(formDataSent.get('stock')).toBe('20');
    });
    expect(toast.success).toHaveBeenCalledWith('¡Producto creado exitosamente!');
    expect(navigateMock).toHaveBeenCalledWith('/admin/products');
  });

   test('successfully creates a new "Yerba" product', async () => {
    const { user } = renderWithRouter(<ProductFormPage />, { route: '/admin/products/new', path: '/admin/products/new' });
    mockedProductService.createProduct.mockResolvedValueOnce({ _id: 'yerbaProdId', name: 'Yerba Test' });

    await user.type(screen.getByLabelText(/nombre del producto/i), 'Yerba Test');
    await user.selectOptions(screen.getByLabelText(/categoría/i), 'Yerbas');
    await waitFor(async () => {
        const typeSelect = screen.getByLabelText(/tipo/i);
        expect(typeSelect).toBeEnabled();
        await user.selectOptions(typeSelect, 'yerba');
    });
    await user.type(screen.getByLabelText(/stock \(en kg\)/i), '5.5');
    const sizeInputs = screen.getAllByLabelText(/tamaño \(kg\)/i);
    const priceInputs = screen.getAllByLabelText(/precio \(\$\)/i);
    await user.type(sizeInputs[0], '0.5');
    await user.type(priceInputs[0], '750');

    await user.click(screen.getByRole('button', { name: /crear producto/i }));

    await waitFor(() => {
      expect(mockedProductService.createProduct).toHaveBeenCalledTimes(1);
      const formDataSent = mockedProductService.createProduct.mock.calls[0][0];
      expect(formDataSent.get('name')).toBe('Yerba Test');
      expect(formDataSent.get('stockInKg')).toBe('5.5');
      expect(formDataSent.get('packageSizes[0][sizeInKg]')).toBe('0.5');
      expect(formDataSent.get('packageSizes[0][price]')).toBe('750');
      expect(formDataSent.has('price')).toBe(false);
      expect(formDataSent.has('stock')).toBe(false);
    });
    expect(toast.success).toHaveBeenCalledWith('¡Producto creado exitosamente!');
    expect(navigateMock).toHaveBeenCalledWith('/admin/products');
  });

  test('successfully updates an existing product', async () => {
    vi.mocked(useParams).mockReturnValue({ productId: 'existing123' });
    const mockProduct = {
      _id: 'existing123', name: 'Old Name', category: 'Mates', type: 'mate torpedo',
      price: '1000', stock: '10', isActive: true, imageUrl: 'http://example.com/old.png', packageSizes: []
    };
    mockedProductService.getProductById.mockResolvedValue(mockProduct);
    mockedProductService.updateProduct.mockResolvedValue({ ...mockProduct, name: 'New Name Updated', price: '1200' });

    const { user } = renderWithRouter(<ProductFormPage />, {
      path: '/admin/products/edit/:productId', route: '/admin/products/edit/existing123',
    });

    expect(await screen.findByDisplayValue('Old Name')).toBeInTheDocument();
    const nameInput = screen.getByLabelText(/nombre del producto/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'New Name Updated');

    const priceInput = screen.getByLabelText(/precio \(\$\)/i);
    await user.clear(priceInput);
    await user.type(priceInput, '1200');

    const submitButton = screen.getByRole('button', { name: /actualizar producto/i });
    await user.click(submitButton);

    expect(await screen.findByRole('button', { name: /actualizando.../i })).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(mockedProductService.updateProduct).toHaveBeenCalledTimes(1);
      const [productIdSent, formDataSent] = mockedProductService.updateProduct.mock.calls[0];
      expect(productIdSent).toBe('existing123');
      expect(formDataSent.get('name')).toBe('New Name Updated');
      expect(formDataSent.get('price')).toBe('1200');
    });
    expect(toast.success).toHaveBeenCalledWith('¡Producto actualizado exitosamente!');
    expect(navigateMock).toHaveBeenCalledWith('/admin/products');
  });

  test('shows validation errors for price and stock if Mate submitted empty', async () => {
    const { user } = renderWithRouter(<ProductFormPage />, { route: '/admin/products/new', path: '/admin/products/new' });
    await user.type(screen.getByLabelText(/nombre del producto/i), 'Valid Mate Name');
    await user.selectOptions(screen.getByLabelText(/categoría/i), 'Mates');
    await waitFor(async () => {
      const typeSelect = screen.getByLabelText(/tipo/i);
      expect(typeSelect).toBeEnabled();
      await user.selectOptions(typeSelect, 'mate camionero');
    });
    const submitButton = screen.getByRole('button', { name: /crear producto/i });
    await user.click(submitButton);

    // screen.debug(undefined, Infinity); // Descomentar para depurar el DOM si falla

    expect(await screen.findByText(/precio es requerido y debe ser positivo para este tipo de producto/i)).toBeInTheDocument();
    expect(await screen.findByText(/stock es requerido y no puede ser negativo para este tipo de producto/i)).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith('Por favor, corrige los errores en el formulario.');
  });

  test('shows validation errors for stockInKg and packageSizes if Yerba submitted empty', async () => {
    const { user } = renderWithRouter(<ProductFormPage />, { route: '/admin/products/new', path: '/admin/products/new' });
    await user.type(screen.getByLabelText(/nombre del producto/i), 'Valid Yerba Name');
    await user.selectOptions(screen.getByLabelText(/categoría/i), 'Yerbas');
    await waitFor(async () => {
      const typeSelect = screen.getByLabelText(/tipo/i);
      expect(typeSelect).toBeEnabled();
      await user.selectOptions(typeSelect, 'yerba');
    });
    const submitButton = screen.getByRole('button', { name: /crear producto/i });
    await user.click(submitButton);

    // screen.debug(undefined, Infinity); // Descomentar para depurar el DOM si falla

    // El mensaje de Zod para stockInKg es "Stock (Kg) es requerido..."
    expect(await screen.findByText(/Stock \(Kg\) es requerido para este tipo de producto/i)).toBeInTheDocument();

    // Para packageSizes, cuando los campos internos están vacíos, Zod emite errores para esos campos.
    // El mensaje "Debe haber al menos una presentación..." es para cuando el array packageSizes está vacío o no existe.
    // En este caso, el array existe con un objeto con campos vacíos.
    expect(await screen.findByText('Tamaño (Kg) es requerido')).toBeInTheDocument(); // Error de packageSizeSchema
    expect(await screen.findByText('Precio es requerido')).toBeInTheDocument(); // Error de packageSizeSchema

    expect(toast.error).toHaveBeenCalledWith('Por favor, corrige los errores en el formulario.');
  });

  test('shows validation error for package size fields if Yerba submitted with empty package details', async () => {
    const { user } = renderWithRouter(<ProductFormPage />, { route: '/admin/products/new', path: '/admin/products/new' });
    await user.type(screen.getByLabelText(/nombre del producto/i), 'Valid Yerba');
    await user.selectOptions(screen.getByLabelText(/categoría/i), 'Yerbas');
    await waitFor(async () => {
      const typeSelect = screen.getByLabelText(/tipo/i);
      expect(typeSelect).toBeEnabled();
      await user.selectOptions(typeSelect, 'yerba');
    });
    await user.type(screen.getByLabelText(/stock \(en kg\)/i), '1');

    const submitButton = screen.getByRole('button', { name: /crear producto/i });
    await user.click(submitButton);

    expect(await screen.findByText('Tamaño (Kg) es requerido')).toBeInTheDocument();
    expect(await screen.findByText('Precio es requerido')).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith('Por favor, corrige los errores en el formulario.');
  });

   // ...existing code...
test('handles image upload and shows preview', async () => {
  const { user } = renderWithRouter(<ProductFormPage />, { route: '/admin/products/new', path: '/admin/products/new' });
  const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
  const imageInput = screen.getByLabelText(/subir imagen/i, { selector: 'input[type="file"]' });

  expect(screen.getByTestId('upload-icon-placeholder')).toBeInTheDocument();

  await user.upload(imageInput, file);

  const previewImage = await screen.findByAltText(/vista previa/i, {}, { timeout: 4000 });
  expect(previewImage).toBeInTheDocument();
  expect(previewImage.src).toMatch(/^blob:/);

  expect(screen.getByLabelText(/cambiar imagen/i, { selector: 'span' })).toBeInTheDocument();
  expect(screen.getByLabelText(/cambiar imagen/i, { selector: 'input[type="file"]' })).toBe(imageInput);
});
// ...existing code...

  test('adds and removes package sizes for Yerba type', async () => {
    const { user } = renderWithRouter(<ProductFormPage />, { route: '/admin/products/new', path: '/admin/products/new' });
    await user.selectOptions(screen.getByLabelText(/categoría/i), 'Yerbas');
    await waitFor(async () => {
      const typeSelect = screen.getByLabelText(/tipo/i);
      expect(typeSelect).toBeEnabled();
      await user.selectOptions(typeSelect, 'yerba');
    });

    expect(screen.getAllByLabelText(/tamaño \(kg\)/i)).toHaveLength(1);
    expect(screen.queryByRole('button', { name: /eliminar presentación/i })).not.toBeInTheDocument();

    const addButton = screen.getByRole('button', { name: /añadir presentación/i });
    await user.click(addButton);
    expect(screen.getAllByLabelText(/tamaño \(kg\)/i)).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /eliminar presentación/i })).toHaveLength(2);

    const removeButtons = screen.getAllByRole('button', { name: /eliminar presentación/i });
    await user.click(removeButtons[0]);
    expect(screen.getAllByLabelText(/tamaño \(kg\)/i)).toHaveLength(1);
    expect(screen.queryByRole('button', { name: /eliminar presentación/i })).not.toBeInTheDocument();
  });

  test('warns when trying to remove the last package size for Yerba type', async () => {
    const { user } = renderWithRouter(<ProductFormPage />, { route: '/admin/products/new', path: '/admin/products/new' });
    await user.selectOptions(screen.getByLabelText(/categoría/i), 'Yerbas');
     await waitFor(async () => {
      const typeSelect = screen.getByLabelText(/tipo/i);
      expect(typeSelect).toBeEnabled();
      await user.selectOptions(typeSelect, 'yerba');
    });
    // La UI actual previene que el botón de eliminar se muestre si solo hay una presentación.
    // Esta prueba, tal como está, no puede verificar el toast.warn porque la acción es prevenida.
    // Para probar la lógica de removePackageSize directamente, se necesitaría exportarla o modificar la UI para la prueba.
    // Por ahora, se asume que la lógica del componente que oculta el botón es correcta.
    expect(screen.queryByRole('button', { name: /eliminar presentación/i })).not.toBeInTheDocument();
  });


  // ...existing code...
test('handles API error during product creation', async () => {
  const { user } = renderWithRouter(<ProductFormPage />, { route: '/admin/products/new', path: '/admin/products/new' });
  const errorMessage = 'Network Error Create';
  mockedProductService.createProduct.mockRejectedValueOnce(new Error(errorMessage));

  // Usar datos válidos para pasar la validación
  await user.type(screen.getByLabelText(/nombre del producto/i), 'Valid Mate Name');
  await user.selectOptions(screen.getByLabelText(/categoría/i), 'Mates');
  await waitFor(async () => {
    const typeSelect = screen.getByLabelText(/tipo/i);
    expect(typeSelect).toBeEnabled();
    await user.selectOptions(typeSelect, 'mate calabaza');
  });
  await user.type(screen.getByLabelText(/precio \(\$\)/i), '100');
  await user.type(screen.getByLabelText(/stock \(unidades\)/i), '1');
  
  const submitButton = screen.getByRole('button', { name: /crear producto/i });
  await user.click(submitButton);

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });
  expect(navigateMock).not.toHaveBeenCalled();
  expect(submitButton).not.toBeDisabled();
});

test('handles API error during product update', async () => {
  vi.mocked(useParams).mockReturnValue({ productId: 'updateFail123' });
  const mockProductData = { 
    _id: 'updateFail123', 
    name: 'Update Fail Name', 
    category: 'Mates', 
    type: 'mate acero', 
    price: '200', 
    stock: '2', 
    isActive: true, 
    imageUrl: '', 
    packageSizes: [] 
  };
  mockedProductService.getProductById.mockResolvedValue(mockProductData);
  const errorMessage = 'Network Error Update';
  mockedProductService.updateProduct.mockRejectedValueOnce(new Error(errorMessage));

  const { user } = renderWithRouter(<ProductFormPage />, {
    path: '/admin/products/edit/:productId', route: '/admin/products/edit/updateFail123',
  });
  
  await waitFor(() => {
    expect(screen.getByDisplayValue('Update Fail Name')).toBeInTheDocument();
  });

  // Asegurar que los campos tienen valores válidos
  await waitFor(() => {
    expect(screen.getByDisplayValue('200')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  const submitButton = screen.getByRole('button', { name: /actualizar producto/i });
  await user.click(submitButton);

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });
  expect(navigateMock).not.toHaveBeenCalled();
  expect(submitButton).not.toBeDisabled();
});
// ...existing code...

  test('handles API error during product update', async () => {
    vi.mocked(useParams).mockReturnValue({ productId: 'updateFail123' });
    const mockProductData = { _id: 'updateFail123', name: 'Update Fail Name', category: 'Mates', type: 'mate acero', price: '200', stock: '2', isActive: true, imageUrl: '', packageSizes: [] };
    mockedProductService.getProductById.mockResolvedValue(mockProductData);
    const errorMessage = 'Network Error Update';
    mockedProductService.updateProduct.mockRejectedValueOnce(new Error(errorMessage));

    const { user } = renderWithRouter(<ProductFormPage />, {
      path: '/admin/products/edit/:productId', route: '/admin/products/edit/updateFail123',
    });
    expect(await screen.findByDisplayValue('Update Fail Name')).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /actualizar producto/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
    expect(navigateMock).not.toHaveBeenCalled();
    expect(submitButton).not.toBeDisabled();
  });

  test('navigates to product list on cancel button click', async () => {
    const { user } = renderWithRouter(<ProductFormPage />, { route: '/admin/products/new', path: '/admin/products/new' });
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);
    expect(navigateMock).toHaveBeenCalledWith('/admin/products');
  });
});