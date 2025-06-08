
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Maximize2 } from 'lucide-react';

export const TradingChart = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('EUR/USD');
  const [timeframe, setTimeframe] = useState('1H');
  const [chartData, setChartData] = useState([]);

  // Simulate candlestick data
  useEffect(() => {
    const generateCandles = () => {
      const candles = [];
      let price = 1.0856;
      
      for (let i = 0; i < 100; i++) {
        const open = price;
        const volatility = 0.001;
        const change = (Math.random() - 0.5) * volatility;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * 0.5;
        
        candles.push({ open, high, low, close, time: i });
        price = close;
      }
      
      return candles;
    };

    setChartData(generateCandles());
  }, [selectedSymbol, timeframe]);

  const symbols = ['EUR/USD', 'GBP/USD', 'BTC/USD', 'ETH/USD', 'GOLD', 'S&P 500'];
  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D'];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <select 
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
          >
            {symbols.map(symbol => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>
          
          <div className="flex space-x-1">
            {timeframes.map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  timeframe === tf 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors">
            <BarChart3 className="h-4 w-4 text-slate-300" />
          </button>
          <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors">
            <Maximize2 className="h-4 w-4 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Price Info */}
      <div className="flex items-center space-x-6 mb-6">
        <div>
          <span className="text-2xl font-bold text-white">1.0856</span>
          <span className="text-green-400 ml-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +0.0024 (+0.22%)
          </span>
        </div>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Open:</span>
            <span className="text-white ml-1">1.0832</span>
          </div>
          <div>
            <span className="text-slate-400">High:</span>
            <span className="text-white ml-1">1.0867</span>
          </div>
          <div>
            <span className="text-slate-400">Low:</span>
            <span className="text-white ml-1">1.0829</span>
          </div>
          <div>
            <span className="text-slate-400">Volume:</span>
            <span className="text-white ml-1">2.4M</span>
          </div>
        </div>
      </div>

      {/* Simulated Chart Area */}
      <div className="h-96 bg-slate-900/50 rounded-lg p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
        
        {/* Grid lines */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className="absolute border-slate-700/30 border-dashed"
              style={{ 
                top: `${i * 10}%`, 
                left: 0, 
                right: 0, 
                borderTopWidth: i > 0 ? '1px' : 0 
              }}
            />
          ))}
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className="absolute border-slate-700/30 border-dashed"
              style={{ 
                left: `${i * 6.67}%`, 
                top: 0, 
                bottom: 0, 
                borderLeftWidth: i > 0 ? '1px' : 0 
              }}
            />
          ))}
        </div>

        {/* Simulated candlestick chart */}
        <div className="relative h-full flex items-end space-x-1 px-4">
          {chartData.slice(-50).map((candle, index) => {
            const isGreen = candle.close > candle.open;
            const bodyHeight = Math.abs(candle.close - candle.open) * 10000;
            const wickTop = (candle.high - Math.max(candle.open, candle.close)) * 10000;
            const wickBottom = (Math.min(candle.open, candle.close) - candle.low) * 10000;
            
            return (
              <div key={index} className="flex flex-col items-center" style={{ width: '6px' }}>
                {/* Upper wick */}
                <div 
                  className={`w-0.5 ${isGreen ? 'bg-green-400' : 'bg-red-400'}`}
                  style={{ height: `${wickTop + 2}px` }}
                />
                {/* Body */}
                <div 
                  className={`w-full ${isGreen ? 'bg-green-400' : 'bg-red-400'} min-h-[2px]`}
                  style={{ height: `${Math.max(bodyHeight, 2)}px` }}
                />
                {/* Lower wick */}
                <div 
                  className={`w-0.5 ${isGreen ? 'bg-green-400' : 'bg-red-400'}`}
                  style={{ height: `${wickBottom + 2}px` }}
                />
              </div>
            );
          })}
        </div>

        {/* Price levels */}
        <div className="absolute right-0 top-0 bottom-0 w-20 flex flex-col justify-between py-4 text-xs text-slate-400">
          <span>1.0890</span>
          <span>1.0870</span>
          <span className="text-blue-400 font-bold">1.0856</span>
          <span>1.0840</span>
          <span>1.0820</span>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600 transition-colors">
            COMPRAR
          </button>
          <button className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 transition-colors">
            VENDER
          </button>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <span>Spread: 0.0001</span>
          <span>•</span>
          <span>Última atualização: agora</span>
        </div>
      </div>
    </div>
  );
};
