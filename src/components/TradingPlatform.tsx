
import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { TradingChart } from './TradingChart';
import { OrderBook } from './OrderBook';
import { Portfolio } from './Portfolio';
import { AutomationPanel } from './AutomationPanel';
import { NewsPanel } from './NewsPanel';
import { Chat } from './Chat';
import { MarketTicker } from './MarketTicker';

export const TradingPlatform = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userType, setUserType] = useState('trader'); // trader, manager, admin, superadmin
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Market Ticker - Cotações em tempo real no topo */}
      <MarketTicker />
      
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          userType={userType}
        />
        
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <Header 
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            userType={userType}
            setUserType={setUserType}
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
          </main>
        </div>
      </div>
    </div>
  );
};
