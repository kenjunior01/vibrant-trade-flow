import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

export const OrderBook = ({ symbol = 'EURUSD' }) => {
  const [sellOrders, setSellOrders] = useState([]);
  const [buyOrders, setBuyOrders] = useState([]);
  const [spread, setSpread] = useState(0);
  const wsRef = useRef<any>(null);

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/market/orderbook/${symbol}`);
        if (!res.ok) throw new Error('Erro ao buscar livro de ofertas');
        const data = await res.json();
        setSellOrders(data.sell || []);
        setBuyOrders(data.buy || []);
        setSpread(data.spread || 0);
      } catch (err) {
        setSellOrders([]);
        setBuyOrders([]);
        setSpread(0);
      }
    };
    fetchOrderBook();
  }, [symbol]);

  useEffect(() => {
    const socket = io('http://localhost:5000/market_data');
    const eventName = `order_book_update_${symbol}`;
    socket.on(eventName, (data) => {
      setSellOrders(data.sell || []);
      setBuyOrders(data.buy || []);
      setSpread(data.spread || 0);
    });
    wsRef.current = socket;
    return () => {
      socket.off(eventName);
      socket.disconnect();
    };
  }, [symbol]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Livro de Ofertas</h3>
      <div className="space-y-4">
        {/* Header */}
        <div className="grid grid-cols-3 gap-4 text-xs text-slate-400 font-medium">
          <span>Preço</span>
          <span className="text-right">Tamanho</span>
          <span className="text-right">Total</span>
        </div>
        {/* Sell Orders */}
        <div className="space-y-1">
          {sellOrders.slice().reverse().map((order, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 text-sm py-1 px-2 rounded hover:bg-red-500/10 transition-colors relative">
              <div 
                className="absolute inset-y-0 right-0 bg-red-500/20"
                style={{ width: `${(order.total / 15.2) * 100}%` }}
              />
              <span className="text-red-400 font-mono relative z-10">{order.price.toFixed(4)}</span>
              <span className="text-white text-right relative z-10">{order.size.toFixed(1)}</span>
              <span className="text-slate-300 text-right relative z-10">{order.total.toFixed(1)}</span>
            </div>
          ))}
        </div>
        {/* Spread */}
        <div className="py-2 text-center border-t border-b border-slate-700/50">
          <span className="text-slate-400 text-sm">Spread: </span>
          <span className="text-white font-mono">{spread.toFixed(4)}</span>
        </div>
        {/* Buy Orders */}
        <div className="space-y-1">
          {buyOrders.map((order, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 text-sm py-1 px-2 rounded hover:bg-green-500/10 transition-colors relative">
              <div 
                className="absolute inset-y-0 right-0 bg-green-500/20"
                style={{ width: `${(order.total / 14.2) * 100}%` }}
              />
              <span className="text-green-400 font-mono relative z-10">{order.price.toFixed(4)}</span>
              <span className="text-white text-right relative z-10">{order.size.toFixed(1)}</span>
              <span className="text-slate-300 text-right relative z-10">{order.total.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Order */}
      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">
            Comprar a Mercado
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">
            Vender a Mercado
          </button>
        </div>
      </div>
    </div>
  );
};
