
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
    const { symbol } = await req.json()
    
    if (!symbol) {
      return new Response(
        JSON.stringify({ error: 'Symbol is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const coinApiKey = Deno.env.get('COIN_API_KEY')
    
    if (!coinApiKey) {
      return new Response(
        JSON.stringify({ error: 'CoinAPI key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // For crypto symbols, get order book from CoinAPI
    if (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('USD')) {
      const exchangeId = 'BINANCE' // Using Binance as default exchange
      const coinSymbol = symbol.replace('USD', '/USD')
      
      const response = await fetch(
        `https://rest.coinapi.io/v1/orderbooks/${exchangeId}_SPOT_${coinSymbol.replace('/', '_')}/current`,
        {
          headers: {
            'X-CoinAPI-Key': coinApiKey
          }
        }
      )

      if (!response.ok) {
        // If specific orderbook fails, generate realistic data based on current price
        const priceResponse = await fetch(
          `https://rest.coinapi.io/v1/exchangerate/${coinSymbol}`,
          {
            headers: {
              'X-CoinAPI-Key': coinApiKey
            }
          }
        )

        if (priceResponse.ok) {
          const priceData = await priceResponse.json()
          const basePrice = priceData.rate
          
          return generateRealisticOrderBook(symbol, basePrice)
        }
        
        throw new Error(`CoinAPI orderbook error: ${response.status}`)
      }

      const data = await response.json()
      
      // Convert CoinAPI format to our format
      const bids = data.bids?.slice(0, 10).map((bid: any) => ({
        price: bid.price,
        size: bid.size,
        total: bid.size
      })) || []

      const asks = data.asks?.slice(0, 10).map((ask: any) => ({
        price: ask.price,
        size: ask.size,
        total: ask.size
      })) || []

      // Calculate running totals
      let totalBids = 0
      bids.forEach(bid => {
        totalBids += bid.size
        bid.total = totalBids
      })

      let totalAsks = 0
      asks.forEach(ask => {
        totalAsks += ask.size
        ask.total = totalAsks
      })

      const spread = asks.length > 0 && bids.length > 0 ? asks[0].price - bids[0].price : 0
      const lastPrice = bids.length > 0 ? bids[0].price : (asks.length > 0 ? asks[0].price : 0)

      return new Response(
        JSON.stringify({
          bids: bids.reverse(),
          asks,
          spread,
          lastPrice,
          source: 'coinapi'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // For forex, generate realistic order book based on current price
    const alphaVantageKey = Deno.env.get('ALPHA_VANTAGE_API_KEY')
    if (alphaVantageKey) {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol.split('/')[0]}&to_currency=${symbol.split('/')[1]}&apikey=${alphaVantageKey}`
      )

      if (response.ok) {
        const data = await response.json()
        const rateData = data['Realtime Currency Exchange Rate']
        if (rateData) {
          const basePrice = parseFloat(rateData['5. Exchange Rate'])
          return generateRealisticOrderBook(symbol, basePrice)
        }
      }
    }

    // Fallback to default realistic data
    return generateRealisticOrderBook(symbol, 1.0856)

  } catch (error) {
    console.error('Error fetching real order book:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch order book', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function generateRealisticOrderBook(symbol: string, basePrice: number) {
  const spread = basePrice * 0.0001 // 0.01% spread
  const bids = []
  const asks = []
  
  let totalBids = 0
  let totalAsks = 0
  
  // Generate realistic bids
  for (let i = 0; i < 10; i++) {
    const price = Number((basePrice - spread/2 - (i * spread * 0.1)).toFixed(5))
    const size = Math.floor(Math.random() * 1000000 + 100000)
    totalBids += size
    
    bids.push({
      price,
      size,
      total: totalBids
    })
  }
  
  // Generate realistic asks
  for (let i = 0; i < 10; i++) {
    const price = Number((basePrice + spread/2 + (i * spread * 0.1)).toFixed(5))
    const size = Math.floor(Math.random() * 1000000 + 100000)
    totalAsks += size
    
    asks.push({
      price,
      size,
      total: totalAsks
    })
  }

  return new Response(
    JSON.stringify({
      bids: bids.reverse(),
      asks,
      spread: Number(spread.toFixed(5)),
      lastPrice: basePrice,
      source: 'generated'
    }),
    { headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' } }
  )
}
