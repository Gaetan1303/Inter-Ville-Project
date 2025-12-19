import React, { createContext, useContext } from 'react';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const toastMethods = useToast();

  // Ajout d'une durée par défaut de 5 secondes pour tous les toasts
  const defaultToastOptions = { duration: 5000 };

  const showToast = (message, type, options = {}) => {
    const toastOptions = { ...defaultToastOptions, ...options };
    toastMethods.addToast(message, type, toastOptions.duration);
  };

  return (
    <ToastContext.Provider value={{ ...toastMethods, showToast }}>
      {children}
      <div className="toast-container">
        {toastMethods.toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => toastMethods.removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};