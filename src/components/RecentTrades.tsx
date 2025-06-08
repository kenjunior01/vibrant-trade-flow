
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface RecentTradesProps {
  userType: string;
}

export const RecentTrades: React.FC<RecentTradesProps> = ({ userType }) => {
  const trades = [
    { symbol: 'EUR/USD', type: 'Compra', amount: '$5,000', profit: '+$125.50', positive: true, time: '14:32' },
    { symbol: 'BTC/USD', type: 'Venda', amount: '$10,000', profit: '-$245.75', positive: false, time: '13:45' },
    { symbol: 'GOLD', type: 'Compra', amount: '$7,500', profit: '+$89.25', positive: true, time: '12:18' },
    { symbol: 'GBP/USD', type: 'Venda', amount: '$3,200', profit: '+$67.80', positive: true, time: '11:55' },
    { symbol: 'ETH/USD', type: 'Compra', amount: '$8,500', profit: '+$156.90', positive: true, time: '10:42' }
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        {userType === 'manager' ? 'Operações dos Clientes' : 'Operações Recentes'}
      </h3>
      <div className="space-y-3">
        {trades.map((trade, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${trade.positive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {trade.positive ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-white">{trade.symbol}</p>
                <p className="text-sm text-slate-400">{trade.type} • {trade.amount}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${trade.positive ? 'text-green-400' : 'text-red-400'}`}>
                {trade.profit}
              </p>
              <p className="text-sm text-slate-400">{trade.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
