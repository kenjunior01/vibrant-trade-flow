import React, { useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, PieChart, BarChart3 } from 'lucide-react';
import { usePositions } from '@/hooks/usePositions';
import { useWallets } from '@/hooks/useWallets';
import { useAuth } from '@/hooks/useAuth';

interface PortfolioProps {
  userType: string;
}

export const Portfolio: React.FC<PortfolioProps> = ({ userType }) => {
  const { positions, loading: loadingPositions } = usePositions();
  const { wallets, loading: loadingWallets } = useWallets();
  const { user } = useAuth();

  // Calculate allocation by asset class (simple example by asset prefix)
  const allocation = useMemo(() => {
    if (loadingPositions || positions.length === 0) return [];
    const classes = {
      Forex: 0,
      Crypto: 0,
      Commodities: 0,
      Índices: 0,
    };
    let total = 0;
    positions.forEach(pos => {
      let value = pos.amount * (pos.open_price || 1);
      total += value;
      if (pos.asset_symbol.includes('USD') && pos.asset_symbol.includes('/')) classes.Forex += value;
      else if (["BTC", "ETH"].some(c => pos.asset_symbol.includes(c))) classes.Crypto += value;
      else if (["GOLD", "XAU", "OIL"].some(c => pos.asset_symbol.includes(c))) classes.Commodities += value;
      else classes["Índices"] += value;
    });
    return Object.entries(classes).map(([asset, value], i) => ({
      asset,
      percentage: total ? Math.round((value / total) * 100) : 0,
      value: `$${value.toLocaleString()}`,
      color: [
        'bg-blue-500',
        'bg-purple-500',
        'bg-yellow-500',
        'bg-green-500',
      ][i],
    })).filter(a => a.percentage > 0);
  }, [positions, loadingPositions]);

  // Portfolio summary
  const totalValue = user?.balance ?? 0;

  const pnlHoje = useMemo(() => {
    // This would require backend support for daily P&L, here we sum today's closed positions as a placeholder
    return positions.filter(p => p.closed_at && new Date(p.closed_at).toDateString() === new Date().toDateString())
      .reduce((sum, p) => sum + (p.pnl || 0), 0);
  }, [positions]);

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Valor Total</h3>
          <div className="text-3xl font-bold text-white mb-2">${totalValue.toLocaleString()}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">P&L Hoje</h3>
          <div className="text-3xl font-bold text-green-400 mb-2">{pnlHoje >= 0 ? '+' : ''}${pnlHoje.toLocaleString()}</div>
          <div className="text-slate-400">
            <span>{positions.filter(p => p.status === 'open').length} posições ativas</span>
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Margem Livre</h3>
          <div className="text-3xl font-bold text-white mb-2">${totalValue.toLocaleString()}</div>
          <div className="text-slate-400">
            <span>Carteiras: {wallets.length}</span>
          </div>
        </div>
      </div>
      {/* Asset Allocation */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <PieChart className="h-5 w-5 mr-2" />
          Alocação de Ativos
        </h3>
        <div className="space-y-4">
          {allocation.length === 0 ? (
            <div className="text-slate-400">Sem dados de alocação.</div>
          ) : allocation.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded ${item.color}`}></div>
                <span className="text-white font-medium">{item.asset}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="text-slate-300 w-12 text-right">{item.percentage}%</span>
                <span className="text-white font-semibold w-20 text-right">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Active Positions */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Posições Ativas
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-slate-400 font-medium py-3">Símbolo</th>
                <th className="text-left text-slate-400 font-medium py-3">Lado</th>
                <th className="text-right text-slate-400 font-medium py-3">Tamanho</th>
                <th className="text-right text-slate-400 font-medium py-3">Entrada</th>
                <th className="text-right text-slate-400 font-medium py-3">Atual</th>
                <th className="text-right text-slate-400 font-medium py-3">P&L</th>
                <th className="text-right text-slate-400 font-medium py-3">%</th>
              </tr>
            </thead>
            <tbody>
              {positions.filter(p => p.status === 'open').map((position, index) => (
                <tr key={position.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                  <td className="py-3">
                    <span className="font-semibold text-white">{position.asset_symbol}</span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      position.type === 'long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {position.type === 'long' ? 'Long' : 'Short'}
                    </span>
                  </td>
                  <td className="text-right py-3 text-white font-mono">{position.amount}</td>
                  <td className="text-right py-3 text-white font-mono">{position.open_price}</td>
                  <td className="text-right py-3 text-white font-mono">-</td>
                  <td className={`text-right py-3 font-mono ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{position.pnl >= 0 ? '+' : ''}{position.pnl}</td>
                  <td className="text-right py-3 text-white font-mono">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
