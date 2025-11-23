import React, { useState, useEffect } from 'react';
import { useTickets } from '../../context/TicketContext';
import { ticketService } from '../../services/ticketService';
import KanbanBoard from '../tickets/KanbanBoard';
import BulkActionsPanel from '../tickets/BulkActionsPanel';
import { Filter, Download, RefreshCw, BarChart3, Users, Clock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const FrontDeskDashboard = () => {
  const { 
    tickets, 
    selectedTickets, 
    filters, 
    setFilters, 
    toggleTicketSelection, 
    selectAllTickets,
    fetchTickets,
    bulkUpdateTickets
  } = useTickets();

  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    assigned: 0,
    inProgress: 0,
    overdue: 0
  });

  useEffect(() => {
    calculateStats();
  }, [tickets]);

  const calculateStats = () => {
    const newTickets = tickets.filter(t => t.status === 'new');
    const assignedTickets = tickets.filter(t => t.status === 'assigned');
    const inProgressTickets = tickets.filter(t => t.status === 'in_progress');
    const overdueTickets = tickets.filter(t => {
      const created = new Date(t.createdAt);
      const now = new Date();
      const hoursPassed = (now - created) / (1000 * 60 * 60);
      
      const slaHours = {
        critical: 2,
        high: 4,
        medium: 8,
        low: 24
      }[t.priority] || 8;
      
      return hoursPassed > slaHours && !['resolved', 'closed'].includes(t.status);
    });

    setStats({
      total: tickets.length,
      new: newTickets.length,
      assigned: assignedTickets.length,
      inProgress: inProgressTickets.length,
      overdue: overdueTickets.length
    });
  };

  const handleBulkAction = async (action, updates) => {
    try {
      if (action === 'update') {
        await bulkUpdateTickets(Array.from(selectedTickets), updates);
      } else if (action === 'assign') {
        // Handle bulk assignment
        for (const ticketId of selectedTickets) {
          await ticketService.assignTicket(ticketId, updates.assigneeId);
        }
        toast.success(`Assigned ${selectedTickets.size} tickets`);
      }
      
      fetchTickets(filters);
    } catch (error) {
      toast.error('Failed to perform bulk action');
    }
  };

  const handleTicketUpdate = async (ticketId, updates) => {
    try {
      await ticketService.updateTicket(ticketId, updates);
      fetchTickets(filters);
    } catch (error) {
      toast.error('Failed to update ticket');
    }
  };

  const exportTickets = () => {
    // Simple CSV export
    const headers = ['ID', 'Title', 'Status', 'Priority', 'Category', 'Submitted By', 'Created At'];
    const csvData = tickets.map(ticket => [
      ticket.id,
      ticket.title,
      ticket.status,
      ticket.priority,
      ticket.category,
      ticket.submittedByName,
      new Date(ticket.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nsu-tickets-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="front-desk-dashboard">
      {/* Header */}
      <div className="dashboard-header mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Front Desk Dashboard</h1>
            <p className="text-gray-600">Manage and monitor all IT support tickets</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => fetchTickets(filters)}
              disabled={loading}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              onClick={exportTickets}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total Tickets</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">New Tickets</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.new}</div>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Assigned</div>
              <div className="text-2xl font-bold text-blue-600">{stats.assigned}</div>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">In Progress</div>
              <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
            </div>
            <RefreshCw className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Overdue</div>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Bulk Actions Panel */}
      {selectedTickets.size > 0 && (
        <BulkActionsPanel
          selectedCount={selectedTickets.size}
          onBulkAction={handleBulkAction}
          onClearSelection={() => selectAllTickets([])}
        />
      )}

      {/* Filters */}
      <div className="filters-section mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-500" />
          
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters({ status: e.target.value })}
            className="p-2 border border-gray-300 rounded text-sm"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="pending_user">Pending User</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={filters.priority || ''}
            onChange={(e) => setFilters({ priority: e.target.value })}
            className="p-2 border border-gray-300 rounded text-sm"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

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
            <option value="rds_erp">RDS/ERP</option>
          </select>

          <input
            type="text"
            placeholder="Search tickets..."
            onChange={(e) => setFilters({ search: e.target.value })}
            className="p-2 border border-gray-300 rounded text-sm w-64"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        tickets={tickets}
        selectedTickets={selectedTickets}
        onTicketSelect={toggleTicketSelection}
        onSelectAll={selectAllTickets}
        onTicketUpdate={handleTicketUpdate}
      />
    </div>
  );
};

export default FrontDeskDashboard;