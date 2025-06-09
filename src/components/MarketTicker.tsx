import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

interface TickerData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export const MarketTicker = () => {
  const [tickerData, setTickerData] = useState<TickerData[]>([]);

  useEffect(() => {
    const socket = io('http://localhost:5000/market_data');
    socket.on('market_quotes', (quotes: TickerData[]) => {
      setTickerData(quotes);
    });
    return () => {
      socket.disconnect();
    };
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
