
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

interface RealOrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  lastPrice: number;
  source: string;
}

export function useRealOrderBook(symbol: string, updateInterval: number = 5000) {
  const [orderBook, setOrderBook] = useState<RealOrderBookData>({
    bids: [],
    asks: [],
    spread: 0,
    lastPrice: 0,
    source: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchOrderBook = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-real-orderbook', {
        body: { symbol }
      });

      if (error) throw error;

      if (data) {
        setOrderBook(data);
      }
    } catch (error) {
      console.error('Error fetching real order book:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!symbol) return;

    fetchOrderBook();

    const interval = setInterval(fetchOrderBook, updateInterval);
    return () => clearInterval(interval);
  }, [symbol, updateInterval]);

  return { orderBook, loading, refetch: fetchOrderBook };
}
