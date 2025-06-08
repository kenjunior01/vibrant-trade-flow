
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import requests
import os
from datetime import datetime, timedelta
import json
from app import db

market_bp = Blueprint('market', __name__)

# API Configuration
ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query"
FINNHUB_BASE_URL = "https://finnhub.io/api/v1"
COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"

# Cache for market data (in production, use Redis)
market_cache = {}
CACHE_DURATION = 60  # seconds

def get_alpha_vantage_data(symbol, function="GLOBAL_QUOTE"):
    """Get data from Alpha Vantage API"""
    api_key = os.environ.get('ALPHA_VANTAGE_API_KEY')
    if not api_key:
        return None
    
    cache_key = f"av_{function}_{symbol}"
    now = datetime.now()
    
    # Check cache
    if cache_key in market_cache:
        cache_data, timestamp = market_cache[cache_key]
        if (now - timestamp).seconds < CACHE_DURATION:
            return cache_data
    
    params = {
        'function': function,
        'symbol': symbol,
        'apikey': api_key
    }
    
    try:
        response = requests.get(ALPHA_VANTAGE_BASE_URL, params=params, timeout=10)
        data = response.json()
        
        # Cache the data
        market_cache[cache_key] = (data, now)
        return data
    except Exception as e:
        print(f"Alpha Vantage API error: {e}")
        return None

def get_finnhub_data(symbol):
    """Get data from Finnhub API"""
    api_key = os.environ.get('FINNHUB_API_KEY')
    if not api_key:
        return None
    
    cache_key = f"fh_{symbol}"
    now = datetime.now()
    
    # Check cache
    if cache_key in market_cache:
        cache_data, timestamp = market_cache[cache_key]
        if (now - timestamp).seconds < CACHE_DURATION:
            return cache_data
    
    headers = {'X-Finnhub-Token': api_key}
    
    try:
        response = requests.get(f"{FINNHUB_BASE_URL}/quote?symbol={symbol}", 
                              headers=headers, timeout=10)
        data = response.json()
        
        # Cache the data
        market_cache[cache_key] = (data, now)
        return data
    except Exception as e:
        print(f"Finnhub API error: {e}")
        return None

def get_coingecko_data(ids):
    """Get cryptocurrency data from CoinGecko API"""
    cache_key = f"cg_{ids}"
    now = datetime.now()
    
    # Check cache
    if cache_key in market_cache:
        cache_data, timestamp = market_cache[cache_key]
        if (now - timestamp).seconds < CACHE_DURATION:
            return cache_data
    
    params = {
        'ids': ids,
        'vs_currencies': 'usd',
        'include_24hr_change': 'true'
    }
    
    try:
        response = requests.get(f"{COINGECKO_BASE_URL}/simple/price", 
                              params=params, timeout=10)
        data = response.json()
        
        # Cache the data
        market_cache[cache_key] = (data, now)
        return data
    except Exception as e:
        print(f"CoinGecko API error: {e}")
        return None

@market_bp.route('/quotes', methods=['GET'])
@jwt_required()
def get_quotes():
    """Get real-time quotes for multiple instruments"""
    try:
        # Define the instruments we want to track
        instruments = {
            'forex': ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF'],
            'crypto': ['bitcoin', 'ethereum', 'binancecoin', 'cardano'],
            'stocks': ['AAPL', 'GOOGL', 'MSFT', 'TSLA'],
            'commodities': ['XAUUSD', 'XAGUSD', 'USOIL', 'UKOIL']
        }
        
        quotes = {}
        
        # Get Forex data from Alpha Vantage
        for symbol in instruments['forex']:
            data = get_alpha_vantage_data(symbol, "CURRENCY_EXCHANGE_RATE")
            if data and "Realtime Currency Exchange Rate" in data:
                rate_data = data["Realtime Currency Exchange Rate"]
                quotes[symbol] = {
                    'symbol': symbol,
                    'price': float(rate_data.get('5. Exchange Rate', 0)),
                    'change': float(rate_data.get('9. Change', 0)),
                    'change_percent': float(rate_data.get('10. Change Percent', '0%').replace('%', '')),
                    'type': 'forex',
                    'last_updated': rate_data.get('6. Last Refreshed')
                }
        
        # Get Cryptocurrency data from CoinGecko
        crypto_ids = ','.join(instruments['crypto'])
        crypto_data = get_coingecko_data(crypto_ids)
        if crypto_data:
            for crypto_id in instruments['crypto']:
                if crypto_id in crypto_data:
                    data = crypto_data[crypto_id]
                    symbol = crypto_id.upper() + 'USD'
                    quotes[symbol] = {
                        'symbol': symbol,
                        'price': data.get('usd', 0),
                        'change': 0,  # Calculate from 24hr change
                        'change_percent': data.get('usd_24h_change', 0),
                        'type': 'crypto',
                        'last_updated': datetime.now().isoformat()
                    }
                    # Calculate absolute change
                    if quotes[symbol]['change_percent'] != 0:
                        quotes[symbol]['change'] = quotes[symbol]['price'] * (quotes[symbol]['change_percent'] / 100)
        
        # Get Stock data from Finnhub
        for symbol in instruments['stocks']:
            data = get_finnhub_data(symbol)
            if data and 'c' in data:  # current price
                change = data.get('d', 0)  # change
                change_percent = data.get('dp', 0)  # change percent
                quotes[symbol] = {
                    'symbol': symbol,
                    'price': data.get('c', 0),
                    'change': change,
                    'change_percent': change_percent,
                    'type': 'stock',
                    'last_updated': datetime.now().isoformat()
                }
        
        # Add some mock commodity data if APIs don't provide
        if not any(symbol in quotes for symbol in instruments['commodities']):
            import random
            base_prices = {'XAUUSD': 2000, 'XAGUSD': 25, 'USOIL': 80, 'UKOIL': 85}
            for symbol in instruments['commodities']:
                base_price = base_prices.get(symbol, 100)
                change_pct = (random.random() - 0.5) * 4  # -2% to +2%
                change = base_price * (change_pct / 100)
                quotes[symbol] = {
                    'symbol': symbol,
                    'price': round(base_price + change, 2),
                    'change': round(change, 2),
                    'change_percent': round(change_pct, 2),
                    'type': 'commodity',
                    'last_updated': datetime.now().isoformat()
                }
        
        return jsonify({'quotes': quotes}), 200
        
    except Exception as e:
        print(f"Error fetching quotes: {e}")
        return jsonify({'error': 'Failed to fetch market data'}), 500

@market_bp.route('/chart/<symbol>', methods=['GET'])
@jwt_required()
def get_chart_data(symbol):
    """Get historical chart data for a symbol"""
    try:
        interval = request.args.get('interval', '1day')
        period = request.args.get('period', '1month')
        
        # For Alpha Vantage, we'll use TIME_SERIES_DAILY
        data = get_alpha_vantage_data(symbol, "TIME_SERIES_DAILY")
        
        if not data or "Time Series (Daily)" not in data:
            # Return mock data if API fails
            return generate_mock_chart_data(symbol, period)
        
        time_series = data["Time Series (Daily)"]
        chart_data = []
        
        # Convert to our format
        for date_str, values in sorted(time_series.items())[-30:]:  # Last 30 days
            chart_data.append({
                'timestamp': date_str,
                'open': float(values['1. open']),
                'high': float(values['2. high']),
                'low': float(values['3. low']),
                'close': float(values['4. close']),
                'volume': int(values['5. volume']) if '5. volume' in values else 0
            })
        
        return jsonify({
            'symbol': symbol,
            'interval': interval,
            'data': chart_data
        }), 200
        
    except Exception as e:
        print(f"Error fetching chart data: {e}")
        return generate_mock_chart_data(symbol, period)

def generate_mock_chart_data(symbol, period):
    """Generate mock chart data when APIs are not available"""
    import random
    from datetime import datetime, timedelta
    
    # Determine number of data points based on period
    days = {'1week': 7, '1month': 30, '3months': 90, '1year': 365}.get(period, 30)
    
    base_price = {'EURUSD': 1.08, 'GBPUSD': 1.27, 'BTCUSD': 43000, 'ETHUSD': 2650}.get(symbol, 100)
    
    chart_data = []
    current_price = base_price
    
    for i in range(days):
        date = (datetime.now() - timedelta(days=days-i)).strftime('%Y-%m-%d')
        
        # Generate realistic OHLC data
        daily_change = (random.random() - 0.5) * 0.02  # -1% to +1%
        
        open_price = current_price
        high_price = open_price * (1 + abs(daily_change) + random.random() * 0.01)
        low_price = open_price * (1 - abs(daily_change) - random.random() * 0.01)
        close_price = open_price * (1 + daily_change)
        
        chart_data.append({
            'timestamp': date,
            'open': round(open_price, 4),
            'high': round(high_price, 4),
            'low': round(low_price, 4),
            'close': round(close_price, 4),
            'volume': random.randint(1000000, 10000000)
        })
        
        current_price = close_price
    
    return jsonify({
        'symbol': symbol,
        'interval': 'daily',
        'data': chart_data
    }), 200

@market_bp.route('/symbols', methods=['GET'])
@jwt_required()
def get_available_symbols():
    """Get list of available trading symbols"""
    symbols = {
        'forex': [
            {'symbol': 'EURUSD', 'name': 'Euro / US Dollar', 'category': 'Major'},
            {'symbol': 'GBPUSD', 'name': 'British Pound / US Dollar', 'category': 'Major'},
            {'symbol': 'USDJPY', 'name': 'US Dollar / Japanese Yen', 'category': 'Major'},
            {'symbol': 'USDCHF', 'name': 'US Dollar / Swiss Franc', 'category': 'Major'},
        ],
        'crypto': [
            {'symbol': 'BTCUSD', 'name': 'Bitcoin / US Dollar', 'category': 'Major'},
            {'symbol': 'ETHUSD', 'name': 'Ethereum / US Dollar', 'category': 'Major'},
            {'symbol': 'BNBUSD', 'name': 'Binance Coin / US Dollar', 'category': 'Major'},
            {'symbol': 'ADAUSD', 'name': 'Cardano / US Dollar', 'category': 'Alt'},
        ],
        'stocks': [
            {'symbol': 'AAPL', 'name': 'Apple Inc.', 'category': 'Tech'},
            {'symbol': 'GOOGL', 'name': 'Alphabet Inc.', 'category': 'Tech'},
            {'symbol': 'MSFT', 'name': 'Microsoft Corporation', 'category': 'Tech'},
            {'symbol': 'TSLA', 'name': 'Tesla Inc.', 'category': 'Auto'},
        ],
        'commodities': [
            {'symbol': 'XAUUSD', 'name': 'Gold / US Dollar', 'category': 'Precious Metals'},
            {'symbol': 'XAGUSD', 'name': 'Silver / US Dollar', 'category': 'Precious Metals'},
            {'symbol': 'USOIL', 'name': 'US Oil', 'category': 'Energy'},
            {'symbol': 'UKOIL', 'name': 'UK Oil', 'category': 'Energy'},
        ]
    }
    
    return jsonify({'symbols': symbols}), 200
