
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Wallet } from '@/types/trading';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWallets();
    }
  }, [user]);

  const fetchWallets = async () => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
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
      const { data, error } = await supabase
        .from('wallets')
        .insert({
          user_id: user?.id,
          name,
          description,
          is_default: wallets.length === 0,
        })
        .select()
        .single();

      if (error) throw error;

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
