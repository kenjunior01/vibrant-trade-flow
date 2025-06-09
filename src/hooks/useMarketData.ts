
import { useState, useEffect } from 'react';
import { useRealMarketData } from './useRealMarketData';

interface MarketDataHook {
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  isLoading: boolean;
  lastUpdate: Date | null;
  source?: string;
}

export function useMarketData(symbol: string, updateInterval: number = 30000): MarketDataHook {
  const { data: realData, loading, error } = useRealMarketData(symbol, updateInterval);
  const [marketData, setMarketData] = useState<MarketDataHook>({
    price: 0,
    change: 0,
    changePercent: 0,
    volume: 0,
    high24h: 0,
    low24h: 0,
    isLoading: true,
    lastUpdate: null,
  });

  useEffect(() => {
    if (realData) {
      setMarketData({
        price: realData.price,
        change: realData.change,
        changePercent: realData.changePercent,
        volume: realData.volume,
        high24h: realData.price * 1.02, // Approximate 24h high
        low24h: realData.price * 0.98,  // Approximate 24h low
        isLoading: false,
        lastUpdate: new Date(realData.timestamp),
        source: realData.source
      });
    } else if (loading) {
      setMarketData(prev => ({ ...prev, isLoading: true }));
    } else if (error) {
      setMarketData(prev => ({ ...prev, isLoading: false }));
    }
  }, [realData, loading, error]);

  return marketData;
}
