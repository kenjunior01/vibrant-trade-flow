
import { useState, useEffect } from 'react';
import { useTradingAPI } from './useTradingAPI';

interface MarketDataHook {
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  isLoading: boolean;
  lastUpdate: Date | null;
}

export function useMarketData(symbol: string, updateInterval: number = 30000) {
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

  const { getMarketData } = useTradingAPI();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        const data = await getMarketData(symbol);
        if (data) {
          setMarketData(prev => ({
            price: data.price,
            change: data.change,
            changePercent: data.changePercent,
            volume: data.volume,
            high24h: prev.high24h || data.price * 1.02, // Mock 24h high
            low24h: prev.low24h || data.price * 0.98, // Mock 24h low
            isLoading: false,
            lastUpdate: new Date(),
          }));
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
        setMarketData(prev => ({ ...prev, isLoading: false }));
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval for updates
    if (updateInterval > 0) {
      interval = setInterval(fetchData, updateInterval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [symbol, updateInterval, getMarketData]);

  return marketData;
}
