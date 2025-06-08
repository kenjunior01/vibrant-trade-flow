
import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  Bot, 
  MessageSquare, 
  Newspaper, 
  Users, 
  Settings,
  Shield,
  Database
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
  userType: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  activeSection, 
  setActiveSection, 
  userType 
}) => {
  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'trading', label: 'Trading', icon: TrendingUp },
      { id: 'portfolio', label: 'Carteira', icon: Wallet },
      { id: 'news', label: 'Notícias', icon: Newspaper },
      { id: 'chat', label: 'Chat', icon: MessageSquare },
    ];

    if (userType === 'manager') {
      baseItems.splice(3, 0, { id: 'automation', label: 'Automação', icon: Bot });
    }

    if (userType === 'admin' || userType === 'superadmin') {
      baseItems.push({ id: 'users', label: 'Usuários', icon: Users });
    }

    if (userType === 'superadmin') {
      baseItems.push(
        { id: 'system', label: 'Sistema', icon: Database },
        { id: 'security', label: 'Segurança', icon: Shield }
      );
    }

    baseItems.push({ id: 'settings', label: 'Configurações', icon: Settings });

    return baseItems;
  };

  return (
    <aside className={`fixed left-0 top-0 h-full bg-slate-800/90 backdrop-blur-sm border-r border-slate-700/50 transition-all duration-300 z-40 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              TradePro
            </span>
          )}
        </div>
      </div>

      <nav className="px-4 space-y-2">
        {getMenuItems().map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
