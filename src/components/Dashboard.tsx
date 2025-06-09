import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, Users, Bot } from 'lucide-react';
import { PerformanceChart } from './PerformanceChart';
import { RecentTrades } from './RecentTrades';
import { ActiveAutomations } from './ActiveAutomations';
import { useAuth } from '@/hooks/useAuth';

interface DashboardProps {
  userType: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userType }) => {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        let url = '';
        if (userType === 'admin') {
          url = 'http://localhost:5000/api/admin/dashboard-stats';
        } else if (userType === 'trader' || userType === 'manager') {
          url = 'http://localhost:5000/api/trading/wallet';
        }
        if (!url) return;
        const res = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Erro ao buscar estatísticas');
        const data = await res.json();
        setStats(data.stats || data);
      } catch (e) {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchStats();
  }, [userType, token]);

  // Helper to map backend stats to cards
  const getStatsCards = () => {
    if (loading || !stats) return Array(4).fill({ title: 'Carregando...', value: '...', change: '', positive: true, icon: DollarSign });
    if (userType === 'admin') {
      return [
        { title: 'Usuários Ativos', value: stats.users?.active ?? '-', change: '+12%', positive: true, icon: Users },
        { title: 'Volume Diário', value: stats.trading?.orders_today ? `$${stats.trading.orders_today} ordens` : '-', change: '+8.3%', positive: true, icon: DollarSign },
        { title: 'Gestores Ativos', value: stats.users?.managers ?? '-', change: '+2', positive: true, icon: Activity },
        { title: 'Taxa de Conversão', value: stats.system?.cache_hit_rate ?? '-', change: '+3%', positive: true, icon: TrendingUp }
      ];
    } else if (userType === 'trader' || userType === 'manager') {
      return [
        { title: 'Saldo Total', value: stats[0]?.balance ? `$${stats[0].balance.toLocaleString()}` : '-', change: '', positive: true, icon: DollarSign },
        { title: 'Carteiras', value: stats.length, change: '', positive: true, icon: Activity },
        { title: 'Última Atualização', value: stats[0]?.updated_at ? new Date(stats[0].updated_at).toLocaleDateString() : '-', change: '', positive: true, icon: TrendingUp },
        { title: 'ID', value: stats[0]?.id ?? '-', change: '', positive: true, icon: Users }
      ];
    }
    return [];
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
