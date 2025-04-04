import { createContext, useContext, useState } from 'react';

// Create context
const UIContext = createContext(null);

// UI provider component
export const UIProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle search
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Toggle filter drawer
  const toggleFilterDrawer = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  // Add notification
  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications([...notifications, { ...notification, id }]);
    
    // Auto remove notification after timeout if not persistent
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.timeout || 5000);
    }
    
    return id;
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <UIContext.Provider
      value={{
        sidebarOpen,
        searchOpen,
        mobileMenuOpen,
        filterDrawerOpen,
        notifications,
        toggleSidebar,
        toggleSearch,
        toggleMobileMenu,
        toggleFilterDrawer,
        addNotification,
        removeNotification
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

// Custom hook for using UI context
export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export default UIContext;