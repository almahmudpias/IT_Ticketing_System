import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { 
  User, Mail, Shield, Phone, Building, 
  Lock, Key, Save, Camera, Activity, 
  CheckCircle, Fingerprint
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // State for focus animations
  const [activeField, setActiveField] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await userService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  // Reusable Field Component (Read-Only & Input)
  const ProfileField = ({ icon: Icon, label, value, readOnly = false, type = "text", onChange, name }) => (
    <div className="group">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">{label}</label>
      <div className={`relative transition-all duration-300 transform ${activeField === name && !readOnly ? 'scale-[1.01]' : ''}`}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 transition-colors duration-300 ${activeField === name ? 'text-blue-600' : 'text-gray-400'}`} />
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          onFocus={() => !readOnly && setActiveField(name)}
          onBlur={() => setActiveField('')}
          className={`block w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300
            ${readOnly 
              ? 'bg-gray-50 border-transparent text-gray-600 cursor-default font-medium' 
              : 'bg-white border-gray-100 focus:border-blue-600 focus:ring-0 text-gray-900 shadow-sm'
            }`}
        />
        {readOnly && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <Lock className="h-4 w-4 text-gray-300" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      
      {/* 1. HERO HEADER: Gradient Background */}
      <div className="relative h-64 bg-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
          <p className="text-blue-200 mt-2 text-sm">Manage your profile information and security</p>
        </div>
      </div>

      {/* 2. MAIN CONTENT CARD (Overlapping Header) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          <div className="flex flex-col md:flex-row min-h-[600px]">
            
            {/* LEFT SIDEBAR: Navigation & User Summary */}
            <div className="w-full md:w-72 bg-gray-50/80 border-r border-gray-100 p-6 flex flex-col items-center md:items-start backdrop-blur-sm">
              
              {/* Avatar Section */}
              <div className="flex flex-col items-center w-full mb-8 group">
                <div className="relative mb-4">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-lg group-hover:shadow-blue-500/30 transition-shadow duration-300">
                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 hover:text-blue-600 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                  <div className="absolute top-1 right-1 h-5 w-5 bg-emerald-500 border-4 border-white rounded-full"></div>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{user?.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize mt-1">
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2 w-full">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === 'profile'
                      ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Activity className="mr-3 h-5 w-5" />
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === 'password'
                      ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Key className="mr-3 h-5 w-5" />
                  Security & Password
                </button>
              </nav>

              <div className="mt-auto pt-8 w-full">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-800">Account Status</span>
                  </div>
                  <div className="flex items-center text-xs text-blue-700">
                    <CheckCircle className="h-3 w-3 mr-1" /> Verified Member
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT CONTENT AREA */}
            <div className="flex-1 p-8 md:p-12 relative overflow-hidden">
              
              {/* Tab: Profile View */}
              {activeTab === 'profile' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                    <p className="text-gray-500 text-sm mt-1">Basic identification details. Contact IT support to update locked fields.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <ProfileField icon={Mail} label="Email Address" value={user?.email} readOnly />
                    </div>
                    
                    <ProfileField icon={Shield} label="System Role" value={user?.role?.replace('_', ' ')} readOnly />
                    
                    {user?.department && (
                      <ProfileField icon={Building} label="Department" value={user?.department} readOnly />
                    )}
                    
                    {user?.studentId && (
                       <ProfileField icon={Fingerprint} label="Student ID" value={user?.studentId} readOnly />
                    )}

                    <div className="md:col-span-2">
                      <ProfileField icon={Phone} label="Phone Number" value={user?.phone || 'Not provided'} readOnly />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Password Change */}
              {activeTab === 'password' && (
                <div className="max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
                    <p className="text-gray-500 text-sm mt-1">Ensure your account uses a long, random password to stay secure.</p>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <ProfileField 
                      icon={Lock} 
                      label="Current Password" 
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    />
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-2 bg-white text-xs text-gray-400 uppercase tracking-widest">New Credentials</span>
                      </div>
                    </div>

                    <ProfileField 
                      icon={Key} 
                      label="New Password" 
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    />

                    <ProfileField 
                      icon={CheckCircle} 
                      label="Confirm New Password" 
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="group relative flex items-center justify-center w-full py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gray-900 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
                      >
                         {loading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating Security...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Save className="h-4 w-4 mr-2" /> Update Password
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;