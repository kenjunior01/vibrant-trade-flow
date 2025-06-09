
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

    const { asset_symbol, side, order_type, quantity, price, wallet_id } = await req.json()

    // Validate required fields
    if (!asset_symbol || !side || !order_type || !quantity || !wallet_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's wallet
    const { data: wallet, error: walletError } = await supabaseClient
      .from('wallets')
      .select('*')
      .eq('id', wallet_id)
      .eq('user_id', user.id)
      .single()

    if (walletError || !wallet) {
      return new Response(
        JSON.stringify({ error: 'Wallet not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // For market orders, get current price
    let execution_price = price
    if (order_type === 'market') {
      // Mock price for now - in production, fetch from market data API
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
      execution_price = mockPrices[asset_symbol] || 100.0
    }

    // Calculate required margin (1% for now)
    const position_value = quantity * execution_price
    const required_margin = position_value * 0.01

    // Check if user has enough free margin
    if (wallet.free_margin < required_margin) {
      return new Response(
        JSON.stringify({ error: 'Insufficient margin' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create order record
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        wallet_id: wallet_id,
        asset_symbol: asset_symbol,
        side: side,
        order_type: order_type,
        quantity: quantity,
        price: execution_price,
        status: order_type === 'market' ? 'filled' : 'pending',
        filled_quantity: order_type === 'market' ? quantity : 0,
        filled_at: order_type === 'market' ? new Date().toISOString() : null
      })
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    // For market orders, create position and update wallet
    if (order_type === 'market') {
      // Create position
      const { error: positionError } = await supabaseClient
        .from('positions')
        .insert({
          user_id: user.id,
          wallet_id: wallet_id,
          asset_symbol: asset_symbol,
          type: side === 'buy' ? 'long' : 'short',
          amount: quantity,
          open_price: execution_price,
          leverage: 1,
          status: 'open'
        })

      if (positionError) {
        console.error('Error creating position:', positionError)
      }

      // Update wallet margin
      const { error: walletUpdateError } = await supabaseClient
        .from('wallets')
        .update({
          margin_used: wallet.margin_used + required_margin,
          free_margin: wallet.free_margin - required_margin
        })
        .eq('id', wallet_id)

      if (walletUpdateError) {
        console.error('Error updating wallet:', walletUpdateError)
      }

      // Create transaction record
      const { error: transactionError } = await supabaseClient
        .from('transactions')
        .insert({
          wallet_id: wallet_id,
          type: 'trade',
          amount: -required_margin,
          description: `${side.toUpperCase()} ${quantity} ${asset_symbol} @ ${execution_price}`
        })

      if (transactionError) {
        console.error('Error creating transaction:', transactionError)
      }
    }

    return new Response(
      JSON.stringify({ 
        order: order,
        execution_price: execution_price,
        message: order_type === 'market' ? 'Order executed successfully' : 'Order placed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error placing order:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to place order' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
