
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  url: string;
  source: string;
  sentiment_score: number;
  sentiment_label: string;
  published_at: string;
  created_at: string;
  image_url?: string;
}

export function useRealNews(category: string = 'business', limit: number = 20) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async (query?: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase.functions.invoke('get-real-news', {
        body: { category, limit, query }
      });

      if (supabaseError) throw supabaseError;

      if (data?.articles) {
        setArticles(data.articles);
      }
    } catch (err: any) {
      console.error('Error fetching real news:', err);
      setError(err.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category, limit]);

  return { articles, loading, error, refetch: fetchNews };
}
