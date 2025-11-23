import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatStatus, formatPriority } from '../utils/formatters';
import { calculateSLAStatus } from '../utils/sla';
import { ArrowLeft, User, Clock, MessageCircle, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const TicketViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  useEffect(() => {
    loadTicket();
  }, [id]);

  const loadTicket = async () => {
    try {
      const ticketData = await ticketService.getTicket(id);
      setTicket(ticketData);
    } catch (error) {
      toast.error('Failed to load ticket');
      navigate('/student');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      await ticketService.addNote(id, newNote, isInternal);
      setNewNote('');
      setIsInternal(false);
      loadTicket(); // Reload ticket to get updated notes
      toast.success('Note added successfully');
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await ticketService.updateTicket(id, { status: newStatus });
      loadTicket();
      toast.success('Ticket status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Ticket not found</h2>
        <button
          onClick={() => navigate('/student')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Return to dashboard
        </button>
      </div>
    );
  }

  const slaStatus = calculateSLAStatus(ticket);
  const canEdit = ['admin', 'front_desk', 'it_staff'].includes(user.role);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
            <p className="text-gray-600 mt-2">
              Ticket #{ticket.id} • Created {formatDate(ticket.createdAt)}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              ticket.priority === 'critical' ? 'bg-red-100 text-red-800' :
              ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
              ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {formatPriority(ticket.priority)}
            </span>
            
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              slaStatus.color === 'red' ? 'bg-red-100 text-red-800' :
              slaStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              SLA: {slaStatus.status === 'breached' ? 'Breached' : `${slaStatus.hoursLeft}h left`}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Ticket Details</h2>
            
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <div>
                <span className="font-medium text-gray-600">Category:</span>
                <span className="ml-2 text-gray-900">{ticket.category}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Status:</span>
                <span className="ml-2 text-gray-900">{formatStatus(ticket.status)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Submitted By:</span>
                <span className="ml-2 text-gray-900">{ticket.submittedByName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Contact Method:</span>
                <span className="ml-2 text-gray-900">{ticket.contactMethod}</span>
              </div>
              {ticket.building && (
                <div>
                  <span className="font-medium text-gray-600">Building/Room:</span>
                  <span className="ml-2 text-gray-900">{ticket.building} {ticket.room}</span>
                </div>
              )}
              {ticket.assetId && (
                <div>
                  <span className="font-medium text-gray-600">Asset ID:</span>
                  <span className="ml-2 text-gray-900">{ticket.assetId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Notes & Updates</h2>
            
            {/* Add Note Form */}
            {canEdit && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note or update..."
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <div className="flex items-center justify-between mt-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Internal note (not visible to user)</span>
                  </label>
                  
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            )}

            {/* Notes List */}
            <div className="space-y-4">
              {ticket.notes && ticket.notes.length > 0 ? (
                ticket.notes.map((note, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      note.isInternal 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{note.addedBy}</span>
                        {note.isInternal && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Internal
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(note.timestamp)}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{note.note}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No notes yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Actions */}
          {canEdit && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold mb-4">Ticket Actions</h3>
              
              <div className="space-y-2">
                {ticket.status === 'new' && (
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                  >
                    Start Working
                  </button>
                )}
                
                {ticket.status === 'in_progress' && (
                  <button
                    onClick={() => handleStatusChange('pending_user')}
                    className="w-full text-left p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100"
                  >
                    Wait for User Response
                  </button>
                )}
                
                {['assigned', 'in_progress', 'pending_user'].includes(ticket.status) && (
                  <button
                    onClick={() => handleStatusChange('resolved')}
                    className="w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                  >
                    Mark as Resolved
                  </button>
                )}
                
                {ticket.status === 'resolved' && (
                  <button
                    onClick={() => handleStatusChange('closed')}
                    className="w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    Close Ticket
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Ticket Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Ticket Information</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-600">Created:</span>
                <div className="text-gray-900">{formatDate(ticket.createdAt, 'PPpp')}</div>
              </div>
              
              <div>
                <span className="font-medium text-gray-600">Last Updated:</span>
                <div className="text-gray-900">{formatDate(ticket.updatedAt, 'PPpp')}</div>
              </div>
              
              <div>
                <span className="font-medium text-gray-600">Priority:</span>
                <div className="text-gray-900">{formatPriority(ticket.priority)}</div>
              </div>
              
              <div>
                <span className="font-medium text-gray-600">Category:</span>
                <div className="text-gray-900 capitalize">{ticket.category}</div>
              </div>
              
              {ticket.assignee && (
                <div>
                  <span className="font-medium text-gray-600">Assigned To:</span>
                  <div className="text-gray-900">{ticket.assignee}</div>
                </div>
              )}
            </div>
          </div>

          {/* SLA Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">SLA Information</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  slaStatus.color === 'red' ? 'text-red-600' :
                  slaStatus.color === 'yellow' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {slaStatus.status === 'breached' ? 'Breached' : 
                   slaStatus.status === 'warning' ? 'At Risk' : 'On Track'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Time Remaining:</span>
                <span className="font-medium text-gray-900">
                  {slaStatus.hoursLeft ? `${Math.ceil(slaStatus.hoursLeft)} hours` : 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Target Resolution:</span>
                <span className="font-medium text-gray-900">
                  {ticket.priority === 'critical' ? '2 hours' :
                   ticket.priority === 'high' ? '4 hours' :
                   ticket.priority === 'medium' ? '8 hours' : '24 hours'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketViewPage;