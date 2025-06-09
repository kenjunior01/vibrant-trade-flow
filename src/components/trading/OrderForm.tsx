
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTradingAPI } from '@/hooks/useTradingAPI';
import { useWallets } from '@/hooks/useWallets';

const AVAILABLE_SYMBOLS = [
  'EURUSD', 'GBPUSD', 'BTCUSD', 'ETHUSD', 
  'AAPL', 'GOOGL', 'XAUUSD', 'USOIL'
];

export function OrderForm() {
  const [symbol, setSymbol] = useState('');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const { placeOrder, loading } = useTradingAPI();
  const { getDefaultWallet } = useWallets();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const wallet = getDefaultWallet();
    if (!wallet) {
      return;
    }

    try {
      await placeOrder({
        asset_symbol: symbol,
        side,
        order_type: orderType,
        quantity: parseFloat(quantity),
        price: orderType === 'limit' ? parseFloat(price) : undefined,
        wallet_id: wallet.id,
      });

      // Reset form
      setQuantity('');
      setPrice('');
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Ordem</CardTitle>
        <CardDescription>
          Execute ordens de compra e venda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Ativo</Label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ativo" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_SYMBOLS.map((sym) => (
                    <SelectItem key={sym} value={sym}>
                      {sym}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="side">Lado</Label>
              <Select value={side} onValueChange={(value: 'buy' | 'sell') => setSide(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Compra</SelectItem>
                  <SelectItem value="sell">Venda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order-type">Tipo de Ordem</Label>
              <Select value={orderType} onValueChange={(value: 'market' | 'limit') => setOrderType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Mercado</SelectItem>
                  <SelectItem value="limit">Limitada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {orderType === 'limit' && (
            <div className="space-y-2">
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                type="number"
                step="0.00001"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00000"
                required
              />
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !symbol || !quantity}
          >
            {loading ? 'Executando...' : `${side === 'buy' ? 'Comprar' : 'Vender'} ${symbol}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
