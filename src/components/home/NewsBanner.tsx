import { useState, useEffect } from 'react';
import { Clock, TrendingUp, AlertCircle, Smile, Meh, Frown } from 'lucide-react';
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
  summary?: string;
  content?: string;
  source: string;
  published_at: string;
  url?: string;
  sentiment_label: 'positive' | 'negative' | 'neutral';
  sentiment_score: number;
  category?: string;
  trending?: boolean;
}

export function NewsBanner() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [sentiment, setSentiment] = useState<{label: string, score: number} | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/news/latest')
      .then(res => res.json())
      .then(data => setNews(data.articles || []))
      .finally(() => setLoading(false));
    fetch('http://localhost:5000/api/news/sentiment-summary')
      .then(res => res.json())
      .then(data => setSentiment(data));
  }, []);

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive': return <Smile className="inline h-4 w-4 mr-1 text-green-400" />;
      case 'negative': return <Frown className="inline h-4 w-4 mr-1 text-red-400" />;
      case 'neutral': return <Meh className="inline h-4 w-4 mr-1 text-yellow-400" />;
      default: return null;
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
          {sentiment && (
            <Badge variant="outline" className={`border-blue-200 text-blue-700 flex items-center space-x-1 ${getSentimentColor(sentiment.label)}`} title={`Sentimento geral: ${sentiment.label} (${sentiment.score?.toFixed(2)})`}>
              {getSentimentIcon(sentiment.label)}
              <span>{sentiment.label?.toUpperCase()} {sentiment.score !== undefined && `(${sentiment.score.toFixed(2)})`}</span>
            </Badge>
          )}
        </div>
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent className="-ml-4">
            {loading ? (
              <div className="text-center text-gray-400">Carregando notícias...</div>
            ) : news.map((item) => (
              <CarouselItem key={item.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={getSentimentColor(item.sentiment_label)}
                        title={`Sentimento: ${item.sentiment_label} (${item.sentiment_score?.toFixed(2)})`}
                      >
                        {getSentimentIcon(item.sentiment_label)}
                        {item.sentiment_label?.toUpperCase()} {item.sentiment_score !== undefined && `(${item.sentiment_score.toFixed(2)})`}
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
                      {formatTime(item.published_at)}
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
                    {item.summary || item.content}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs font-medium">
                      {item.source}
                    </span>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors">
                        Ler mais →
                      </a>
                    )}
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
