import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TicketCard from './TicketCard';

const KanbanBoard = ({ 
  tickets, 
  selectedTickets, 
  onTicketSelect, 
  onSelectAll,
  onTicketUpdate,
  onTicketReorder
}) => {
  const columns = [
    {
      id: 'new',
      title: 'New',
      color: 'bg-gray-100',
      tickets: tickets.filter(t => t.status === 'new')
    },
    {
      id: 'assigned',
      title: 'Assigned',
      color: 'bg-blue-50',
      tickets: tickets.filter(t => t.status === 'assigned')
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      color: 'bg-yellow-50',
      tickets: tickets.filter(t => t.status === 'in_progress')
    },
    {
      id: 'pending_user',
      title: 'Pending User',
      color: 'bg-orange-50',
      tickets: tickets.filter(t => t.status === 'pending_user')
    },
    {
      id: 'resolved',
      title: 'Resolved',
      color: 'bg-green-50',
      tickets: tickets.filter(t => t.status === 'resolved')
    }
  ];

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    // Update ticket status based on column
    const newStatus = destination.droppableId;
    onTicketUpdate(draggableId, { status: newStatus });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {columns.map(column => (
            <div key={column.id} className="kanban-column">
              <div className={`column-header ${column.color} p-3 rounded-t-lg border-b border-gray-200`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">
                    {column.title} <span className="text-gray-600">({column.tickets.length})</span>
                  </h3>
                  {column.tickets.length > 0 && (
                    <button
                      onClick={() => onSelectAll(column.tickets.map(t => t.id))}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {selectedTickets.size === column.tickets.length ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                </div>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`column-content min-h-96 p-2 rounded-b-lg transition-colors duration-200 ${
                      snapshot.isDraggingOver ? 'bg-blue-100' : 'bg-gray-50'
                    }`}
                  >
                    {column.tickets.map((ticket, index) => (
                      <Draggable
                        key={ticket.id}
                        draggableId={ticket.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-2 transition-transform duration-200 ${
                              snapshot.isDragging ? 'rotate-5 shadow-lg' : ''
                            }`}
                          >
                            <TicketCard
                              ticket={ticket}
                              isSelected={selectedTickets.has(ticket.id)}
                              onSelect={onTicketSelect}
                              onUpdate={onTicketUpdate}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {column.tickets.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <div className="text-gray-400 mb-2">No tickets</div>
                        <div className="text-xs text-gray-400">Drag tickets here</div>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;