import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { 
  Shield, Mail, User, BookOpen, Phone, Calendar, ArrowLeft, 
  CheckCircle, Search, Clock, AlertCircle, FileText,
  ChevronRight, Home, Download, Copy, ExternalLink,
  ArrowRight, Eye, EyeOff, Key, Server, LayoutGrid, UserCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const NsuEmailRequest = () => {
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    name: '',
    admissionNo: '',
    program: '',
    dateOfBirth: '',
    phone: '',
    emergencyContact: ''
  });
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeField, setActiveField] = useState('');

  const programs = [
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

  const statusConfig = {
    pending: { 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-50', 
      border: 'border-yellow-200', 
      icon: Clock,
      badge: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    approved: { 
      color: 'text-green-600', 
      bg: 'bg-green-50', 
      border: 'border-green-200', 
      icon: CheckCircle,
      badge: 'bg-green-100 text-green-800 border-green-200'
    },
    rejected: { 
      color: 'text-red-600', 
      bg: 'bg-red-50', 
      border: 'border-red-200', 
      icon: AlertCircle,
      badge: 'bg-red-100 text-red-800 border-red-200'
    },
    processing: { 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      border: 'border-blue-200', 
      icon: Clock,
      badge: 'bg-blue-100 text-blue-800 border-blue-200'
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await userService.requestNsuEmail(formData);
      setTrackingId(result.ticketId);
      setStep('submitted');
      toast.success('Request submitted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast.error('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    try {
      const result = await userService.trackNsuEmailRequest(trackingId);
      setTrackingResult(result);
      toast.success('Request status retrieved successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to fetch request status');
      setTrackingResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const ProgressBar = ({ currentStep }) => {
    const steps = [
      { key: 'form', label: 'Application', number: 1 },
      { key: 'submitted', label: 'Submitted', number: 2 },
      { key: 'track', label: 'Tracking', number: 3 }
    ];
    
    const currentIndex = steps.findIndex(step => step.key === currentStep);
    
    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                currentStep === step.key 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                  : index < currentIndex
                  ? 'bg-green-500 border-green-500 text-white shadow-md'
                  : 'border-gray-300 text-gray-500 bg-white'
              }`}>
                {index < currentIndex ? <CheckCircle className="h-4 w-4" /> : step.number}
              </div>
              <span className={`ml-2 text-sm font-medium transition-colors duration-300 ${
                currentStep === step.key ? 'text-blue-600 font-semibold' : 
                index < currentIndex ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 transition-all duration-500 ${
                index < currentIndex ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      
      {/* LEFT SIDE: Brand & Visuals - Same as Login.js */}
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
            NSU Email <br/> Account Request
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Get your official NSU email account for university communications, 
            LMS access, and academic resources.
          </p>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-8">
            <div className={`flex items-center gap-2 ${step === 'form' ? 'text-white' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'form' ? 'bg-blue-600 border-blue-600' : 'border-slate-400'}`}>
                1
              </div>
              <span className="text-sm font-medium">Application</span>
            </div>
            
            <div className="w-8 h-0.5 bg-slate-600"></div>
            
            <div className={`flex items-center gap-2 ${step === 'submitted' ? 'text-white' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'submitted' ? 'bg-blue-600 border-blue-600' : 'border-slate-400'}`}>
                2
              </div>
              <span className="text-sm font-medium">Submitted</span>
            </div>

            <div className="w-8 h-0.5 bg-slate-600"></div>
            
            <div className={`flex items-center gap-2 ${step === 'track' ? 'text-white' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'track' ? 'bg-blue-600 border-blue-600' : 'border-slate-400'}`}>
                3
              </div>
              <span className="text-sm font-medium">Tracking</span>
            </div>
          </div>
        </div>

        {/* Feature badges */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <Mail className="h-6 w-6 text-blue-400 mb-2" />
            <h3 className="font-semibold">Official Email</h3>
            <p className="text-xs text-slate-400">University communications</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <FileText className="h-6 w-6 text-purple-400 mb-2" />
            <h3 className="font-semibold">Quick Processing</h3>
            <p className="text-xs text-slate-400">24-48 hour turnaround</p>
          </div>
        </div>

        {/* Back to Login */}
        <div className="relative z-10 mt-8">
          <Link
            to="/login"
            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Student Login
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE: Forms - Same layout as Login.js */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-6 lg:p-12 bg-gray-50/50">
        <div className="max-w-md w-full space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 text-white shadow-lg mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 'form' ? 'NSU Email Request' : step === 'submitted' ? 'Request Submitted' : 'Track Request'}
            </h2>
          </div>

          {/* Progress Bar for mobile */}
          <div className="lg:hidden mb-6">
            <ProgressBar currentStep={step} />
          </div>

          <div className="text-left">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight hidden lg:block">
              {step === 'form' ? 'NSU Email Request' : step === 'submitted' ? 'Request Submitted' : 'Track Your Request'}
            </h2>
            <p className="mt-2 text-gray-500">
              {step === 'form' && 'Fill out the form to request your official NSU email account'}
              {step === 'submitted' && 'Your request has been submitted successfully'}
              {step === 'track' && 'Enter your tracking ID to check the status of your request'}
            </p>
          </div>

          {/* Request Form */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-5">
                {/* Full Name */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Full Name *
                  </label>
                  <div className={`relative transition-all duration-300 transform ${activeField === 'name' ? 'scale-[1.02]' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className={`h-5 w-5 transition-colors duration-300 ${activeField === 'name' ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setActiveField('name')}
                      onBlur={() => setActiveField('')}
                      className={`block w-full pl-11 pr-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-0 transition-all duration-300 border-gray-100 hover:border-gray-200`}
                      placeholder="Enter your full name as per admission"
                      required
                    />
                  </div>
                </div>

                {/* Admission Number */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    NSU ID Number *
                  </label>
                  <div className={`relative transition-all duration-300 transform ${activeField === 'admissionNo' ? 'scale-[1.02]' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <BookOpen className={`h-5 w-5 transition-colors duration-300 ${activeField === 'admissionNo' ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      name="admissionNo"
                      value={formData.admissionNo}
                      onChange={handleChange}
                      onFocus={() => setActiveField('admissionNo')}
                      onBlur={() => setActiveField('')}
                      className={`block w-full pl-11 pr-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-0 transition-all duration-300 border-gray-100 hover:border-gray-200`}
                      placeholder="2024123456"
                      required
                    />
                  </div>
                </div>

                {/* Program */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Program/Department *
                  </label>
                  <div className={`relative transition-all duration-300 transform ${activeField === 'program' ? 'scale-[1.02]' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FileText className={`h-5 w-5 transition-colors duration-300 ${activeField === 'program' ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <select
                      name="program"
                      value={formData.program}
                      onChange={handleChange}
                      onFocus={() => setActiveField('program')}
                      onBlur={() => setActiveField('')}
                      className={`block w-full pl-11 pr-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-0 transition-all duration-300 border-gray-100 hover:border-gray-200 appearance-none`}
                      required
                    >
                      <option value="">Select your program</option>
                      {programs.map(program => (
                        <option key={program} value={program}>{program}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Date of Birth *
                  </label>
                  <div className={`relative transition-all duration-300 transform ${activeField === 'dateOfBirth' ? 'scale-[1.02]' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className={`h-5 w-5 transition-colors duration-300 ${activeField === 'dateOfBirth' ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      onFocus={() => setActiveField('dateOfBirth')}
                      onBlur={() => setActiveField('')}
                      className={`block w-full pl-11 pr-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-0 transition-all duration-300 border-gray-100 hover:border-gray-200`}
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Phone Number *
                  </label>
                  <div className={`relative transition-all duration-300 transform ${activeField === 'phone' ? 'scale-[1.02]' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className={`h-5 w-5 transition-colors duration-300 ${activeField === 'phone' ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setActiveField('phone')}
                      onBlur={() => setActiveField('')}
                      className={`block w-full pl-11 pr-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-0 transition-all duration-300 border-gray-100 hover:border-gray-200`}
                      placeholder="+8801XXXXXXXXX"
                      required
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Emergency Contact
                  </label>
                  <div className={`relative transition-all duration-300 transform ${activeField === 'emergencyContact' ? 'scale-[1.02]' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className={`h-5 w-5 transition-colors duration-300 ${activeField === 'emergencyContact' ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      onFocus={() => setActiveField('emergencyContact')}
                      onBlur={() => setActiveField('')}
                      className={`block w-full pl-11 pr-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-0 transition-all duration-300 border-gray-100 hover:border-gray-200`}
                      placeholder="Guardian/Parent phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
                      Processing Request...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Submit Application <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep('track')}
                  className="px-6 py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-blue-500 hover:text-blue-600 transition-all duration-200 flex items-center justify-center hover:shadow-md bg-white"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Track Request
                </button>
              </div>
            </form>
          )}

          {/* Submission Success */}
          {step === 'submitted' && (
            <div className="mt-8 space-y-6">
              <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border-2 border-green-200">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4 animate-pulse" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted Successfully!</h3>
                <p className="text-gray-600 mb-6">
                  Your NSU email request is now under review by the IT department
                </p>

                <div className="bg-white rounded-xl border-2 border-blue-200 p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Your Tracking ID</h4>
                      <p className="text-blue-600 text-sm">Keep this safe for future reference</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(trackingId)}
                      className="flex items-center space-x-2 bg-blue-50 border border-blue-300 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-200"
                    >
                      <Copy className="h-4 w-4" />
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="font-mono text-xl font-bold text-gray-800 tracking-wider text-center">
                      {trackingId}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setStep('track');
                      setTrackingId(trackingId);
                    }}
                    className="w-full bg-gray-900 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center group"
                  >
                    <Search className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    Track This Request Status
                  </button>
                  <button
                    onClick={() => {
                      setStep('form');
                      setFormData({
                        name: '',
                        admissionNo: '',
                        program: '',
                        dateOfBirth: '',
                        phone: '',
                        emergencyContact: ''
                      });
                    }}
                    className="w-full bg-white text-gray-700 py-3.5 px-4 rounded-xl font-medium border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 hover:shadow-md"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Track Request */}
          {step === 'track' && (
            <div className="mt-8 space-y-6">
              <form onSubmit={handleTrack} className="space-y-4">
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Tracking ID
                  </label>
                  <div className={`relative transition-all duration-300 transform ${activeField === 'trackingId' ? 'scale-[1.02]' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className={`h-5 w-5 transition-colors duration-300 ${activeField === 'trackingId' ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                      onFocus={() => setActiveField('trackingId')}
                      onBlur={() => setActiveField('')}
                      className={`block w-full pl-11 pr-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-0 transition-all duration-300 border-gray-100 hover:border-gray-200`}
                      placeholder="NSUEMAIL-XXXXXX"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:transform-none flex items-center justify-center group"
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
                      Track Request <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </form>

              {trackingResult && (
                <div className={`border-2 rounded-2xl p-6 transition-all duration-300 ${
                  statusConfig[trackingResult.status]?.border || 'border-gray-200'
                } ${statusConfig[trackingResult.status]?.bg || 'bg-gray-50'} hover:shadow-lg`}>
                  {/* ... (rest of the tracking result display remains the same as your original code) */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Request Details</h3>
                      <p className="text-gray-600">Ticket ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{trackingResult.ticketId}</span></p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const StatusIcon = statusConfig[trackingResult.status]?.icon || AlertCircle;
                        return <StatusIcon className={`h-5 w-5 ${statusConfig[trackingResult.status]?.color}`} />;
                      })()}
                      <span className={`px-4 py-2 rounded-full font-semibold border transition-all duration-200 ${
                        statusConfig[trackingResult.status]?.badge || 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {trackingResult.status?.charAt(0).toUpperCase() + trackingResult.status?.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <InfoField label="Full Name" value={trackingResult.name} />
                      <InfoField label="Admission Number" value={trackingResult.admissionNo} />
                      <InfoField label="Program" value={trackingResult.program} />
                    </div>
                    <div className="space-y-4">
                      <InfoField label="Date Submitted" value={new Date(trackingResult.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} />
                      <InfoField label="Last Updated" value={new Date(trackingResult.updatedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} />
                      <InfoField label="Contact Phone" value={trackingResult.phone} />
                    </div>
                  </div>

                  {trackingResult.status === 'approved' && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-md">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-green-800 text-lg mb-1 flex items-center">
                            <span className="text-2xl mr-2">🎉</span>
                            Email Account Created!
                          </h4>
                          <p className="text-green-700">Your NSU email is now active and ready to use</p>
                        </div>
                        <ExternalLink className="h-5 w-5 text-green-600 mt-1" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-sm font-medium text-green-700 block mb-2">Email Address</label>
                          <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-green-200">
                            <p className="font-mono text-green-800 font-semibold text-lg flex-1">
                              {trackingResult.generatedEmail}
                            </p>
                            <button
                              onClick={() => copyToClipboard(trackingResult.generatedEmail)}
                              className="text-green-600 hover:text-green-800 transition-colors p-1 hover:bg-green-50 rounded"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-green-700 block mb-2">Temporary Password</label>
                          <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-green-200">
                            <p className="font-mono text-green-800 font-semibold text-lg flex-1">
                              {trackingResult.tempPassword}
                            </p>
                            <button
                              onClick={() => copyToClipboard(trackingResult.tempPassword)}
                              className="text-green-600 hover:text-green-800 transition-colors p-1 hover:bg-green-50 rounded"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 text-sm flex items-start">
                          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                          <span>For security reasons, please change your password immediately after first login. Keep your credentials confidential.</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {trackingResult.notes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 transition-all duration-200 hover:shadow-sm">
                      <h5 className="font-semibold text-blue-800 mb-1 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Administrator Notes
                      </h5>
                      <p className="text-blue-700">{trackingResult.notes}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={() => setStep('form')}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-all duration-200 flex items-center justify-center mx-auto group"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Submit New Email Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for info fields
const InfoField = ({ label, value }) => (
  <div className="bg-white/50 rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors duration-200">
    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">{label}</span>
    <p className="text-gray-900 font-semibold text-sm">{value}</p>
  </div>
);

export default NsuEmailRequest;