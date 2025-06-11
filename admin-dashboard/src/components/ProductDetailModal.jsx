import React, { useRef, useEffect, useState, useCallback, memo } from "react";
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

// ✅ COMPONENTES MEMOIZADOS PARA OPTIMIZACIÓN
const TabButton = memo(({ tab, activeTab, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(tab.id)}
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
));

TabButton.displayName = 'TabButton';

const PackageCard = memo(({ pkg, index, formatCurrency }) => (
  <div
    key={index}
    className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow duration-200"
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="font-semibold text-blue-900 text-lg">
          {pkg.sizeInKg} kg
        </p>
        <p className="text-sm text-blue-600">Presentación individual</p>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-blue-700">
          {formatCurrency(pkg.price)}
        </p>
        <p className="text-xs text-blue-600">
          {formatCurrency(pkg.price / pkg.sizeInKg)}/kg
        </p>
      </div>
    </div>
  </div>
));

PackageCard.displayName = 'PackageCard';

const StatusBadge = memo(({ isActive, className = "" }) => (
  <span
    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
      isActive
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"
    } ${className}`}
  >
    {isActive ? (
      <CheckCircleIcon className="h-3 w-3 mr-1" />
    ) : (
      <XCircleIcon className="h-3 w-3 mr-1" />
    )}
    {isActive ? "Activo" : "Inactivo"}
  </span>
));

StatusBadge.displayName = 'StatusBadge';

const ProductDetailModal = ({
  isOpen,
  onClose,
  product,
  onEdit,
  onProductUpdated,
  onToggleStatus,
  onDuplicate,
}) => {
  // ✅ VALIDACIÓN TEMPRANA MEJORADA
  if (!isOpen || !product) return null;
  
  if (!onClose || !onEdit) {
    console.warn('ProductDetailModal: onClose y onEdit son requeridos');
    return null;
  }

  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  
  // ✅ LOADING STATES ESPECÍFICOS
  const [loadingStates, setLoadingStates] = useState({
    toggling: false,
    duplicating: false,
    sharing: false,
  });

  // ✅ FUNCIONES DE UTILIDAD MEJORADAS
  const formatCurrency = useCallback((amount) => {
    if (!amount || Number.isNaN(amount)) return "N/A";
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

  const getProductPrice = useCallback(
    (productData) => {
      if (!productData) return "N/A";

      if (productData.price) {
        return formatCurrency(productData.price);
      }

      if (productData.packageSizes && productData.packageSizes.length > 0) {
        const validPrices = productData.packageSizes
          .map((pkg) => pkg.price)
          .filter((price) => price != null && !Number.isNaN(price));

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

  const getProductStock = useCallback((productData) => {
    if (!productData) return "N/A";

    if (productData.stock !== undefined && productData.stock !== null) {
      return `${productData.stock} unidades`;
    }
    if (productData.stockInKg !== undefined && productData.stockInKg !== null) {
      return `${productData.stockInKg} kg`;
    }
    return "Sin stock definido";
  }, []);

  const getStockStatus = useCallback((productData) => {
    if (!productData)
      return {
        status: "unknown",
        color: "gray",
        message: "Desconocido",
      };

    let currentStock = 0;
    let isKg = false;

    if (productData.stock !== undefined && productData.stock !== null) {
      currentStock = productData.stock;
    } else if (productData.stockInKg !== undefined && productData.stockInKg !== null) {
      currentStock = productData.stockInKg;
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

  // ✅ MANEJO DE TAB CON ANALYTICS
  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    
    // ✅ ANALYTICS TRACKING
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'product_modal_tab_change', {
        event_category: 'Product Management',
        event_label: tabId,
        product_id: product._id
      });
    }
  }, [product._id]);

  // ✅ ACCIONES CON LOADING STATES ESPECÍFICOS
  const handleEditProduct = useCallback(() => {
    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'product_edit_start', {
        event_category: 'Product Management',
        product_id: product._id
      });
    }
    
    onEdit(product);
    onClose();
  }, [onEdit, product, onClose]);

  const handleToggleStatus = useCallback(async () => {
    if (!onToggleStatus) return;

    setLoadingStates(prev => ({ ...prev, toggling: true }));
    try {
      await onToggleStatus(product._id, !product.isActive);
      toast.success(
        `Producto ${!product.isActive ? "activado" : "desactivado"} correctamente`,
        { autoClose: 3000 }
      );
      if (onProductUpdated) onProductUpdated();
      
      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'product_status_toggle', {
          event_category: 'Product Management',
          product_id: product._id,
          new_status: !product.isActive
        });
      }
    } catch (error) {
      toast.error(`Error al cambiar estado: ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, toggling: false }));
    }
  }, [onToggleStatus, product, onProductUpdated]);

  const handleDuplicate = useCallback(async () => {
    if (!onDuplicate) return;

    setLoadingStates(prev => ({ ...prev, duplicating: true }));
    try {
      await onDuplicate(product);
      toast.success('Producto duplicado correctamente', { autoClose: 3000 });
      if (onProductUpdated) onProductUpdated();
      onClose();
      
      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'product_duplicate', {
          event_category: 'Product Management',
          product_id: product._id
        });
      }
    } catch (error) {
      toast.error(`Error al duplicar: ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, duplicating: false }));
    }
  }, [onDuplicate, product, onProductUpdated, onClose]);

  const handleCopyId = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(product._id);
      toast.success("ID copiado al portapapeles", { autoClose: 2000 });
      
      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'product_id_copy', {
          event_category: 'Product Management',
          product_id: product._id
        });
      }
    } else {
      toast.error("No se pudo copiar el ID");
    }
  }, [product]);

  const handleShare = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, sharing: true }));
    
    try {
      const shareData = {
        title: `Producto: ${product.name}`,
        text: `${product.name} - ${product.category} - ${getProductPrice(product)}`,
        url: typeof window !== 'undefined' ? window.location.href : '',
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success("Producto compartido correctamente", { autoClose: 2000 });
      } else if (navigator.clipboard) {
        const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        toast.success("Información copiada al portapapeles", { autoClose: 2000 });
      } else {
        toast.error("No se pudo compartir el producto");
      }
      
      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'product_share', {
          event_category: 'Product Management',
          product_id: product._id
        });
      }
    } catch (error) {
      toast.error("Error al compartir el producto");
    } finally {
      setLoadingStates(prev => ({ ...prev, sharing: false }));
    }
  }, [product, getProductPrice]);

  // ✅ CLICK OUTSIDE HANDLER MEJORADO
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      if (isImageFullscreen) {
        setIsImageFullscreen(false);
      } else {
        onClose();
      }
    }
  }, [onClose, isImageFullscreen]);

  // ✅ GESTIÓN DE FOCO Y KEYBOARD MEJORADA
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      setTimeout(() => modalRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e) => {
        // Escape key
        if (e.key === "Escape") {
          if (isImageFullscreen) {
            setIsImageFullscreen(false);
          } else {
            onClose();
          }
          return;
        }

        // ✅ KEYBOARD SHORTCUTS
        if (e.ctrlKey || e.metaKey) {
          switch (e.key) {
            case 'e':
              e.preventDefault();
              handleEditProduct();
              break;
            case 'd':
              e.preventDefault();
              handleDuplicate();
              break;
            case 'k':
              e.preventDefault();
              handleToggleStatus();
              break;
            case 's':
              e.preventDefault();
              handleShare();
              break;
            default:
              break;
          }
        }

        // ✅ NAVEGACIÓN POR NÚMEROS (1-4 para tabs)
        if (e.key >= '1' && e.key <= '4') {
          const tabIndex = parseInt(e.key, 10) - 1;
          const tabs = ["details", "pricing", "inventory", "system"];
          if (tabs[tabIndex]) {
            setActiveTab(tabs[tabIndex]);
          }
        }

        // ✅ TAB TRAPPING PARA ACCESIBILIDAD
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements?.length) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "unset";
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
    return undefined;
  }, [isOpen, onClose, isImageFullscreen, handleEditProduct, handleDuplicate, handleToggleStatus, handleShare]);

  // ✅ RESET ESTADOS AL ABRIR/CERRAR
  useEffect(() => {
    if (isOpen) {
      setActiveTab("details");
      setImageError(false);
      setIsImageFullscreen(false);
      setLoadingStates({
        toggling: false,
        duplicating: false,
        sharing: false,
      });
    }
  }, [isOpen, product]);

  // ✅ DATOS CALCULADOS
  const stockStatus = getStockStatus(product);
  const isAnyLoading = Object.values(loadingStates).some(Boolean);

  // ✅ TABS CONFIGURATION
  const tabs = [
    { id: "details", label: "Detalles", icon: InformationCircleIcon },
    { id: "pricing", label: "Precios", icon: CurrencyDollarIcon },
    { id: "inventory", label: "Inventario", icon: CubeIcon },
    { id: "system", label: "Sistema", icon: CalendarIcon },
  ];

  return (
    <>
      {/* ✅ MODAL PRINCIPAL */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <div
          ref={modalRef}
          className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden focus:outline-none"
          tabIndex={-1}
        >
          {/* ✅ HEADER MEJORADO */}
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
                  <StatusBadge isActive={product.isActive} />
                  
                  {/* ✅ ESTADO DEL STOCK */}
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

            {/* ✅ ACCIONES DEL HEADER */}
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

              {/* ✅ BOTONES CON LOADING STATES */}
              <button
                type="button"
                onClick={handleShare}
                disabled={loadingStates.sharing}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150 disabled:opacity-50"
                title="Compartir (Ctrl+S)"
              >
                {loadingStates.sharing ? (
                  <LoadingSpinner size="small" showDots={false} />
                ) : (
                  <ShareIcon className="h-4 w-4" />
                )}
              </button>

              {onDuplicate && (
                <button
                  type="button"
                  onClick={handleDuplicate}
                  disabled={loadingStates.duplicating}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150 disabled:opacity-50"
                  title="Duplicar producto (Ctrl+D)"
                >
                  {loadingStates.duplicating ? (
                    <LoadingSpinner size="small" showDots={false} />
                  ) : (
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  )}
                </button>
              )}

              {onToggleStatus && (
                <button
                  type="button"
                  onClick={handleToggleStatus}
                  disabled={loadingStates.toggling}
                  className={`p-2 rounded-lg transition-colors duration-150 disabled:opacity-50 ${
                    product.isActive
                      ? "text-red-400 hover:text-red-600 hover:bg-red-50"
                      : "text-green-400 hover:text-green-600 hover:bg-green-50"
                  }`}
                  title={`${product.isActive ? "Desactivar" : "Activar"} (Ctrl+K)`}
                >
                  {loadingStates.toggling ? (
                    <LoadingSpinner size="small" showDots={false} />
                  ) : product.isActive ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={handleEditProduct}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                title="Editar (Ctrl+E)"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Editar
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
                aria-label="Cerrar modal (Escape)"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ✅ NAVEGACIÓN POR TABS CON COMPONENTE MEMOIZADO */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  tab={tab}
                  activeTab={activeTab}
                  onClick={handleTabChange}
                />
              ))}
            </nav>
            
            {/* ✅ INDICADOR DE KEYBOARD SHORTCUTS */}
            <div className="px-6 pb-2">
              <p className="text-xs text-gray-500">
                💡 Atajos: Ctrl+E (Editar), Ctrl+D (Duplicar), Ctrl+K (Toggle), 1-4 (Tabs)
              </p>
            </div>
          </div>

          {/* ✅ CONTENIDO CON SCROLL MEJORADO */}
          <div className="overflow-y-auto max-h-[calc(90vh-280px)]">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* ✅ IMAGEN DEL PRODUCTO - STICKY */}
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
                            loading="lazy"
                          />
                          <button
                            type="button"
                            onClick={() => setIsImageFullscreen(true)}
                            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                            aria-label="Ver imagen en pantalla completa"
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

                {/* ✅ CONTENIDO POR TABS */}
                <div className="lg:col-span-3">
                  {activeTab === "details" && (
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <TagIcon className="h-5 w-5 mr-2" />
                          Información básica
                        </h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                            <dd className="mt-1 text-sm text-gray-900">{product.name}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Categoría</dt>
                            <dd className="mt-1">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {product.category}
                              </span>
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Tipo</dt>
                            <dd className="mt-1 text-sm text-gray-900 capitalize">{product.type}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Estado</dt>
                            <dd className="mt-1">
                              <StatusBadge isActive={product.isActive} />
                            </dd>
                          </div>
                        </dl>

                        {product.description && (
                          <div className="mt-6">
                            <dt className="text-sm font-medium text-gray-500 mb-2">Descripción</dt>
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
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                        <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center">
                          <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                          Precio principal
                        </h3>
                        <div className="text-3xl font-bold text-green-700">
                          {getProductPrice(product)}
                        </div>
                      </div>

                      {product.packageSizes && product.packageSizes.length > 0 && (
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <ScaleIcon className="h-5 w-5 mr-2" />
                            Presentaciones disponibles
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {product.packageSizes.map((pkg, index) => (
                              <PackageCard
                                key={`package-${index}`}
                                pkg={pkg}
                                index={index}
                                formatCurrency={formatCurrency}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "inventory" && (
                    <div className="space-y-6">
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

                      {/* ✅ INFORMACIÓN ADICIONAL DE INVENTARIO */}
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Historial de movimientos
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <ClockIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Próximamente: Historial de entradas y salidas de stock
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "system" && (
                    <div className="space-y-6">
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
                                type="button"
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

                      {/* ✅ MÉTRICAS ADICIONALES */}
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <ChartBarIcon className="h-5 w-5 mr-2" />
                          Métricas del producto
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">N/A</div>
                            <div className="text-xs text-blue-800">Vistas</div>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="text-lg font-bold text-green-600">N/A</div>
                            <div className="text-xs text-green-800">Ventas</div>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <div className="text-lg font-bold text-yellow-600">N/A</div>
                            <div className="text-xs text-yellow-800">Rating</div>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <div className="text-lg font-bold text-purple-600">N/A</div>
                            <div className="text-xs text-purple-800">Favoritos</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-4 text-center">
                          Las métricas se habilitarán cuando se integren con el sistema de analytics
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ✅ FOOTER MEJORADO */}
          <div className="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Última actualización:</span>{" "}
                {getRelativeTime(product.updatedAt)}
              </div>
              {isAnyLoading && (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="small" showDots={false} />
                  <span className="text-sm text-gray-600">Procesando...</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handleEditProduct}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <PencilIcon className="h-4 w-4 mr-2 inline" />
                Editar Producto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ MODAL DE IMAGEN FULLSCREEN MEJORADO */}
      {isImageFullscreen && product.imageUrl && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4"
          onClick={() => setIsImageFullscreen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Imagen en pantalla completa"
        >
          <div className="relative max-w-5xl max-h-full">
            <button
              type="button"
              onClick={() => setIsImageFullscreen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2 rounded-full bg-black/50 backdrop-blur-sm transition-colors"
              aria-label="Cerrar imagen (Escape)"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                }
              }}
              role="button"
              tabIndex={0}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white p-4 rounded-b-lg">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-200">{product.category} • {product.type}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ✅ PROPIEDADES POR DEFECTO Y DISPLAYNAME
ProductDetailModal.displayName = 'ProductDetailModal';

export default ProductDetailModal;