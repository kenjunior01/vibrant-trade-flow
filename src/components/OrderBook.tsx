import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderBookProps {
  symbol: string;
}

// Mock order book data
const generateOrderBookData = () => {
  const basePrice = 43250;
  const bids = [];
  const asks = [];
  
  for (let i = 0; i < 10; i++) {
    bids.push({
      price: basePrice - (i + 1) * 10,
      size: Math.random() * 5 + 0.1,
      total: 0
    });
    
    asks.push({
      price: basePrice + (i + 1) * 10,
      size: Math.random() * 5 + 0.1,
      total: 0
    });
  }
  
  // Calculate cumulative totals
  let bidTotal = 0;
  let askTotal = 0;
  
  bids.forEach(bid => {
    bidTotal += bid.size;
    bid.total = bidTotal;
  });
  
  asks.reverse().forEach(ask => {
    askTotal += ask.size;
    ask.total = askTotal;
  });
  asks.reverse();
  
  return { bids, asks };
};

export function OrderBook({ symbol }: OrderBookProps) {
  const { bids, asks } = generateOrderBookData();
  
  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Order Book</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-xs">
          {/* Header */}
          <div className="grid grid-cols-3 gap-1 px-3 py-2 bg-muted text-muted-foreground font-medium">
            <span>Price</span>
            <span className="text-right">Size</span>
            <span className="text-right">Total</span>
          </div>
          
          {/* Asks (Sell orders) */}
          <div className="space-y-0.5 mb-2">
            {asks.slice(0, 8).reverse().map((ask, index) => (
              <div key={index} className="grid grid-cols-3 gap-1 px-3 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                <span className="font-mono">{ask.price.toFixed(2)}</span>
                <span className="text-right font-mono">{ask.size.toFixed(3)}</span>
                <span className="text-right font-mono">{ask.total.toFixed(3)}</span>
              </div>
            ))}
          </div>
          
          {/* Spread */}
          <div className="px-3 py-2 bg-muted text-center">
            <span className="text-sm font-medium">
              Spread: ${(asks[0].price - bids[0].price).toFixed(2)}
            </span>
          </div>
          
          {/* Bids (Buy orders) */}
          <div className="space-y-0.5 mt-2">
            {bids.slice(0, 8).map((bid, index) => (
              <div key={index} className="grid grid-cols-3 gap-1 px-3 py-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20">
                <span className="font-mono">{bid.price.toFixed(2)}</span>
                <span className="text-right font-mono">{bid.size.toFixed(3)}</span>
                <span className="text-right font-mono">{bid.total.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
