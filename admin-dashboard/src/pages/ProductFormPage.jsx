import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import productService from "../services/productService";
import LoadingSpinner from "../components/LoadingSpinner";
import { showToast } from "../components/ToastManager"; // ✅ Importar helper
import {
  ArrowUpTrayIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const initialFormData = {
  name: "",
  description: "",
  category: "",
  type: "",
  price: "",
  stock: "",
  stockInKg: "",
  packageSizes: [{ sizeInKg: "", price: "" }],
  isActive: true,
  image: null,
};

// Esquema de validación con Zod
const packageSizeSchema = z.object({
  sizeInKg: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined
        ? undefined
        : parseFloat(String(val)),
    z
      .number({
        required_error: "Tamaño (Kg) es requerido",
        invalid_type_error: "Tamaño (Kg) debe ser un número",
      })
      .positive({ message: "Tamaño (Kg) debe ser positivo" })
      .optional()
  ),
  price: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined
        ? undefined
        : parseFloat(String(val)),
    z
      .number({
        required_error: "Precio es requerido",
        invalid_type_error: "Precio debe ser un número",
      })
      .positive({ message: "Precio debe ser positivo" })
      .optional()
  ),
});

const productSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
    description: z.string().optional(),
    category: z.string().min(1, { message: "Categoría es requerida" }),
    type: z.string().min(1, { message: "Tipo es requerido" }),
    price: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined
          ? undefined
          : parseFloat(String(val)),
      z
        .number({ invalid_type_error: "Precio debe ser un número" })
        .positive({ message: "Precio debe ser positivo" })
        .optional()
    ),
    stock: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined
          ? undefined
          : parseInt(String(val), 10),
      z
        .number({ invalid_type_error: "Stock debe ser un número" })
        .int({ message: "Stock debe ser entero" })
        .min(0, { message: "Stock no puede ser negativo" })
        .optional()
    ),
    stockInKg: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined
          ? undefined
          : parseFloat(String(val)),
      z
        .number({ invalid_type_error: "Stock (Kg) debe ser un número" })
        .positive({ message: "Stock (Kg) debe ser positivo" })
        .optional()
    ),
    packageSizes: z.array(packageSizeSchema).optional(),
    isActive: z.boolean(),
    image: z.instanceof(File).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "yerba" || data.type === "yuyo") {
      // Para yerba/yuyo, verificar stockInKg
      // preprocess ya convierte strings vacíos a undefined
      if (
        data.stockInKg === undefined ||
        data.stockInKg === null ||
        data.stockInKg <= 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["stockInKg"],
          message: "Stock (Kg) es requerido para este tipo de producto",
        });
      }

      if (!data.packageSizes || data.packageSizes.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["packageSizes"],
          message:
            "Debe haber al menos una presentación para este tipo de producto",
        });
      } else {
        const validPackages = data.packageSizes.filter(
          (pkg) =>
            pkg.sizeInKg !== undefined &&
            pkg.sizeInKg !== null &&
            pkg.sizeInKg > 0 &&
            pkg.price !== undefined &&
            pkg.price !== null &&
            pkg.price > 0
        );

        if (validPackages.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["packageSizes"],
            message:
              "Debe haber al menos una presentación para este tipo de producto",
          });
        }

        data.packageSizes.forEach((pkg, index) => {
          if (pkg.sizeInKg === undefined || pkg.sizeInKg === null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["packageSizes", index, "sizeInKg"],
              message: "Tamaño (Kg) es requerido",
            });
          }
          if (pkg.price === undefined || pkg.price === null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["packageSizes", index, "price"],
              message: "Precio es requerido",
            });
          }
        });
      }
    } else {
      // Para otros tipos (mate, etc.), verificar price y stock
      // preprocess ya convierte strings vacíos a undefined
      if (data.price === undefined || data.price === null || data.price <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["price"],
          message:
            "precio es requerido y debe ser positivo para este tipo de producto",
        });
      }
      if (data.stock === undefined || data.stock === null || data.stock < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["stock"],
          message:
            "Stock es requerido y no puede ser negativo para este tipo de producto",
        });
      }
    }
  });

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 mr-2 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const categories = ["Yerbas", "Mates", "Bombillas", "Accesorios", "Yuyos"]; // ✅ Agregar esta línea que faltaba

function ProductFormPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [validationTimeout, setValidationTimeout] = useState(null);

  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditMode = Boolean(productId);

  // ✅ Validación debounced para mejor UX
  const debouncedValidation = useCallback(
    (fieldName, value) => {
      if (validationTimeout) {
        clearTimeout(validationTimeout);
      }

      const timeout = setTimeout(() => {
        // Solo validar el campo específico si no está vacío
        if (value && value.trim()) {
          try {
            const fieldSchema = productSchema.pick({ [fieldName]: true });
            fieldSchema.parse({ [fieldName]: value });

            // Limpiar error si es válido
            setFormErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors[fieldName];
              return newErrors;
            });
          } catch (error) {
            // Mostrar error específico
            if (error.errors?.[0]) {
              setFormErrors((prev) => ({
                ...prev,
                [fieldName]: error.errors[0].message,
              }));
            }
          }
        }
      }, 500); // 500ms de debounce

      setValidationTimeout(timeout);
    },
    [validationTimeout]
  );

  // ✅ Carga inicial optimizada con mejor manejo de errores
  useEffect(() => {
    let isMounted = true;

    if (isEditMode && productId) {
      setIsLoadingInitialData(true);

      // ✅ Mostrar toast de carga
      const loadingToast = toast.info("Cargando datos del producto...", {
        autoClose: false,
        hideProgressBar: true,
        closeButton: false,
      });

      productService
        .getProductById(productId)
        .then((product) => {
          if (!isMounted) return;

          // ✅ Cerrar toast de carga
          toast.dismiss(loadingToast);

          const productData = {
            name: product.name || "",
            description: product.description || "",
            category: product.category || "",
            type: product.type || "",
            price: product.price !== undefined ? String(product.price) : "",
            stock: product.stock !== undefined ? String(product.stock) : "",
            stockInKg:
              product.stockInKg !== undefined ? String(product.stockInKg) : "",
            packageSizes:
              product.packageSizes && product.packageSizes.length > 0
                ? product.packageSizes.map((pkg) => ({
                    sizeInKg:
                      pkg.sizeInKg !== undefined ? String(pkg.sizeInKg) : "",
                    price: pkg.price !== undefined ? String(pkg.price) : "",
                  }))
                : [{ sizeInKg: "", price: "" }],
            isActive: product.isActive !== undefined ? product.isActive : true,
            image: null,
          };

          setFormData(productData);

          if (product.imageUrl) {
            setCurrentImageUrl(product.imageUrl);
            setImagePreviewUrl(null);
          }

          // ✅ Toast de éxito más duradero
          toast.success(`Producto "${product.name}" cargado correctamente`, {
            autoClose: 3000,
          });
        })
        .catch((err) => {
          if (!isMounted) return;

          // ✅ Cerrar toast de carga
          toast.dismiss(loadingToast);

          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Error al cargar el producto.";

          // ✅ Toast de error más duradero
          toast.error(`Error: ${errorMessage}`, {
            autoClose: 6000,
          });

          // ✅ Delay antes de navegar para que el usuario vea el error
          setTimeout(() => {
            navigate("/admin/products");
          }, 2000);
        })
        .finally(() => {
          if (isMounted) {
            setIsLoadingInitialData(false);
          }
        });
    } else {
      // ✅ Para modo creación, mostrar toast informativo
      if (!isEditMode) {
        toast.info("Formulario listo para crear nuevo producto", {
          autoClose: 2000,
        });
      }

      setFormData(initialFormData);
      setImagePreviewUrl(null);
      setCurrentImageUrl("");
      setFormErrors({});
    }

    return () => {
      isMounted = false;
    };
  }, [isEditMode, productId, navigate]);

  // ✅ Manejo de cambios optimizado con validación debounced
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;

      let newFormData = {
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "category") {
        newFormData.type = "";
      }

      setFormData(newFormData);

      // ✅ Limpiar errores inmediatamente al cambiar
      if (formErrors[name]) {
        setFormErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[name];
          if (name === "category") delete newErrors.type;
          return newErrors;
        });
      }

      // ✅ Validación debounced solo para campos importantes
      if (["name", "category", "type"].includes(name)) {
        debouncedValidation(name, type === "checkbox" ? checked : value);
      }
    },
    [formData, formErrors, debouncedValidation]
  );

  // ✅ Manejo de archivo optimizado con mejores toasts
  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error(
          "Tipo de archivo no válido. Solo se permiten JPG, PNG y WebP.",
          {
            autoClose: 5000,
          }
        );
        return;
      }

      if (file.size > maxSize) {
        toast.error(
          "El archivo es demasiado grande. El tamaño máximo es 5MB.",
          {
            autoClose: 5000,
          }
        );
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));

      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }

      const newPreviewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(newPreviewUrl);
      setCurrentImageUrl("");

      if (formErrors.image) {
        setFormErrors((prevErrors) => ({ ...prevErrors, image: undefined }));
      }

      // ✅ Toast de éxito con duración adecuada
      toast.success(`Imagen "${file.name}" seleccionada correctamente`, {
        autoClose: 3000,
      });
    },
    [imagePreviewUrl, formErrors]
  );

  // ✅ Cleanup optimizado
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      if (validationTimeout) {
        clearTimeout(validationTimeout);
      }
    };
  }, [imagePreviewUrl, validationTimeout]);

  const handlePackageSizeChange = (index, field, value) => {
    const updatedPackageSizes = formData.packageSizes.map((pkg, i) =>
      i === index ? { ...pkg, [field]: value } : pkg
    );
    setFormData((prev) => ({ ...prev, packageSizes: updatedPackageSizes }));

    const errorPath = `packageSizes.${index}.${field}`;
    const generalPackageErrorPath = "packageSizes";

    if (formErrors[errorPath] || formErrors[generalPackageErrorPath]) {
      setFormErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[errorPath];
        // Solo borrar el error general de packageSizes si todos los errores específicos de items se limpian
        // o si el cambio es relevante para el error general. Por ahora, lo borramos si existe.
        delete newErrors[generalPackageErrorPath];
        return newErrors;
      });
    }
  };

  const addPackageSize = () => {
    setFormData((prev) => ({
      ...prev,
      packageSizes: [...prev.packageSizes, { sizeInKg: "", price: "" }],
    }));
  };

  const removePackageSize = (index) => {
    if (
      formData.packageSizes.length <= 1 &&
      (formData.type === "yerba" || formData.type === "yuyo")
    ) {
      toast.warn("Debe haber al menos una presentación para yerbas/yuyos.");
      return;
    }
    const updatedPackageSizes = formData.packageSizes.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({ ...prev, packageSizes: updatedPackageSizes }));
  };
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setFormErrors({});
      setIsSubmitting(true);

      // ✅ Toast de loading persistente
      const loadingToast = toast.info(
        isEditMode ? "Actualizando producto..." : "Creando producto...",
        {
          autoClose: false,
          hideProgressBar: true,
          closeButton: false,
        }
      );

      try {
        // ✅ Delay mínimo para mostrar el loading
        await new Promise((resolve) => setTimeout(resolve, 500));

        const dataToValidate = {
          ...formData,
          price: formData.price,
          stock: formData.stock,
          stockInKg: formData.stockInKg,
          packageSizes: formData.packageSizes,
        };

        const validationResult = productSchema.safeParse(dataToValidate);

        if (!validationResult.success) {
          // ✅ Cerrar loading
          toast.dismiss(loadingToast);

          const errors = {};
          validationResult.error.errors.forEach((error) => {
            const path = error.path.join(".");
            errors[path] = error.message;
          });
          setFormErrors(errors);

          toast.error(
            "Por favor, corrige los errores en el formulario antes de continuar.",
            {
              autoClose: 6000,
            }
          );
          setIsSubmitting(false);
          return;
        }

        // Preparar datos
        const sourceData = validationResult.data;
        const dataToSubmit = new FormData();

        Object.keys(sourceData).forEach((key) => {
          if (
            key === "packageSizes" &&
            (sourceData.type === "yerba" || sourceData.type === "yuyo")
          ) {
            if (sourceData.packageSizes && sourceData.packageSizes.length > 0) {
              const validPackages = sourceData.packageSizes.filter(
                (pkg) =>
                  pkg.sizeInKg &&
                  pkg.sizeInKg !== "" &&
                  pkg.price &&
                  pkg.price !== ""
              );
              validPackages.forEach((pkg, index) => {
                dataToSubmit.append(
                  `packageSizes[${index}][sizeInKg]`,
                  String(pkg.sizeInKg)
                );
                dataToSubmit.append(
                  `packageSizes[${index}][price]`,
                  String(pkg.price)
                );
              });
            }
          } else if (key === "image" && sourceData.image instanceof File) {
            dataToSubmit.append("image", sourceData.image);
          } else if (
            key !== "packageSizes" &&
            key !== "image" &&
            sourceData[key] !== null &&
            sourceData[key] !== undefined
          ) {
            dataToSubmit.append(key, String(sourceData[key]));
          }
        });

        // Limpiar campos irrelevantes
        if (sourceData.type === "yerba" || sourceData.type === "yuyo") {
          if (dataToSubmit.has("price")) dataToSubmit.delete("price");
          if (dataToSubmit.has("stock")) dataToSubmit.delete("stock");
        } else {
          if (dataToSubmit.has("stockInKg")) dataToSubmit.delete("stockInKg");
        }

        // ✅ Operación con feedback optimizado
        let result;
        if (isEditMode) {
          result = await productService.updateProduct(productId, dataToSubmit);

          // ✅ Cerrar loading y mostrar éxito
          toast.dismiss(loadingToast);
          toast.success(
            `¡Producto "${
              result.name || formData.name
            }" actualizado exitosamente!`,
            {
              autoClose: 4000,
            }
          );
        } else {
          result = await productService.createProduct(dataToSubmit);

          // ✅ Cerrar loading y mostrar éxito
          toast.dismiss(loadingToast);
          toast.success(
            `¡Producto "${result.name || formData.name}" creado exitosamente!`,
            {
              autoClose: 4000,
            }
          );
        }

        // ✅ Delay antes de navegar para mostrar el toast
        setTimeout(() => {
          navigate("/admin/products", {
            state: {
              [isEditMode ? "updated" : "created"]: true,
              productName: result.name || formData.name,
            },
          });
        }, 1500);
      } catch (error) {
        console.error("Error:", error);

        // ✅ Cerrar loading
        toast.dismiss(loadingToast);

        const errorMessage =
          error.message ||
          `Error al ${isEditMode ? "actualizar" : "crear"} producto`;

        toast.error(`Error: ${errorMessage}`, {
          autoClose: 6000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, isEditMode, productId, navigate]
  );

  // ✅ Datos memoizados para rendimiento
  const availableTypes = useMemo(() => {
    const productTypes = {
      Yerbas: ["yerba"],
      Mates: [
        "mate calabaza",
        "mate torpedo",
        "mate camionero",
        "mate acero",
        "mate vidrio",
      ],
      Bombillas: ["bombilla acero", "bombilla alpaca", "bombilla pico de loro"],
      Accesorios: ["termo", "matero", "limpia bombilla", "cepillo mate"],
      Yuyos: ["yuyo medicinal", "yuyo aromático"],
    };
    return formData.category ? productTypes[formData.category] || [] : [];
  }, [formData.category]);

  // ✅ Loading optimizado con mejor UX
  if (isLoadingInitialData && isEditMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Cargando datos del producto
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Por favor espera mientras obtenemos la información...
          </p>
        </div>
      </div>
    );
  }

  const inputBaseClasses =
    "w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed";
  const labelBaseClasses = "block text-sm font-medium text-gray-700 mb-1";
  const errorTextClasses = "mt-1 text-xs text-red-600";

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">
        {isEditMode ? "Editar Producto" : "Añadir Nuevo Producto"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-lg shadow-xl space-y-6"
        noValidate
      >
        {Object.keys(formErrors).length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            <strong>Corrija los siguientes errores:</strong>
            <ul className="list-disc list-inside">
              {Object.values(formErrors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <label htmlFor="name" className={labelBaseClasses}>
            Nombre del Producto
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`${inputBaseClasses} ${
              formErrors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formErrors.name && (
            <p className={errorTextClasses} role="alert">
              {formErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className={labelBaseClasses}>
            Descripción
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            disabled={isSubmitting}
            className={`${inputBaseClasses} ${
              formErrors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formErrors.description && (
            <p className={errorTextClasses} role="alert">
              {formErrors.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className={labelBaseClasses}>
              Categoría
            </label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`${inputBaseClasses} bg-white ${
                formErrors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {formErrors.category && (
              <p className={errorTextClasses} role="alert">
                {formErrors.category}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="type" className={labelBaseClasses}>
              Tipo
            </label>
            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleChange}
              disabled={!formData.category || isSubmitting}
              className={`${inputBaseClasses} bg-white ${
                formErrors.type ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">
                {formData.category
                  ? "Seleccione un tipo"
                  : "Seleccione categoría primero"}
              </option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {formErrors.type && (
              <p className={errorTextClasses} role="alert">
                {formErrors.type}
              </p>
            )}
          </div>
        </div>

        {formData.type === "yerba" || formData.type === "yuyo" ? (
          <>
            <div>
              <label htmlFor="stockInKg" className={labelBaseClasses}>
                Stock (en Kg)
              </label>
              <input
                type="number"
                name="stockInKg"
                id="stockInKg"
                value={formData.stockInKg}
                onChange={handleChange}
                step="0.01"
                min="0"
                disabled={isSubmitting}
                className={`${inputBaseClasses} ${
                  formErrors.stockInKg ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.stockInKg && (
                <p className={errorTextClasses} role="alert">
                  {formErrors.stockInKg}
                </p>
              )}
            </div>
            <div className="space-y-4 border border-gray-200 p-4 rounded-md">
              <h3 className="text-md font-medium text-gray-800 mb-3">
                Presentaciones
              </h3>

              {formErrors.packageSizes &&
                typeof formErrors.packageSizes === "string" && (
                  <p className={errorTextClasses} role="alert">
                    {formErrors.packageSizes}
                  </p>
                )}
              {formData.packageSizes.map((pkg, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-3 bg-gray-50 rounded"
                >
                  <div>
                    <label
                      htmlFor={`sizeInKg-${index}`}
                      className="block text-xs font-medium text-gray-600 mb-1"
                    >
                      Tamaño (Kg)
                    </label>
                    <input
                      type="number"
                      name="sizeInKg"
                      id={`sizeInKg-${index}`}
                      value={pkg.sizeInKg}
                      onChange={(e) =>
                        handlePackageSizeChange(
                          index,
                          "sizeInKg",
                          e.target.value
                        )
                      }
                      step="0.01"
                      min="0.01"
                      disabled={isSubmitting}
                      className={`${inputBaseClasses} text-sm ${
                        formErrors[`packageSizes.${index}.sizeInKg`]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors[`packageSizes.${index}.sizeInKg`] && (
                      <p className={errorTextClasses} role="alert">
                        {formErrors[`packageSizes.${index}.sizeInKg`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`price-${index}`}
                      className="block text-xs font-medium text-gray-600 mb-1"
                    >
                      Precio ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      id={`price-${index}`}
                      value={pkg.price}
                      onChange={(e) =>
                        handlePackageSizeChange(index, "price", e.target.value)
                      }
                      step="0.01"
                      min="0.01"
                      disabled={isSubmitting}
                      className={`${inputBaseClasses} text-sm ${
                        formErrors[`packageSizes.${index}.price`]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors[`packageSizes.${index}.price`] && (
                      <p className={errorTextClasses} role="alert">
                        {formErrors[`packageSizes.${index}.price`]}
                      </p>
                    )}
                  </div>
                  {formData.packageSizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePackageSize(index)}
                      title="Eliminar presentación"
                      disabled={isSubmitting}
                      className="p-2 text-red-500 hover:text-red-700 self-center md:self-end mb-1 md:mb-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addPackageSize}
                disabled={isSubmitting}
                className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusCircleIcon className="h-5 w-5 mr-1" /> Añadir Presentación
              </button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className={labelBaseClasses}>
                Precio ($)
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                disabled={isSubmitting}
                className={`${inputBaseClasses} ${
                  formErrors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.price && (
                <p className={errorTextClasses} role="alert">
                  {formErrors.price}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="stock" className={labelBaseClasses}>
                Stock (unidades)
              </label>
              <input
                type="number"
                name="stock"
                id="stock"
                value={formData.stock}
                onChange={handleChange}
                step="1"
                min="0"
                disabled={isSubmitting}
                className={`${inputBaseClasses} ${
                  formErrors.stock ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.stock && (
                <p className={errorTextClasses} role="alert">
                  {formErrors.stock}
                </p>
              )}
            </div>
          </div>
        )}

        <div>
          <label className={labelBaseClasses}>Imagen del Producto</label>
          <div className="mt-1 flex items-center space-x-4">
            <span
              className="inline-block h-20 w-20 rounded-md overflow-hidden bg-gray-100 "
              data-testid="upload-icon-placeholder-container"
            >
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Vista previa"
                  className="h-full w-full object-cover"
                />
              ) : currentImageUrl ? (
                <img
                  src={currentImageUrl}
                  alt="Imagen actual"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ArrowUpTrayIcon
                  data-testid="upload-icon-placeholder"
                  className="h-full w-full text-gray-300 p-4"
                />
              )}
            </span>
            <span
              className={`cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              role="button"
              tabIndex={0}
              aria-label={
                imagePreviewUrl || currentImageUrl
                  ? "Cambiar imagen"
                  : "Subir imagen"
              }
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  document.getElementById("image").click();
              }}
              onClick={() => document.getElementById("image").click()}
            >
              <span>
                {imagePreviewUrl || currentImageUrl ? "Cambiar" : "Subir"}{" "}
                imagen
              </span>
              <input
                id="image"
                name="image"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept="image/*"
                disabled={isSubmitting}
                aria-label={
                  imagePreviewUrl || currentImageUrl
                    ? "Cambiar imagen"
                    : "Subir imagen"
                }
              />
            </span>
          </div>
          {formErrors.image && (
            <p className={errorTextClasses} role="alert">
              {formErrors.image}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={handleChange}
            disabled={isSubmitting}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label
            htmlFor="isActive"
            className="ml-2 block text-sm text-gray-900"
          >
            Producto Activo
          </label>
        </div>

        <div className="pt-5 flex flex-col sm:flex-row sm:justify-end sm:space-x-3">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            disabled={isSubmitting}
            className="w-full sm:w-auto mb-3 sm:mb-0 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-200 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner
                  size="small"
                  showDots={false}
                  className="mr-2"
                />
                <span>{isEditMode ? "Actualizando..." : "Creando..."}</span>
              </>
            ) : isEditMode ? (
              "Actualizar Producto"
            ) : (
              "Crear Producto"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductFormPage;
