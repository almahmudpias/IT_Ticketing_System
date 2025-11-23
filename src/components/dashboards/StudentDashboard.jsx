import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTickets } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import { Plus, Clock, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { formatRelativeTime, formatStatus } from '../../utils/formatters';
import { calculateSLAStatus } from '../../utils/sla';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { tickets, fetchTickets } = useTickets();
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0,
    overdue: 0
  });

  useEffect(() => {
    fetchTickets({ submittedBy: user.id });
  }, [user.id]);

  useEffect(() => {
    if (tickets.length > 0) {
      const openTickets = tickets.filter(t => 
        t.status !== 'resolved' && t.status !== 'closed'
      );
      const resolvedTickets = tickets.filter(t => 
        t.status === 'resolved' || t.status === 'closed'
      );
      const overdueTickets = tickets.filter(t => {
        const sla = calculateSLAStatus(t);
        return sla.status === 'breached' && t.status !== 'resolved' && t.status !== 'closed';
      });

      setStats({
        total: tickets.length,
        open: openTickets.length,
        resolved: resolvedTickets.length,
        overdue: overdueTickets.length
      });
    }
  }, [tickets]);

  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="student-dashboard">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600">
          Here's your IT support ticket overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <Link
          to="/create-ticket"
          className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="h-5 w-5" />
          <span>Create New Ticket</span>
        </Link>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {recentTickets.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
              <p className="text-gray-600 mb-4">Create your first support ticket to get help</p>
              <Link
                to="/create-ticket"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Create Ticket</span>
              </Link>
            </div>
          ) : (
            recentTickets.map(ticket => (
              <div key={ticket.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">
                        <Link 
                          to={`/ticket/${ticket.id}`}
                          className="hover:text-blue-600"
                        >
                          {ticket.title}
                        </Link>
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>#{ticket.id}</span>
                      <span>{formatStatus(ticket.status)}</span>
                      <span>{formatRelativeTime(ticket.createdAt)}</span>
                      <span>{ticket.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <SLALabel ticket={ticket} />
                    <Link
                      to={`/ticket/${ticket.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {tickets.length > 5 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Link
              to="/tickets"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View all tickets →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;