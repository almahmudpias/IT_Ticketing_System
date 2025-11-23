import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { 
  User, Mail, Phone, BookOpen, ArrowLeft, 
  Building2, Lock, BadgeCheck, GraduationCap, 
  CheckCircle, Smartphone, Eye, EyeOff, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: '',
    department: '',
    emergencyContact: ''
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeField, setActiveField] = useState(''); // For focus animations

  const departments = [
    'Computer Science and Engineering',
    'Electrical and Electronic Engineering',
    'Business Administration',
    'Economics',
    'English and Modern Languages',
    'Political Science',
    'Architecture',
    'Pharmacy',
    'Environmental Science',
    'Other'
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (password.length < 6) newErrors.password = 'Password must be 6+ characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please check the form for errors');
      return;
    }

    setLoading(true);
    try {
      const studentData = { ...formData, password };
      await userService.registerStudent(studentData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Reusable Input Component to keep code clean
  const FormInput = ({ icon: Icon, label, name, type = "text", placeholder, value, onChange, error, isPassword = false, showPass, togglePass }) => (
    <div className="group">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">{label}</label>
      <div className={`relative transition-all duration-300 transform ${activeField === name ? 'scale-[1.01]' : ''}`}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 transition-colors duration-300 ${activeField === name ? 'text-blue-600' : 'text-gray-400'}`} />
        </div>
        <input
          name={name}
          type={isPassword ? (showPass ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          onFocus={() => setActiveField(name)}
          onBlur={() => setActiveField('')}
          className={`block w-full pl-11 pr-4 py-3 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-0 transition-all duration-300 ${error ? 'border-red-300 bg-red-50' : 'border-transparent hover:border-gray-200'}`}
          placeholder={placeholder}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={togglePass}
          >
            {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500 font-medium ml-1 flex items-center"><span className="w-1 h-1 bg-red-500 rounded-full mr-1"></span>{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      
      {/* LEFT SIDE: Visuals & Branding */}
      <div className="lg:w-1/2 relative overflow-hidden bg-slate-900 flex flex-col justify-between p-12 text-white hidden lg:flex">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-[40%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-emerald-400 mb-8">
            <BadgeCheck className="h-8 w-8" />
            <span className="font-bold tracking-wider text-lg">NSU REGISTRATION</span>
          </div>
          
          <h1 className="text-5xl font-extrabold leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-blue-200">
            Start Your <br/> Digital Journey.
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Create your comprehensive student profile to access IT support, campus resources, and academic tracking tools.
          </p>
        </div>

        {/* Dynamic List */}
        <div className="relative z-10 space-y-4">
          {[
            { icon: ShieldCheck, text: "Secure Identity Verification" },
            { icon: Smartphone, text: "Mobile Access Enabled" },
            { icon: CheckCircle, text: "Instant Account Activation" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 w-fit">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="font-medium text-slate-200">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: Scrollable Form */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-6 lg:p-12 bg-white overflow-y-auto">
        <div className="max-w-lg w-full">
          
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-600 text-white shadow-lg mb-4">
              <User className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          </div>

          <div className="mb-8">
            <Link to="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6 group">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight hidden lg:block">
              Create Account
            </h2>
            <p className="mt-2 text-gray-500">
              Enter your personal details to register.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <FormInput 
              icon={User} label="Full Name" name="name" 
              placeholder="Ex: John Doe" 
              value={formData.name} onChange={handleChange} error={errors.name} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Student ID */}
              <FormInput 
                icon={BookOpen} label="Student ID" name="studentId" 
                placeholder="2024..." 
                value={formData.studentId} onChange={handleChange} error={errors.studentId} 
              />
              {/* Phone */}
              <FormInput 
                icon={Phone} label="Phone Number" name="phone" 
                placeholder="+8801..." 
                value={formData.phone} onChange={handleChange} error={errors.phone} 
              />
            </div>

            {/* Email Field */}
            <FormInput 
              icon={Mail} label="Personal Email" name="email" type="email"
              placeholder="name@example.com" 
              value={formData.email} onChange={handleChange} error={errors.email} 
            />

            {/* Department Select - Custom Styled */}
            <div className="group">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">Department</label>
              <div className={`relative transition-all duration-300 transform ${activeField === 'department' ? 'scale-[1.01]' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <GraduationCap className={`h-5 w-5 transition-colors duration-300 ${activeField === 'department' ? 'text-blue-600' : 'text-gray-400'}`} />
                </div>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  onFocus={() => setActiveField('department')}
                  onBlur={() => setActiveField('')}
                  className={`block w-full pl-11 pr-4 py-3 bg-gray-50 border-2 rounded-xl text-gray-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-0 transition-all duration-300 appearance-none cursor-pointer ${errors.department ? 'border-red-300 bg-red-50' : 'border-transparent hover:border-gray-200'}`}
                >
                  <option value="">Select your department...</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Building2 className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              {errors.department && <p className="mt-1 text-xs text-red-500 font-medium ml-1">{errors.department}</p>}
            </div>

            {/* Emergency Contact */}
            <FormInput 
              icon={Smartphone} label="Emergency Contact (Optional)" name="emergencyContact" 
              placeholder="Guardian's Phone" 
              value={formData.emergencyContact} onChange={handleChange} 
            />

            {/* Passwords Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput 
                icon={Lock} label="Password" name="password" 
                placeholder="••••••" 
                value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password}
                isPassword={true} showPass={showPassword} togglePass={() => setShowPassword(!showPassword)}
              />
              <FormInput 
                icon={Lock} label="Confirm Password" name="confirmPassword" 
                placeholder="••••••" 
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword}
                isPassword={true} showPass={showConfirmPassword} togglePass={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gray-900 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Registration...
                  </span>
                ) : (
                  <span className="flex items-center text-base">
                    Create Account
                  </span>
                )}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;