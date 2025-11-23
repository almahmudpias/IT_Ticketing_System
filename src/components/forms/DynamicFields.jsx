import React from 'react';

const DynamicFields = ({ formData, onChange, errors = {} }) => {
  const hardwareSubcategories = [
    'Laptop/Desktop',
    'Printer/Scanner',
    'Monitor',
    'Keyboard/Mouse',
    'Network Equipment',
    'Other Hardware'
  ];

  const softwareSubcategories = [
    'Operating System',
    'Microsoft Office',
    'Specialized Software',
    'Antivirus',
    'Browser Issues',
    'Other Software'
  ];

  const networkSubcategories = [
    'Wi-Fi Connectivity',
    'Ethernet Connection',
    'VPN Access',
    'Network Drives',
    'Internet Speed',
    'Other Network'
  ];

  const getSubcategories = () => {
    switch (formData.category) {
      case 'hardware':
        return hardwareSubcategories;
      case 'software':
        return softwareSubcategories;
      case 'network':
        return networkSubcategories;
      default:
        return [];
    }
  };

  const subcategories = getSubcategories();

  if (!formData.category) {
    return null;
  }

  return (
    <div className="form-section">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Additional Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subcategory */}
        {subcategories.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Subcategory
            </label>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Subcategory</option>
              {subcategories.map(subcat => (
                <option key={subcat} value={subcat}>
                  {subcat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Hardware-specific fields */}
        {formData.category === 'hardware' && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Asset ID *
            </label>
            <input
              type="text"
              name="assetId"
              value={formData.assetId}
              onChange={onChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.assetId ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., NSU-LAP-12345"
            />
            {errors.assetId && (
              <p className="mt-1 text-sm text-red-600">{errors.assetId}</p>
            )}
          </div>
        )}

        {/* Software-specific fields */}
        {formData.category === 'software' && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              OS Version *
            </label>
            <select
              name="osVersion"
              value={formData.osVersion}
              onChange={onChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.osVersion ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select OS Version</option>
              <option value="windows-10">Windows 10</option>
              <option value="windows-11">Windows 11</option>
              <option value="macos-monterey">macOS Monterey</option>
              <option value="macos-ventura">macOS Ventura</option>
              <option value="linux-ubuntu">Linux Ubuntu</option>
              <option value="other">Other</option>
            </select>
            {errors.osVersion && (
              <p className="mt-1 text-sm text-red-600">{errors.osVersion}</p>
            )}
          </div>
        )}

        {/* Network-specific fields */}
        {formData.category === 'network' && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Device Type
            </label>
            <select
              name="deviceType"
              value={formData.deviceType}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Device Type</option>
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile Phone</option>
              <option value="tablet">Tablet</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}

        {/* RDS/ERP specific fields */}
        {formData.category === 'rds_erp' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                System Module
              </label>
              <select
                name="systemModule"
                value={formData.systemModule}
                onChange={onChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Module</option>
                <option value="student_portal">Student Portal</option>
                <option value="faculty_portal">Faculty Portal</option>
                <option value="finance">Finance</option>
                <option value="hr">Human Resources</option>
                <option value="registration">Registration</option>
                <option value="grades">Grades</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Error Code (if any)
              </label>
              <input
                type="text"
                name="errorCode"
                value={formData.errorCode}
                onChange={onChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., ERR-404, SQL-1001"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DynamicFields;