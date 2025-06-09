
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PlaceOrderParams {
  asset_symbol: string;
  side: 'buy' | 'sell';
  order_type: 'market' | 'limit' | 'stop';
  quantity: number;
  price?: number;
  wallet_id: string;
}

interface MarketData {
  symbol: string;
  price: number;
  timestamp: number;
  volume: number;
  change: number;
  changePercent: number;
}

export function useTradingAPI() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getMarketData = async (symbol: string): Promise<MarketData | null> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('get-market-data', {
        body: { symbol }
      });

      if (error) throw error;

      return data.data;
    } catch (error: any) {
      console.error('Error fetching market data:', error);
      toast({
        title: "Erro",
        description: "Erro ao buscar dados de mercado",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (params: PlaceOrderParams) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('place-order', {
        body: params
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: data.message || "Ordem executada com sucesso!",
      });

      return data;
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao executar ordem",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const closePosition = async (position_id: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('close-position', {
        body: { position_id }
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Posição fechada com sucesso!",
      });

      return data;
    } catch (error: any) {
      console.error('Error closing position:', error);
      toast({
        title: "Erro",
        description: "Erro ao fechar posição",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getWalletData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-wallet-data');

      if (error) throw error;

      return data.wallet;
    } catch (error: any) {
      console.error('Error fetching wallet data:', error);
      return null;
    }
  };

  return {
    loading,
    getMarketData,
    placeOrder,
    closePosition,
    getWalletData,
  };
}
