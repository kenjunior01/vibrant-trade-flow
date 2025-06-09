import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { NotificationProvider } from '@/hooks/useNotifications';
import { AuthPage } from '@/components/auth/AuthPage';
import { HomePage } from '@/components/home/HomePage';
import { DashboardPage } from '@/components/dashboard/DashboardPage';
import { TradingPlatform } from '@/components/TradingPlatform';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/trading" 
                element={
                  <ProtectedRoute>
                    <TradingPlatform />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
          <Toaster />
          <SonnerToaster />
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
