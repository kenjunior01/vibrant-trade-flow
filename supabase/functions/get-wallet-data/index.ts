
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get user from auth header
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's default wallet
    const { data: wallet, error: walletError } = await supabaseClient
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_default', true)
      .single()

    if (walletError || !wallet) {
      return new Response(
        JSON.stringify({ error: 'Wallet not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get open positions for unrealized P&L calculation
    const { data: positions, error: positionsError } = await supabaseClient
      .from('positions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'open')

    if (positionsError) {
      console.error('Error fetching positions:', positionsError)
    }

    // Calculate total unrealized P&L
    let total_unrealized_pnl = 0
    const mockPrices: { [key: string]: number } = {
      'EURUSD': 1.0856,
      'GBPUSD': 1.2745,
      'BTCUSD': 43250.00,
      'ETHUSD': 2650.25,
      'AAPL': 190.50,
      'GOOGL': 140.75,
      'XAUUSD': 2034.50,
      'USOIL': 82.30
    }

    if (positions) {
      for (const position of positions) {
        const current_price = mockPrices[position.asset_symbol] || position.open_price
        let pnl = 0
        if (position.type === 'long') {
          pnl = (current_price - position.open_price) * position.amount
        } else {
          pnl = (position.open_price - current_price) * position.amount
        }
        total_unrealized_pnl += pnl
      }
    }

    // Update wallet equity
    const updated_equity = wallet.balance + total_unrealized_pnl

    const { error: updateError } = await supabaseClient
      .from('wallets')
      .update({ equity: updated_equity })
      .eq('id', wallet.id)

    if (updateError) {
      console.error('Error updating wallet equity:', updateError)
    }

    const walletData = {
      id: wallet.id,
      balance: wallet.balance,
      equity: updated_equity,
      margin_used: wallet.margin_used,
      free_margin: wallet.free_margin,
      unrealized_pnl: total_unrealized_pnl,
      open_positions_count: positions?.length || 0
    }

    return new Response(
      JSON.stringify({ wallet: walletData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error fetching wallet data:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch wallet data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
