import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { 
  Home, 
  Ticket, 
  Users, 
  Settings, 
  BarChart3, 
  X,
  User,
  Shield,
  Laptop,
  Beaker,
  Calendar,
  MessageSquare,
  FileText,
  Database,
  Server,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Star,
  Zap,
  Clock
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const { sidebarOpen, setSidebarOpen, notifications } = useUI();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const getDashboardPath = (role) => {
    switch (role) {
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

  const getRoleColor = (role) => {
    const colors = {
      super_admin: 'from-red-500 to-pink-600',
      admin: 'from-purple-500 to-indigo-600',
      it_staff: 'from-blue-500 to-cyan-600',
      front_desk: 'from-green-500 to-emerald-600',
      lab_instructor: 'from-orange-500 to-amber-600',
      student: 'from-indigo-500 to-purple-600',
      faculty: 'from-teal-500 to-cyan-600',
      staff: 'from-gray-600 to-gray-700'
    };
    return colors[role] || 'from-blue-500 to-purple-600';
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: getDashboardPath(user?.role),
      icon: Home,
      roles: ['student', 'faculty', 'staff', 'super_admin', 'admin', 'it_staff', 'front_desk', 'lab_instructor'],
      badge: null
    },
    {
      name: 'Create Ticket',
      href: '/create-ticket',
      icon: Ticket,
      roles: ['student', 'faculty', 'staff', 'lab_instructor'],
      badge: 'new'
    },
    {
      name: 'My Tickets',
      href: '/tickets',
      icon: FileText,
      roles: ['student', 'faculty', 'staff', 'lab_instructor'],
      badge: notifications.length > 0 ? notifications.length.toString() : null
    },
    {
      name: 'Ticket Management',
      href: '/tickets/manage',
      icon: Laptop,
      roles: ['it_staff', 'front_desk', 'admin', 'super_admin'],
      badge: 'hot'
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: Users,
      roles: ['super_admin', 'admin'],
      submenu: [
        { name: 'All Users', href: '/admin/users' },
        { name: 'Add User', href: '/admin/users/create' },
        { name: 'Roles & Permissions', href: '/admin/users/roles' }
      ]
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      roles: ['super_admin', 'admin'],
      submenu: [
        { name: 'Overview', href: '/admin/analytics' },
        { name: 'Tickets', href: '/admin/analytics/tickets' },
        { name: 'Users', href: '/admin/analytics/users' },
        { name: 'System', href: '/admin/analytics/system' }
      ]
    },
    {
      name: 'System Settings',
      href: '/admin/settings',
      icon: Settings,
      roles: ['super_admin'],
      submenu: [
        { name: 'General', href: '/admin/settings' },
        { name: 'Email', href: '/admin/settings/email' },
        { name: 'Security', href: '/admin/settings/security' },
        { name: 'Backup', href: '/admin/settings/backup' }
      ]
    },
    {
      name: 'Resources',
      href: '/resources',
      icon: Database,
      roles: ['student', 'faculty', 'staff', 'it_staff', 'lab_instructor'],
      badge: null
    },
    {
      name: 'Help & Support',
      href: '/help',
      icon: HelpCircle,
      roles: ['student', 'faculty', 'staff', 'it_staff', 'front_desk', 'lab_instructor'],
      badge: null
    }
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const handleNavigation = (href) => {
    setSidebarOpen(false);
    navigate(href);
  };

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  const getBadgeColor = (badge) => {
    if (badge === 'new') return 'bg-green-100 text-green-800';
    if (badge === 'hot') return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest('.sidebar-container')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-sm lg:hidden transition-opacity duration-300" />
      )}

      {/* Sidebar - Fixed position */}
      <div className={`
        sidebar-container
        fixed top-0 left-0 h-screen flex flex-col z-40 w-80 
        bg-gradient-to-b from-white to-gray-50/80 
        shadow-2xl border-r border-gray-200/50 backdrop-blur-lg
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* CORRECT ORDER: Header first */}
        <div className="flex-shrink-0 flex items-center justify-between h-20 px-6 border-b border-gray-200/50 bg-white/80">
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-xl shadow-lg`}>
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                NSU IT Portal
              </h1>
              <p className="text-xs text-gray-500 font-medium">Powered by IT Department</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 lg:hidden transform hover:scale-105"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User profile card */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200/50 bg-white/60">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`w-14 h-14 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{user?.name}</h3>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${
                  user?.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                  user?.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user?.role === 'it_staff' ? 'bg-blue-100 text-blue-800' :
                  user?.role === 'front_desk' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user?.role?.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <nav className="h-full overflow-y-auto">
            <div className="px-4 py-6 space-y-1">
              {filteredNavigation.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const hasSubmenu = item.submenu;
                
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => hasSubmenu ? toggleSubmenu(index) : handleNavigation(item.href)}
                      className={`
                        group flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-left
                        ${active 
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 border-r-2 border-blue-500 shadow-sm' 
                          : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`
                          h-5 w-5 flex-shrink-0 transition-colors duration-200
                          ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}
                        `} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getBadgeColor(item.badge)}`}>
                            {item.badge}
                          </span>
                        )}
                        {hasSubmenu && (
                          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                            activeSubmenu === index ? 'rotate-180' : ''
                          }`} />
                        )}
                      </div>
                    </button>

                    {/* Submenu */}
                    {hasSubmenu && activeSubmenu === index && (
                      <div className="ml-4 space-y-1 animate-slide-down">
                        {item.submenu.map((subItem) => (
                          <button
                            key={subItem.name}
                            onClick={() => handleNavigation(subItem.href)}
                            className={`
                              flex items-center w-full px-4 py-2.5 text-sm rounded-lg transition-all duration-150
                              ${isActive(subItem.href)
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                              }
                            `}
                          >
                            <ChevronRight className="h-3 w-3 mr-3 flex-shrink-0" />
                            {subItem.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Sidebar footer - Last */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200/50 bg-white/60">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-4 border border-blue-200/50">
            <div className="flex items-center space-x-3 mb-3">
              <Zap className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">Quick Stats</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Tickets Today</span>
                <span className="font-semibold text-blue-700">12</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Response Time</span>
                <span className="font-semibold text-green-700">2.3h</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Satisfaction</span>
                <span className="font-semibold text-amber-700">94%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;