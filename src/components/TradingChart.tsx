import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Maximize2 } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  Bar,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { io } from 'socket.io-client';

export const TradingChart = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('EUR/USD');
  const [timeframe, setTimeframe] = useState('1D');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const wsRef = useRef<any>(null);

  useEffect(() => {
    let symbol = selectedSymbol.replace('/', '').replace(' ', '').toUpperCase();
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/market/chart/${symbol}?interval=${timeframe}`);
        if (!res.ok) throw new Error('Erro ao buscar dados do gráfico');
        const data = await res.json();
        setChartData(data.ohlc || []);
        if (data.ohlc && data.ohlc.length > 0) {
          setCurrentPrice(data.ohlc[data.ohlc.length - 1].close);
        }
      } catch (err) {
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, [selectedSymbol, timeframe]);

  useEffect(() => {
    let symbol = selectedSymbol.replace('/', '').replace(' ', '').toUpperCase();
    const socket = io('http://localhost:5000/market_data');
    socket.on('market_quotes', (quotes) => {
      const quote = Array.isArray(quotes)
        ? quotes.find((q) => q.symbol.replace('/', '').replace(' ', '').toUpperCase() === symbol)
        : null;
      if (quote && chartData.length > 0) {
        setCurrentPrice(quote.price);
        // Atualiza o último candle com o novo preço
        setChartData((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            close: quote.price,
          };
          return updated;
        });
      }
    });
    wsRef.current = socket;
    return () => {
      socket.disconnect();
    };
  }, [selectedSymbol, chartData]);

  const symbols = ['EUR/USD', 'GBP/USD', 'BTC/USD', 'ETH/USD', 'GOLD', 'S&P 500'];
  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D'];
  const last = chartData.length > 0 ? chartData[chartData.length - 1] : null;

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
        <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors">
          <Maximize2 className="h-4 w-4 text-slate-300" />
        </button>
      </div>
      {last && (
        <div className="flex items-center space-x-8 mb-4 text-xs text-slate-300">
          <span>Open: <span className="text-white font-mono">{last.open}</span></span>
          <span>High: <span className="text-white font-mono">{last.high}</span></span>
          <span>Low: <span className="text-white font-mono">{last.low}</span></span>
          <span>Close: <span className="text-white font-mono">{currentPrice ?? last.close}</span></span>
          <span>Volume: <span className="text-white font-mono">{last.volume}</span></span>
        </div>
      )}
      <div className="h-96 w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-400">Carregando gráfico...</div>
        ) : (
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={v => new Date(v).toLocaleString()} />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                {/* Candlestick bars (if recharts supports, else use Bar for OHLC) */}
                <Bar dataKey="close" fill="#3B82F6" />
                {/* Indicadores */}
                {chartData[0]?.sma && <Line type="monotone" dataKey="sma" stroke="#F59E42" dot={false} />}
                {chartData[0]?.rsi && <Line type="monotone" dataKey="rsi" stroke="#10B981" dot={false} />}
                {chartData[0]?.macd && <Line type="monotone" dataKey="macd" stroke="#6366F1" dot={false} />}
                <Legend />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>
    </div>
  );
};
