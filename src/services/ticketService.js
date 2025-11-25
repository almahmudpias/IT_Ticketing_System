import api from './api';
import toast from 'react-hot-toast';

let mockTickets = [
  {
    id: 'TKT-001',
    title: 'Internet connectivity issue',
    description: 'No internet access in computer lab',
    category: 'network',
    priority: 'high',
    status: 'in_progress',
    submittedBy: '7',
    submittedByName: 'John Student',
    submittedByEmail: 'student@northsouth.edu',
    assignedTo: '3',
    assignedToName: 'IT Support Technician 1',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-16').toISOString(),
    slaStatus: 'warning',
    comments: [
      {
        id: '1',
        userId: '3',
        userName: 'IT Support Technician 1',
        message: 'Investigating network issue',
        timestamp: new Date('2024-01-15 10:30:00').toISOString(),
        isInternal: false
      }
    ],
    feedback: null,
    timeSpent: '2 hours',
    forwardedFrom: null
  }
];

export const ticketService = {
  // Create new ticket
  async createTicket(ticketData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTicket = {
        id: `TKT-${Date.now()}`,
        ...ticketData,
        status: 'new',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
        feedback: null,
        timeSpent: '0 hours',
        forwardedFrom: null
      };
      
      mockTickets.push(newTicket);
      toast.success('Ticket created successfully!');
      return newTicket;
    } catch (error) {
      toast.error('Failed to create ticket');
      throw error;
    }
  },

  // Get tickets with filters
  async getTickets(filters = {}) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredTickets = [...mockTickets];
      
      if (filters.userId) {
        filteredTickets = filteredTickets.filter(t => t.submittedBy === filters.userId);
      }
      
      if (filters.status) {
        filteredTickets = filteredTickets.filter(t => t.status === filters.status);
      }
      
      if (filters.assignedTo) {
        filteredTickets = filteredTickets.filter(t => t.assignedTo === filters.assignedTo);
      }
      
      return { tickets: filteredTickets };
    } catch (error) {
      toast.error('Failed to fetch tickets');
      throw error;
    }
  },

  // Get single ticket
  async getTicket(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const ticket = mockTickets.find(t => t.id === id);
      if (!ticket) {
        throw new Error('Ticket not found');
      }
      
      return ticket;
    } catch (error) {
      toast.error('Failed to fetch ticket');
      throw error;
    }
  },

  // Update ticket
  async updateTicket(id, updates) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const ticketIndex = mockTickets.findIndex(t => t.id === id);
      if (ticketIndex === -1) {
        throw new Error('Ticket not found');
      }
      
      mockTickets[ticketIndex] = {
        ...mockTickets[ticketIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      toast.success('Ticket updated successfully!');
      return mockTickets[ticketIndex];
    } catch (error) {
      toast.error('Failed to update ticket');
      throw error;
    }
  },

  // Assign ticket to IT staff
  async assignTicket(ticketId, assigneeId, assigneeName) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
      if (ticketIndex === -1) {
        throw new Error('Ticket not found');
      }
      
      mockTickets[ticketIndex] = {
        ...mockTickets[ticketIndex],
        assignedTo: assigneeId,
        assignedToName: assigneeName,
        status: 'assigned',
        updatedAt: new Date().toISOString()
      };
      
      toast.success('Ticket assigned successfully!');
      return mockTickets[ticketIndex];
    } catch (error) {
      toast.error('Failed to assign ticket');
      throw error;
    }
  },

  // Forward ticket to another IT staff
  async forwardTicket(ticketId, newAssigneeId, newAssigneeName, comment) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
      if (ticketIndex === -1) {
        throw new Error('Ticket not found');
      }
      
      const originalAssignee = mockTickets[ticketIndex].assignedToName;
      
      mockTickets[ticketIndex] = {
        ...mockTickets[ticketIndex],
        assignedTo: newAssigneeId,
        assignedToName: newAssigneeName,
        forwardedFrom: originalAssignee,
        updatedAt: new Date().toISOString()
      };
      
      // Add forward comment
      if (comment) {
        const forwardComment = {
          id: `comment-${Date.now()}`,
          userId: newAssigneeId,
          userName: newAssigneeName,
          message: `Forwarded from ${originalAssignee}: ${comment}`,
          timestamp: new Date().toISOString(),
          isInternal: true
        };
        
        mockTickets[ticketIndex].comments.push(forwardComment);
      }
      
      toast.success('Ticket forwarded successfully!');
      return mockTickets[ticketIndex];
    } catch (error) {
      toast.error('Failed to forward ticket');
      throw error;
    }
  },

  // Add comment to ticket
  async addComment(ticketId, commentData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
      if (ticketIndex === -1) {
        throw new Error('Ticket not found');
      }
      
      const newComment = {
        id: `comment-${Date.now()}`,
        ...commentData,
        timestamp: new Date().toISOString()
      };
      
      mockTickets[ticketIndex].comments.push(newComment);
      mockTickets[ticketIndex].updatedAt = new Date().toISOString();
      
      toast.success('Comment added successfully!');
      return mockTickets[ticketIndex];
    } catch (error) {
      toast.error('Failed to add comment');
      throw error;
    }
  },

  // Submit feedback for ticket
  async submitFeedback(ticketId, feedbackData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
      if (ticketIndex === -1) {
        throw new Error('Ticket not found');
      }
      
      mockTickets[ticketIndex].feedback = {
        ...feedbackData,
        submittedAt: new Date().toISOString()
      };
      
      mockTickets[ticketIndex].updatedAt = new Date().toISOString();
      
      toast.success('Feedback submitted successfully!');
      return mockTickets[ticketIndex];
    } catch (error) {
      toast.error('Failed to submit feedback');
      throw error;
    }
  },

  // Get statistics for admin dashboard
  async getStats() {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const totalTickets = mockTickets.length;
      const openTickets = mockTickets.filter(t => 
        ['new', 'assigned', 'in_progress'].includes(t.status)
      ).length;
      const resolvedTickets = mockTickets.filter(t => t.status === 'resolved').length;
      
      // IT Staff performance
      const itStaff = mockUsers.filter(u => u.role === 'it_staff');
      const staffPerformance = itStaff.map(staff => {
        const assignedTickets = mockTickets.filter(t => t.assignedTo === staff.id);
        const resolved = assignedTickets.filter(t => t.status === 'resolved').length;
        
        return {
          id: staff.id,
          name: staff.name,
          assignedTickets: assignedTickets.length,
          resolvedTickets: resolved,
          resolutionRate: assignedTickets.length > 0 ? (resolved / assignedTickets.length * 100).toFixed(1) : 0
        };
      });
      
      return {
        totalTickets,
        openTickets,
        resolvedTickets,
        staffPerformance,
        averageResolutionTime: '2.3 hours'
      };
    } catch (error) {
      throw new Error('Failed to fetch statistics');
    }
  }
};