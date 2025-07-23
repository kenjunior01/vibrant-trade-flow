import { useState, useEffect } from 'react';
import { TradingChart } from './TradingChart';
import { OrderBook } from './OrderBook';
import { Portfolio } from './Portfolio';
import { RecentTrades } from './RecentTrades';
import { MarketTicker } from './MarketTicker';
import { Header } from './Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Mock market data
const MOCK_PRICE = {
  'BTCUSD': 43250.00,
  'ETHUSD': 2650.25,
  'EURUSD': 1.0856,
  'GBPUSD': 1.2745,
  'XAUUSD': 2034.50,
  'AAPL': 190.50,
  'GOOGL': 140.75,
  'USOIL': 82.30
};

interface Position {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  size: number;
  price: number;
  time: string;
  pnl?: number;
}

export function TradingPlatform() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSD');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [balance] = useState(50000);
  const [positions, setPositions] = useState<Position[]>([]);
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [currentPrices, setCurrentPrices] = useState(MOCK_PRICE);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrices(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(symbol => {
          const change = (Math.random() - 0.5) * 0.02; // ±1% change
          updated[symbol] = updated[symbol] * (1 + change);
        });
        return updated;
      });

      // Update position P&L
      setPositions(prev => prev.map(pos => {
        const currentPrice = currentPrices[pos.symbol];
        const pnl = pos.side === 'buy' 
          ? (currentPrice - pos.entryPrice) * pos.size
          : (pos.entryPrice - currentPrice) * pos.size;
        const pnlPercent = (pnl / (pos.entryPrice * pos.size)) * 100;
        
        return {
          ...pos,
          currentPrice,
          pnl,
          pnlPercent
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [currentPrices]);

  const handlePlaceOrder = () => {
    if (!quantity) return;

    const currentPrice = currentPrices[selectedSymbol];
    const orderPrice = orderType === 'market' ? currentPrice : parseFloat(price);
    const orderQuantity = parseFloat(quantity);

    // Create new position
    const newPosition: Position = {
      id: Date.now().toString(),
      symbol: selectedSymbol,
      side: orderSide,
      size: orderQuantity,
      entryPrice: orderPrice,
      currentPrice: orderPrice,
      pnl: 0,
      pnlPercent: 0
    };

    setPositions(prev => [...prev, newPosition]);

    // Add to recent trades
    const newTrade: Trade = {
      id: Date.now().toString(),
      symbol: selectedSymbol,
      side: orderSide,
      size: orderQuantity,
      price: orderPrice,
      time: new Date().toLocaleTimeString()
    };

    setRecentTrades(prev => [newTrade, ...prev.slice(0, 9)]);

    // Reset form
    setQuantity('');
    setPrice('');
  };

  const handleClosePosition = (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    if (!position) return;

    // Add closing trade to recent trades
    const closingTrade: Trade = {
      id: Date.now().toString(),
      symbol: position.symbol,
      side: position.side === 'buy' ? 'sell' : 'buy',
      size: position.size,
      price: position.currentPrice,
      time: new Date().toLocaleTimeString(),
      pnl: position.pnl
    };

    setRecentTrades(prev => [closingTrade, ...prev.slice(0, 9)]);
    setPositions(prev => prev.filter(p => p.id !== positionId));
  };

  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalEquity = balance + totalPnL;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MarketTicker prices={currentPrices} />
      
      <div className="container mx-auto p-4 space-y-4">
        {/* Main Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Trading Chart */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    {selectedSymbol}
                    <Badge variant="outline">
                      ${currentPrices[selectedSymbol]?.toFixed(2)}
                    </Badge>
                  </CardTitle>
                  <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(currentPrices).map(symbol => (
                        <SelectItem key={symbol} value={symbol}>
                          {symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-2">
                <TradingChart symbol={selectedSymbol} />
              </CardContent>
            </Card>
          </div>

          {/* Order Book & Order Panel */}
          <div className="space-y-4">
            {/* Order Form */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Place Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={orderSide} onValueChange={(v) => setOrderSide(v as 'buy' | 'sell')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buy" className="text-green-600">Buy</TabsTrigger>
                    <TabsTrigger value="sell" className="text-red-600">Sell</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div>
                  <Label>Order Type</Label>
                  <Select value={orderType} onValueChange={(v) => setOrderType(v as 'market' | 'limit')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="limit">Limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                {orderType === 'limit' && (
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                )}

                <Button
                  onClick={handlePlaceOrder}
                  className={`w-full ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                  disabled={!quantity || (orderType === 'limit' && !price)}
                >
                  {orderSide === 'buy' ? (
                    <><TrendingUp className="h-4 w-4 mr-2" />Buy {selectedSymbol}</>
                  ) : (
                    <><TrendingDown className="h-4 w-4 mr-2" />Sell {selectedSymbol}</>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Order Book */}
            <OrderBook symbol={selectedSymbol} />
          </div>
        </div>

        {/* Portfolio & Trading History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Portfolio 
            balance={balance}
            equity={totalEquity}
            positions={positions}
            onClosePosition={handleClosePosition}
          />
          <RecentTrades trades={recentTrades} />
        </div>
      </div>
    </div>
  );
}