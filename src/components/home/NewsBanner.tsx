
import { useState, useEffect } from 'react';
import { Clock, TrendingUp, AlertCircle } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  trending?: boolean;
}

export function NewsBanner() {
  const [news] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Fed mantém taxa de juros estável, sinalizando cautela com inflação',
      summary: 'Banco Central americano decide manter política monetária atual em meio a dados econômicos mistos.',
      source: 'Reuters',
      publishedAt: '2024-01-15T14:30:00Z',
      impact: 'high',
      category: 'Política Monetária',
      trending: true
    },
    {
      id: '2',
      title: 'Bitcoin atinge novo máximo histórico acima de $44,000',
      summary: 'Criptomoeda líder mundial alcança novos patamares em meio ao otimismo institucional.',
      source: 'CoinDesk',
      publishedAt: '2024-01-15T13:15:00Z',
      impact: 'high',
      category: 'Criptomoedas',
      trending: true
    },
    {
      id: '3',
      title: 'Apple reporta crescimento de 8% nas vendas do iPhone no Q4',
      summary: 'Gigante da tecnologia supera expectativas com forte demanda por dispositivos premium.',
      source: 'Apple Inc.',
      publishedAt: '2024-01-15T12:45:00Z',
      impact: 'medium',
      category: 'Tecnologia'
    },
    {
      id: '4',
      title: 'Petróleo Brent recua 2% após dados de estoque americano',
      summary: 'Preços do petróleo caem com aumento nos estoques de crude dos EUA.',
      source: 'Bloomberg',
      publishedAt: '2024-01-15T11:20:00Z',
      impact: 'medium',
      category: 'Commodities'
    },
    {
      id: '5',
      title: 'Banco Central Europeu sinaliza possível corte de juros',
      summary: 'BCE indica flexibilização monetária em resposta ao crescimento econômico lento.',
      source: 'ECB',
      publishedAt: '2024-01-15T10:00:00Z',
      impact: 'high',
      category: 'Política Monetária'
    },
    {
      id: '6',
      title: 'Tesla anuncia expansão de fábrica na China',
      summary: 'Montadora elétrica planeja dobrar capacidade de produção em Shanghai.',
      source: 'Tesla',
      publishedAt: '2024-01-15T09:30:00Z',
      impact: 'medium',
      category: 'Automobilístico'
    }
  ]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m atrás`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h atrás`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d atrás`;
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <AlertCircle className="h-6 w-6 mr-2 text-blue-600" />
            Notícias e Análises
          </h2>
          <Badge variant="outline" className="border-blue-200 text-blue-700">
            Atualizado agora
          </Badge>
        </div>
        
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent className="-ml-4">
            {news.map((item) => (
              <CarouselItem key={item.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={getImpactColor(item.impact)}
                      >
                        {item.impact.toUpperCase()}
                      </Badge>
                      {item.trending && (
                        <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(item.publishedAt)}
                    </div>
                  </div>

                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-3 leading-tight line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs font-medium">
                      {item.source}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors">
                      Ler mais →
                    </button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-gray-600 border-gray-300 hover:bg-gray-50" />
          <CarouselNext className="text-gray-600 border-gray-300 hover:bg-gray-50" />
        </Carousel>
      </div>
    </div>
  );
}
