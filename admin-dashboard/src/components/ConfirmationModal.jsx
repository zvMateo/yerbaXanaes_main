import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Spinner = () => (
  // Tu componente Spinner (sin cambios)
  <svg className='animate-spin h-5 w-5 text-white' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar Acción",
  message = "¿Estás seguro de que quieres realizar esta acción?",
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
  confirmButtonColor = "red",
  isConfirming = false
}) {

  const baseButtonClasses = "inline-flex justify-center items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors duration-150";

  const colorConfig = {
    red: {
      bg: "bg-red-600",
      hoverBg: "hover:bg-red-700",
      focusRing: "focus-visible:ring-red-500",
      text: "text-white"
    },
    blue: {
      bg: "bg-blue-600",
      hoverBg: "hover:bg-blue-700",
      focusRing: "focus-visible:ring-blue-500",
      text: "text-white"
    },
    green: {
      bg: "bg-green-600",
      hoverBg: "hover:bg-green-700",
      focusRing: "focus-visible:ring-green-500",
      text: "text-white"
    },
    default: {
      bg: "bg-(--secondary-color)",
      hoverBg: "hover:bg-(--primary-color)",
      focusRing: "focus-visible:ring-(--secondary-color)",
      text: "text-white"
    }
  };

  const currentConfirmColor = colorConfig[confirmButtonColor] || colorConfig.default;

  const confirmButtonClasses = `
    ${baseButtonClasses}
    ${currentConfirmColor.bg}
    ${currentConfirmColor.text}
    ${isConfirming ? 'opacity-75 cursor-not-allowed' : currentConfirmColor.hoverBg}
    ${currentConfirmColor.focusRing}
  `;

  const cancelButtonClasses = `
    ${baseButtonClasses}
    border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-(--secondary-color)
    ${isConfirming ? 'opacity-75 cursor-not-allowed' : ''}
  `;

  const handleSafeClose = () => {
    if (!isConfirming) {
      onClose();
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleSafeClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        {/* Modal container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* Panel del diálogo */}
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-start justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 flex items-center"
                  >
                    {confirmButtonColor === 'red' && <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />}
                    {title}
                  </Dialog.Title>
                  <button
                      type="button"
                      className="ml-4 text-gray-400 hover:text-gray-600 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--secondary-color)"
                      onClick={handleSafeClose}
                      aria-label="Cerrar modal"
                      disabled={isConfirming}
                  >
                      <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-3">
                  {/* Descripción/Mensaje del diálogo */}
                  <Dialog.Description as="p" className="text-sm text-gray-600">
                    {message}
                  </Dialog.Description>
                </div>

                <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 sm:space-x-reverse">
                  {/* Botón de Cancelar (primero en el DOM para orden visual en móviles, luego se invierte con flex-row-reverse) */}
                  <button
                    type="button"
                    className={cancelButtonClasses}
                    onClick={handleSafeClose}
                    disabled={isConfirming}
                  >
                    {cancelButtonText}
                  </button>
                  {/* Botón de Confirmar */}
                  <button
                    type="button"
                    className={`${confirmButtonClasses} mt-3 sm:mt-0`} // Añadir margen superior en móviles si es necesario
                    onClick={onConfirm}
                    disabled={isConfirming}
                  >
                    {isConfirming ? (
                      <>
                        <Spinner />
                        <span className="ml-2">Procesando...</span>
                      </>
                    ) : (
                      confirmButtonText
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ConfirmationModal;