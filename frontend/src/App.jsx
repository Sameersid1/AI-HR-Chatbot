import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import HRDashboard from './pages/HRDashboard';
import Navbar from './components/layout/Navbar';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If not authorized for this role, redirect to a default home or appropriate dashboard
    return <Navigate to="/" replace />;
  }

  return children;
};

const RoleBasedHome = () => {
  const { user } = useAuth();
  
  if (user?.role === 'HR' || user?.role === 'Admin') {
    return <HRDashboard />;
  }
  return <EmployeeDashboard />;
};

const AppContent = () => {
  const { user } = useAuth();
  
  return (
    <Router>
      {user && <Navbar />}
      <div className={user ? 'pt-16 min-h-screen bg-gray-50' : ''}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <RoleBasedHome />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
