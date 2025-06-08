
import React from 'react';
import { TrendingUp, TrendingDown, PieChart, BarChart3 } from 'lucide-react';

interface PortfolioProps {
  userType: string;
}

export const Portfolio: React.FC<PortfolioProps> = ({ userType }) => {
  const positions = [
    { symbol: 'EUR/USD', side: 'Long', size: '10,000', entry: '1.0832', current: '1.0856', pnl: '+$240.00', pnlPercent: '+2.21%', positive: true },
    { symbol: 'BTC/USD', side: 'Long', size: '0.25', entry: '42,000', current: '43,250', pnl: '+$312.50', pnlPercent: '+2.98%', positive: true },
    { symbol: 'GOLD', side: 'Short', size: '5 oz', entry: '2,040', current: '2,034', pnl: '+$30.00', pnlPercent: '+0.29%', positive: true },
    { symbol: 'GBP/USD', side: 'Long', size: '7,500', entry: '1.2760', current: '1.2745', pnl: '-$11.25', pnlPercent: '-0.12%', positive: false },
  ];

  const allocation = [
    { asset: 'Forex', percentage: 45, value: '$20,250', color: 'bg-blue-500' },
    { asset: 'Crypto', percentage: 30, value: '$13,500', color: 'bg-purple-500' },
    { asset: 'Commodities', percentage: 15, value: '$6,750', color: 'bg-yellow-500' },
    { asset: 'Índices', percentage: 10, value: '$4,500', color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Valor Total</h3>
          <div className="text-3xl font-bold text-white mb-2">$45,250.00</div>
          <div className="flex items-center text-green-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+$1,125.50 (+2.5%)</span>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">P&L Hoje</h3>
          <div className="text-3xl font-bold text-green-400 mb-2">+$571.25</div>
          <div className="text-slate-400">
            <span>Em 8 posições ativas</span>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Margem Livre</h3>
          <div className="text-3xl font-bold text-white mb-2">$15,420.00</div>
          <div className="text-slate-400">
            <span>68% disponível</span>
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
          {allocation.map((item, index) => (
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
                <th className="text-right text-slate-400 font-medium py-3">Ação</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position, index) => (
                <tr key={index} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                  <td className="py-3">
                    <span className="font-semibold text-white">{position.symbol}</span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      position.side === 'Long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {position.side}
                    </span>
                  </td>
                  <td className="text-right py-3 text-white font-mono">{position.size}</td>
                  <td className="text-right py-3 text-slate-300 font-mono">{position.entry}</td>
                  <td className="text-right py-3 text-white font-mono">{position.current}</td>
                  <td className={`text-right py-3 font-semibold ${position.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {position.pnl}
                  </td>
                  <td className={`text-right py-3 font-medium ${position.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {position.pnlPercent}
                  </td>
                  <td className="text-right py-3">
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                      Fechar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
