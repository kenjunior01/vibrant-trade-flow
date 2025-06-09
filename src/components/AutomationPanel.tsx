import React, { useState } from 'react';
import { Bot, Plus, Settings, Play, Pause, Trash2 } from 'lucide-react';

export const AutomationPanel = () => {
  const [showNewStrategy, setShowNewStrategy] = useState(false);
  const [strategyForm, setStrategyForm] = useState({
    name: '',
    client: '',
    asset: 'EUR/USD',
    capitalAllocation: 5,
    stopLossPct: 2,
    takeProfitPct: 4,
    maxDailyLoss: '',
    strategyType: 'dca',
    trailingStopDistance: '',
    entryIndicator: '',
    indicatorValue: '',
    dcaFrequency: '',
    rebalanceThreshold: '',
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
      takeProfit: '4%',
      trailingStopDistance: '0.5',
      entryIndicator: 'RSI',
      indicatorValue: 30,
      dcaFrequency: 'daily',
      rebalanceThreshold: '5%'
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
      takeProfit: '15%',
      trailingStopDistance: '1',
      entryIndicator: 'MACD',
      indicatorValue: 0,
      dcaFrequency: 'weekly',
      rebalanceThreshold: '10%'
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
      takeProfit: '6%',
      trailingStopDistance: '',
      entryIndicator: '',
      indicatorValue: '',
      dcaFrequency: '',
      rebalanceThreshold: ''
    }
  ];

  const clients = ['João Silva', 'Maria Santos', 'Carlos Oliveira', 'Ana Costa', 'Pedro Souza'];
  const assets = ['EUR/USD', 'GBP/USD', 'BTC/USD', 'ETH/USD', 'GOLD', 'S&P 500'];
  const strategyTypes = [
    { value: 'dca', label: 'DCA' },
    { value: 'grid', label: 'Grid' },
    { value: 'trailing_stop', label: 'Trailing Stop' },
    { value: 'momentum', label: 'Momentum' },
    { value: 'rebalancing', label: 'Rebalanceamento' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Monta o payload conforme o modelo do backend
    const payload = {
      name: strategyForm.name,
      client: strategyForm.client,
      symbol: strategyForm.asset,
      capital_allocation: Number(strategyForm.capitalAllocation),
      stop_loss_pct: Number(strategyForm.stopLossPct),
      take_profit_pct: Number(strategyForm.takeProfitPct),
      max_daily_loss: strategyForm.maxDailyLoss ? Number(strategyForm.maxDailyLoss) : null,
      strategy_type: strategyForm.strategyType,
      parameters: {
        trailing_stop_distance: strategyForm.trailingStopDistance ? Number(strategyForm.trailingStopDistance) : null,
        entry_indicator: strategyForm.entryIndicator,
        indicator_value: strategyForm.indicatorValue ? Number(strategyForm.indicatorValue) : null,
        dca_frequency: strategyForm.dcaFrequency,
        rebalance_threshold: strategyForm.rebalanceThreshold ? Number(strategyForm.rebalanceThreshold) : null,
      },
      start_date: strategyForm.startDate || null,
      end_date: strategyForm.endDate || null,
    };
    try {
      await fetch('http://localhost:5000/api/automation/strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setShowNewStrategy(false);
      setStrategyForm({
        name: '',
        client: '',
        asset: 'EUR/USD',
        capitalAllocation: 5,
        stopLossPct: 2,
        takeProfitPct: 4,
        maxDailyLoss: '',
        strategyType: 'dca',
        trailingStopDistance: '',
        entryIndicator: '',
        indicatorValue: '',
        dcaFrequency: '',
        rebalanceThreshold: '',
        startDate: '',
        endDate: ''
      });
    } catch (err) {
      // Trate o erro conforme necessário
    }
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
                    value={strategyForm.capitalAllocation}
                    onChange={(e) => setStrategyForm({...strategyForm, capitalAllocation: Number(e.target.value)})}
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
                    value={strategyForm.stopLossPct}
                    onChange={(e) => setStrategyForm({...strategyForm, stopLossPct: Number(e.target.value)})}
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
                    value={strategyForm.takeProfitPct}
                    onChange={(e) => setStrategyForm({...strategyForm, takeProfitPct: Number(e.target.value)})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Tipo de Estratégia</label>
                  <select
                    value={strategyForm.strategyType}
                    onChange={e => setStrategyForm({ ...strategyForm, strategyType: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    {strategyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
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

                {/* Trailing Stop Distance */}
                {strategyForm.strategyType === 'trailing_stop' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Trailing Stop (distância)</label>
                    <input
                      type="number"
                      min="0"
                      value={strategyForm.trailingStopDistance}
                      onChange={e => setStrategyForm({ ...strategyForm, trailingStopDistance: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                      placeholder="Ex: 0.5 (em % ou valor absoluto)"
                    />
                  </div>
                )}
                {/* Entry Indicator */}
                {strategyForm.strategyType === 'momentum' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Indicador de Entrada</label>
                      <select
                        value={strategyForm.entryIndicator}
                        onChange={e => setStrategyForm({ ...strategyForm, entryIndicator: e.target.value })}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Nenhum</option>
                        <option value="RSI">RSI</option>
                        <option value="MACD">MACD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Valor do Indicador</label>
                      <input
                        type="number"
                        value={strategyForm.indicatorValue}
                        onChange={e => setStrategyForm({ ...strategyForm, indicatorValue: e.target.value })}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="Ex: 30 (RSI), 0 (MACD)"
                      />
                    </div>
                  </>
                )}
                {strategyForm.strategyType === 'dca' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Frequência DCA</label>
                    <select
                      value={strategyForm.dcaFrequency}
                      onChange={e => setStrategyForm({ ...strategyForm, dcaFrequency: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Nenhuma</option>
                      <option value="daily">Diária</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                    </select>
                  </div>
                )}
                {strategyForm.strategyType === 'rebalancing' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Rebalanceamento (limite %)</label>
                    <input
                      type="number"
                      min="0"
                      value={strategyForm.rebalanceThreshold}
                      onChange={e => setStrategyForm({ ...strategyForm, rebalanceThreshold: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                      placeholder="Ex: 5 (rebalancear se variar 5%)"
                    />
                  </div>
                )}
                {/* Campo para maxDailyLoss */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Perda Máxima Diária (%)</label>
                  <input
                    type="number"
                    min="0"
                    value={strategyForm.maxDailyLoss}
                    onChange={e => setStrategyForm({ ...strategyForm, maxDailyLoss: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Ex: 10 (encerra operações se atingir 10%)"
                  />
                </div>
              </div>

              {/* Placeholder de Backtesting */}
              <div className="bg-slate-700/40 border border-slate-600/40 rounded-lg p-4 mt-4">
                <h4 className="text-white font-semibold mb-2">Prévia de Backtesting</h4>
                <p className="text-slate-300 text-sm">
                  Com esses parâmetros, em dados históricos da última semana, o lucro estimado seria <span className="text-green-400 font-bold">+R$ 1.250,00</span>.<br/>
                  (Simulação visual, sem cálculo real)
                </p>
                <div className="w-full h-16 bg-gradient-to-r from-green-400/30 to-blue-400/20 rounded mt-2 flex items-end">
                  <div className="bg-green-400 h-10 w-1/6 rounded-l" />
                  <div className="bg-blue-400 h-8 w-1/6" />
                  <div className="bg-green-400 h-12 w-1/6" />
                  <div className="bg-blue-400 h-6 w-1/6" />
                  <div className="bg-green-400 h-14 w-1/6" />
                  <div className="bg-blue-400 h-7 w-1/6 rounded-r" />
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

              <div className="grid grid-cols-2 md:grid-cols-8 gap-4 text-sm">
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
                <div>
                  <p className="text-slate-400">Trailing Stop</p>
                  <p className="font-semibold text-white">{strategy.trailingStopDistance || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-400">Indicador</p>
                  <p className="font-semibold text-white">{strategy.entryIndicator || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-400">Valor Indicador</p>
                  <p className="font-semibold text-white">{strategy.indicatorValue || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-400">DCA</p>
                  <p className="font-semibold text-white">{strategy.dcaFrequency || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-400">Rebalance (%)</p>
                  <p className="font-semibold text-white">{strategy.rebalanceThreshold || '-'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
