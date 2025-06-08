
import React, { useState } from 'react';
import { Bot, Plus, Settings, Play, Pause, Trash2 } from 'lucide-react';

export const AutomationPanel = () => {
  const [showNewStrategy, setShowNewStrategy] = useState(false);
  const [strategyForm, setStrategyForm] = useState({
    name: '',
    client: '',
    asset: 'EUR/USD',
    allocation: 5,
    stopLoss: 2,
    takeProfit: 4,
    type: 'market',
    startDate: '',
    endDate: ''
  });

  const strategies = [
    {
      id: 1,
      name: 'EUR/USD Scalping',
      client: 'João Silva',
      asset: 'EUR/USD',
      status: 'active',
      allocation: '5%',
      profit: '+$2,450.00',
      trades: 47,
      stopLoss: '2%',
      takeProfit: '4%'
    },
    {
      id: 2,
      name: 'BTC DCA Strategy',
      client: 'Maria Santos',
      asset: 'BTC/USD',
      status: 'active',
      allocation: '10%',
      profit: '+$8,920.50',
      trades: 23,
      stopLoss: '5%',
      takeProfit: '15%'
    },
    {
      id: 3,
      name: 'Gold Swing Trade',
      client: 'Carlos Oliveira',
      asset: 'GOLD',
      status: 'paused',
      allocation: '8%',
      profit: '-$125.75',
      trades: 8,
      stopLoss: '3%',
      takeProfit: '6%'
    }
  ];

  const clients = ['João Silva', 'Maria Santos', 'Carlos Oliveira', 'Ana Costa', 'Pedro Souza'];
  const assets = ['EUR/USD', 'GBP/USD', 'BTC/USD', 'ETH/USD', 'GOLD', 'S&P 500'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nova estratégia:', strategyForm);
    setShowNewStrategy(false);
    setStrategyForm({
      name: '',
      client: '',
      asset: 'EUR/USD',
      allocation: 5,
      stopLoss: 2,
      takeProfit: 4,
      type: 'market',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Bot className="h-6 w-6 mr-3 text-blue-400" />
          Automação de Trading
        </h2>
        <button
          onClick={() => setShowNewStrategy(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Estratégia
        </button>
      </div>

      {/* Strategy Form Modal */}
      {showNewStrategy && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-white mb-6">Configurar Nova Estratégia</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Nome da Estratégia</label>
                  <input
                    type="text"
                    value={strategyForm.name}
                    onChange={(e) => setStrategyForm({...strategyForm, name: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Ex: EUR/USD Scalping"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Cliente</label>
                  <select
                    value={strategyForm.client}
                    onChange={(e) => setStrategyForm({...strategyForm, client: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    required
                  >
                    <option value="">Selecionar cliente</option>
                    {clients.map(client => (
                      <option key={client} value={client}>{client}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Ativo</label>
                  <select
                    value={strategyForm.asset}
                    onChange={(e) => setStrategyForm({...strategyForm, asset: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    {assets.map(asset => (
                      <option key={asset} value={asset}>{asset}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Alocação (% do saldo)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={strategyForm.allocation}
                    onChange={(e) => setStrategyForm({...strategyForm, allocation: Number(e.target.value)})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Stop Loss (%)</label>
                  <input
                    type="number"
                    min="0.1"
                    max="20"
                    step="0.1"
                    value={strategyForm.stopLoss}
                    onChange={(e) => setStrategyForm({...strategyForm, stopLoss: Number(e.target.value)})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Take Profit (%)</label>
                  <input
                    type="number"
                    min="0.1"
                    max="50"
                    step="0.1"
                    value={strategyForm.takeProfit}
                    onChange={(e) => setStrategyForm({...strategyForm, takeProfit: Number(e.target.value)})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Tipo de Ordem</label>
                  <select
                    value={strategyForm.type}
                    onChange={(e) => setStrategyForm({...strategyForm, type: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="market">Ordem a Mercado</option>
                    <option value="limit">Ordem Limite</option>
                    <option value="stop">Ordem Stop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Data de Início</label>
                  <input
                    type="datetime-local"
                    value={strategyForm.startDate}
                    onChange={(e) => setStrategyForm({...strategyForm, startDate: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Data de Fim</label>
                  <input
                    type="datetime-local"
                    value={strategyForm.endDate}
                    onChange={(e) => setStrategyForm({...strategyForm, endDate: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Criar Estratégia
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewStrategy(false)}
                  className="bg-slate-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Strategies List */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Estratégias Ativas</h3>
        
        <div className="space-y-4">
          {strategies.map((strategy) => (
            <div key={strategy.id} className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    strategy.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{strategy.name}</h4>
                    <p className="text-sm text-slate-400">Cliente: {strategy.client}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    strategy.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {strategy.status === 'active' ? 'Ativo' : 'Pausado'}
                  </span>
                  
                  <button className="p-1 rounded hover:bg-slate-600/50 transition-colors">
                    {strategy.status === 'active' ? (
                      <Pause className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Play className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                  
                  <button className="p-1 rounded hover:bg-slate-600/50 transition-colors">
                    <Settings className="h-4 w-4 text-slate-400" />
                  </button>
                  
                  <button className="p-1 rounded hover:bg-red-500/50 transition-colors">
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Ativo</p>
                  <p className="font-semibold text-white">{strategy.asset}</p>
                </div>
                <div>
                  <p className="text-slate-400">Alocação</p>
                  <p className="font-semibold text-white">{strategy.allocation}</p>
                </div>
                <div>
                  <p className="text-slate-400">P&L</p>
                  <p className={`font-semibold ${
                    strategy.profit.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {strategy.profit}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Operações</p>
                  <p className="font-semibold text-white">{strategy.trades}</p>
                </div>
                <div>
                  <p className="text-slate-400">Stop Loss</p>
                  <p className="font-semibold text-red-400">{strategy.stopLoss}</p>
                </div>
                <div>
                  <p className="text-slate-400">Take Profit</p>
                  <p className="font-semibold text-green-400">{strategy.takeProfit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
