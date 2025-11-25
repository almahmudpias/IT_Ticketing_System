import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { 
  Menu, Bell, User, LogOut, Search, 
  Settings, HelpCircle, Sun, Moon,
  MessageSquare, Calendar, Star,
  ChevronDown, Shield, Laptop
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { setSidebarOpen, notifications, darkMode, setDarkMode } = useUI();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/dashboard': 'Dashboard Overview',
      '/create-ticket': 'Create Support Ticket',
      '/tickets': 'My Tickets',
      '/admin/users': 'User Management',
      '/admin/analytics': 'System Analytics',
      '/admin/settings': 'System Settings',
      '/front-desk': 'Front Desk Dashboard',
      '/it-staff': 'IT Staff Portal',
      '/super-admin': 'Super Admin Console'
    };
    
    return titles[path] || 'NSU IT Portal';
  };

  const getRoleBadge = () => {
    const roleConfig = {
      super_admin: { color: 'bg-red-100 text-red-800', label: 'Super Admin' },
      admin: { color: 'bg-purple-100 text-purple-800', label: 'Administrator' },
      it_staff: { color: 'bg-blue-100 text-blue-800', label: 'IT Staff' },
      front_desk: { color: 'bg-green-100 text-green-800', label: 'Front Desk' },
      lab_instructor: { color: 'bg-orange-100 text-orange-800', label: 'Lab Instructor' },
      student: { color: 'bg-indigo-100 text-indigo-800', label: 'Student' },
      faculty: { color: 'bg-teal-100 text-teal-800', label: 'Faculty' },
      staff: { color: 'bg-cyan-100 text-cyan-800', label: 'Staff' }
    };
    
    return roleConfig[user?.role] || { color: 'bg-gray-100 text-gray-800', label: 'User' };
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200/50' 
        : 'bg-white border-b border-gray-200'
    }`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Title and Breadcrumb */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 lg:hidden transform hover:scale-105"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Page title and breadcrumb */}
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                {getPageTitle()}
              </h1>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <span>NSU IT Portal</span>
                <span>•</span>
                <span className="font-medium capitalize">{user?.role?.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-gray-600 hover:text-amber-500 hover:bg-amber-50 transition-all duration-200 transform hover:scale-105"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Search Bar */}
            <div className="hidden md:block relative">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tickets, users..."
                    className="block w-72 pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white"
                  />
                </div>
              </form>
            </div>

            {/* Quick Actions */}
            <div className="hidden lg:flex items-center space-x-1">
              <button className="p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 transform hover:scale-105">
                <Calendar className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 transform hover:scale-105">
                <MessageSquare className="h-5 w-5" />
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 transform hover:scale-105 relative"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200/50 backdrop-blur-lg z-50 transform origin-top-right transition-all duration-200">
                  <div className="p-4 border-b border-gray-200/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {notifications.length} new
                      </span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No notifications</p>
                        <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className="p-4 border-b border-gray-100/50 hover:bg-gray-50/50 transition-colors duration-150 cursor-pointer group"
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              notification.type === 'urgent' ? 'bg-red-100 text-red-600' :
                              notification.type === 'info' ? 'bg-blue-100 text-blue-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {notification.type === 'urgent' ? <Shield className="h-4 w-4" /> :
                               notification.type === 'info' ? <Laptop className="h-4 w-4" /> :
                               <Star className="h-4 w-4" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(notification.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200/50">
                      <button className="w-full text-center text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
                        Mark all as read
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${roleBadge.color} border-2 border-white shadow-sm`}>
                        {roleBadge.label}
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role?.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  showUserMenu ? 'rotate-180' : ''
                }`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200/50 backdrop-blur-lg z-50 transform origin-top-right transition-all duration-200">
                  <div className="p-4 border-b border-gray-200/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-bold mt-1 ${roleBadge.color}`}>
                          {roleBadge.label}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 group"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4 mr-3 text-gray-400 group-hover:text-blue-600" />
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 group"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="h-4 w-4 mr-3 text-gray-400 group-hover:text-blue-600" />
                      Account Settings
                    </Link>
                    <Link
                      to="/help"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 group"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <HelpCircle className="h-4 w-4 mr-3 text-gray-400 group-hover:text-blue-600" />
                      Help & Support
                    </Link>
                  </div>
                  
                  <div className="p-3 border-t border-gray-200/50">
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200 group"
                    >
                      <LogOut className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;