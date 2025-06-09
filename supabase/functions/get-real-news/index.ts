
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { category = 'business', limit = 20, query = '' } = await req.json()
    
    const newsApiKey = Deno.env.get('NEWS_API_KEY')
    
    if (!newsApiKey) {
      return new Response(
        JSON.stringify({ error: 'News API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let url = 'https://newsapi.org/v2/'
    let params = new URLSearchParams({
      apiKey: newsApiKey,
      language: 'en',
      pageSize: limit.toString()
    })

    if (query) {
      url += 'everything'
      params.append('q', `${query} AND (finance OR trading OR market OR economy)`)
      params.append('sortBy', 'publishedAt')
    } else {
      url += 'top-headlines'
      params.append('category', category)
    }

    const response = await fetch(`${url}?${params}`)

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'ok') {
      throw new Error(`News API returned status: ${data.status}`)
    }

    // Analyze sentiment (basic implementation)
    const analyzeSentiment = (text: string) => {
      const positiveWords = ['gain', 'rise', 'up', 'growth', 'profit', 'bull', 'high', 'strong', 'boost', 'surge']
      const negativeWords = ['loss', 'fall', 'down', 'drop', 'decline', 'bear', 'low', 'weak', 'crash', 'plunge']
      
      const lowerText = text.toLowerCase()
      const positiveCount = positiveWords.reduce((count, word) => count + (lowerText.includes(word) ? 1 : 0), 0)
      const negativeCount = negativeWords.reduce((count, word) => count + (lowerText.includes(word) ? 1 : 0), 0)
      
      if (positiveCount > negativeCount) {
        return { label: 'positive', score: (positiveCount - negativeCount) / (positiveCount + negativeCount + 1) }
      } else if (negativeCount > positiveCount) {
        return { label: 'negative', score: -(negativeCount - positiveCount) / (positiveCount + negativeCount + 1) }
      }
      return { label: 'neutral', score: 0 }
    }

    const articles = data.articles.map((article: any, index: number) => {
      const sentiment = analyzeSentiment(`${article.title} ${article.description || ''}`)
      
      return {
        id: `news_${Date.now()}_${index}`,
        title: article.title,
        content: article.description || article.content || '',
        url: article.url,
        source: article.source?.name || 'Unknown',
        sentiment_score: sentiment.score,
        sentiment_label: sentiment.label,
        published_at: article.publishedAt,
        created_at: new Date().toISOString(),
        image_url: article.urlToImage
      }
    })

    return new Response(
      JSON.stringify({ 
        articles,
        total: data.totalResults,
        source: 'newsapi'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error fetching real news:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch news', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
