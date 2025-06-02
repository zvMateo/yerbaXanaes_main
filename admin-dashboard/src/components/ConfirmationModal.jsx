import React from 'react';
import { Dialog, Transition } from '@headlessui/react'; // Usaremos Headless UI para accesibilidad y transiciones
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react'; // Fragment es necesario para Transition.Child

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar Acción",
  message = "¿Estás seguro de que quieres realizar esta acción?",
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
  confirmButtonColor = "red" // 'red' o 'green' o 'blue', etc. para el color del botón de confirmación
}) {
  if (!isOpen) return null;

  let confirmColorClasses = 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500';
  if (confirmButtonColor === 'green') {
    confirmColorClasses = 'bg-yrbx-olive hover:bg-yrbx-green-dark focus-visible:ring-yrbx-olive';
  } else if (confirmButtonColor === 'blue') {
    confirmColorClasses = 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500';
  }
  // Añade más colores si es necesario

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900 flex items-center"
                >
                  {confirmButtonColor === 'red' && <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />}
                  {title}
                </Dialog.Title>
                <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                    aria-label="Cerrar modal"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
                <div className="mt-3">
                  <p className="text-sm text-gray-600">
                    {message}
                  </p>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-yrbx-olive focus-visible:ring-offset-2 transition-colors"
                    onClick={onClose}
                  >
                    {cancelButtonText}
                  </button>
                  <button
                    type="button"
                    className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors ${confirmColorClasses}`}
                    onClick={onConfirm}
                  >
                    {confirmButtonText}
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