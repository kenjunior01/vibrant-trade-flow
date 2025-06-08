
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import User, Wallet, Position, Order, OrderType, OrderStatus
from decimal import Decimal
import uuid
from datetime import datetime

trading_bp = Blueprint('trading', __name__)

@trading_bp.route('/positions', methods=['GET'])
@jwt_required()
def get_positions():
    """Get user's trading positions"""
    try:
        user_id = get_jwt_identity()
        
        # Get query parameters
        status = request.args.get('status', 'open')  # 'open', 'closed', 'all'
        
        query = Position.query.filter_by(user_id=user_id)
        
        if status == 'open':
            query = query.filter_by(is_open=True)
        elif status == 'closed':
            query = query.filter_by(is_open=False)
        
        positions = query.order_by(Position.opened_at.desc()).all()
        
        return jsonify({
            'positions': [pos.to_dict() for pos in positions]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@trading_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    """Get user's orders"""
    try:
        user_id = get_jwt_identity()
        
        status = request.args.get('status', 'all')  # 'pending', 'filled', 'cancelled', 'all'
        
        query = Order.query.filter_by(user_id=user_id)
        
        if status != 'all':
            try:
                order_status = OrderStatus(status)
                query = query.filter_by(status=order_status)
            except ValueError:
                return jsonify({'error': 'Invalid status'}), 400
        
        orders = query.order_by(Order.created_at.desc()).limit(50).all()
        
        return jsonify({
            'orders': [order.to_dict() for order in orders]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@trading_bp.route('/place-order', methods=['POST'])
@jwt_required()
def place_order():
    """Place a new trading order"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['symbol', 'side', 'order_type', 'size']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        symbol = data['symbol'].upper()
        side = data['side'].lower()  # 'buy' or 'sell'
        order_type = data['order_type'].lower()
        size = Decimal(str(data['size']))
        price = Decimal(str(data.get('price', 0))) if data.get('price') else None
        stop_price = Decimal(str(data.get('stop_price', 0))) if data.get('stop_price') else None
        
        # Validate inputs
        if side not in ['buy', 'sell']:
            return jsonify({'error': 'Side must be buy or sell'}), 400
        
        if size <= 0:
            return jsonify({'error': 'Size must be positive'}), 400
        
        try:
            order_type_enum = OrderType(order_type)
        except ValueError:
            return jsonify({'error': 'Invalid order type'}), 400
        
        # Get user's wallet
        user = User.query.get(user_id)
        if not user or not user.wallets:
            return jsonify({'error': 'User wallet not found'}), 404
        
        wallet = user.wallets[0]
        
        # For market orders, execute immediately
        if order_type_enum == OrderType.MARKET:
            return execute_market_order(user_id, wallet, symbol, side, size)
        
        # For other order types, create pending order
        order = Order(
            user_id=user_id,
            symbol=symbol,
            side=side,
            order_type=order_type_enum,
            size=size,
            price=price,
            stop_price=stop_price,
            status=OrderStatus.PENDING
        )
        
        db.session.add(order)
        db.session.commit()
        
        return jsonify({
            'message': 'Order placed successfully',
            'order': order.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def execute_market_order(user_id, wallet, symbol, side, size):
    """Execute a market order immediately"""
    try:
        # Get current market price (mock for now)
        market_price = get_mock_market_price(symbol)
        
        # Calculate required margin
        position_value = float(size) * market_price
        required_margin = position_value * 0.01  # 1% margin requirement
        
        # Check if user has enough free margin
        if float(wallet.free_margin) < required_margin:
            return jsonify({'error': 'Insufficient margin'}), 400
        
        # Create the order record
        order = Order(
            user_id=user_id,
            symbol=symbol,
            side=side,
            order_type=OrderType.MARKET,
            size=size,
            status=OrderStatus.FILLED,
            filled_size=size,
            avg_fill_price=Decimal(str(market_price)),
            filled_at=datetime.utcnow()
        )
        
        # Check if user has an existing position in this symbol
        existing_position = Position.query.filter_by(
            user_id=user_id,
            symbol=symbol,
            is_open=True
        ).first()
        
        if existing_position:
            # Update existing position or close if opposite side
            if existing_position.side == side:
                # Same side - increase position
                total_size = float(existing_position.size) + float(size)
                total_value = (float(existing_position.size) * float(existing_position.entry_price) + 
                              float(size) * market_price)
                new_avg_price = total_value / total_size
                
                existing_position.size = Decimal(str(total_size))
                existing_position.entry_price = Decimal(str(new_avg_price))
                existing_position.current_price = Decimal(str(market_price))
            else:
                # Opposite side - reduce or close position
                if float(existing_position.size) > float(size):
                    # Reduce position
                    existing_position.size -= size
                    existing_position.current_price = Decimal(str(market_price))
                else:
                    # Close position
                    existing_position.is_open = False
                    existing_position.closed_at = datetime.utcnow()
                    existing_position.current_price = Decimal(str(market_price))
        else:
            # Create new position
            position = Position(
                user_id=user_id,
                symbol=symbol,
                side=side,
                size=size,
                entry_price=Decimal(str(market_price)),
                current_price=Decimal(str(market_price))
            )
            db.session.add(position)
        
        # Update wallet
        wallet.margin_used += Decimal(str(required_margin))
        wallet.free_margin -= Decimal(str(required_margin))
        
        db.session.add(order)
        db.session.commit()
        
        return jsonify({
            'message': 'Market order executed successfully',
            'order': order.to_dict(),
            'execution_price': market_price
        }), 201
        
    except Exception as e:
        db.session.rollback()
        raise e

def get_mock_market_price(symbol):
    """Get mock market price for a symbol"""
    prices = {
        'EURUSD': 1.0856,
        'GBPUSD': 1.2745,
        'BTCUSD': 43250.00,
        'ETHUSD': 2650.25,
        'AAPL': 190.50,
        'GOOGL': 140.75,
        'XAUUSD': 2034.50,
        'USOIL': 82.30
    }
    return prices.get(symbol, 100.0)

@trading_bp.route('/close-position/<position_id>', methods=['POST'])
@jwt_required()
def close_position(position_id):
    """Close a specific position"""
    try:
        user_id = get_jwt_identity()
        
        position = Position.query.filter_by(
            id=position_id,
            user_id=user_id,
            is_open=True
        ).first()
        
        if not position:
            return jsonify({'error': 'Position not found'}), 404
        
        # Get current market price
        market_price = get_mock_market_price(position.symbol)
        
        # Update position
        position.current_price = Decimal(str(market_price))
        position.is_open = False
        position.closed_at = datetime.utcnow()
        
        # Calculate P&L
        pnl = position.calculate_pnl()
        
        # Update wallet
        user = User.query.get(user_id)
        wallet = user.wallets[0]
        
        # Release margin
        position_value = float(position.size) * float(position.entry_price)
        margin_released = position_value * 0.01
        
        wallet.margin_used -= Decimal(str(margin_released))
        wallet.free_margin += Decimal(str(margin_released))
        wallet.balance += Decimal(str(pnl))
        wallet.equity = wallet.balance + wallet.margin_used
        
        # Create closing order record
        order = Order(
            user_id=user_id,
            symbol=position.symbol,
            side='sell' if position.side == 'buy' else 'buy',
            order_type=OrderType.MARKET,
            size=position.size,
            status=OrderStatus.FILLED,
            filled_size=position.size,
            avg_fill_price=Decimal(str(market_price)),
            filled_at=datetime.utcnow()
        )
        
        db.session.add(order)
        db.session.commit()
        
        return jsonify({
            'message': 'Position closed successfully',
            'position': position.to_dict(),
            'pnl': pnl,
            'closing_price': market_price
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@trading_bp.route('/wallet', methods=['GET'])
@jwt_required()
def get_wallet_info():
    """Get user's wallet information"""
    try:
        user_id = get_jwt_identity()
        
        user = User.query.get(user_id)
        if not user or not user.wallets:
            return jsonify({'error': 'Wallet not found'}), 404
        
        wallet = user.wallets[0]
        
        # Get open positions for unrealized P&L calculation
        open_positions = Position.query.filter_by(
            user_id=user_id,
            is_open=True
        ).all()
        
        total_unrealized_pnl = 0
        for position in open_positions:
            # Update current price with mock data
            current_price = get_mock_market_price(position.symbol)
            position.current_price = Decimal(str(current_price))
            total_unrealized_pnl += position.calculate_pnl()
        
        # Update wallet equity
        wallet.equity = wallet.balance + Decimal(str(total_unrealized_pnl))
        db.session.commit()
        
        wallet_data = wallet.to_dict()
        wallet_data['unrealized_pnl'] = total_unrealized_pnl
        wallet_data['open_positions_count'] = len(open_positions)
        
        return jsonify({'wallet': wallet_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@trading_bp.route('/performance', methods=['GET'])
@jwt_required()
def get_performance():
    """Get user's trading performance statistics"""
    try:
        user_id = get_jwt_identity()
        
        # Get closed positions for performance calculation
        closed_positions = Position.query.filter_by(
            user_id=user_id,
            is_open=False
        ).all()
        
        total_trades = len(closed_positions)
        winning_trades = 0
        total_pnl = 0
        
        for position in closed_positions:
            pnl = position.calculate_pnl()
            total_pnl += pnl
            if pnl > 0:
                winning_trades += 1
        
        win_rate = (winning_trades / total_trades * 100) if total_trades > 0 else 0
        
        # Get open positions
        open_positions = Position.query.filter_by(
            user_id=user_id,
            is_open=True
        ).all()
        
        total_unrealized_pnl = sum(pos.calculate_pnl() for pos in open_positions)
        
        performance_data = {
            'total_trades': total_trades,
            'winning_trades': winning_trades,
            'losing_trades': total_trades - winning_trades,
            'win_rate': round(win_rate, 2),
            'total_realized_pnl': round(total_pnl, 2),
            'total_unrealized_pnl': round(total_unrealized_pnl, 2),
            'open_positions': len(open_positions)
        }
        
        return jsonify({'performance': performance_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
