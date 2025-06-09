import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock, Smile, Meh, Frown } from 'lucide-react';

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
}

export const NewsPanel = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [loading, setLoading] = useState(false);
  const categories = ['Todas', 'Forex', 'Criptomoedas', 'Ações', 'Commodities', 'Política Monetária'];

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/news/latest')
      .then(res => res.json())
      .then(data => setNews(data.articles || []))
      .finally(() => setLoading(false));
  }, []);

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive': return 'bg-green-500/20 text-green-400';
      case 'negative': return 'bg-red-500/20 text-red-400';
      case 'neutral': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-slate-500/20 text-slate-400';
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

  const filteredNews = selectedCategory === 'Todas'
    ? news
    : news.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Newspaper className="h-6 w-6 mr-3 text-blue-400" />
          Notícias Financeiras
        </h2>
        <div className="text-sm text-slate-400 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Atualizado agora
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-slate-400">Carregando notícias...</div>
        ) : filteredNews.map((item) => (
          <div key={item.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(item.sentiment_label)}`}
                  title={`Sentimento: ${item.sentiment_label} (${item.sentiment_score?.toFixed(2)})`}>
                  {getSentimentIcon(item.sentiment_label)}
                  {item.sentiment_label?.toUpperCase()} {item.sentiment_score !== undefined && `(${item.sentiment_score.toFixed(2)})`}
                </span>
                {item.category && <span className="text-blue-400 text-sm font-medium">{item.category}</span>}
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
              {item.summary || item.content}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">
                Fonte: {item.source}
              </span>
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                  Ler mais
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="bg-slate-700/50 hover:bg-slate-600/50 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Carregar mais notícias
        </button>
      </div>
    </div>
  );
};
