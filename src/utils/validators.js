export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  nsuEmail: (email) => {
    const nsuEmailRegex = /^[a-zA-Z0-9._%+-]+@northsouth\.edu$/;
    return nsuEmailRegex.test(email);
  },

  required: (value) => {
    return value && value.toString().trim().length > 0;
  },

  minLength: (value, min) => {
    return value && value.toString().length >= min;
  },

  maxLength: (value, max) => {
    return value && value.toString().length <= max;
  },

  phone: (phone) => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  },

  assetId: (assetId) => {
    const assetRegex = /^[A-Z0-9]{3,}-[A-Z0-9]{3,}$/;
    return assetRegex.test(assetId);
  }
};

export const validateTicketForm = (formData) => {
  const errors = {};

  if (!validators.required(formData.title)) {
    errors.title = 'Title is required';
  }

  if (!validators.required(formData.category)) {
    errors.category = 'Category is required';
  }

  if (!validators.required(formData.description)) {
    errors.description = 'Description is required';
  }

  if (formData.description && formData.description.length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  }

  if (formData.category === 'hardware' && !validators.required(formData.assetId)) {
    errors.assetId = 'Asset ID is required for hardware issues';
  }

  if (formData.category === 'software' && !validators.required(formData.osVersion)) {
    errors.osVersion = 'OS Version is required for software issues';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};