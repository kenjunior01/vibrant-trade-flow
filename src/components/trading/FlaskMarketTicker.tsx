
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, RefreshCw, Activity } from 'lucide-react';
import { useFlaskMarketData } from '@/hooks/useFlaskAPI';
import { cn } from '@/lib/utils';

export function FlaskMarketTicker() {
  const { data: marketData, isLoading, error, refetch } = useFlaskMarketData();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 animate-pulse" />
            Carregando Dados de Mercado...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Dados de Mercado
            </span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Erro ao carregar dados: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const quotes = marketData?.quotes || {};
  const quotesArray = Object.values(quotes);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Dados de Mercado em Tempo Real
            <Badge variant="outline" className="ml-2 text-xs">
              Flask API
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quotesArray.map((quote: any) => (
            <div key={quote.symbol} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{quote.symbol}</span>
                <Badge variant="outline" className="text-xs">
                  {quote.type}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold">
                  {typeof quote.price === 'number' ? quote.price.toFixed(quote.symbol.includes('USD') ? 2 : 5) : quote.price}
                </div>
                
                <div className={cn(
                  "flex items-center text-sm",
                  quote.change >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {quote.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  <span>
                    {quote.change >= 0 ? '+' : ''}{typeof quote.change === 'number' ? quote.change.toFixed(4) : quote.change}
                  </span>
                  <span className="ml-1">
                    ({quote.change_percent >= 0 ? '+' : ''}{typeof quote.change_percent === 'number' ? quote.change_percent.toFixed(2) : quote.change_percent}%)
                  </span>
                </div>
                
                <div className="text-xs text-gray-500">
                  Fonte: {quote.source}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {quotesArray.length === 0 && (
          <p className="text-center text-gray-500">Nenhum dado disponível</p>
        )}
      </CardContent>
    </Card>
  );
}
