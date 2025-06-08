
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Position } from '@/types/trading';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function usePositions() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchPositions();
      subscribeToPositions();
    }
  }, [user]);

  const fetchPositions = async () => {
    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('user_id', user?.id)
        .order('opened_at', { ascending: false });

      if (error) throw error;
      setPositions(data || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao carregar posições",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPositions = () => {
    const channel = supabase
      .channel('positions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'positions',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchPositions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createPosition = async (positionData: Omit<Position, 'id' | 'user_id' | 'opened_at' | 'pnl'>) => {
    try {
      const { data, error } = await supabase
        .from('positions')
        .insert({
          ...positionData,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Posição aberta com sucesso!",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao abrir posição",
        variant: "destructive",
      });
      throw error;
    }
  };

  const closePosition = async (positionId: string, closePrice: number) => {
    try {
      const { error } = await supabase
        .from('positions')
        .update({
          status: 'closed',
          close_price: closePrice,
          closed_at: new Date().toISOString(),
        })
        .eq('id', positionId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Posição fechada com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao fechar posição",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    positions,
    loading,
    createPosition,
    closePosition,
    refetch: fetchPositions,
  };
}
