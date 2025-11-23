import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext';
import { UIProvider } from './context/UIContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layouts/MainLayout';

// Pages
import Login from './pages/Login';
import TicketCreatePage from './pages/TicketCreatePage';
import TicketViewPage from './pages/TicketViewPage';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
import StudentRegistration from './pages/StudentRegistration';

// Dashboards
import StudentDashboard from './components/dashboards/StudentDashboard';
import FrontDeskDashboard from './components/dashboards/FrontDeskDashboard';
import ITStaffDashboard from './components/dashboards/ITStaffDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import LabInstructorDashboard from './components/dashboards/LabInstructorDashboard';

import { Toaster } from 'react-hot-toast';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UIProvider>
          <TicketProvider>
            <div className="app">
              <Toaster position="top-right" />
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<StudentRegistration />} />
                
                {/* Student Routes */}
                <Route path="/student" element={
                  <ProtectedRoute allowedRoles={['student', 'staff', 'faculty', 'lab_instructor']}>
                    <MainLayout>
                      <StudentDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                {/* Front Desk Routes */}
                <Route path="/front-desk" element={
                  <ProtectedRoute allowedRoles={['front_desk', 'admin']}>
                    <MainLayout>
                      <FrontDeskDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                {/* IT Staff Routes */}
                <Route path="/it-staff" element={
                  <ProtectedRoute allowedRoles={['it_staff', 'admin']}>
                    <MainLayout>
                      <ITStaffDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                {/* Lab Instructor Routes */}
                <Route path="/lab-instructor" element={
                  <ProtectedRoute allowedRoles={['lab_instructor', 'admin']}>
                    <MainLayout>
                      <LabInstructorDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <MainLayout>
                      <AdminDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                {/* Common Protected Routes */}
                <Route path="/create-ticket" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <TicketCreatePage />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/ticket/:id" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <TicketViewPage />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ProfilePage />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                {/* Catch-all Routes */}
                <Route path="/" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </TicketProvider>
        </UIProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;