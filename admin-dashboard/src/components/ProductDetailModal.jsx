import React, { useRef, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  XMarkIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  CubeIcon,
  TagIcon,
  ScaleIcon,
  CalendarIcon,
  PhotoIcon,
  ArrowsPointingOutIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  EyeIcon,
  EyeSlashIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "./LoadingSpinner";

const ProductDetailModal = ({
  isOpen,
  onClose,
  product,
  onEdit,
  onProductUpdated,
  onToggleStatus,
  onDuplicate,
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Manejar foco y escape key mejorado
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      setTimeout(() => modalRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";

      const handleEscape = (e) => {
        if (e.key === "Escape") {
          if (isImageFullscreen) {
            setIsImageFullscreen(false);
          } else {
            onClose();
          }
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose, isImageFullscreen]);

  // ✅ Reset estados al abrir/cerrar modal
  useEffect(() => {
    if (isOpen) {
      setActiveTab("details");
      setImageError(false);
      setIsImageFullscreen(false);
    }
  }, [isOpen, product]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      if (isImageFullscreen) {
        setIsImageFullscreen(false);
      } else {
        onClose();
      }
    }
  };

  // ✅ Funciones de utilidad mejoradas
  const formatCurrency = useCallback((amount) => {
    if (!amount || isNaN(amount)) return "N/A";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "No disponible";
    try {
      return new Date(dateString).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Fecha inválida";
    }
  }, []);

  const getRelativeTime = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Hoy";
      if (diffDays === 1) return "Ayer";
      if (diffDays < 7) return `Hace ${diffDays} días`;
      if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
      return `Hace ${Math.floor(diffDays / 30)} meses`;
    } catch (error) {
      return "N/A";
    }
  }, []);

  // ✅ Funciones de precio y stock mejoradas
  const getProductPrice = useCallback(
    (product) => {
      if (!product) return "N/A";

      if (product.price) {
        return formatCurrency(product.price);
      }

      if (product.packageSizes && product.packageSizes.length > 0) {
        const validPrices = product.packageSizes
          .map((pkg) => pkg.price)
          .filter((price) => price != null && !isNaN(price));

        if (validPrices.length === 0) return "N/A";

        const minPrice = Math.min(...validPrices);
        const maxPrice = Math.max(...validPrices);

        return minPrice === maxPrice
          ? formatCurrency(minPrice)
          : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
      }

      return "Sin precio definido";
    },
    [formatCurrency]
  );

  const getProductStock = useCallback((product) => {
    if (!product) return "N/A";

    if (product.stock !== undefined && product.stock !== null) {
      return `${product.stock} unidades`;
    }
    if (product.stockInKg !== undefined && product.stockInKg !== null) {
      return `${product.stockInKg} kg`;
    }
    return "Sin stock definido";
  }, []);

  const getStockStatus = useCallback((product) => {
    if (!product)
      return {
        status: "unknown",
        color: "gray",
        message: "Desconocido",
      };

    let currentStock = 0;
    let isKg = false;

    if (product.stock !== undefined && product.stock !== null) {
      currentStock = product.stock;
    } else if (product.stockInKg !== undefined && product.stockInKg !== null) {
      currentStock = product.stockInKg;
      isKg = true;
    }

    const threshold = isKg ? 5 : 10;

    if (currentStock === 0) {
      return { status: "out", color: "red", message: "Sin stock" };
    } else if (currentStock <= threshold) {
      return { status: "low", color: "yellow", message: "Stock bajo" };
    } else {
      return { status: "good", color: "green", message: "Stock disponible" };
    }
  }, []);

  // ✅ Acciones mejoradas
  const handleEditProduct = useCallback(() => {
    onEdit(product);
    onClose();
  }, [onEdit, product, onClose]);

  const handleToggleStatus = useCallback(async () => {
    if (!onToggleStatus) return;

    setIsLoading(true);
    try {
      await onToggleStatus(product._id, !product.isActive);
      toast.success(
        `Producto ${
          !product.isActive ? "activado" : "desactivado"
        } correctamente`,
        { autoClose: 3000 }
      );
      if (onProductUpdated) onProductUpdated();
    } catch (error) {
      toast.error(`Error al cambiar estado: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [onToggleStatus, product, onProductUpdated]);

  const handleDuplicate = useCallback(async () => {
    if (!onDuplicate) return;

    setIsLoading(true);
    try {
      await onDuplicate(product);
      toast.success(`Producto duplicado correctamente`, { autoClose: 3000 });
      if (onProductUpdated) onProductUpdated();
      onClose();
    } catch (error) {
      toast.error(`Error al duplicar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [onDuplicate, product, onProductUpdated, onClose]);

  const handleCopyId = useCallback(() => {
    navigator.clipboard.writeText(product._id);
    toast.success("ID copiado al portapapeles", { autoClose: 2000 });
  }, [product]);

  const handleShare = useCallback(() => {
    const shareData = {
      title: `Producto: ${product.name}`,
      text: `${product.name} - ${product.category}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
      navigator.clipboard.writeText(shareText);
      toast.success("Información copiada al portapapeles", { autoClose: 2000 });
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const stockStatus = getStockStatus(product);

  // ✅ Tabs de navegación
  const tabs = [
    { id: "details", label: "Detalles", icon: InformationCircleIcon },
    { id: "pricing", label: "Precios", icon: CurrencyDollarIcon },
    { id: "inventory", label: "Inventario", icon: CubeIcon },
    { id: "system", label: "Sistema", icon: CalendarIcon },
  ];

  return (
    <>
      {/* ✅ Modal principal */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <div
          ref={modalRef}
          className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          tabIndex={-1}
        >
          {/* ✅ Header con más acciones */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <CubeIcon className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h2
                  id="product-modal-title"
                  className="text-xl font-bold text-gray-900"
                >
                  {product.name}
                </h2>
                <div className="flex items-center space-x-3 mt-1 flex-wrap gap-1">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                  <span className="text-sm text-gray-600 capitalize">
                    {product.type}
                  </span>

                  {/* ✅ Estado del producto */}
                  {product.isActive ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      <XCircleIcon className="h-3 w-3 mr-1" />
                      Inactivo
                    </span>
                  )}

                  {/* ✅ Estado del stock */}
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      stockStatus.color === "green"
                        ? "bg-green-100 text-green-800"
                        : stockStatus.color === "yellow"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {stockStatus.color === "red" && (
                      <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                    )}
                    {stockStatus.message}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ Acciones del header */}
            <div className="flex items-center space-x-2">
              {/* Precio destacado */}
              <div className="text-right mr-4 hidden sm:block">
                <div className="text-2xl font-bold text-green-600">
                  {getProductPrice(product)}
                </div>
                <div className="text-xs text-gray-500">
                  {getProductStock(product)}
                </div>
              </div>

              {/* Botones de acción */}
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                title="Compartir"
              >
                <ShareIcon className="h-4 w-4" />
              </button>

              {onDuplicate && (
                <button
                  onClick={handleDuplicate}
                  disabled={isLoading}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150 disabled:opacity-50"
                  title="Duplicar producto"
                >
                  <DocumentDuplicateIcon className="h-4 w-4" />
                </button>
              )}

              {onToggleStatus && (
                <button
                  onClick={handleToggleStatus}
                  disabled={isLoading}
                  className={`p-2 rounded-lg transition-colors duration-150 disabled:opacity-50 ${
                    product.isActive
                      ? "text-red-400 hover:text-red-600 hover:bg-red-50"
                      : "text-green-400 hover:text-green-600 hover:bg-green-50"
                  }`}
                  title={product.isActive ? "Desactivar" : "Activar"}
                >
                  {product.isActive ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              )}

              <button
                onClick={handleEditProduct}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Editar
              </button>

              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
                aria-label="Cerrar modal"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ✅ Navegación por tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* ✅ Contenido con scroll mejorado */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* ✅ Imagen del producto - siempre visible */}
                <div className="lg:col-span-1">
                  <div className="sticky top-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <PhotoIcon className="h-5 w-5 mr-2" />
                      Imagen del producto
                    </h3>
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner relative group">
                      {product.imageUrl && !imageError ? (
                        <>
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={() => setImageError(true)}
                          />
                          <button
                            onClick={() => setIsImageFullscreen(true)}
                            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                          >
                            <ArrowsPointingOutIcon className="h-8 w-8 text-white" />
                          </button>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <PhotoIcon className="h-20 w-20 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-500 font-medium">
                              Sin imagen disponible
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ✅ Contenido por tabs */}
                <div className="lg:col-span-3">
                  {activeTab === "details" && (
                    <div className="space-y-6">
                      {/* Información básica */}
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <TagIcon className="h-5 w-5 mr-2" />
                          Información básica
                        </h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">
                              Nombre
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {product.name}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">
                              Categoría
                            </dt>
                            <dd className="mt-1">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {product.category}
                              </span>
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">
                              Tipo
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 capitalize">
                              {product.type}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">
                              Estado
                            </dt>
                            <dd className="mt-1">
                              <span
                                className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                                  product.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {product.isActive ? (
                                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                                ) : (
                                  <XCircleIcon className="h-3 w-3 mr-1" />
                                )}
                                {product.isActive ? "Activo" : "Inactivo"}
                              </span>
                            </dd>
                          </div>
                        </dl>

                        {product.description && (
                          <div className="mt-6">
                            <dt className="text-sm font-medium text-gray-500 mb-2">
                              Descripción
                            </dt>
                            <dd className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                              {product.description}
                            </dd>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "pricing" && (
                    <div className="space-y-6">
                      {/* Precio principal */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                        <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center">
                          <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                          Precio principal
                        </h3>
                        <div className="text-3xl font-bold text-green-700">
                          {getProductPrice(product)}
                        </div>
                      </div>

                      {/* Presentaciones */}
                      {product.packageSizes &&
                        product.packageSizes.length > 0 && (
                          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <ScaleIcon className="h-5 w-5 mr-2" />
                              Presentaciones disponibles
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {product.packageSizes.map((pkg, index) => (
                                <div
                                  key={index}
                                  className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-semibold text-blue-900 text-lg">
                                        {pkg.sizeInKg} kg
                                      </p>
                                      <p className="text-sm text-blue-600">
                                        Presentación individual
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xl font-bold text-blue-700">
                                        {formatCurrency(pkg.price)}
                                      </p>
                                      <p className="text-xs text-blue-600">
                                        {formatCurrency(
                                          pkg.price / pkg.sizeInKg
                                        )}
                                        /kg
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  )}

                  {activeTab === "inventory" && (
                    <div className="space-y-6">
                      {/* Estado del stock */}
                      <div
                        className={`p-6 rounded-xl border-2 ${
                          stockStatus.color === "green"
                            ? "bg-green-50 border-green-200"
                            : stockStatus.color === "yellow"
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <h3
                          className={`text-lg font-semibold mb-2 flex items-center ${
                            stockStatus.color === "green"
                              ? "text-green-900"
                              : stockStatus.color === "yellow"
                              ? "text-yellow-900"
                              : "text-red-900"
                          }`}
                        >
                          <TruckIcon className="h-5 w-5 mr-2" />
                          Estado del inventario
                        </h3>
                        <div
                          className={`text-2xl font-bold ${
                            stockStatus.color === "green"
                              ? "text-green-700"
                              : stockStatus.color === "yellow"
                              ? "text-yellow-700"
                              : "text-red-700"
                          }`}
                        >
                          {getProductStock(product)}
                        </div>
                        <p
                          className={`text-sm mt-1 ${
                            stockStatus.color === "green"
                              ? "text-green-600"
                              : stockStatus.color === "yellow"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {stockStatus.message}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "system" && (
                    <div className="space-y-6">
                      {/* Información del sistema */}
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <CalendarIcon className="h-5 w-5 mr-2" />
                          Información del sistema
                        </h3>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <dt className="text-sm font-medium text-gray-500 mb-1">
                              Fecha de creación
                            </dt>
                            <dd className="text-sm text-gray-900">
                              {formatDate(product.createdAt)}
                            </dd>
                            <dd className="text-xs text-gray-500">
                              {getRelativeTime(product.createdAt)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500 mb-1">
                              Última actualización
                            </dt>
                            <dd className="text-sm text-gray-900">
                              {formatDate(product.updatedAt)}
                            </dd>
                            <dd className="text-xs text-gray-500">
                              {getRelativeTime(product.updatedAt)}
                            </dd>
                          </div>
                          <div className="md:col-span-2">
                            <dt className="text-sm font-medium text-gray-500 mb-1">
                              ID del producto
                            </dt>
                            <dd className="flex items-center space-x-2">
                              <code className="text-sm text-gray-900 font-mono bg-gray-100 px-3 py-2 rounded-md border flex-1">
                                {product._id}
                              </code>
                              <button
                                onClick={handleCopyId}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                title="Copiar ID"
                              >
                                <DocumentDuplicateIcon className="h-4 w-4" />
                              </button>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Footer mejorado con más acciones */}
          <div className="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Última actualización:</span>{" "}
                {getRelativeTime(product.updatedAt)}
              </div>
              {isLoading && (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="small" showDots={false} />
                  <span className="text-sm text-gray-600">Procesando...</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
              >
                Cerrar
              </button>
              <button
                onClick={handleEditProduct}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Editar Producto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Modal de imagen fullscreen */}
      {isImageFullscreen && product.imageUrl && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4"
          onClick={() => setIsImageFullscreen(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setIsImageFullscreen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 p-2"
              aria-label="Cerrar imagen"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailModal;
