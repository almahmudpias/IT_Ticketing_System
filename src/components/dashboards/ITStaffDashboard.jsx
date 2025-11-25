import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ITStaffDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="it-staff-dashboard">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">IT Staff Dashboard</h1>
        <p className="text-gray-600">
          Welcome, {user?.name}. Manage assigned tickets and provide support.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Assigned Tickets</h3>
        <div className="text-center py-8 text-gray-500">
          <p>IT Staff dashboard content will be implemented here</p>
          <p className="text-sm mt-2">View assigned tickets, update status, add comments, and forward tickets</p>
        </div>
      </div>
    </div>
  );
};

export default ITStaffDashboard;