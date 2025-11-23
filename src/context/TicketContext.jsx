import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ticketService } from '../services/ticketService';

const TicketContext = createContext();

const ticketReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TICKETS':
      return { ...state, tickets: action.payload, loading: false };
    case 'ADD_TICKET':
      return { ...state, tickets: [action.payload, ...state.tickets] };
    case 'UPDATE_TICKET':
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket.id === action.payload.id ? action.payload : ticket
        )
      };
    case 'DELETE_TICKET':
      return {
        ...state,
        tickets: state.tickets.filter(ticket => ticket.id !== action.payload)
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_SELECTED_TICKETS':
      return { ...state, selectedTickets: action.payload };
    default:
      return state;
  }
};

const initialState = {
  tickets: [],
  selectedTickets: new Set(),
  filters: {
    status: '',
    priority: '',
    category: '',
    assignee: '',
    dateRange: ''
  },
  loading: true,
  stats: {
    total: 0,
    open: 0,
    resolved: 0,
    overdue: 0
  }
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

export const TicketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  const fetchTickets = async (filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await ticketService.getTickets(filters);
      dispatch({ type: 'SET_TICKETS', payload: data.tickets || [] });
      
      // Calculate stats
      const stats = {
        total: data.tickets.length,
        open: data.tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length,
        resolved: data.tickets.filter(t => t.status === 'resolved').length,
        overdue: data.tickets.filter(t => t.slaStatus === 'breached').length
      };
      
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createTicket = async (ticketData) => {
    try {
      const newTicket = await ticketService.createTicket(ticketData);
      dispatch({ type: 'ADD_TICKET', payload: newTicket });
      return newTicket;
    } catch (error) {
      throw error;
    }
  };

  const updateTicket = async (ticketId, updates) => {
    try {
      const updatedTicket = await ticketService.updateTicket(ticketId, updates);
      dispatch({ type: 'UPDATE_TICKET', payload: updatedTicket });
      return updatedTicket;
    } catch (error) {
      throw error;
    }
  };

  const bulkUpdateTickets = async (ticketIds, updates) => {
    try {
      await ticketService.bulkUpdateTickets(ticketIds, updates);
      await fetchTickets(state.filters);
    } catch (error) {
      throw error;
    }
  };

  const assignTicket = async (ticketId, assigneeId) => {
    try {
      const updatedTicket = await ticketService.assignTicket(ticketId, assigneeId);
      dispatch({ type: 'UPDATE_TICKET', payload: updatedTicket });
      return updatedTicket;
    } catch (error) {
      throw error;
    }
  };

  const addNote = async (ticketId, note, isInternal = false) => {
    try {
      const updatedTicket = await ticketService.addNote(ticketId, note, isInternal);
      dispatch({ type: 'UPDATE_TICKET', payload: updatedTicket });
      return updatedTicket;
    } catch (error) {
      throw error;
    }
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setSelectedTickets = (ticketIds) => {
    dispatch({ type: 'SET_SELECTED_TICKETS', payload: ticketIds });
  };

  const toggleTicketSelection = (ticketId) => {
    const newSelected = new Set(state.selectedTickets);
    if (newSelected.has(ticketId)) {
      newSelected.delete(ticketId);
    } else {
      newSelected.add(ticketId);
    }
    setSelectedTickets(newSelected);
  };

  const selectAllTickets = (ticketIds) => {
    if (state.selectedTickets.size === ticketIds.length) {
      setSelectedTickets(new Set());
    } else {
      setSelectedTickets(new Set(ticketIds));
    }
  };

  useEffect(() => {
    fetchTickets(state.filters);
  }, [state.filters]);

  const value = {
    ...state,
    fetchTickets,
    createTicket,
    updateTicket,
    bulkUpdateTickets,
    assignTicket,
    addNote,
    setFilters,
    setSelectedTickets,
    toggleTicketSelection,
    selectAllTickets
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
};