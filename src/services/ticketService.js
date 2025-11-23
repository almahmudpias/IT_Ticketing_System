import api from './api';
import toast from 'react-hot-toast';

export const ticketService = {
  // Create new ticket
  async createTicket(ticketData) {
    try {
      const response = await api.post('/tickets', ticketData);
      toast.success('Ticket created successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to create ticket');
      throw error;
    }
  },

  // Get all tickets with filtering
  async getTickets(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      return await api.get(`/tickets?${queryParams}`);
    } catch (error) {
      toast.error('Failed to fetch tickets');
      throw error;
    }
  },

  // Get single ticket
  async getTicket(id) {
    try {
      return await api.get(`/tickets/${id}`);
    } catch (error) {
      toast.error('Failed to fetch ticket details');
      throw error;
    }
  },

  // Update ticket
  async updateTicket(id, updates) {
    try {
      const response = await api.put(`/tickets/${id}`, updates);
      toast.success('Ticket updated successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to update ticket');
      throw error;
    }
  },

  // Bulk update tickets
  async bulkUpdateTickets(ticketIds, updates) {
    try {
      const response = await api.put('/tickets/bulk', { ticketIds, updates });
      toast.success(`${ticketIds.length} tickets updated successfully!`);
      return response;
    } catch (error) {
      toast.error('Failed to update tickets');
      throw error;
    }
  },

  // Add note to ticket
  async addNote(ticketId, note, isInternal = false) {
    try {
      const response = await api.post(`/tickets/${ticketId}/notes`, { 
        note, 
        isInternal,
        timestamp: new Date().toISOString()
      });
      toast.success('Note added successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to add note');
      throw error;
    }
  },

  // Assign ticket
  async assignTicket(ticketId, assigneeId) {
    try {
      const response = await api.put(`/tickets/${ticketId}/assign`, { assigneeId });
      toast.success('Ticket assigned successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to assign ticket');
      throw error;
    }
  },

  // Get ticket statistics
  async getStats() {
    try {
      return await api.get('/tickets/stats');
    } catch (error) {
      toast.error('Failed to fetch statistics');
      throw error;
    }
  },

  // Get analytics data
  async getAnalytics(timeRange = '7d') {
    try {
      return await api.get(`/analytics?range=${timeRange}`);
    } catch (error) {
      toast.error('Failed to fetch analytics');
      throw error;
    }
  }
};