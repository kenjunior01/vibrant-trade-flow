
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
    const { symbol, interval = 'daily', period = '1month' } = await req.json()
    
    if (!symbol) {
      return new Response(
        JSON.stringify({ error: 'Symbol is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const alphaVantageKey = Deno.env.get('ALPHA_VANTAGE_API_KEY')
    
    if (!alphaVantageKey) {
      return new Response(
        JSON.stringify({ error: 'Alpha Vantage API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Map intervals to Alpha Vantage functions
    const intervalMap = {
      '1min': 'TIME_SERIES_INTRADAY&interval=1min',
      '5min': 'TIME_SERIES_INTRADAY&interval=5min',
      '15min': 'TIME_SERIES_INTRADAY&interval=15min',
      '30min': 'TIME_SERIES_INTRADAY&interval=30min',
      '60min': 'TIME_SERIES_INTRADAY&interval=60min',
      'daily': 'TIME_SERIES_DAILY',
      'weekly': 'TIME_SERIES_WEEKLY',
      'monthly': 'TIME_SERIES_MONTHLY'
    }

    const functionType = intervalMap[interval] || 'TIME_SERIES_DAILY'
    
    const response = await fetch(
      `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&apikey=${alphaVantageKey}&outputsize=full`
    )

    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Find the time series data key
    const timeSeriesKey = Object.keys(data).find(key => 
      key.includes('Time Series') || key.includes('Daily') || key.includes('Weekly') || key.includes('Monthly')
    )

    if (!timeSeriesKey || !data[timeSeriesKey]) {
      console.log('Available keys:', Object.keys(data))
      throw new Error('No time series data found in response')
    }

    const timeSeries = data[timeSeriesKey]
    const chartData = []

    // Convert to our format and limit based on period
    const entries = Object.entries(timeSeries)
    const periodLimits = {
      '1week': 7,
      '1month': 30,
      '3months': 90,
      '6months': 180,
      '1year': 252
    }
    
    const limit = periodLimits[period] || 30
    const limitedEntries = entries.slice(0, limit)

    for (const [timestamp, values] of limitedEntries.reverse()) {
      const candle = values as any
      chartData.push({
        timestamp,
        open: parseFloat(candle['1. open']),
        high: parseFloat(candle['2. high']),
        low: parseFloat(candle['3. low']),
        close: parseFloat(candle['4. close']),
        volume: parseInt(candle['5. volume'] || candle['6. volume'] || '0')
      })
    }

    return new Response(
      JSON.stringify({ 
        symbol, 
        interval, 
        period,
        data: chartData,
        source: 'alphavantage'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error fetching historical data:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch historical data', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
