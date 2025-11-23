import React, { useState } from 'react';
import { X, Users, MessageCircle, Tag, Clock } from 'lucide-react';

const BulkActionsPanel = ({ selectedCount, onBulkAction, onClearSelection }) => {
  const [showActions, setShowActions] = useState(false);

  const statusOptions = [
    { value: 'assigned', label: 'Assign' },
    { value: 'in_progress', label: 'Start Progress' },
    { value: 'pending_user', label: 'Wait for User' },
    { value: 'resolved', label: 'Resolve' },
    { value: 'closed', label: 'Close' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const handleAction = (action, value) => {
    onBulkAction(action, value);
    setShowActions(false);
  };

  return (
    <div className="bulk-actions-panel bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium">
              {selectedCount}
            </div>
            <span className="font-medium text-blue-900">
              {selectedCount} ticket{selectedCount > 1 ? 's' : ''} selected
            </span>
          </div>

          <button
            onClick={onClearSelection}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
          >
            <X className="h-4 w-4" />
            <span>Clear selection</span>
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Bulk Actions
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-2">
                {/* Status Update */}
                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Update Status
                  </label>
                  <select
                    onChange={(e) => handleAction('update', { status: e.target.value })}
                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Update */}
                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Update Priority
                  </label>
                  <select
                    onChange={(e) => handleAction('update', { priority: e.target.value })}
                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Priority</option>
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assign to */}
                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Assign to Team
                  </label>
                  <select
                    onChange={(e) => handleAction('assign', { assigneeId: e.target.value })}
                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Team</option>
                    <option value="hardware">Hardware Team</option>
                    <option value="software">Software Team</option>
                    <option value="network">Network Team</option>
                    <option value="helpdesk">Help Desk</option>
                  </select>
                </div>

                {/* Add Note */}
                <button
                  onClick={() => {
                    const note = prompt('Add a note to all selected tickets:');
                    if (note) {
                      handleAction('update', { internalNote: note });
                    }
                  }}
                  className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Add Internal Note</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-2 mt-3">
        <button
          onClick={() => handleAction('update', { status: 'resolved' })}
          className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
        >
          <Tag className="h-3 w-3" />
          <span>Resolve All</span>
        </button>

        <button
          onClick={() => handleAction('update', { priority: 'high' })}
          className="flex items-center space-x-1 px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
        >
          <Clock className="h-3 w-3" />
          <span>Mark High Priority</span>
        </button>

        <button
          onClick={() => {
            const team = prompt('Enter team name to assign:');
            if (team) {
              handleAction('assign', { assigneeId: team });
            }
          }}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          <Users className="h-3 w-3" />
          <span>Assign to Team</span>
        </button>
      </div>
    </div>
  );
};

export default BulkActionsPanel;