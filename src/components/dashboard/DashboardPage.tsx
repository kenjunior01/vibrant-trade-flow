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

export function DashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  const userType = user?.role === 'manager' ? 'manager' : 
                  user?.role === 'superadmin' ? 'superadmin' :
                  user?.role === 'admin' ? 'admin' : 'trader';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <MarketTicker />
      
      <div className="flex h-screen">
        <Sidebar 
          collapsed={sidebarCollapsed}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          userType={userType}
        />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <Header 
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            userType={userType}
            setUserType={() => {}} // Usuário não pode mudar o próprio tipo
          />
          
          <main className="p-6 overflow-auto h-[calc(100vh-128px)]">
            {activeSection === 'dashboard' && <Dashboard userType={userType} />}
            {activeSection === 'trading' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TradingChart />
                </div>
                <div>
                  <OrderBook />
                </div>
              </div>
            )}
            {activeSection === 'portfolio' && <Portfolio userType={userType} />}
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
