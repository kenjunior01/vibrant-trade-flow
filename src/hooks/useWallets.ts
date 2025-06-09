import { useState, useEffect } from 'react';
import { Wallet } from '@/types/trading';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && token) {
      fetchWallets();
    }
  }, [user, token]);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/trading/wallet', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao carregar carteiras');
      const data = await res.json();
      setWallets(data || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao carregar carteiras",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async (name: string, description?: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/trading/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) throw new Error('Erro ao criar carteira');
      const data = await res.json();
      setWallets([...wallets, data]);
      toast({
        title: "Sucesso",
        description: "Carteira criada com sucesso!",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao criar carteira",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getDefaultWallet = () => {
    return wallets.find(wallet => wallet.is_default) || wallets[0];
  };

  return {
    wallets,
    loading,
    createWallet,
    getDefaultWallet,
    refetch: fetchWallets,
  };
}
