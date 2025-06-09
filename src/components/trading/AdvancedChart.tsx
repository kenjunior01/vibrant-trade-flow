
import React, { useState, useEffect } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, Activity, RefreshCw } from 'lucide-react';
import { useRealMarketData } from '@/hooks/useRealMarketData';
import { useHistoricalData } from '@/hooks/useHistoricalData';

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
  const [timeframe, setTimeframe] = useState('daily');
  const [period, setPeriod] = useState('1month');
  const [showIndicators, setShowIndicators] = useState(true);
  
  const { data: currentData, loading: priceLoading } = useRealMarketData(symbol);
  const { data: historicalData, loading: historyLoading, refetch } = useHistoricalData(symbol, timeframe, period);

  const symbols = [
    { value: 'EURUSD', label: 'EUR/USD' },
    { value: 'GBPUSD', label: 'GBP/USD' },
    { value: 'BTCUSD', label: 'BTC/USD' },
    { value: 'ETHUSD', label: 'ETH/USD' },
    { value: 'AAPL', label: 'Apple' },
    { value: 'GOOGL', label: 'Google' },
  ];

  const timeframes = [
    { value: 'daily', label: '1D' },
    { value: '60min', label: '1H' },
    { value: '15min', label: '15M' },
    { value: '5min', label: '5M' }
  ];

  const periods = [
    { value: '1week', label: '1W' },
    { value: '1month', label: '1M' },
    { value: '3months', label: '3M' },
    { value: '6months', label: '6M' },
    { value: '1year', label: '1Y' }
  ];

  // Calculate technical indicators
  const calculateIndicators = (data: any[]): CandleData[] => {
    if (!data || data.length === 0) return [];

    return data.map((candle, index) => {
      // SMA 20
      const sma20 = index >= 19 
        ? data.slice(index - 19, index + 1).reduce((sum, c) => sum + c.close, 0) / 20
        : undefined;

      // EMA 12
      const ema12 = index >= 11
        ? calculateEMA(data.slice(0, index + 1).map(c => c.close), 12)[index]
        : undefined;

      // RSI 14
      const rsi = index >= 13
        ? calculateRSI(data.slice(0, index + 1).map(c => c.close), 14)
        : undefined;

      return {
        ...candle,
        sma20: sma20 ? Number(sma20.toFixed(5)) : undefined,
        ema12: ema12 ? Number(ema12.toFixed(5)) : undefined,
        rsi: rsi ? Number(rsi.toFixed(2)) : undefined,
      };
    });
  };

  const calculateEMA = (prices: number[], period: number): number[] => {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    ema[0] = prices[0];
    for (let i = 1; i < prices.length; i++) {
      ema[i] = (prices[i] * multiplier) + (ema[i - 1] * (1 - multiplier));
    }
    
    return ema;
  };

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

  const chartData = calculateIndicators(historicalData);
  const currentPrice = currentData?.price || 0;
  const priceChange = currentData?.change || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Real Chart
              {currentData?.source && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {currentData.source}
                </Badge>
              )}
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

            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map(tf => (
                  <SelectItem key={tf.value} value={tf.value}>
                    {tf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periods.map(p => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              disabled={historyLoading}
            >
              <RefreshCw className={cn("h-4 w-4", historyLoading && "animate-spin")} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowIndicators(!showIndicators)}
            >
              <Activity className="h-4 w-4 mr-2" />
              Indicators
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">{currentPrice.toFixed(5)}</span>
            <Badge variant={priceChange >= 0 ? "default" : "destructive"} className="flex items-center">
              {priceChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(5)}
            </Badge>
          </div>
          
          {chartData.length > 0 && (
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <span>O: {chartData[chartData.length - 1]?.open.toFixed(5)}</span>
              <span>H: {chartData[chartData.length - 1]?.high.toFixed(5)}</span>
              <span>L: {chartData[chartData.length - 1]?.low.toFixed(5)}</span>
              <span>C: {chartData[chartData.length - 1]?.close.toFixed(5)}</span>
              {chartData[chartData.length - 1]?.rsi && (
                <span>RSI: {chartData[chartData.length - 1]?.rsi}</span>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {historyLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-muted-foreground">Carregando dados históricos reais...</div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-muted-foreground">Nenhum dado disponível</div>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis domain={['dataMin - 0.001', 'dataMax + 0.001']} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: any, name: string) => [value, name]}
                />
                
                <Line 
                  type="monotone" 
                  dataKey="close" 
                  stroke="var(--color-close)" 
                  strokeWidth={2}
                  dot={false}
                />
                
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
        )}

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
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
