
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  lastPrice: number;
}

export function AdvancedOrderBook() {
  const [orderBook, setOrderBook] = useState<OrderBookData>({
    bids: [],
    asks: [],
    spread: 0,
    lastPrice: 1.0856
  });
  const [maxSize, setMaxSize] = useState(0);

  // Generate mock order book data
  const generateOrderBook = () => {
    const basePrice = 1.0856;
    const spread = 0.0002;
    
    const bids: OrderBookEntry[] = [];
    const asks: OrderBookEntry[] = [];
    
    let totalBids = 0;
    let totalAsks = 0;
    
    // Generate bids (buy orders)
    for (let i = 0; i < 10; i++) {
      const price = basePrice - spread/2 - (i * 0.0001);
      const size = Math.random() * 1000000 + 100000;
      totalBids += size;
      
      bids.push({
        price: Number(price.toFixed(5)),
        size: Math.round(size),
        total: Math.round(totalBids)
      });
    }
    
    // Generate asks (sell orders)
    for (let i = 0; i < 10; i++) {
      const price = basePrice + spread/2 + (i * 0.0001);
      const size = Math.random() * 1000000 + 100000;
      totalAsks += size;
      
      asks.push({
        price: Number(price.toFixed(5)),
        size: Math.round(size),
        total: Math.round(totalAsks)
      });
    }
    
    const allSizes = [...bids, ...asks].map(entry => entry.size);
    const maxOrderSize = Math.max(...allSizes);
    
    setMaxSize(maxOrderSize);
    setOrderBook({
      bids: bids.reverse(), // Show highest bids first
      asks,
      spread: Number(spread.toFixed(5)),
      lastPrice: basePrice
    });
  };

  useEffect(() => {
    generateOrderBook();
    const interval = setInterval(generateOrderBook, 2000); // Update every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const OrderRow = ({ 
    entry, 
    type, 
    onClick 
  }: { 
    entry: OrderBookEntry; 
    type: 'bid' | 'ask'; 
    onClick: (price: number, size: number) => void;
  }) => {
    const percentage = (entry.size / maxSize) * 100;
    
    return (
      <div
        className={cn(
          "relative grid grid-cols-3 gap-2 px-2 py-1 text-xs cursor-pointer hover:bg-muted/50 transition-colors",
          type === 'bid' ? 'text-green-600' : 'text-red-600'
        )}
        onClick={() => onClick(entry.price, entry.size)}
      >
        {/* Background bar showing relative size */}
        <div
          className={cn(
            "absolute inset-0 opacity-20",
            type === 'bid' ? 'bg-green-500' : 'bg-red-500'
          )}
          style={{ width: `${percentage}%` }}
        />
        
        <div className="text-right font-mono">{entry.price}</div>
        <div className="text-right font-mono">{entry.size.toLocaleString()}</div>
        <div className="text-right font-mono text-muted-foreground">{entry.total.toLocaleString()}</div>
      </div>
    );
  };

  const handleOrderClick = (price: number, size: number) => {
    console.log(`Clicked order: ${price} @ ${size}`);
    // In a real app, this would populate the order form
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Order Book
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="font-mono">
              Spread: {orderBook.spread}
            </Badge>
            <Badge variant="secondary" className="font-mono">
              {orderBook.lastPrice}
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
        
        {/* Asks (Sell Orders) */}
        <div className="space-y-0">
          {orderBook.asks.slice().reverse().map((ask, index) => (
            <OrderRow
              key={`ask-${index}`}
              entry={ask}
              type="ask"
              onClick={handleOrderClick}
            />
          ))}
        </div>
        
        {/* Spread indicator */}
        <div className="flex items-center justify-center py-3 border-y bg-muted/20">
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-mono font-semibold">{orderBook.lastPrice}</span>
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
            />
          ))}
        </div>
        
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
