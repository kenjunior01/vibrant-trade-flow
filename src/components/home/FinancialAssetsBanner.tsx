import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export function FinancialAssetsBanner() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000/market_data');
    socket.on('market_quotes', (quotes) => {
      setAssets(quotes);
    });
    return () => {
      socket.disconnect();
    };
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
