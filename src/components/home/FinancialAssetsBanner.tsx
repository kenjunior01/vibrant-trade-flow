
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface AssetData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
}

export function FinancialAssetsBanner() {
  const [assets, setAssets] = useState<AssetData[]>([
    { symbol: 'BTC/USD', name: 'Bitcoin', price: 43250.00, change: 1250.50, changePercent: 2.98, volume: '$2.1B' },
    { symbol: 'ETH/USD', name: 'Ethereum', price: 2650.25, change: -45.75, changePercent: -1.70, volume: '$890M' },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 185.20, change: 2.80, changePercent: 1.54, volume: '$45M' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -5.20, changePercent: -2.05, volume: '$28M' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.80, change: 1.95, changePercent: 1.38, volume: '$32M' },
    { symbol: 'EUR/USD', name: 'Euro/Dólar', price: 1.0856, change: 0.0024, changePercent: 0.22, volume: '$1.5B' },
    { symbol: 'GBP/USD', name: 'Libra/Dólar', price: 1.2745, change: -0.0018, changePercent: -0.14, volume: '$890M' },
    { symbol: 'GOLD', name: 'Ouro', price: 2034.50, change: 12.30, changePercent: 0.61, volume: '$650M' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => ({
        ...asset,
        price: asset.price + (Math.random() - 0.5) * (asset.price * 0.002),
        change: (Math.random() - 0.5) * (asset.price * 0.003),
        changePercent: (Math.random() - 0.5) * 3
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">Mercados em Tempo Real</h2>
          <div className="text-green-400 text-sm animate-pulse">● AO VIVO</div>
        </div>
        
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent className="-ml-2 md:-ml-4">
            {assets.map((asset, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-white font-semibold text-sm">{asset.symbol}</div>
                      <div className="text-gray-300 text-xs">{asset.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-mono text-sm">
                        ${asset.price.toFixed(asset.symbol.includes('/') ? 4 : 2)}
                      </div>
                      <div className="text-gray-400 text-xs">{asset.volume}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className={`flex items-center text-xs font-medium ${
                      asset.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {asset.change >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}
                    </div>
                    <div className={`text-xs font-medium ${
                      asset.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-white border-white/20 hover:bg-white/10" />
          <CarouselNext className="text-white border-white/20 hover:bg-white/10" />
        </Carousel>
      </div>
    </div>
  );
}
