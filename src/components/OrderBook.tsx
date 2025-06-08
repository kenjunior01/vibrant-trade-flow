
import React from 'react';

export const OrderBook = () => {
  const sellOrders = [
    { price: 1.0867, size: 2.5, total: 15.2 },
    { price: 1.0865, size: 1.8, total: 12.7 },
    { price: 1.0863, size: 3.2, total: 10.9 },
    { price: 1.0861, size: 1.5, total: 7.7 },
    { price: 1.0859, size: 2.1, total: 6.2 },
  ];

  const buyOrders = [
    { price: 1.0857, size: 1.9, total: 4.1 },
    { price: 1.0855, size: 2.7, total: 6.8 },
    { price: 1.0853, size: 1.6, total: 9.5 },
    { price: 1.0851, size: 3.1, total: 11.1 },
    { price: 1.0849, size: 2.4, total: 14.2 },
  ];

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
          {sellOrders.reverse().map((order, index) => (
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
          <span className="text-white font-mono">0.0002</span>
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
