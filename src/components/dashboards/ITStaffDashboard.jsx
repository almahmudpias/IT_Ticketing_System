import React, { useState, useEffect } from 'react';
import { useTickets } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import KanbanBoard from '../tickets/KanbanBoard';
import { Filter, RefreshCw, User, Clock, AlertTriangle } from 'lucide-react';

const ITStaffDashboard = () => {
  const { user } = useAuth();
  const { 
    tickets, 
    selectedTickets, 
    filters, 
    setFilters, 
    toggleTicketSelection, 
    selectAllTickets,
    fetchTickets
  } = useTickets();

  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Filter tickets assigned to current user
    const assignedToMe = tickets.filter(ticket => 
      ticket.assigneeId === user.id || 
      ticket.assignee === user.name
    );
    setMyTickets(assignedToMe);
  }, [tickets, user]);

  const handleTicketUpdate = async (ticketId, updates) => {
    try {
      await ticketService.updateTicket(ticketId, updates);
      fetchTickets(filters);
    } catch (error) {
      console.error('Failed to update ticket:', error);
    }
  };

  const assignedStats = {
    total: myTickets.length,
    inProgress: myTickets.filter(t => t.status === 'in_progress').length,
    pending: myTickets.filter(t => t.status === 'pending_user').length,
    overdue: myTickets.filter(t => {
      const created = new Date(t.createdAt);
      const now = new Date();
      const hoursPassed = (now - created) / (1000 * 60 * 60);
      const slaHours = { critical: 2, high: 4, medium: 8, low: 24 }[t.priority] || 8;
      return hoursPassed > slaHours && !['resolved', 'closed'].includes(t.status);
    }).length
  };

  return (
    <div className="it-staff-dashboard">
      {/* Header */}
      <div className="dashboard-header mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">IT Staff Dashboard</h1>
            <p className="text-gray-600">Manage your assigned tickets and workload</p>
          </div>
          <button
            onClick={() => fetchTickets(filters)}
            disabled={loading}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* My Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Assigned to Me</div>
              <div className="text-2xl font-bold text-gray-900">{assignedStats.total}</div>
            </div>
            <User className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">In Progress</div>
              <div className="text-2xl font-bold text-orange-600">{assignedStats.inProgress}</div>
            </div>
            <RefreshCw className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Waiting for User</div>
              <div className="text-2xl font-bold text-yellow-600">{assignedStats.pending}</div>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Overdue</div>
              <div className="text-2xl font-bold text-red-600">{assignedStats.overdue}</div>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* My Tickets Kanban */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Assigned Tickets</h2>
          <span className="text-sm text-gray-600">{myTickets.length} tickets</span>
        </div>
        
        {myTickets.length > 0 ? (
          <KanbanBoard
            tickets={myTickets}
            selectedTickets={selectedTickets}
            onTicketSelect={toggleTicketSelection}
            onSelectAll={selectAllTickets}
            onTicketUpdate={handleTicketUpdate}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets assigned</h3>
            <p className="text-gray-600">You don't have any tickets assigned to you yet.</p>
          </div>
        )}
      </div>

      {/* All Tickets View */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">All Team Tickets</h2>
          
          {/* Filters */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filters.category || ''}
              onChange={(e) => setFilters({ category: e.target.value })}
              className="p-2 border border-gray-300 rounded text-sm"
            >
              <option value="">All Categories</option>
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="network">Network</option>
              <option value="account">Account</option>
            </select>
            
            <select
              value={filters.priority || ''}
              onChange={(e) => setFilters({ priority: e.target.value })}
              className="p-2 border border-gray-300 rounded text-sm"
            >
              <option value="">All Priority</option>
              <option value="high">High & Critical</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <KanbanBoard
          tickets={tickets}
          selectedTickets={selectedTickets}
          onTicketSelect={toggleTicketSelection}
          onSelectAll={selectAllTickets}
          onTicketUpdate={handleTicketUpdate}
        />
      </div>
    </div>
  );
};

export default ITStaffDashboard;