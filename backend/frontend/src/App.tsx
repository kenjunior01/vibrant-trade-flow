
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth'; // Ainda precisamos do AuthProvider, mas simplificado
import { HomePage } from '@/components/home/HomePage';
import { DashboardPage } from '@/components/dashboard/DashboardPage';
import { NewTradingPlatform } from '@/components/trading/NewTradingPlatform';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* A rota /auth foi removida */}
            <Route 
              path="/dashboard" 
              element={<DashboardPage />} // Rota direta, sem ProtectedRoute
            />
            <Route 
              path="/trading" 
              element={<NewTradingPlatform />} // Rota direta, sem ProtectedRoute
            />
          </Routes>
        </Router>
        <Toaster />
        <SonnerToaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
