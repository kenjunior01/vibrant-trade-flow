import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface RecentTradesProps {
  userType: string;
}

export const RecentTrades: React.FC<RecentTradesProps> = ({ userType }) => {
  const { token } = useAuth();
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/trading/orders', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Erro ao buscar trades');
        const result = await res.json();
        // Map backend data to UI format
        if (Array.isArray(result.orders)) {
          setTrades(result.orders.map((order: any) => ({
            symbol: order.asset_symbol,
            type: order.side === 'buy' ? 'Compra' : 'Venda',
            amount: order.quantity ? `$${order.quantity}` : '-',
            profit: order.pnl !== undefined ? `${order.pnl >= 0 ? '+' : ''}$${order.pnl}` : '-',
            positive: order.pnl >= 0,
            time: order.created_at ? new Date(order.created_at).toLocaleTimeString() : '',
          })));
        } else {
          setTrades([]);
        }
      } catch {
        setTrades([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchTrades();
  }, [token]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        {userType === 'manager' ? 'Operações dos Clientes' : 'Operações Recentes'}
      </h3>
      <div className="space-y-3">
        {loading ? (
          <div className="text-slate-400">Carregando...</div>
        ) : trades.length === 0 ? (
          <div className="text-slate-400">Nenhuma operação encontrada.</div>
        ) : trades.map((trade, index) => (
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
