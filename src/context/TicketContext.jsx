import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ticketService } from '../services/ticketService';
import { useAuth } from './AuthContext';

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
    search: ''
  },
  loading: true
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
  const { user } = useAuth();

  const fetchTickets = async (filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Add user-based filtering
      const queryFilters = { ...state.filters, ...filters };
      if (user && !['admin', 'super_admin', 'it_staff', 'front_desk'].includes(user.role)) {
        queryFilters.userId = user.id;
      }

      const data = await ticketService.getTickets(queryFilters);
      dispatch({ type: 'SET_TICKETS', payload: data.tickets || [] });
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

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const value = {
    ...state,
    fetchTickets,
    createTicket,
    updateTicket,
    setFilters,
    setSelectedTickets,
    toggleTicketSelection
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
};