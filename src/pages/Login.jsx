import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, Mail, Lock, Eye, EyeOff, 
  ArrowRight, ChevronRight, UserCircle, 
  Server, LayoutGrid 
} from 'lucide-react';

const Login = () => {
  const { user, login, loading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState(''); // For tracking focus animations

  // Redirect Logic
  if (user) {
    const redirectPath = user.role === 'student' ? '/student' : 
                         user.role === 'front_desk' ? '/front-desk' :
                         user.role === 'it_staff' ? '/it-staff' : 
                         user.role === 'staff' ? '/student' : '/admin';
    return <Navigate to={redirectPath} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    const result = await login(formData.email, formData.password);
    if (!result.success) setError(result.error);
  };

  const demoCredentials = [
    { email: 'student@northsouth.edu', role: 'Student', color: 'bg-blue-100 text-blue-700' },
    { email: 'staff@northsouth.edu', role: 'Staff', color: 'bg-purple-100 text-purple-700' },
    { email: 'frontdesk@northsouth.edu', role: 'Front Desk', color: 'bg-pink-100 text-pink-700' },
    { email: 'itstaff@northsouth.edu', role: 'IT Staff', color: 'bg-amber-100 text-amber-700' },
    { email: 'admin@northsouth.edu', role: 'Admin', color: 'bg-emerald-100 text-emerald-700' }
  ];

  const fillDemoCredentials = (email) => {
    setFormData({ email, password: 'password' });
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      
      {/* LEFT SIDE: Brand & Visuals (Hidden on mobile, full height on desktop) */}
      <div className="lg:w-1/2 relative overflow-hidden bg-slate-900 flex flex-col justify-between p-12 text-white">
        {/* Abstract Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        {/* Logo/Brand Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-blue-400 mb-8">
            <Shield className="h-8 w-8" />
            <span className="font-bold tracking-wider text-lg">NSU SECURE</span>
          </div>
          
          <h1 className="text-5xl font-extrabold leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200">
            Support made <br/> Simple.
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Manage tickets, request support, and track your academic IT status in one unified platform designed for North South University.
          </p>
        </div>

        {/* Feature badges at bottom left */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <Server className="h-6 w-6 text-blue-400 mb-2" />
            <h3 className="font-semibold">Fast Tracking</h3>
            <p className="text-xs text-slate-400">Real-time updates</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <LayoutGrid className="h-6 w-6 text-purple-400 mb-2" />
            <h3 className="font-semibold">All-in-One</h3>
            <p className="text-xs text-slate-400">Everything you need</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-6 lg:p-12 bg-gray-50/50">
        <div className="max-w-md w-full space-y-8">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 text-white shadow-lg mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          </div>

          <div className="text-left">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight hidden lg:block">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-500">
              Please enter your details to sign in.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <Shield className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              {/* Email Field */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email Address</label>
                <div className={`relative transition-all duration-300 transform ${activeField === 'email' ? 'scale-[1.02]' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 transition-colors duration-300 ${activeField === 'email' ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setActiveField('email')}
                    onBlur={() => setActiveField('')}
                    className={`block w-full pl-11 pr-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-0 transition-all duration-300 ${error ? 'border-red-300' : 'border-gray-100 hover:border-gray-200'}`}
                    placeholder="student@northsouth.edu"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative group">
                <div className="flex justify-between items-center mb-1 ml-1">
                   <label className="block text-sm font-medium text-gray-700">Password</label>
                   <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-800">Forgot password?</a>
                </div>
                <div className={`relative transition-all duration-300 transform ${activeField === 'password' ? 'scale-[1.02]' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors duration-300 ${activeField === 'password' ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setActiveField('password')}
                    onBlur={() => setActiveField('')}
                    className={`block w-full pl-11 pr-12 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-0 transition-all duration-300 ${error ? 'border-red-300' : 'border-gray-100 hover:border-gray-200'}`}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer hover:text-gray-600 text-gray-400 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gray-900 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in to Account <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50/50 text-gray-500 font-medium">Quick Access (Demo)</span>
              </div>
            </div>

            {/* Improved Demo Credentials Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => fillDemoCredentials(cred.email)}
                  className={`p-2 rounded-lg border border-transparent hover:border-gray-200 hover:shadow-sm transition-all text-left ${index >= 3 ? 'sm:col-span-1' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${cred.color}`}>
                    <UserCircle className="h-5 w-5" />
                  </div>
                  <div className="text-xs font-bold text-gray-700">{cred.role}</div>
                </button>
              ))}
            </div>

            <div className="text-center pt-6">
              <p className="text-sm text-gray-600">
                New student?{' '}
                <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 flex items-center justify-center gap-1 inline-flex transition-colors">
                  Create an account <ChevronRight className="h-3 w-3" />
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;