
import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
}

export const NewsPanel = () => {
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Fed mantém taxa de juros estável em 5.25%-5.50%',
      summary: 'O Federal Reserve decidiu manter as taxas de juros inalteradas na reunião de dezembro, sinalizando cautela com a inflação.',
      source: 'Reuters',
      publishedAt: '2024-12-13T14:30:00Z',
      impact: 'high',
      category: 'Política Monetária'
    },
    {
      id: '2',
      title: 'Bitcoin atinge novo máximo histórico acima de $44,000',
      summary: 'A criptomoeda líder mundial alcançou novos patamares em meio ao otimismo institucional e aprovação de ETFs.',
      source: 'CoinDesk',
      publishedAt: '2024-12-13T13:15:00Z',
      impact: 'high',
      category: 'Criptomoedas'
    },
    {
      id: '3',
      title: 'EUR/USD sob pressão após dados fracos da Zona do Euro',
      summary: 'O par de moedas recua após divulgação de dados econômicos abaixo do esperado da região.',
      source: 'ForexLive',
      publishedAt: '2024-12-13T12:45:00Z',
      impact: 'medium',
      category: 'Forex'
    },
    {
      id: '4',
      title: 'Ouro se mantém estável próximo aos $2,030/oz',
      summary: 'O metal precioso mantém estabilidade em meio à incerteza geopolítica e expectativas sobre política monetária.',
      source: 'Kitco',
      publishedAt: '2024-12-13T11:20:00Z',
      impact: 'low',
      category: 'Commodities'
    },
    {
      id: '5',
      title: 'S&P 500 fecha em alta de 0.8% liderado por tecnologia',
      summary: 'O índice americano encerrou o pregão em alta, impulsionado pelos ganhos do setor de tecnologia.',
      source: 'MarketWatch',
      publishedAt: '2024-12-13T21:00:00Z',
      impact: 'medium',
      category: 'Ações'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const categories = ['Todas', 'Forex', 'Criptomoedas', 'Ações', 'Commodities', 'Política Monetária'];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-slate-500/20 text-slate-400';
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
        {filteredNews.map((item) => (
          <div key={item.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(item.impact)}`}>
                  {item.impact.toUpperCase()}
                </span>
                <span className="text-blue-400 text-sm font-medium">{item.category}</span>
              </div>
              <div className="flex items-center text-slate-400 text-sm">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(item.publishedAt)}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
              {item.title}
            </h3>

            <p className="text-slate-300 mb-4 leading-relaxed">
              {item.summary}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">
                Fonte: {item.source}
              </span>
              <button className="flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                Ler mais
                <ExternalLink className="h-3 w-3 ml-1" />
              </button>
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
