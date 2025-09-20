import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import AssetDetail from './pages/AssetDetail';
import NewAsset from './pages/NewAsset';
import EditAsset from './pages/EditAsset';
import Scanner from './pages/Scanner';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

import Reports from './pages/Reports';
import Profile from './pages/Profile';
import AssetCostAnalysis from './pages/AssetCostAnalysis';
import Employees from './pages/Employees';
import AllTickets from './pages/AllTickets';
// Initialize QueryClient
const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show a loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Only redirect after loading is complete and user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Manager-only route wrapper
const ManagerRoute = ({ children }: { children: React.ReactNode }) => {
  const { isManager, isLoading } = useAuth();
  const navigate = useNavigate();
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (!isManager) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected App Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="assets" element={<Assets />} />
              <Route path="assets/new" element={<NewAsset />} />
              <Route path="assets/:id" element={<AssetDetail />} />
              <Route path="assets/:id/edit" element={<EditAsset />} />
              <Route path="scanner" element={<Scanner />} />
              <Route path="admin" element={<Admin />} />
              <Route path="reports" element={
                <ManagerRoute>
                  <Reports />
                </ManagerRoute>
              } />
              <Route path="profile" element={<Profile />} />
              <Route path="asset-cost-analysis" element={<AssetCostAnalysis />} />
              <Route path="employees" element={<Employees />} />
              <Route path="all-tickets" element={
                <ManagerRoute>
                  <AllTickets />
                </ManagerRoute>
              } />
              
              {/* Add more routes here as they are implemented */}
              <Route path="settings" element={<div className="p-4">Settings page coming soon!</div>} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
