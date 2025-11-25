import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext';
import { UIProvider } from './context/UIContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layouts/MainLayout';

// Pages
import EnhancedLogin from './pages/EnhancedLogin';
import NsuEmailRequest from './pages/NsuEmailRequest';
import StudentRegistration from './pages/StudentRegistration';
import TicketCreatePage from './pages/TicketCreatePage';
import TicketViewPage from './pages/TicketViewPage';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
import Login from './pages/Login';

// Dashboards
import UserDashboard from './components/dashboards/UserDashboard';
import SuperAdminDashboard from './components/dashboards/SuperAdminDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import ITStaffDashboard from './components/dashboards/ITStaffDashboard';
import FrontDeskDashboard from './components/dashboards/FrontDeskDashboard';
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
                <Route path="/nsu-email-request" element={<NsuEmailRequest />} />
                <Route path="/register" element={<StudentRegistration />} />
                
                {/* Unified User Dashboard - Students, Faculty, Staff */}
                <Route path="/dashboard" element={
                  <ProtectedRoute allowedRoles={['student', 'faculty', 'staff', 'lab_instructor']}>
                    <MainLayout>
                      <UserDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                {/* Super Admin Dashboard */}
                <Route path="/super-admin" element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <MainLayout>
                      <SuperAdminDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                {/* Admin Dashboard */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                    <MainLayout>
                      <AdminDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                {/* IT Staff Dashboard */}
                <Route path="/it-staff" element={
                  <ProtectedRoute allowedRoles={['it_staff']}>
                    <MainLayout>
                      <ITStaffDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                {/* Front Desk Dashboard */}
                <Route path="/front-desk" element={
                  <ProtectedRoute allowedRoles={['front_desk']}>
                    <MainLayout>
                      <FrontDeskDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                {/* Lab Instructor Dashboard */}
                <Route path="/lab-instructor" element={
                  <ProtectedRoute allowedRoles={['lab_instructor']}>
                    <MainLayout>
                      <LabInstructorDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                {/* Common Routes */}
                <Route path="/create-ticket" element={
                  <ProtectedRoute allowedRoles={['student', 'faculty', 'staff', 'lab_instructor']}>
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
                
                {/* Redirect root based on user role */}
                <Route path="/" element={<Navigate to="/Login" replace />} />
                
                {/* Catch all route */}
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