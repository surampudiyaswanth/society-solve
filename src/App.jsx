import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import AIChatWidget from './components/common/AIChatWidget';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProblemDiscoveryPage from './pages/ProblemDiscoveryPage';
import ProblemTrackingPage from './pages/ProblemTrackingPage';
import CitizenDashboard from './pages/CitizenDashboard';
import UniversityDashboard from './pages/UniversityDashboard';
import IndustryDashboard from './pages/IndustryDashboard';
import GovernmentDashboard from './pages/GovernmentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SolutionsPage from './pages/SolutionsPage';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
            {/* Global Navbar */}
            <Navbar />

            {/* Main Route Content */}
            <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/problems" element={<ProblemDiscoveryPage />} />
              <Route path="/problems/:id" element={<ProblemTrackingPage />} />
              <Route path="/solutions" element={<SolutionsPage />} />

              {/* Protected Citizen Route */}
              <Route
                path="/citizen"
                element={
                  <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                    <CitizenDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected University Route */}
              <Route
                path="/university"
                element={
                  <ProtectedRoute allowedRoles={['university', 'admin']}>
                    <UniversityDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Industry Route */}
              <Route
                path="/industry"
                element={
                  <ProtectedRoute allowedRoles={['industry', 'admin']}>
                    <IndustryDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Government Route */}
              <Route
                path="/government"
                element={
                  <ProtectedRoute allowedRoles={['government', 'admin']}>
                    <GovernmentDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-800/80 bg-slate-950 py-10 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-300">SocietySolve Platform</span>
                <span>&bull;</span>
                <span>Connecting Citizens, Universities, Industry & Government</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-mono text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800 text-[11px]">
                  5-Portal Architecture: Active
                </span>
                <span>JWT + Bcrypt Protected</span>
              </div>
            </div>
          </footer>

          {/* AI Floating Chatbot Assistant */}
          <AIChatWidget />
        </div>
      </Router>
    </AuthProvider>
  </ErrorBoundary>
  );
}