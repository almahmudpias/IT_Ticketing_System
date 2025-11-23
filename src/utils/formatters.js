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