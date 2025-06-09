from celery import Celery
from app import db
from models import AutomationStrategy, Position, User
from routes.market_data import get_alpha_vantage_data
from routes.trading import place_order, update_position_pnl_and_price
from datetime import datetime, timedelta
import pandas as pd
import pandas_ta as ta

celery = Celery('tasks')

@celery.task
def monitor_automation_strategies():
    now = datetime.utcnow()
    strategies = AutomationStrategy.query.filter_by(is_active=True).all()
    for strategy in strategies:
        # Check if strategy is within start/end date
        if strategy.start_date and now < strategy.start_date:
            continue
        if strategy.end_date and now > strategy.end_date:
            continue
        # Get current price and historical data
        data = get_alpha_vantage_data(strategy.symbol, "TIME_SERIES_DAILY")
        if not data or "Time Series (Daily)" not in data:
            continue
        time_series = data["Time Series (Daily)"]
        df = pd.DataFrame([
            {
                'timestamp': date_str,
                'close': float(values['4. close'])
            }
            for date_str, values in sorted(time_series.items())[-50:]
        ])
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values('timestamp')
        df.set_index('timestamp', inplace=True)
        df['rsi'] = ta.rsi(df['close'], length=14)
        macd = ta.macd(df['close'])
        df['macd'] = macd['MACD_12_26_9']
        df['macd_signal'] = macd['MACDs_12_26_9']
        df['macd_hist'] = macd['MACDh_12_26_9']
        current_price = df['close'].iloc[-1]
        # --- Strategy Logic ---
        if strategy.strategy_type == 'dca':
            # Example: buy every X hours
            last_order_time = strategy.parameters.get('last_order_time')
            interval = int(strategy.parameters.get('interval_hours', 24))
            if not last_order_time or (now - datetime.fromisoformat(last_order_time)).total_seconds() > interval * 3600:
                size = float(strategy.capital_allocation)  # Simplified
                place_order(strategy.client_id, strategy.symbol, 'buy', 'market', size)
                strategy.parameters['last_order_time'] = now.isoformat()
                db.session.commit()
        elif strategy.strategy_type == 'momentum':
            # Example: RSI/MACD signal
            rsi = df['rsi'].iloc[-1]
            macd_val = df['macd'].iloc[-1]
            macd_signal = df['macd_signal'].iloc[-1]
            if rsi is not None and rsi < 30:
                size = float(strategy.capital_allocation)
                place_order(strategy.client_id, strategy.symbol, 'buy', 'market', size)
            elif rsi is not None and rsi > 70:
                size = float(strategy.capital_allocation)
                place_order(strategy.client_id, strategy.symbol, 'sell', 'market', size)
            elif macd_val is not None and macd_signal is not None and macd_val > macd_signal:
                size = float(strategy.capital_allocation)
                place_order(strategy.client_id, strategy.symbol, 'buy', 'market', size)
        # ...implement grid, trailing_stop, rebalancing, etc...
    # --- Stop Loss / Take Profit Management ---
    open_positions = Position.query.filter_by(is_open=True).all()
    for pos in open_positions:
        # Update price and PnL
        data = get_alpha_vantage_data(pos.symbol, "GLOBAL_QUOTE")
        if data and "Global Quote" in data:
            new_price = float(data["Global Quote"].get('05. price', pos.current_price))
            update_position_pnl_and_price(pos.id, new_price)
            # Stop Loss / Take Profit
            if pos.stop_loss and ((pos.side == 'buy' and new_price <= float(pos.stop_loss)) or (pos.side == 'sell' and new_price >= float(pos.stop_loss))):
                pos.is_open = False
                pos.closed_at = now
                db.session.commit()
            if pos.take_profit and ((pos.side == 'buy' and new_price >= float(pos.take_profit)) or (pos.side == 'sell' and new_price <= float(pos.take_profit))):
                pos.is_open = False
                pos.closed_at = now
                db.session.commit()
    # Log execution (could be improved with a logging system)
    print(f"[Automation] monitor_automation_strategies executed at {now.isoformat()}")
