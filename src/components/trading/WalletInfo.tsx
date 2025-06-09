
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTradingAPI } from '@/hooks/useTradingAPI';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface WalletData {
  id: string;
  balance: number;
  equity: number;
  margin_used: number;
  free_margin: number;
  unrealized_pnl: number;
  open_positions_count: number;
}

export function WalletInfo() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const { getWalletData } = useTradingAPI();

  useEffect(() => {
    const fetchWalletData = async () => {
      const data = await getWalletData();
      if (data) {
        setWalletData(data);
      }
    };

    fetchWalletData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchWalletData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!walletData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Carteira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4" />
            Saldo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${walletData.balance.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4" />
            Patrimônio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${walletData.equity.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Margem Livre</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            ${walletData.free_margin.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            {walletData.unrealized_pnl >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            P&L Não Realizado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            walletData.unrealized_pnl >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${walletData.unrealized_pnl.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
