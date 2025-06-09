
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    const polygonApiKey = Deno.env.get('POLYGON_API_KEY')
    if (!polygonApiKey) {
      return new Response(
        JSON.stringify({ error: 'Polygon API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get current market data from Polygon
    const response = await fetch(
      `https://api.polygon.io/v2/last/trade/${symbol}?apikey=${polygonApiKey}`
    )

    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform data to our format
    const marketData = {
      symbol: symbol,
      price: data.results?.p || 0,
      timestamp: data.results?.t || Date.now(),
      volume: data.results?.s || 0,
      change: 0, // We'll calculate this later
      changePercent: 0
    }

    return new Response(
      JSON.stringify({ data: marketData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error fetching market data:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch market data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
