
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
    const { symbol, dataType = 'quote' } = await req.json()
    
    if (!symbol) {
      return new Response(
        JSON.stringify({ error: 'Symbol is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const alphaVantageKey = Deno.env.get('ALPHA_VANTAGE_API_KEY')
    const coinApiKey = Deno.env.get('COIN_API_KEY')
    
    if (!alphaVantageKey || !coinApiKey) {
      return new Response(
        JSON.stringify({ error: 'API keys not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let marketData;

    // Check if it's a crypto symbol
    if (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('USD') && symbol.length <= 6) {
      // Use CoinAPI for crypto
      const coinSymbol = symbol.replace('USD', '/USD')
      const response = await fetch(
        `https://rest.coinapi.io/v1/exchangerate/${coinSymbol}`,
        {
          headers: {
            'X-CoinAPI-Key': coinApiKey
          }
        }
      )

      if (!response.ok) {
        throw new Error(`CoinAPI error: ${response.status}`)
      }

      const data = await response.json()
      
      marketData = {
        symbol: symbol,
        price: data.rate || 0,
        timestamp: new Date(data.time).getTime(),
        volume: 0,
        change: 0,
        changePercent: 0,
        source: 'coinapi'
      }
    } else {
      // Use Alpha Vantage for forex/stocks
      let function_type = 'GLOBAL_QUOTE'
      if (symbol.includes('/')) {
        function_type = 'CURRENCY_EXCHANGE_RATE'
      }

      const response = await fetch(
        `https://www.alphavantage.co/query?function=${function_type}&symbol=${symbol}&apikey=${alphaVantageKey}`
      )

      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`)
      }

      const data = await response.json()

      if (function_type === 'CURRENCY_EXCHANGE_RATE' && data['Realtime Currency Exchange Rate']) {
        const rateData = data['Realtime Currency Exchange Rate']
        marketData = {
          symbol: symbol,
          price: parseFloat(rateData['5. Exchange Rate']) || 0,
          timestamp: new Date(rateData['6. Last Refreshed']).getTime(),
          volume: 0,
          change: parseFloat(rateData['9. Change']) || 0,
          changePercent: parseFloat(rateData['10. Change Percent'].replace('%', '')) || 0,
          source: 'alphavantage'
        }
      } else if (data['Global Quote']) {
        const quote = data['Global Quote']
        marketData = {
          symbol: symbol,
          price: parseFloat(quote['05. price']) || 0,
          timestamp: Date.now(),
          volume: parseInt(quote['06. volume']) || 0,
          change: parseFloat(quote['09. change']) || 0,
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')) || 0,
          source: 'alphavantage'
        }
      } else {
        throw new Error('Invalid API response format')
      }
    }

    return new Response(
      JSON.stringify({ data: marketData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error fetching real market data:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch market data', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
