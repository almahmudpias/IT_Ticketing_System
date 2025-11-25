import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Helper function to get dashboard path based on role
  const getDashboardPath = (userRole) => {
    switch (userRole) {
      case 'super_admin':
        return '/super-admin';
      case 'admin':
        return '/admin';
      case 'it_staff':
        return '/it-staff';
      case 'front_desk':
        return '/front-desk';
      case 'lab_instructor':
        return '/lab-instructor';
      case 'student':
      case 'faculty':
      case 'staff':
      default:
        return '/dashboard';
    }
  };

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('nsu_ticket_token');
      if (token) {
        const userData = await userService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('nsu_ticket_token');
      setUser(null);
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  const login = async (identifier, password) => {
    try {
      setLoading(true);
      const response = await userService.login(identifier, password);
      const { user: userData, token } = response;
      
      localStorage.setItem('nsu_ticket_token', token);
      setUser(userData);
      
      // Get the appropriate dashboard path and redirect
      const dashboardPath = getDashboardPath(userData.role);
      
      // Use setTimeout to ensure state is updated before redirect
      setTimeout(() => {
        window.location.href = dashboardPath;
      }, 100);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('nsu_ticket_token');
    setUser(null);
    window.location.href = '/login';
  };

  const hasPermission = (requiredPermission) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    
    const rolePermissions = {
      admin: ['manage_tickets', 'assign_tickets', 'view_reports', 'manage_users'],
      front_desk: ['create_tickets', 'view_tickets', 'assign_tickets'],
      it_staff: ['view_assigned_tickets', 'update_tickets', 'add_comments'],
      lab_instructor: ['create_tickets', 'view_tickets', 'lab_requests'],
      user: ['create_tickets', 'view_own_tickets']
    };

    const permissions = rolePermissions[user.role] || [];
    return permissions.includes(requiredPermission);
  };

  const hasRole = (requiredRoles) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return requiredRoles.includes(user.role);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    hasRole,
    hasPermission,
    authChecked,
    getDashboardPath // Export this for use in other components
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};