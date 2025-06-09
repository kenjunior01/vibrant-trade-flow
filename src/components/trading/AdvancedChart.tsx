
import React, { useState, useEffect } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { useTradingAPI } from '@/hooks/useTradingAPI';

interface CandleData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
  ema12?: number;
  rsi?: number;
}

const chartConfig = {
  close: {
    label: "Close",
    color: "hsl(var(--chart-1))",
  },
  volume: {
    label: "Volume",
    color: "hsl(var(--chart-2))",
  },
  sma20: {
    label: "SMA 20",
    color: "hsl(var(--chart-3))",
  },
  ema12: {
    label: "EMA 12",
    color: "hsl(var(--chart-4))",
  },
};

export function AdvancedChart() {
  const [symbol, setSymbol] = useState('EURUSD');
  const [timeframe, setTimeframe] = useState('1H');
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [showIndicators, setShowIndicators] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const { getMarketData, loading } = useTradingAPI();

  const symbols = [
    { value: 'EURUSD', label: 'EUR/USD' },
    { value: 'GBPUSD', label: 'GBP/USD' },
    { value: 'BTCUSD', label: 'BTC/USD' },
    { value: 'ETHUSD', label: 'ETH/USD' },
    { value: 'AAPL', label: 'Apple' },
    { value: 'GOOGL', label: 'Google' },
  ];

  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D'];

  // Generate mock chart data with technical indicators
  const generateChartData = () => {
    const data: CandleData[] = [];
    let price = symbol === 'BTCUSD' ? 43000 : symbol === 'ETHUSD' ? 2650 : 1.0856;
    
    for (let i = 0; i < 100; i++) {
      const timestamp = new Date(Date.now() - (100 - i) * 3600000).toISOString();
      const volatility = price * 0.002;
      const change = (Math.random() - 0.5) * volatility;
      
      const open = price;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      const volume = Math.random() * 1000000 + 500000;

      data.push({
        timestamp,
        open: Number(open.toFixed(4)),
        high: Number(high.toFixed(4)),
        low: Number(low.toFixed(4)),
        close: Number(close.toFixed(4)),
        volume: Math.round(volume),
      });

      price = close;
    }

    // Calculate technical indicators
    return data.map((candle, index) => {
      const sma20 = index >= 19 
        ? data.slice(index - 19, index + 1).reduce((sum, c) => sum + c.close, 0) / 20
        : undefined;

      const ema12 = index >= 11
        ? calculateEMA(data.slice(0, index + 1).map(c => c.close), 12)[index]
        : undefined;

      const rsi = index >= 13
        ? calculateRSI(data.slice(0, index + 1).map(c => c.close), 14)
        : undefined;

      return {
        ...candle,
        sma20: sma20 ? Number(sma20.toFixed(4)) : undefined,
        ema12: ema12 ? Number(ema12.toFixed(4)) : undefined,
        rsi: rsi ? Number(rsi.toFixed(2)) : undefined,
      };
    });
  };

  // Calculate EMA
  const calculateEMA = (prices: number[], period: number): number[] => {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    ema[0] = prices[0];
    for (let i = 1; i < prices.length; i++) {
      ema[i] = (prices[i] * multiplier) + (ema[i - 1] * (1 - multiplier));
    }
    
    return ema;
  };

  // Calculate RSI
  const calculateRSI = (prices: number[], period: number): number => {
    const changes = [];
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1]);
    }

    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? -change : 0);

    const avgGain = gains.slice(-period).reduce((sum, gain) => sum + gain, 0) / period;
    const avgLoss = losses.slice(-period).reduce((sum, loss) => sum + loss, 0) / period;

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

  useEffect(() => {
    const data = generateChartData();
    setChartData(data);
    
    if (data.length > 0) {
      const latest = data[data.length - 1];
      const previous = data[data.length - 2];
      setCurrentPrice(latest.close);
      setPriceChange(latest.close - previous.close);
    }
  }, [symbol, timeframe]);

  // Fetch real market data
  useEffect(() => {
    const fetchData = async () => {
      const marketData = await getMarketData(symbol);
      if (marketData) {
        setCurrentPrice(marketData.price);
        setPriceChange(marketData.change);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [symbol]);

  const CustomCandlestick = (props: any) => {
    const { payload, x, y, width, height } = props;
    if (!payload) return null;

    const { open, high, low, close } = payload;
    const isGreen = close > open;
    const color = isGreen ? '#10b981' : '#ef4444';
    
    const bodyHeight = Math.abs(close - open) * height / (payload.high - payload.low);
    const bodyY = y + (Math.max(high - Math.max(open, close), 0) * height / (high - low));

    return (
      <g>
        {/* Wick */}
        <line
          x1={x + width / 2}
          y1={y}
          x2={x + width / 2}
          y2={y + height}
          stroke={color}
          strokeWidth={1}
        />
        {/* Body */}
        <rect
          x={x + width * 0.2}
          y={bodyY}
          width={width * 0.6}
          height={Math.max(bodyHeight, 1)}
          fill={color}
        />
      </g>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Advanced Chart
            </CardTitle>
            
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {symbols.map(sym => (
                  <SelectItem key={sym.value} value={sym.value}>
                    {sym.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex space-x-1">
              {timeframes.map(tf => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </Button>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowIndicators(!showIndicators)}
          >
            <Activity className="h-4 w-4 mr-2" />
            Indicators
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">{currentPrice.toFixed(4)}</span>
            <Badge variant={priceChange >= 0 ? "default" : "destructive"} className="flex items-center">
              {priceChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(4)}
            </Badge>
          </div>
          
          {chartData.length > 0 && (
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <span>O: {chartData[chartData.length - 1]?.open.toFixed(4)}</span>
              <span>H: {chartData[chartData.length - 1]?.high.toFixed(4)}</span>
              <span>L: {chartData[chartData.length - 1]?.low.toFixed(4)}</span>
              <span>C: {chartData[chartData.length - 1]?.close.toFixed(4)}</span>
              {chartData[chartData.length - 1]?.rsi && (
                <span>RSI: {chartData[chartData.length - 1]?.rsi}</span>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              />
              <YAxis domain={['dataMin - 0.001', 'dataMax + 0.001']} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: any, name: string) => [value, name]}
              />
              
              {/* Candlestick bodies */}
              <Bar dataKey="close" shape={<CustomCandlestick />} />
              
              {/* Technical indicators */}
              {showIndicators && (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="sma20" 
                    stroke="var(--color-sma20)" 
                    strokeWidth={1}
                    dot={false}
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ema12" 
                    stroke="var(--color-ema12)" 
                    strokeWidth={1}
                    dot={false}
                    connectNulls={false}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* RSI Indicator */}
        {showIndicators && chartData.length > 0 && (
          <div className="mt-4">
            <ChartContainer config={chartConfig} className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData.slice(-30)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis domain={[0, 100]} />
                  <Tooltip labelFormatter={(value) => `RSI: ${value}`} />
                  <Line 
                    type="monotone" 
                    dataKey="rsi" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={false}
                  />
                  {/* RSI levels */}
                  <Line 
                    type="monotone" 
                    dataKey={() => 70} 
                    stroke="#ef4444" 
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={() => 30} 
                    stroke="#10b981" 
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
