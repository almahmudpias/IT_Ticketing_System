import React, { useState, useEffect } from 'react';
import { useTickets } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import { Beaker, Computer, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const LabInstructorDashboard = () => {
  const { user } = useAuth();
  const { tickets, fetchTickets } = useTickets();
  const [labTickets, setLabTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0,
    urgent: 0
  });

  useEffect(() => {
    // Filter lab-related tickets
    const labRelatedTickets = tickets.filter(ticket => 
      ticket.category === 'lab_software' || 
      ticket.category === 'lab_requisition' ||
      (ticket.labName && ticket.labName.includes('lab'))
    );
    
    setLabTickets(labRelatedTickets);

    // Calculate stats
    setStats({
      total: labRelatedTickets.length,
      open: labRelatedTickets.filter(t => !['resolved', 'closed'].includes(t.status)).length,
      resolved: labRelatedTickets.filter(t => t.status === 'resolved').length,
      urgent: labRelatedTickets.filter(t => t.priority === 'high' || t.priority === 'critical').length
    });
  }, [tickets]);

  const getLabTicketsByType = (type) => {
    return labTickets.filter(ticket => ticket.category === type);
  };

  return (
    <div className="lab-instructor-dashboard">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Lab Management Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome, {user.name} - {user.department} Lab
        </p>
      </div>

      {/* Lab Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Lab Issues</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Beaker className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Issues</p>
              <p className="text-2xl font-bold text-orange-600">{stats.open}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgent</p>
              <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
            </div>
            <Clock className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Lab Issues by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Software Issues */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold flex items-center">
              <Computer className="h-5 w-5 mr-2 text-blue-600" />
              Lab Software Issues
            </h3>
          </div>
          <div className="card-body">
            {getLabTicketsByType('lab_software').length === 0 ? (
              <p className="text-gray-500 text-center py-4">No software issues reported</p>
            ) : (
              <div className="space-y-3">
                {getLabTicketsByType('lab_software').slice(0, 5).map(ticket => (
                  <div key={ticket.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{ticket.softwareName}</h4>
                      <span className={`priority-badge priority-${ticket.priority}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ticket.labName}</p>
                    <p className="text-xs text-gray-500">{ticket.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Requisitions */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold flex items-center">
              <Beaker className="h-5 w-5 mr-2 text-green-600" />
              Lab Requisitions
            </h3>
          </div>
          <div className="card-body">
            {getLabTicketsByType('lab_requisition').length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending requisitions</p>
            ) : (
              <div className="space-y-3">
                {getLabTicketsByType('lab_requisition').slice(0, 5).map(ticket => (
                  <div key={ticket.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{ticket.requisitionType}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        ticket.requisitionUrgency === 'critical' ? 'bg-red-100 text-red-800' :
                        ticket.requisitionUrgency === 'urgent' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {ticket.requisitionUrgency}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ticket.labName}</p>
                    <p className="text-xs text-gray-500">{ticket.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabInstructorDashboard;