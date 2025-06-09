
import { useQuery } from '@tanstack/react-query';

const FLASK_API_URL = 'http://localhost:5000/api';

// Hook para buscar cotações do mercado
export function useFlaskMarketData() {
  return useQuery({
    queryKey: ['flask-market-quotes'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${FLASK_API_URL}/market/quotes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }

      return response.json();
    },
    refetchInterval: 30000, // Atualizar a cada 30 segundos
    staleTime: 25000, // Considerar dados obsoletos após 25 segundos
  });
}

// Hook para buscar notícias
export function useFlaskNews(category = 'business', limit = 20) {
  return useQuery({
    queryKey: ['flask-news', category, limit],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${FLASK_API_URL}/news/latest?category=${category}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      return response.json();
    },
    refetchInterval: 300000, // Atualizar a cada 5 minutos
    staleTime: 240000, // Considerar dados obsoletos após 4 minutos
  });
}

// Hook para buscar dados de gráfico
export function useFlaskChartData(symbol: string, interval = '1day', period = '1month') {
  return useQuery({
    queryKey: ['flask-chart', symbol, interval, period],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${FLASK_API_URL}/market/chart/${symbol}?interval=${interval}&period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chart data');
      }

      return response.json();
    },
    refetchInterval: 60000, // Atualizar a cada 1 minuto
    staleTime: 45000, // Considerar dados obsoletos após 45 segundos
  });
}

// Hook para buscar resumo de sentimento das notícias
export function useFlaskSentimentSummary() {
  return useQuery({
    queryKey: ['flask-sentiment'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${FLASK_API_URL}/news/sentiment-summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sentiment summary');
      }

      return response.json();
    },
    refetchInterval: 300000, // Atualizar a cada 5 minutos
  });
}

// Hook para buscar símbolos disponíveis
export function useFlaskAvailableSymbols() {
  return useQuery({
    queryKey: ['flask-symbols'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${FLASK_API_URL}/market/symbols`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch symbols');
      }

      return response.json();
    },
    staleTime: 3600000, // Símbolos não mudam frequentemente - 1 hora
  });
}
