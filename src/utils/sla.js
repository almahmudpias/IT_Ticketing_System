import { format, differenceInHours, parseISO } from 'date-fns';

export const slaConfig = {
  critical: 2,    // 2 hours
  high: 4,        // 4 hours
  medium: 8,      // 8 hours
  low: 24         // 24 hours
};

export const calculateSLAStatus = (ticket) => {
  if (ticket.status === 'resolved' || ticket.status === 'closed') {
    return { status: 'resolved', color: 'green' };
  }

  const created = parseISO(ticket.createdAt);
  const now = new Date();
  const hoursPassed = differenceInHours(now, created);
  
  const slaHours = slaConfig[ticket.priority] || slaConfig.medium;
  const hoursLeft = slaHours - hoursPassed;

  if (hoursLeft <= 0) {
    return { status: 'breached', color: 'red', hoursLeft: 0 };
  } else if (hoursLeft <= 1) {
    return { status: 'warning', color: 'yellow', hoursLeft };
  } else {
    return { status: 'normal', color: 'green', hoursLeft };
  }
};

export const formatSLA = (hoursLeft) => {
  if (hoursLeft <= 0) {
    return 'Breached';
  }
  
  if (hoursLeft < 1) {
    const minutes = Math.ceil(hoursLeft * 60);
    return `${minutes}m`;
  }
  
  return `${Math.ceil(hoursLeft)}h`;
};

export const getPriorityColor = (priority) => {
  const colors = {
    critical: 'red',
    high: 'orange',
    medium: 'yellow',
    low: 'green'
  };
  return colors[priority] || 'gray';
};