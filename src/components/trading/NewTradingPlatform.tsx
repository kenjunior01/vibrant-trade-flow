import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWallets } from '@/hooks/useWallets';
import { usePositions } from '@/hooks/usePositions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { FlaskMarketTicker } from './FlaskMarketTicker';
import { FlaskNewsPanel } from './FlaskNewsPanel';

export function NewTradingPlatform() {
  const { user, signOut } = useAuth();
  const { wallets, getDefaultWallet } = useWallets();
  const { positions, createPosition } = usePositions();
  
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [amount, setAmount] = useState('');
  const [leverage, setLeverage] = useState('1');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [price, setPrice] = useState('');

  const defaultWallet = getDefaultWallet();
  const openPositions = positions.filter(p => p.status === 'open');
  const totalPnL = openPositions.reduce((sum, pos) => sum + pos.pnl, 0);

  const handleOpenPosition = async (side: 'long' | 'short') => {
    if (!amount || !defaultWallet) return;

    try {
      await createPosition({
        wallet_id: defaultWallet.id,
        asset_symbol: symbol,
        type: side,
        amount: parseFloat(amount),
        open_price: orderType === 'market' ? 50000 : parseFloat(price), // Mock price
        leverage: parseInt(leverage),
        status: 'open',
        pnl: 0,
        close_price: undefined,
        closed_at: undefined,
      });

      setAmount('');
      setPrice('');
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Trading Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Olá, {user?.full_name || user?.email}
              </span>
              <Badge variant={user?.role === 'manager' ? 'default' : 'secondary'}>
                {user?.role}
              </Badge>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Data Ticker */}
        <div className="mb-8">
          <FlaskMarketTicker />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trading Panel */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="trading" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="trading">Trading</TabsTrigger>
                <TabsTrigger value="news">Notícias</TabsTrigger>
              </TabsList>

              <TabsContent value="trading">
                <Card>
                  <CardHeader>
                    <CardTitle>Abrir Posição</CardTitle>
                    <CardDescription>
                      Configure e execute suas operações
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="symbol">Ativo</Label>
                        <Select value={symbol} onValueChange={setSymbol}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
                            <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
                            <SelectItem value="ADAUSDT">ADA/USDT</SelectItem>
                            <SelectItem value="SOLUSDT">SOL/USDT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="orderType">Tipo de Ordem</Label>
                        <Select value={orderType} onValueChange={(value: 'market' | 'limit') => setOrderType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="market">Mercado</SelectItem>
                            <SelectItem value="limit">Limite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="amount">Quantidade</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="leverage">Alavancagem</Label>
                        <Select value={leverage} onValueChange={setLeverage}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1x</SelectItem>
                            <SelectItem value="2">2x</SelectItem>
                            <SelectItem value="5">5x</SelectItem>
                            <SelectItem value="10">10x</SelectItem>
                            <SelectItem value="20">20x</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {orderType === 'limit' && (
                      <div>
                        <Label htmlFor="price">Preço</Label>
                        <Input
                          id="price"
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <Button
                        onClick={() => handleOpenPosition('long')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={!amount}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Comprar (Long)
                      </Button>
                      <Button
                        onClick={() => handleOpenPosition('short')}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                        disabled={!amount}
                      >
                        <TrendingDown className="h-4 w-4 mr-2" />
                        Vender (Short)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="news">
                <FlaskNewsPanel />
              </TabsContent>
            </Tabs>
          </div>

          {/* Portfolio Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Resumo da Carteira
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Saldo:</span>
                    <span className="font-semibold">R$ {user?.balance?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">P&L Total:</span>
                    <span className={`font-semibold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {totalPnL.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Posições Abertas:</span>
                    <span className="font-semibold">{openPositions.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Posições Abertas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {openPositions.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhuma posição aberta</p>
                  ) : (
                    openPositions.map((position) => (
                      <div key={position.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{position.asset_symbol}</div>
                          <div className="text-sm text-gray-600">
                            {position.type.toUpperCase()} {position.leverage}x
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{position.amount}</div>
                          <div className={`text-sm ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            R$ {position.pnl.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
