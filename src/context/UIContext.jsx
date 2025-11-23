import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export const UIProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    type: '',
    data: null
  });
  const [notifications, setNotifications] = useState([]);

  const openModal = (type, data = null) => {
    setModal({ open: true, type, data });
  };

  const closeModal = () => {
    setModal({ open: false, type: '', data: null });
  };

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, ...notification }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const value = {
    sidebarOpen,
    setSidebarOpen,
    modal,
    openModal,
    closeModal,
    notifications,
    addNotification,
    removeNotification
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};