
import React, { useState } from 'react';
import { Newspaper, ExternalLink, Clock, RefreshCw, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRealNews } from '@/hooks/useRealNews';

export const NewsPanel = () => {
  const [selectedCategory, setSelectedCategory] = useState('business');
  const [searchQuery, setSearchQuery] = useState('');
  const { articles, loading, error, refetch } = useRealNews(selectedCategory, 20);

  const categories = [
    { value: 'business', label: 'Negócios' },
    { value: 'technology', label: 'Tecnologia' },
    { value: 'general', label: 'Geral' }
  ];

  const getImpactColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500/20 text-green-400';
      case 'negative': return 'bg-red-500/20 text-red-400';
      default: return 'bg-yellow-500/20 text-yellow-400';
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

  const handleSearch = () => {
    refetch(searchQuery);
  };

  const filteredArticles = articles;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Newspaper className="h-6 w-6 mr-3 text-blue-400" />
          Notícias Financeiras Reais
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <div className="text-sm text-slate-400 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            NewsAPI
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex space-x-2">
        <Input
          placeholder="Pesquisar notícias financeiras..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.value
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="text-center py-8">
          <div className="text-slate-400">Carregando notícias reais...</div>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-400">
          Erro ao carregar notícias: {error}
        </div>
      )}

      {/* News List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredArticles.map((item) => (
            <div key={item.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Badge className={getImpactColor(item.sentiment_label)}>
                    {item.sentiment_label.toUpperCase()}
                  </Badge>
                  <span className="text-blue-400 text-sm font-medium">{item.source}</span>
                </div>
                <div className="flex items-center text-slate-400 text-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(item.published_at)}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
                {item.title}
              </h3>

              <p className="text-slate-300 mb-4 leading-relaxed">
                {item.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 text-sm">
                    Sentiment: {item.sentiment_score.toFixed(2)}
                  </span>
                </div>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  Ler mais
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filteredArticles.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          Nenhuma notícia encontrada
        </div>
      )}
    </div>
  );
};
