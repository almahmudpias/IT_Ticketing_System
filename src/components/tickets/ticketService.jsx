import api from './api';
import toast from 'react-hot-toast';

export const ticketService = {
  // Create ticket with enhanced fields
  async createTicket(ticketData) {
    try {
      const enhancedData = {
        ...ticketData,
        ticket_id: this.generateTicketId(ticketData.category),
        created_at: new Date().toISOString(),
        status: 'new',
        sla_deadline: this.calculateSLADeadline(ticketData.priority)
      };

      const response = await api.post('/tickets', enhancedData);
      toast.success('Ticket created successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to create ticket');
      throw error;
    }
  },

  // Generate ticket ID based on category
  generateTicketId(category) {
    const prefix = {
      hardware: 'HW',
      software: 'SW',
      network: 'NET',
      email: 'EMAIL',
      lab_support: 'LAB',
      nsu_email_request: 'NSU-EMAIL'
    }[category] || 'TKT';

    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    
    return `${prefix}-${timestamp}-${random}`;
  },

  // Calculate SLA deadline based on priority
  calculateSLADeadline(priority) {
    const slaHours = {
      urgent: 4,
      high: 24,
      medium: 72,
      low: 168 // 7 days
    }[priority] || 72;

    const deadline = new Date();
    deadline.setHours(deadline.getHours() + slaHours);
    return deadline.toISOString();
  },

  // Get tickets with role-based filtering
  async getTickets(filters = {}, userRole) {
    try {
      let queryParams = new URLSearchParams(filters);
      
      // Add role-based filters
      if (userRole === 'user') {
        queryParams.append('requester_id', 'current'); // Will be handled by backend
      } else if (userRole === 'it_staff') {
        queryParams.append('assignee_id', 'current');
      }

      return await api.get(`/tickets?${queryParams}`);
    } catch (error) {
      toast.error('Failed to fetch tickets');
      throw error;
    }
  },

  // Enhanced ticket assignment
  async assignTicket(ticketId, assigneeId, comment = '') {
    try {
      const response = await api.put(`/tickets/${ticketId}/assign`, {
        assignee_id: assigneeId,
        comment,
        assigned_at: new Date().toISOString()
      });
      toast.success('Ticket assigned successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to assign ticket');
      throw error;
    }
  },

  // Forward ticket
  async forwardTicket(ticketId, forwardToId, comment) {
    try {
      const response = await api.post(`/tickets/${ticketId}/forward`, {
        forward_to: forwardToId,
        comment,
        forwarded_at: new Date().toISOString()
      });
      toast.success('Ticket forwarded successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to forward ticket');
      throw error;
    }
  },

  // Add comment with type (internal/public)
  async addComment(ticketId, comment, isInternal = false, mentionedUsers = []) {
    try {
      const response = await api.post(`/tickets/${ticketId}/comments`, {
        comment,
        is_internal: isInternal,
        mentioned_users: mentionedUsers,
        timestamp: new Date().toISOString()
      });
      toast.success('Comment added successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to add comment');
      throw error;
    }
  },

  // Submit feedback
  async submitFeedback(ticketId, rating, comment) {
    try {
      const response = await api.post(`/tickets/${ticketId}/feedback`, {
        rating,
        comment,
        submitted_at: new Date().toISOString()
      });
      toast.success('Feedback submitted successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to submit feedback');
      throw error;
    }
  },

  // Bulk operations
  async bulkUpdateTickets(ticketIds, updates) {
    try {
      const response = await api.put('/tickets/bulk', { ticketIds, updates });
      toast.success(`${ticketIds.length} tickets updated successfully!`);
      return response;
    } catch (error) {
      toast.error('Failed to update tickets');
      throw error;
    }
  }
};