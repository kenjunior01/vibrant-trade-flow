
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRealOrderBook } from '@/hooks/useRealOrderBook';

export function AdvancedOrderBook() {
  const { orderBook, loading, refetch } = useRealOrderBook('EURUSD', 5000);

  const OrderRow = ({ 
    entry, 
    type, 
    onClick,
    maxSize
  }: { 
    entry: any; 
    type: 'bid' | 'ask'; 
    onClick: (price: number, size: number) => void;
    maxSize: number;
  }) => {
    const percentage = maxSize > 0 ? (entry.size / maxSize) * 100 : 0;
    
    return (
      <div
        className={cn(
          "relative grid grid-cols-3 gap-2 px-2 py-1 text-xs cursor-pointer hover:bg-muted/50 transition-colors",
          type === 'bid' ? 'text-green-600' : 'text-red-600'
        )}
        onClick={() => onClick(entry.price, entry.size)}
      >
        <div
          className={cn(
            "absolute inset-0 opacity-20",
            type === 'bid' ? 'bg-green-500' : 'bg-red-500'
          )}
          style={{ width: `${percentage}%` }}
        />
        
        <div className="text-right font-mono relative z-10">{entry.price.toFixed(5)}</div>
        <div className="text-right font-mono relative z-10">{entry.size.toLocaleString()}</div>
        <div className="text-right font-mono text-muted-foreground relative z-10">{entry.total.toLocaleString()}</div>
      </div>
    );
  };

  const handleOrderClick = (price: number, size: number) => {
    console.log(`Clicked order: ${price} @ ${size}`);
  };

  const maxSize = Math.max(
    ...orderBook.bids.map(b => b.size), 
    ...orderBook.asks.map(a => a.size)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Order Book {orderBook.source && (
              <Badge variant="outline" className="ml-2 text-xs">
                {orderBook.source}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              disabled={loading}
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            <Badge variant="outline" className="font-mono">
              Spread: {orderBook.spread.toFixed(5)}
            </Badge>
            <Badge variant="secondary" className="font-mono">
              {orderBook.lastPrice.toFixed(5)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Header */}
        <div className="grid grid-cols-3 gap-2 px-2 py-2 text-xs font-semibold text-muted-foreground border-b">
          <div className="text-right">Price</div>
          <div className="text-right">Size</div>
          <div className="text-right">Total</div>
        </div>
        
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">
            Carregando dados reais...
          </div>
        ) : (
          <>
            {/* Asks (Sell Orders) */}
            <div className="space-y-0">
              {orderBook.asks.slice().reverse().map((ask, index) => (
                <OrderRow
                  key={`ask-${index}`}
                  entry={ask}
                  type="ask"
                  onClick={handleOrderClick}
                  maxSize={maxSize}
                />
              ))}
            </div>
            
            {/* Spread indicator */}
            <div className="flex items-center justify-center py-3 border-y bg-muted/20">
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-mono font-semibold">{orderBook.lastPrice.toFixed(5)}</span>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </div>
            </div>
            
            {/* Bids (Buy Orders) */}
            <div className="space-y-0">
              {orderBook.bids.map((bid, index) => (
                <OrderRow
                  key={`bid-${index}`}
                  entry={bid}
                  type="bid"
                  onClick={handleOrderClick}
                  maxSize={maxSize}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Quick actions */}
        <div className="flex space-x-2 p-3 border-t">
          <Button 
            size="sm" 
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => console.log('Buy market')}
          >
            Buy Market
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            className="flex-1"
            onClick={() => console.log('Sell market')}
          >
            Sell Market
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
