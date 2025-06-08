
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, Users, Bot } from 'lucide-react';
import { PerformanceChart } from './PerformanceChart';
import { RecentTrades } from './RecentTrades';
import { ActiveAutomations } from './ActiveAutomations';

interface DashboardProps {
  userType: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userType }) => {
  const getStatsCards = () => {
    switch (userType) {
      case 'trader':
        return [
          { title: 'Saldo Total', value: '$45,250.00', change: '+2.5%', positive: true, icon: DollarSign },
          { title: 'P&L Hoje', value: '+$1,125.50', change: '+2.5%', positive: true, icon: TrendingUp },
          { title: 'Posições Abertas', value: '8', change: '+2', positive: true, icon: Activity },
          { title: 'Performance 30d', value: '+15.8%', change: '+3.2%', positive: true, icon: TrendingUp }
        ];
      case 'manager':
        return [
          { title: 'Clientes Ativos', value: '24', change: '+3', positive: true, icon: Users },
          { title: 'AUM Total', value: '$2.4M', change: '+5.8%', positive: true, icon: DollarSign },
          { title: 'Automações Ativas', value: '12', change: '+2', positive: true, icon: Bot },
          { title: 'Performance Média', value: '+12.4%', change: '+1.2%', positive: true, icon: TrendingUp }
        ];
      case 'admin':
        return [
          { title: 'Usuários Ativos', value: '1,247', change: '+12%', positive: true, icon: Users },
          { title: 'Volume Diário', value: '$15.2M', change: '+8.3%', positive: true, icon: DollarSign },
          { title: 'Gestores Ativos', value: '45', change: '+2', positive: true, icon: Activity },
          { title: 'Taxa de Conversão', value: '68%', change: '+3%', positive: true, icon: TrendingUp }
        ];
      default:
        return [
          { title: 'Receita Total', value: '$890K', change: '+15%', positive: true, icon: DollarSign },
          { title: 'Usuários Totais', value: '12,547', change: '+24%', positive: true, icon: Users },
          { title: 'Uptime Sistema', value: '99.9%', change: '0%', positive: true, icon: Activity },
          { title: 'Lucro Mensal', value: '$145K', change: '+18%', positive: true, icon: TrendingUp }
        ];
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStatsCards().map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-3 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {stat.positive ? (
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                )}
                <span className={`text-sm font-medium ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
                <span className="text-slate-400 text-sm ml-1">vs. período anterior</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart userType={userType} />
        <RecentTrades userType={userType} />
      </div>

      {/* Conditional Content */}
      {userType === 'manager' && <ActiveAutomations />}
    </div>
  );
};
