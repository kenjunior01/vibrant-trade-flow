
import React from 'react';
import { Menu, User, Settings, LogOut, Bell } from 'lucide-react';

interface HeaderProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  userType: string;
  setUserType: (type: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  sidebarCollapsed, 
  setSidebarCollapsed, 
  userType,
  setUserType 
}) => {
  const userTypeLabels = {
    trader: 'Trader',
    manager: 'Gestor de Conta',
    admin: 'Admin',
    superadmin: 'Super Admin'
  };

  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          TradePro Platform
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <select 
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm"
        >
          <option value="trader">Trader</option>
          <option value="manager">Gestor de Conta</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>

        <button className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
        </button>

        <div className="flex items-center space-x-2 bg-slate-700/50 rounded-lg px-3 py-2">
          <User className="h-5 w-5" />
          <span className="text-sm font-medium">{userTypeLabels[userType as keyof typeof userTypeLabels]}</span>
        </div>

        <button className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};
