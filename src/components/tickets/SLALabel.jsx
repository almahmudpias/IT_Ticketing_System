import React from 'react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { calculateSLAStatus, formatSLA } from '../../utils/sla';

const SLALabel = ({ ticket }) => {
  const slaStatus = calculateSLAStatus(ticket);

  const getSLAClassName = () => {
    switch (slaStatus.status) {
      case 'breached':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getIcon = () => {
    switch (slaStatus.status) {
      case 'breached':
        return <AlertTriangle className="h-3 w-3" />;
      case 'warning':
        return <Clock className="h-3 w-3" />;
      case 'resolved':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getLabel = () => {
    switch (slaStatus.status) {
      case 'breached':
        return 'SLA Breached';
      case 'warning':
        return `${formatSLA(slaStatus.hoursLeft)} left`;
      case 'resolved':
        return 'Resolved';
      default:
        return `${formatSLA(slaStatus.hoursLeft)} left`;
    }
  };

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getSLAClassName()}`}>
      {getIcon()}
      <span>{getLabel()}</span>
    </div>
  );
};

export default SLALabel;