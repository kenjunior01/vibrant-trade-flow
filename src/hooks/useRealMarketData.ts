
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RealMarketData {
  symbol: string;
  price: number;
  timestamp: number;
  volume: number;
  change: number;
  changePercent: number;
  source: string;
}

interface UseRealMarketDataReturn {
  data: RealMarketData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRealMarketData(symbol: string, updateInterval: number = 30000): UseRealMarketDataReturn {
  const [data, setData] = useState<RealMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error: supabaseError } = await supabase.functions.invoke('get-real-market-data', {
        body: { symbol }
      });

      if (supabaseError) throw supabaseError;

      if (result?.data) {
        setData(result.data);
      } else {
        throw new Error('No data received');
      }
    } catch (err: any) {
      console.error('Error fetching real market data:', err);
      setError(err.message || 'Failed to fetch market data');
      toast({
        title: "Erro ao buscar dados",
        description: "Erro ao buscar dados reais de mercado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchData();
  };

  useEffect(() => {
    if (!symbol) return;

    // Initial fetch
    fetchData();

    // Set up interval for updates
    let interval: NodeJS.Timeout;
    if (updateInterval > 0) {
      interval = setInterval(fetchData, updateInterval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [symbol, updateInterval]);

  return { data, loading, error, refetch };
}
