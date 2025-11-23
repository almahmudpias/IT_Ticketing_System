export const priorities = [
  { value: 'low', label: 'Low', color: 'green', slaHours: 24 },
  { value: 'medium', label: 'Medium', color: 'yellow', slaHours: 8 },
  { value: 'high', label: 'High', color: 'orange', slaHours: 4 },
  { value: 'critical', label: 'Critical', color: 'red', slaHours: 2 }
];

export const getPriorityConfig = (priority) => {
  return priorities.find(p => p.value === priority) || priorities[1]; // Default to medium
};

export const calculateDueDate = (createdAt, priority) => {
  const config = getPriorityConfig(priority);
  const dueDate = new Date(createdAt);
  dueDate.setHours(dueDate.getHours() + config.slaHours);
  return dueDate;
};

// Enhanced priority calculation based on user role and type
export const calculateAutoPriority = (user, category, isLabRelated = false) => {
  // Lab-related issues get higher priority
  if (isLabRelated) {
    return 'high';
  }

  // Priority based on user role and type
  switch (user.role) {
    case 'faculty':
      switch (user.type) {
        case 'dean':
        case 'department_chair':
          return 'critical';
        case 'professor':
          return 'high';
        case 'assistant_professor':
        case 'lecturer':
          return 'medium';
        default:
          return 'medium';
      }
    
    case 'lab_instructor':
      return 'high'; // Lab issues are high priority
    
    case 'staff':
      if (user.type === 'administrative_staff') {
        return 'medium';
      }
      return 'low';
    
    case 'student':
      if (user.type === 'fresher_student') {
        return 'medium'; // Freshers get medium priority for onboarding issues
      }
      return 'low';
    
    default:
      return 'medium';
  }
};

// Get user priority level for display
export const getUserPriorityLevel = (user) => {
  if (!user) return 'standard';
  
  switch (user.role) {
    case 'faculty':
      switch (user.type) {
        case 'dean':
        case 'department_chair':
          return 'critical';
        case 'professor':
          return 'high';
        default:
          return 'medium';
      }
    
    case 'lab_instructor':
      return 'high';
    
    case 'staff':
      return 'medium';
    
    case 'student':
      return user.type === 'fresher_student' ? 'medium' : 'low';
    
    default:
      return 'standard';
  }
};