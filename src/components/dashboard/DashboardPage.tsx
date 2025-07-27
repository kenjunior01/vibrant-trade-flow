import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { TradingChart } from '@/components/TradingChart';
import { OrderBook } from '@/components/OrderBook';
import { Portfolio } from '@/components/Portfolio';
import { AutomationPanel } from '@/components/AutomationPanel';
import { NewsPanel } from '@/components/NewsPanel';
import { Chat } from '@/components/Chat';
import { MarketTicker } from '@/components/MarketTicker';
import { UserManagementPanel } from '@/components/admin/UserManagementPanel';

// Mock market data
const MOCK_PRICES = {
  'BTCUSD': 43250.00,
  'ETHUSD': 2650.25,
  'EURUSD': 1.0856,
  'GBPUSD': 1.2745,
  'XAUUSD': 2034.50,
  'AAPL': 190.50,
  'GOOGL': 140.75,
  'USOIL': 82.30
};

export function DashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSD');
  const { user } = useAuth();

  const userType = user?.role === 'manager' ? 'manager' : 
                  user?.role === 'superadmin' ? 'superadmin' :
                  user?.role === 'admin' ? 'admin' : 'trader';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <MarketTicker prices={MOCK_PRICES} />
      
      <div className="flex h-screen">
        <Sidebar 
          collapsed={sidebarCollapsed}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          userType={userType}
        />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="flex items-center justify-between p-4 bg-slate-800/50 border-b border-slate-700/50">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <span className="text-slate-300">☰</span>
            </button>
            <h1 className="text-lg font-semibold text-white">Trading Dashboard</h1>
          </div>
          
          <main className="p-6 overflow-auto h-[calc(100vh-128px)]">
            {activeSection === 'dashboard' && <Dashboard userType={userType} />}
            {activeSection === 'trading' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TradingChart symbol={selectedSymbol} />
                </div>
                <div>
                  <OrderBook symbol={selectedSymbol} />
                </div>
              </div>
            )}
            {activeSection === 'portfolio' && <Portfolio balance={50000} equity={52500} positions={[]} onClosePosition={() => {}} />}
            {activeSection === 'automation' && userType === 'manager' && <AutomationPanel />}
            {activeSection === 'news' && <NewsPanel />}
            {activeSection === 'chat' && <Chat userType={userType} />}
            {activeSection === 'users' && (userType === 'admin' || userType === 'superadmin') && <UserManagementPanel />}
          </main>
        </div>
      </div>
    </div>
  );
}
