import React from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import { useUI } from '../../context/UIContext';

const MainLayout = ({ children }) => {
  const { sidebarOpen } = useUI();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        {/* Main content */}
        <div className="flex-1 lg:ml-64">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;