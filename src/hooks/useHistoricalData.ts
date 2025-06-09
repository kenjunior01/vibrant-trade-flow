
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HistoricalCandle {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function useHistoricalData(
  symbol: string, 
  interval: string = 'daily', 
  period: string = '1month'
) {
  const [data, setData] = useState<HistoricalCandle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoricalData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error: supabaseError } = await supabase.functions.invoke('get-historical-data', {
        body: { symbol, interval, period }
      });

      if (supabaseError) throw supabaseError;

      if (result?.data) {
        setData(result.data);
      }
    } catch (err: any) {
      console.error('Error fetching historical data:', err);
      setError(err.message || 'Failed to fetch historical data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!symbol) return;
    fetchHistoricalData();
  }, [symbol, interval, period]);

  return { data, loading, error, refetch: fetchHistoricalData };
}
