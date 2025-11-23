import React from 'react';
import { formatRelativeTime, formatStatus, formatPriority } from '../../utils/formatters';
import { calculateSLAStatus } from '../../utils/sla';
import { User, Clock, AlertTriangle } from 'lucide-react';

const TicketCard = ({ ticket, isSelected, onSelect, onUpdate }) => {
  const slaStatus = calculateSLAStatus(ticket);
  
  const handleStatusChange = async (newStatus) => {
    try {
      await onUpdate(ticket.id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-gray-100 text-gray-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      pending_user: 'bg-orange-100 text-orange-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.new;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div 
      className={`ticket-card bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'
      }`}
      onClick={() => onSelect(ticket.id)}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(ticket.id)}
              onClick={(e) => e.stopPropagation()}
              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <h3 className="font-semibold text-gray-900 line-clamp-2">
              {ticket.title}
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
              {formatPriority(ticket.priority)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
              {formatStatus(ticket.status)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {ticket.submittedByName}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatRelativeTime(ticket.createdAt)}
            </span>
          </div>
          
          <div className={`flex items-center ${slaStatus.color === 'red' ? 'text-red-600' : slaStatus.color === 'yellow' ? 'text-yellow-600' : 'text-green-600'}`}>
            {slaStatus.color === 'red' && <AlertTriangle className="h-4 w-4 mr-1" />}
            <span className="text-xs font-medium">
              SLA: {slaStatus.status === 'breached' ? 'Breached' : `${slaStatus.hoursLeft}h`}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
          {ticket.description}
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div>
            <span className="font-medium">Category:</span> {ticket.category}
          </div>
          <div>
            <span className="font-medium">Building:</span> {ticket.building || 'N/A'}
          </div>
          {ticket.assetId && (
            <div>
              <span className="font-medium">Asset ID:</span> {ticket.assetId}
            </div>
          )}
          {ticket.assignee && (
            <div>
              <span className="font-medium">Assigned to:</span> {ticket.assignee}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            #{ticket.id}
          </span>
          
          {/* Quick Actions */}
          <div className="flex space-x-1">
            {ticket.status === 'new' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange('in_progress');
                }}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Start
              </button>
            )}
            
            {ticket.status === 'in_progress' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange('pending_user');
                }}
                className="px-2 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700"
              >
                Wait User
              </button>
            )}
            
            {['assigned', 'in_progress', 'pending_user'].includes(ticket.status) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange('resolved');
                }}
                className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                Resolve
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;