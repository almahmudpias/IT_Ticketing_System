import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { 
  Shield, Mail, Lock, Key, User, ArrowLeft, 
  ArrowRight, Eye, EyeOff, CheckCircle,
  Server, LayoutGrid, UserCircle
} from 'lucide-react';

const EnhancedLogin = () => {
  const { user, login } = useAuth();
  const [step, setStep] = useState('email'); // email → password → otp (if new user)
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    otp: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userExists, setUserExists] = useState(null);
  const [activeField, setActiveField] = useState('');

  // Redirect based on user role
  // In the redirect section, replace with:
if (user) {
  let redirectPath = '/dashboard'; // Default for students, faculty, staff
  
  switch (user.role) {
    case 'super_admin':
      redirectPath = '/super-admin';
      break;
    case 'admin':
      redirectPath = '/admin';
      break;
    case 'it_staff':
      redirectPath = '/it-staff';
      break;
    case 'front_desk':
      redirectPath = '/front-desk';
      break;
    case 'lab_instructor':
      redirectPath = '/lab-instructor';
      break;
    case 'student':
    case 'faculty':
    case 'staff':
    default:
      redirectPath = '/dashboard';
  }
  
  return <Navigate to={redirectPath} replace />;
}
  // Step 1: Check if user exists
  const handleEmailSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    // Check if user exists by trying to login with a dummy password
    // This is a mock implementation - in real system, you'd have a dedicated endpoint
    const mockUsers = [
      'student@northsouth.edu',
      'staff@northsouth.edu', 
      'frontdesk@northsouth.edu',
      'itstaff@northsouth.edu',
      'admin@northsouth.edu',
      'lab.cs@northsouth.edu',
      'prof.ahmed@northsouth.edu',
      'superadmin@northsouth.edu'
    ];

    const userExists = mockUsers.includes(formData.identifier) || 
                      formData.identifier === 'FAC001'; // Faculty ID check

    if (userExists) {
      // Existing user - go to password step
      setUserExists(true);
      setStep('password');
    } else {
      // New user - send OTP
      try {
        await userService.requestOTP(formData.identifier);
        setUserExists(false);
        setStep('otp');
      } catch (otpError) {
        setError(otpError.message);
      }
    }
  } catch (error) {
    setError('Failed to check user account. Please try again.');
  } finally {
    setLoading(false);
  }
};

  // Step 2: Login with password (existing users)
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.identifier, formData.password);
      if (!result.success) {
        setError(result.error);
      } else {
        // Force immediate redirect after successful login
        setTimeout(() => {
          window.location.href = '/student';
        }, 100);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Verify OTP and create account (new users)
  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await userService.verifyOTPAndCreate(
        formData.identifier,
        formData.otp,
        formData.newPassword
      );
      
      localStorage.setItem('nsu_ticket_token', result.token);
      // Force page reload to trigger auth context update
      window.location.href = '/student';
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 'password' || step === 'otp') {
      setStep('email');
      setError('');
    }
  };

  const resetFlow = () => {
    setStep('email');
    setFormData({ identifier: '', password: '', otp: '', newPassword: '' });
    setError('');
    setUserExists(null);
  };

  const demoCredentials = [
    { email: 'student@northsouth.edu', role: 'Student', color: 'bg-blue-100 text-blue-700' },
    { email: 'staff@northsouth.edu', role: 'Staff', color: 'bg-purple-100 text-purple-700' },
    { email: 'frontdesk@northsouth.edu', role: 'Front Desk', color: 'bg-pink-100 text-pink-700' },
    { email: 'itstaff@northsouth.edu', role: 'IT Staff', color: 'bg-amber-100 text-amber-700' },
    { email: 'admin@northsouth.edu', role: 'Admin', color: 'bg-emerald-100 text-emerald-700' },
    { email: 'lab.cs@northsouth.edu', role: 'Lab Instructor', color: 'bg-orange-100 text-orange-700' }
  ];

  const fillDemoCredentials = (email) => {
    setFormData(prev => ({ ...prev, identifier: email, password: 'password' }));
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      
      {/* LEFT SIDE: Brand & Visuals */}
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
            <span className="font-bold tracking-wider text-lg">NSU IT PORTAL</span>
          </div>
          
          <h1 className="text-5xl font-extrabold leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200">
            Welcome to <br/> NSU Support
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Manage IT tickets, request support, and track your requests in one unified platform for North South University.
          </p>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-8">
            <div className={`flex items-center gap-2 ${step === 'email' ? 'text-white' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'email' ? 'bg-blue-600 border-blue-600' : 'border-slate-400'}`}>
                1
              </div>
              <span className="text-sm font-medium">Enter Email</span>
            </div>
            
            <div className="w-8 h-0.5 bg-slate-600"></div>
            
            <div className={`flex items-center gap-2 ${step !== 'email' ? 'text-white' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step !== 'email' ? 'bg-blue-600 border-blue-600' : 'border-slate-400'}`}>
                {step === 'otp' ? '2' : '✓'}
              </div>
              <span className="text-sm font-medium">
                {userExists === false ? 'Verify & Create' : 'Password'}
              </span>
            </div>
          </div>
        </div>

        {/* Feature badges */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <Server className="h-6 w-6 text-blue-400 mb-2" />
            <h3 className="font-semibold">Smart Detection</h3>
            <p className="text-xs text-slate-400">Auto user detection</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <LayoutGrid className="h-6 w-6 text-purple-400 mb-2" />
            <h3 className="font-semibold">Secure Access</h3>
            <p className="text-xs text-slate-400">OTP verification</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Forms */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-6 lg:p-12 bg-gray-50/50">
        <div className="max-w-md w-full space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 text-white shadow-lg mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 'email' ? 'Welcome Back' : step === 'password' ? 'Enter Password' : 'Verify Account'}
            </h2>
          </div>

          {/* Back Button */}
          {(step === 'password' || step === 'otp') && (
            <button
              onClick={goBack}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to email
            </button>
          )}

          <div className="text-left">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight hidden lg:block">
              {step === 'email' ? 'Welcome Back' : step === 'password' ? 'Enter Password' : 'Verify Account'}
            </h2>
            <p className="mt-2 text-gray-500">
              {step === 'email' && 'Enter your NSU email or Faculty ID to continue'}
              {step === 'password' && `Enter password for ${formData.identifier}`}
              {step === 'otp' && `We sent a verification code to ${formData.identifier}`}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <Shield className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Step 1: Email Input */}
          {step === 'email' && (
            <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
              <div className="space-y-5">
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Email or Faculty ID
                  </label>
                  <div className={`relative transition-all duration-300 transform ${activeField === 'identifier' ? 'scale-[1.02]' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 transition-colors duration-300 ${activeField === 'identifier' ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      value={formData.identifier}
                      onChange={(e) => setFormData(prev => ({ ...prev, identifier: e.target.value }))}
                      onFocus={() => setActiveField('identifier')}
                      onBlur={() => setActiveField('')}
                      className={`block w-full pl-11 pr-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-0 transition-all duration-300 ${error ? 'border-red-300' : 'border-gray-100 hover:border-gray-200'}`}
                      placeholder="student@northsouth.edu or FAC001"
                      required
                      disabled={loading}
                    />
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
                    Checking...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Continue <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>

              {/* Demo Credentials */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-50/50 text-gray-500 font-medium">Quick Access (Demo)</span>
                </div>
              </div>

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
                  New student without NSU email?{' '}
                  <Link to="/nsu-email-request" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                    Request account here
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* Step 2: Password for Existing Users */}
          {step === 'password' && (
            <form className="mt-8 space-y-6" onSubmit={handlePasswordLogin}>
              <div className="space-y-5">
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
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      onFocus={() => setActiveField('password')}
                      onBlur={() => setActiveField('')}
                      className={`block w-full pl-11 pr-12 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-0 transition-all duration-300 ${error ? 'border-red-300' : 'border-gray-100 hover:border-gray-200'}`}
                      placeholder="••••••••"
                      required
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
                className="w-full bg-nsu-blue text-white py-3.5 px-4 rounded-xl hover:bg-blue-800 font-bold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:transform-none"
              >
                {loading ? 'Signing in...' : 'Sign In to Account'}
              </button>
            </form>
          )}

          {/* Step 3: OTP Verification for New Users */}
          {step === 'otp' && (
            <form className="mt-8 space-y-6" onSubmit={handleOTPVerification}>
              <div className="space-y-5">
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Verification Code
                  </label>
                  <div className={`relative transition-all duration-300 transform ${activeField === 'otp' ? 'scale-[1.02]' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Key className={`h-5 w-5 transition-colors duration-300 ${activeField === 'otp' ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      value={formData.otp}
                      onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value }))}
                      onFocus={() => setActiveField('otp')}
                      onBlur={() => setActiveField('')}
                      className={`block w-full pl-11 pr-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-0 transition-all duration-300 ${error ? 'border-red-300' : 'border-gray-100 hover:border-gray-200'}`}
                      placeholder="Enter 6-digit code"
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-1">
                    Check your email for the verification code
                  </p>
                </div>

                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Set Password
                  </label>
                  <div className={`relative transition-all duration-300 transform ${activeField === 'newPassword' ? 'scale-[1.02]' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 transition-colors duration-300 ${activeField === 'newPassword' ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                      onFocus={() => setActiveField('newPassword')}
                      onBlur={() => setActiveField('')}
                      className={`block w-full pl-11 pr-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-0 transition-all duration-300 ${error ? 'border-red-300' : 'border-gray-100 hover:border-gray-200'}`}
                      placeholder="Create your password"
                      required
                      minLength={6}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3.5 px-4 rounded-xl hover:bg-green-700 font-bold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:transform-none"
              >
                {loading ? 'Creating Account...' : 'Create Account & Sign In'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedLogin;