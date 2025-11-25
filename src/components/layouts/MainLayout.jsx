import React from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import { useUI } from '../../context/UIContext';

const MainLayout = ({ children }) => {
  const { sidebarOpen, setSidebarOpen } = useUI();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-100/20">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16">
        <Navbar />
      </div>

      {/* Main Layout Container */}
      <div className="flex pt-16 h-screen overflow-hidden">
        
        {/* Fixed Sidebar - Full height */}
        <div className={`
          fixed top-16 left-0 bottom-0 z-40 w-80
          transform transition-transform duration-300
          lg:translate-x-0 lg:static lg:h-[calc(100vh-4rem)]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar />
        </div>

        {/* Scrollable Content Area */}
        <div className={`
          flex-1 min-h-full transition-all duration-300 overflow-auto
          ${sidebarOpen ? 'lg:ml-80' : 'lg:ml-0'}
          w-full
        `}>
          <main className="p-6 lg:p-8 min-h-full">
            <div className="max-w-full">
              <div className="animate-fade-in">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MainLayout;