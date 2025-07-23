import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TradingPlatform } from '@/components/TradingPlatform';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<TradingPlatform />} />
        </Routes>
      </Router>
      <Toaster />
      <SonnerToaster />
    </QueryClientProvider>
  );
}

export default App;
