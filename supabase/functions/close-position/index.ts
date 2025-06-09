
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

    const { position_id } = await req.json()

    if (!position_id) {
      return new Response(
        JSON.stringify({ error: 'Position ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get position
    const { data: position, error: positionError } = await supabaseClient
      .from('positions')
      .select('*')
      .eq('id', position_id)
      .eq('user_id', user.id)
      .eq('status', 'open')
      .single()

    if (positionError || !position) {
      return new Response(
        JSON.stringify({ error: 'Position not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get current market price (mock for now)
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
    const current_price = mockPrices[position.asset_symbol] || position.open_price

    // Calculate P&L
    let pnl = 0
    if (position.type === 'long') {
      pnl = (current_price - position.open_price) * position.amount
    } else {
      pnl = (position.open_price - current_price) * position.amount
    }

    // Update position
    const { error: updateError } = await supabaseClient
      .from('positions')
      .update({
        status: 'closed',
        close_price: current_price,
        pnl: pnl,
        closed_at: new Date().toISOString()
      })
      .eq('id', position_id)

    if (updateError) {
      throw updateError
    }

    // Get wallet to update margin
    const { data: wallet, error: walletError } = await supabaseClient
      .from('wallets')
      .select('*')
      .eq('id', position.wallet_id)
      .single()

    if (wallet) {
      // Release margin and add P&L to balance
      const position_value = position.amount * position.open_price
      const margin_released = position_value * 0.01

      const { error: walletUpdateError } = await supabaseClient
        .from('wallets')
        .update({
          balance: wallet.balance + pnl,
          margin_used: wallet.margin_used - margin_released,
          free_margin: wallet.free_margin + margin_released,
          equity: wallet.balance + pnl
        })
        .eq('id', position.wallet_id)

      if (walletUpdateError) {
        console.error('Error updating wallet:', walletUpdateError)
      }

      // Create transaction record
      const { error: transactionError } = await supabaseClient
        .from('transactions')
        .insert({
          wallet_id: position.wallet_id,
          position_id: position_id,
          type: 'trade',
          amount: pnl,
          description: `Closed ${position.type} ${position.amount} ${position.asset_symbol} - P&L: ${pnl.toFixed(2)}`
        })

      if (transactionError) {
        console.error('Error creating transaction:', transactionError)
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Position closed successfully',
        pnl: pnl,
        closing_price: current_price
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error closing position:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to close position' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
