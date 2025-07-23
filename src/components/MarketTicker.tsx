import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketTickerProps {
  prices: Record<string, number>;
}

export function MarketTicker({ prices }: MarketTickerProps) {
  const symbols = Object.keys(prices);

  return (
    <div className="bg-muted border-b overflow-hidden">
      <div className="animate-scroll flex space-x-8 py-2">
        {symbols.concat(symbols).map((symbol, index) => {
          const price = prices[symbol];
          const change = (Math.random() - 0.5) * 2; // Mock change percentage
          const isPositive = change >= 0;
          
          return (
            <div key={`${symbol}-${index}`} className="flex items-center space-x-2 whitespace-nowrap">
              <span className="font-medium">{symbol}</span>
              <span className="text-sm">${price.toFixed(2)}</span>
              <div className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {isPositive ? '+' : ''}{change.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
