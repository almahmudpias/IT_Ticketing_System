import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (dateString, formatStr = 'MMM dd, yyyy HH:mm') => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), formatStr);
  } catch {
    return 'Invalid Date';
  }
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return 'Invalid Date';
  }
};

export const formatDuration = (minutes) => {
  if (!minutes) return '0m';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatStatus = (status) => {
  const statusMap = {
    new: 'New',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    pending_user: 'Pending User',
    resolved: 'Resolved',
    closed: 'Closed'
  };
  return statusMap[status] || capitalize(status);
};

export const formatPriority = (priority) => {
  const priorityMap = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical'
  };
  return priorityMap[priority] || capitalize(priority);
};

export const priorities = [
  { value: 'low', label: 'Low', color: 'green', slaHours: 24 },
  { value: 'medium', label: 'Medium', color: 'yellow', slaHours: 8 },
  { value: 'high', label: 'High', color: 'orange', slaHours: 4 },
  { value: 'critical', label: 'Critical', color: 'red', slaHours: 2 }
];

export const getPriorityConfig = (priority) => {
  return priorities.find(p => p.value === priority) || priorities[1];
};

export const calculateDueDate = (createdAt, priority) => {
  const config = getPriorityConfig(priority);
  const dueDate = new Date(createdAt);
  dueDate.setHours(dueDate.getHours() + config.slaHours);
  return dueDate;
};

export const calculateAutoPriority = (user, category, isLabRelated = false) => {
  if (isLabRelated) {
    return 'high';
  }

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
      return 'high';
    
    case 'staff':
      if (user.type === 'administrative_staff') {
        return 'medium';
      }
      return 'low';
    
    case 'student':
      if (user.type === 'fresher_student') {
        return 'medium';
      }
      return 'low';
    
    default:
      return 'medium';
  }
};

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