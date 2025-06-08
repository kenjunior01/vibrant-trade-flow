
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
      
      const typedPositions = (data || []).map(pos => ({
        ...pos,
        type: pos.type as 'long' | 'short',
        status: pos.status as 'open' | 'closed'
      }));
      
      setPositions(typedPositions);
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

  const createPosition = async (positionData: Omit<Position, 'id' | 'user_id' | 'opened_at'>) => {
    try {
      const { data, error } = await supabase
        .from('positions')
        .insert({
          user_id: user?.id,
          ...positionData,
        })
        .select()
        .single();

      if (error) throw error;

      setPositions([data, ...positions]);
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

  return {
    positions,
    loading,
    createPosition,
    refetch: fetchPositions,
  };
}
