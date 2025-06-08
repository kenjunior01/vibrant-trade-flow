
import React, { useState, useEffect } from 'react';

interface TickerData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export const MarketTicker = () => {
  const [tickerData, setTickerData] = useState<TickerData[]>([
    { symbol: 'EUR/USD', price: 1.0856, change: 0.0024, changePercent: 0.22 },
    { symbol: 'GBP/USD', price: 1.2745, change: -0.0018, changePercent: -0.14 },
    { symbol: 'BTC/USD', price: 43250.00, change: 1250.50, changePercent: 2.98 },
    { symbol: 'ETH/USD', price: 2650.25, change: -45.75, changePercent: -1.70 },
    { symbol: 'GOLD', price: 2034.50, change: 12.30, changePercent: 0.61 },
    { symbol: 'S&P 500', price: 4785.60, change: 23.40, changePercent: 0.49 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData(prev => prev.map(item => ({
        ...item,
        price: item.price + (Math.random() - 0.5) * (item.price * 0.001),
        change: (Math.random() - 0.5) * (item.price * 0.002),
        changePercent: (Math.random() - 0.5) * 2
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50 py-2 overflow-hidden">
      <div className="animate-marquee flex space-x-8 whitespace-nowrap">
        {tickerData.concat(tickerData).map((item, index) => (
          <div key={index} className="flex items-center space-x-2 px-4">
            <span className="font-semibold text-blue-300">{item.symbol}</span>
            <span className="text-white font-mono">${item.price.toFixed(item.symbol.includes('/') ? 4 : 2)}</span>
            <span className={`text-sm font-medium ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
