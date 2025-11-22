import React, { createContext, useContext, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/Toast/ToastContainer';
import { setToastInstance } from '../utils/toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const toast = useToast();
  
  // Set global toast instance for utility functions
  useEffect(() => {
    setToastInstance(toast);
  }, [toast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
};

