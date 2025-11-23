import React, { useState, useEffect } from 'react';
import { ticketService } from '../../services/ticketService';
import DynamicFields from './DynamicFields';
import SmartSuggestions from './SmartSuggestions';
import { useAuth } from '../../context/AuthContext';
import { validateTicketForm } from '../../utils/validators';
import toast from 'react-hot-toast';

const TicketForm = ({ onSubmit, initialData = {}, mode = 'create' }) => {
  const { user } = useAuth();
  
  // Initialize state including new lab-specific fields
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    priority: 'medium',
    description: '',
    assetId: '',
    osVersion: '',
    building: '',
    room: '',
    contactMethod: 'email',
    // New fields for Lab/Requisition
    labName: '',
    softwareName: '',
    labIssueType: '',
    requisitionType: '',
    requisitionUrgency: 'normal',
    ...initialData
  });

  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [errors, setErrors] = useState({});

  // Updated Categories Array
  const categories = [
    { value: 'hardware', label: 'Hardware' },
    { value: 'software', label: 'Software' },
    { value: 'network', label: 'Network' },
    { value: 'account', label: 'Account Access' },
    { value: 'rds_erp', label: 'RDS/ERP' },
    { value: 'lab_software', label: 'Lab Software' },     // Added
    { value: 'lab_requisition', label: 'Lab Requisition' }, // Added
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'green' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'critical', label: 'Critical', color: 'red' }
  ];

  const buildings = [
    'Admin Building', 'North Tower', 'South Tower', 'East Wing', 
    'West Wing', 'Library', 'Science Building', 'Engineering Building'
  ];

  const contactMethods = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'teams', label: 'Microsoft Teams' },
    { value: 'in_person', label: 'In Person' }
  ];

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData);
    }
  }, [mode, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Trigger smart suggestions for description
    if (name === 'description' && value.length > 10) {
      fetchSuggestions(value);
    }
  };

  const fetchSuggestions = async (text) => {
    try {
      // Common solutions database
      const commonIssues = {
        'internet slow': [
          'Reset NSU proxy settings',
          'Check Wi-Fi connection',
          'Restart router',
          'Move closer to access point'
        ],
        'password reset': [
          'Use self-service password reset at password.northsouth.edu',
          'Contact IT help desk with your NSU ID',
          'Visit IT office in person with ID card'
        ],
        'software installation': [
          'Check software center for available applications',
          'Request admin access through IT portal',
          'Contact software support team'
        ],
        'email issue': [
          'Check Outlook settings and connectivity',
          'Verify internet connection',
          'Clear browser cache for webmail',
          'Check email forwarding settings'
        ],
        'printer': [
          'Check printer network connection',
          'Verify printer driver installation',
          'Clear print queue and restart spooler',
          'Check paper and toner levels'
        ]
      };

      const matchedSuggestions = [];
      Object.keys(commonIssues).forEach(issue => {
        if (text.toLowerCase().includes(issue)) {
          matchedSuggestions.push(...commonIssues[issue]);
        }
      });

      setSuggestions(matchedSuggestions.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      description: prev.description + `\n\nSuggested solution: ${suggestion}`
    }));
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateTicketForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);

    try {
      const ticketData = {
        ...formData,
        submittedBy: user.id,
        submittedByEmail: user.email,
        submittedByName: user.name,
        department: user.department
      };

      await onSubmit(ticketData);
      
      if (mode === 'create') {
        setFormData({
          title: '',
          category: '',
          subcategory: '',
          priority: 'medium',
          description: '',
          assetId: '',
          osVersion: '',
          building: '',
          room: '',
          contactMethod: 'email',
          labName: '',
          softwareName: '',
          labIssueType: '',
          requisitionType: '',
          requisitionUrgency: 'normal'
        });
      }
      
      setErrors({});
    } catch (error) {
      console.error('Failed to submit ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClassName = "block text-sm font-medium mb-2 text-gray-700";

  return (
    <div className="ticket-form-container bg-white rounded-lg shadow-sm border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {/* Basic Information */}
        <div className="form-section">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClassName}>
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className={`${inputClassName} ${errors.title ? 'border-red-300' : ''}`}
                placeholder="Brief description of the issue"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className={labelClassName}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className={`${inputClassName} ${errors.category ? 'border-red-300' : ''}`}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            <div>
              <label className={labelClassName}>
                Priority *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                required
                className={inputClassName}
              >
                {priorities.map(pri => (
                  <option key={pri.value} value={pri.value}>
                    {pri.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClassName}>
                Building
              </label>
              <select
                name="building"
                value={formData.building}
                onChange={handleInputChange}
                className={inputClassName}
              >
                <option value="">Select Building</option>
                {buildings.map(building => (
                  <option key={building} value={building}>
                    {building}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Fields - Existing Component */}
        <DynamicFields 
          formData={formData} 
          onChange={handleInputChange}
          errors={errors}
        />

        {/* Lab Software Specific Fields */}
        {formData.category === 'lab_software' && (
          <div className="form-section bg-blue-50 p-4 rounded-lg border border-blue-100">
             <h4 className="text-md font-medium mb-3 text-blue-900">Lab Software Details</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClassName}>Lab Name *</label>
                  <select
                    name="labName"
                    value={formData.labName}
                    onChange={handleInputChange}
                    className={inputClassName}
                    required
                  >
                    <option value="">Select Lab</option>
                    <option value="computer_lab_1">Computer Lab 1 (Level 4)</option>
                    <option value="computer_lab_2">Computer Lab 2 (Level 4)</option>
                    <option value="engineering_lab">Engineering Lab (Level 3)</option>
                    <option value="physics_lab">Physics Lab (Level 2)</option>
                    <option value="chemistry_lab">Chemistry Lab (Level 2)</option>
                    <option value="research_lab">Research Lab (Level 5)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClassName}>Software Name *</label>
                  <input
                    type="text"
                    name="softwareName"
                    value={formData.softwareName}
                    onChange={handleInputChange}
                    className={inputClassName}
                    placeholder="e.g., MATLAB, AutoCAD, Visual Studio"
                    required
                  />
                </div>
                <div>
                  <label className={labelClassName}>Issue Type</label>
                  <select
                    name="labIssueType"
                    value={formData.labIssueType}
                    onChange={handleInputChange}
                    className={inputClassName}
                  >
                    <option value="">Select Issue Type</option>
                    <option value="installation">Software Installation</option>
                    <option value="update">Software Update</option>
                    <option value="license">License Issue</option>
                    <option value="crash">Software Crash</option>
                    <option value="performance">Performance Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
             </div>
          </div>
        )}

        {/* Lab Requisition Specific Fields */}
        {formData.category === 'lab_requisition' && (
          <div className="form-section bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h4 className="text-md font-medium mb-3 text-indigo-900">Requisition Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClassName}>Requisition Type *</label>
                <select
                  name="requisitionType"
                  value={formData.requisitionType}
                  onChange={handleInputChange}
                  className={inputClassName}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="software_request">Software Request</option>
                  <option value="hardware_request">Hardware Request</option>
                  <option value="maintenance">Lab Maintenance</option>
                  <option value="supplies">Lab Supplies</option>
                  <option value="equipment">Equipment Setup</option>
                </select>
              </div>
              <div>
                <label className={labelClassName}>Lab Name *</label>
                <select
                  name="labName"
                  value={formData.labName}
                  onChange={handleInputChange}
                  className={inputClassName}
                  required
                >
                  <option value="">Select Lab</option>
                  <option value="computer_lab_1">Computer Lab 1</option>
                  <option value="computer_lab_2">Computer Lab 2</option>
                  <option value="engineering_lab">Engineering Lab</option>
                  <option value="physics_lab">Physics Lab</option>
                  <option value="chemistry_lab">Chemistry Lab</option>
                </select>
              </div>
              <div>
                <label className={labelClassName}>Urgency Level</label>
                <select
                  name="requisitionUrgency"
                  value={formData.requisitionUrgency}
                  onChange={handleInputChange}
                  className={inputClassName}
                >
                  <option value="normal">Normal (Within 2 weeks)</option>
                  <option value="urgent">Urgent (Within 1 week)</option>
                  <option value="critical">Critical (Within 48 hours)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Description with Smart Suggestions */}
        <div className="form-section">
          <label className={labelClassName}>
            Description *
          </label>
          <div className="relative">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={6}
              className={`${inputClassName} ${errors.description ? 'border-red-300' : ''}`}
              placeholder="Please provide detailed information about the issue. Include error messages, steps to reproduce, and what you were trying to accomplish."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            
            {/* Smart Suggestions */}
            <SmartSuggestions 
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="form-section">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClassName}>
                Room Number
              </label>
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                className={inputClassName}
                placeholder="e.g., 405A, Lab-3B"
              />
            </div>

            <div>
              <label className={labelClassName}>
                Preferred Contact Method
              </label>
              <select
                name="contactMethod"
                value={formData.contactMethod}
                onChange={handleInputChange}
                className={inputClassName}
              >
                {contactMethods.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : mode === 'create' ? 'Submit Ticket' : 'Update Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;