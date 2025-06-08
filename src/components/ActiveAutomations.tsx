
import React from 'react';
import { Bot, Play, Pause, TrendingUp, AlertTriangle } from 'lucide-react';

export const ActiveAutomations = () => {
  const automations = [
    { 
      name: 'EUR/USD Scalping', 
      status: 'active', 
      profit: '+$2,450.00', 
      trades: 47, 
      client: 'João Silva',
      riskLevel: 'Baixo'
    },
    { 
      name: 'BTC DCA Strategy', 
      status: 'active', 
      profit: '+$8,920.50', 
      trades: 23, 
      client: 'Maria Santos',
      riskLevel: 'Médio'
    },
    { 
      name: 'Gold Swing Trade', 
      status: 'paused', 
      profit: '-$125.75', 
      trades: 8, 
      client: 'Carlos Oliveira',
      riskLevel: 'Alto'
    },
    { 
      name: 'Portfolio Rebalance', 
      status: 'active', 
      profit: '+$1,567.25', 
      trades: 12, 
      client: 'Ana Costa',
      riskLevel: 'Baixo'
    }
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Bot className="h-5 w-5 mr-2 text-blue-400" />
          Automações Ativas
        </h3>
        <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          Nova Automação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automations.map((automation, index) => (
          <div key={index} className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-white">{automation.name}</h4>
                <p className="text-sm text-slate-400">Cliente: {automation.client}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  automation.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {automation.status === 'active' ? 'Ativo' : 'Pausado'}
                </span>
                <button className="p-1 rounded hover:bg-slate-600/50 transition-colors">
                  {automation.status === 'active' ? (
                    <Pause className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Play className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-slate-400">Lucro/Prejuízo</p>
                <p className={`font-semibold ${
                  automation.profit.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {automation.profit}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Operações</p>
                <p className="font-semibold text-white">{automation.trades}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                automation.riskLevel === 'Baixo' 
                  ? 'bg-green-500/20 text-green-400'
                  : automation.riskLevel === 'Médio'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                Risco {automation.riskLevel}
              </span>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                Configurar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
