import { useState, useEffect } from 'react';
import { Position } from '@/types/trading';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function usePositions() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && token) {
      fetchPositions();
    }
  }, [user, token]);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/trading/positions', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao carregar posições');
      const data = await res.json();
      setPositions((data || []).map(pos => ({
        ...pos,
        type: pos.type as 'long' | 'short',
        status: pos.status as 'open' | 'closed',
      })));
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
      const res = await fetch('http://localhost:5000/api/trading/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(positionData),
      });
      if (!res.ok) throw new Error('Erro ao abrir posição');
      const data = await res.json();
      const newPosition: Position = {
        ...data,
        type: data.type as 'long' | 'short',
        status: data.status as 'open' | 'closed',
      };
      setPositions([newPosition, ...positions]);
      toast({
        title: "Sucesso",
        description: "Posição aberta com sucesso!",
      });
      return newPosition;
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
