import React, { useState } from "react";
import {
  AlertTriangle,
  X,
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
} from "lucide-react";
import productService from "../services/productService";
import { toast } from "react-toastify";

const DevelopmentBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleResetMockData = () => {
    if (window.confirm("¿Resetear los datos mock a su estado inicial?")) {
      productService.resetMockData();
      window.location.reload();
    }
  };

  const handleDebugMockData = () => {
    productService.debugMockData();
  };

  // ✅ Nueva función para limpiar URLs blob
  const handleCleanupBlobs = () => {
    productService.cleanupBlobUrls();
    toast.success("URLs blob limpiadas");
  };

  if (!isVisible || import.meta.env.PROD) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">
            Modo Desarrollo
          </span>
          <div className="flex items-center space-x-1 text-xs text-amber-700">
            {isOnline ? (
              <>
                <Wifi className="h-3 w-3" />
                <span>Backend: No disponible (usando datos mock)</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                <span>Sin conexión a internet</span>
              </>
            )}
          </div>

          {/* ✅ Herramientas de desarrollo */}
          <div className="hidden md:flex items-center space-x-2 ml-4">
            <button
              onClick={handleDebugMockData}
              className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded transition-colors"
              title="Ver datos mock en consola"
            >
              <Database className="h-3 w-3 inline mr-1" />
              Debug
            </button>
            <button
              onClick={handleCleanupBlobs}
              className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded transition-colors"
              title="Limpiar URLs blob obsoletas"
            >
              🧹 Clean
            </button>
            <button
              onClick={handleResetMockData}
              className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded transition-colors"
              title="Resetear datos mock"
            >
              <RefreshCw className="h-3 w-3 inline mr-1" />
              Reset
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-amber-500 hover:text-amber-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default DevelopmentBanner;
