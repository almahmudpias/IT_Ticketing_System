import React from 'react';
import { useAuth } from '../../context/AuthContext';

const FrontDeskDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="front-desk-dashboard">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Front Desk Dashboard</h1>
        <p className="text-gray-600">
          Welcome, {user?.name}. Manage incoming tickets and assignments.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Ticket Queue</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Front Desk dashboard content will be implemented here</p>
          <p className="text-sm mt-2">Receive, verify, and assign incoming support tickets</p>
        </div>
      </div>
    </div>
  );
};

export default FrontDeskDashboard;