
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Newspaper, ExternalLink, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useFlaskNews, useFlaskSentimentSummary } from '@/hooks/useFlaskAPI';
import { cn } from '@/lib/utils';

export function FlaskNewsPanel() {
  const { data: newsData, isLoading: newsLoading, error: newsError, refetch: refetchNews } = useFlaskNews();
  const { data: sentimentData, isLoading: sentimentLoading } = useFlaskSentimentSummary();

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumo de Sentimento */}
      {sentimentData && !sentimentLoading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Sentimento do Mercado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold",
                  sentimentData.overall_sentiment === 'positive' ? 'text-green-600' :
                  sentimentData.overall_sentiment === 'negative' ? 'text-red-600' : 'text-gray-600'
                )}>
                  {getSentimentIcon(sentimentData.overall_sentiment)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Geral</div>
                <div className="font-semibold capitalize">{sentimentData.overall_sentiment}</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{sentimentData.breakdown.positive}</div>
                <div className="text-sm text-gray-600">Positivas</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{sentimentData.breakdown.neutral}</div>
                <div className="text-sm text-gray-600">Neutras</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{sentimentData.breakdown.negative}</div>
                <div className="text-sm text-gray-600">Negativas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notícias */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Newspaper className="h-5 w-5 mr-2" />
              Notícias Financeiras
              <Badge variant="outline" className="ml-2 text-xs">
                {newsData?.source || 'Flask API'}
              </Badge>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => refetchNews()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {newsLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          )}

          {newsError && (
            <p className="text-red-500">Erro ao carregar notícias: {newsError.message}</p>
          )}

          {newsData?.articles && (
            <div className="space-y-4">
              {newsData.articles.map((article: any, index: number) => (
                <div key={article.id || index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {article.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="text-xs">
                            {article.source}
                          </Badge>
                          
                          <Badge className={cn(
                            "text-xs flex items-center gap-1",
                            getSentimentColor(article.sentiment_label)
                          )}>
                            {getSentimentIcon(article.sentiment_label)}
                            {article.sentiment_label}
                          </Badge>
                          
                          <span className="text-xs text-gray-500">
                            {new Date(article.published_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        
                        {article.url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {newsData?.articles?.length === 0 && (
            <p className="text-center text-gray-500">Nenhuma notícia disponível</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
