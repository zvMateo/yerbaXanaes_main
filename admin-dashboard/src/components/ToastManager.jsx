import React from 'react';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ✅ Componente personalizado para toasts con mejor UX
const CustomToast = ({ type, message, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = icons[type];

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-3">
        {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
        <span className="flex-1 text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="ml-3 p-1 rounded-lg hover:bg-black/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Cerrar notificación"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// ✅ Métodos helper para toasts consistentes
export const showToast = {
  success: (message, options = {}) => {
    toast.success(
      ({ closeToast }) => (
        <CustomToast type="success" message={message} onClose={closeToast} />
      ),
      {
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        ...options,
      }
    );
  },

  error: (message, options = {}) => {
    toast.error(
      ({ closeToast }) => (
        <CustomToast type="error" message={message} onClose={closeToast} />
      ),
      {
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        ...options,
      }
    );
  },

  warning: (message, options = {}) => {
    toast.warning(
      ({ closeToast }) => (
        <CustomToast type="warning" message={message} onClose={closeToast} />
      ),
      {
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        ...options,
      }
    );
  },

  info: (message, options = {}) => {
    toast.info(
      ({ closeToast }) => (
        <CustomToast type="info" message={message} onClose={closeToast} />
      ),
      {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        ...options,
      }
    );
  },

  // ✅ Toast para operaciones loading
  loading: (message) => {
    return toast.info(
      <div className="flex items-center space-x-3">
        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
        <span className="text-sm font-medium">{message}</span>
      </div>,
      {
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    );
  },

  // ✅ Actualizar toast loading
  updateLoading: (toastId, message, type = 'success') => {
    const methods = { success: toast.success, error: toast.error, info: toast.info };
    methods[type](message, {
      toastId,
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
    });
  },

  // ✅ Limpiar todos los toasts
  clear: () => {
    toast.dismiss();
  },
};

export default showToast;
