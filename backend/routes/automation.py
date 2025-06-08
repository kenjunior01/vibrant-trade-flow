
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import User, AutomationStrategy, UserRole
from datetime import datetime

automation_bp = Blueprint('automation', __name__)

@automation_bp.route('/strategies', methods=['GET'])
@jwt_required()
def get_strategies():
    """Get automation strategies based on user role"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.role == UserRole.MANAGER:
            # Managers see strategies they created
            strategies = AutomationStrategy.query.filter_by(manager_id=user_id).all()
        elif user.role == UserRole.TRADER:
            # Traders see strategies assigned to them
            strategies = AutomationStrategy.query.filter_by(client_id=user_id).all()
        else:
            # Admins see all strategies
            strategies = AutomationStrategy.query.all()
        
        return jsonify({
            'strategies': [strategy.to_dict() for strategy in strategies]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/strategies', methods=['POST'])
@jwt_required()
def create_strategy():
    """Create a new automation strategy (managers only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != UserRole.MANAGER:
            return jsonify({'error': 'Only managers can create strategies'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['client_id', 'name', 'symbol', 'strategy_type', 'capital_allocation']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate client belongs to this manager
        client = User.query.filter_by(
            id=data['client_id'],
            manager_id=user_id,
            role=UserRole.TRADER
        ).first()
        
        if not client:
            return jsonify({'error': 'Client not found or not managed by you'}), 404
        
        # Create strategy
        strategy = AutomationStrategy(
            manager_id=user_id,
            client_id=data['client_id'],
            name=data['name'],
            symbol=data['symbol'].upper(),
            strategy_type=data['strategy_type'],
            parameters=data.get('parameters', {}),
            capital_allocation=data['capital_allocation'],
            stop_loss_pct=data.get('stop_loss_pct'),
            take_profit_pct=data.get('take_profit_pct'),
            max_daily_loss=data.get('max_daily_loss')
        )
        
        db.session.add(strategy)
        db.session.commit()
        
        return jsonify({
            'message': 'Strategy created successfully',
            'strategy': strategy.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/strategies/<strategy_id>', methods=['PUT'])
@jwt_required()
def update_strategy(strategy_id):
    """Update an automation strategy"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        strategy = AutomationStrategy.query.get(strategy_id)
        if not strategy:
            return jsonify({'error': 'Strategy not found'}), 404
        
        # Check permissions
        if user.role == UserRole.MANAGER and strategy.manager_id != user_id:
            return jsonify({'error': 'Not authorized to modify this strategy'}), 403
        elif user.role == UserRole.TRADER:
            return jsonify({'error': 'Traders cannot modify strategies'}), 403
        
        data = request.get_json()
        
        # Update allowed fields
        updatable_fields = [
            'name', 'parameters', 'capital_allocation', 'stop_loss_pct',
            'take_profit_pct', 'max_daily_loss', 'is_active'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(strategy, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Strategy updated successfully',
            'strategy': strategy.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/strategies/<strategy_id>', methods=['DELETE'])
@jwt_required()
def delete_strategy(strategy_id):
    """Delete an automation strategy"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        strategy = AutomationStrategy.query.get(strategy_id)
        if not strategy:
            return jsonify({'error': 'Strategy not found'}), 404
        
        # Check permissions
        if user.role == UserRole.MANAGER and strategy.manager_id != user_id:
            return jsonify({'error': 'Not authorized to delete this strategy'}), 403
        elif user.role == UserRole.TRADER:
            return jsonify({'error': 'Traders cannot delete strategies'}), 403
        
        db.session.delete(strategy)
        db.session.commit()
        
        return jsonify({'message': 'Strategy deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/strategy-templates', methods=['GET'])
@jwt_required()
def get_strategy_templates():
    """Get available strategy templates with recommended parameters"""
    templates = {
        'dca': {
            'name': 'Dollar Cost Averaging',
            'description': 'Buy/sell fixed amounts at regular intervals',
            'parameters': {
                'interval_hours': 24,
                'amount_per_trade': 100,
                'max_trades': 10
            },
            'risk_level': 'low',
            'suitable_for': ['conservative', 'moderate']
        },
        'grid': {
            'name': 'Grid Trading',
            'description': 'Place buy and sell orders at predefined intervals',
            'parameters': {
                'grid_size': 0.001,
                'grid_levels': 10,
                'base_amount': 100
            },
            'risk_level': 'medium',
            'suitable_for': ['moderate', 'aggressive']
        },
        'trailing_stop': {
            'name': 'Trailing Stop',
            'description': 'Follow price with dynamic stop loss',
            'parameters': {
                'trail_distance': 0.005,
                'min_profit': 0.002
            },
            'risk_level': 'medium',
            'suitable_for': ['moderate', 'aggressive']
        },
        'momentum': {
            'name': 'Momentum Trading',
            'description': 'Trade based on price momentum indicators',
            'parameters': {
                'rsi_oversold': 30,
                'rsi_overbought': 70,
                'ma_period': 20
            },
            'risk_level': 'high',
            'suitable_for': ['aggressive']
        },
        'rebalancing': {
            'name': 'Portfolio Rebalancing',
            'description': 'Maintain target asset allocation percentages',
            'parameters': {
                'rebalance_threshold': 0.05,
                'rebalance_frequency': 'weekly'
            },
            'risk_level': 'low',
            'suitable_for': ['conservative', 'moderate']
        }
    }
    
    return jsonify({'templates': templates}), 200

@automation_bp.route('/clients', methods=['GET'])
@jwt_required()
def get_manager_clients():
    """Get clients assigned to this manager"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != UserRole.MANAGER:
            return jsonify({'error': 'Only managers can view clients'}), 403
        
        clients = User.query.filter_by(
            manager_id=user_id,
            role=UserRole.TRADER,
            is_active=True
        ).all()
        
        client_data = []
        for client in clients:
            client_info = client.to_dict()
            
            # Add wallet information
            if client.wallets:
                client_info['wallet'] = client.wallets[0].to_dict()
            
            # Add strategy count
            strategy_count = AutomationStrategy.query.filter_by(
                client_id=client.id,
                is_active=True
            ).count()
            client_info['active_strategies'] = strategy_count
            
            client_data.append(client_info)
        
        return jsonify({'clients': client_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/performance/<strategy_id>', methods=['GET'])
@jwt_required()
def get_strategy_performance(strategy_id):
    """Get performance metrics for a specific strategy"""
    try:
        user_id = get_jwt_identity()
        
        strategy = AutomationStrategy.query.get(strategy_id)
        if not strategy:
            return jsonify({'error': 'Strategy not found'}), 404
        
        # Check permissions
        user = User.query.get(user_id)
        if (user.role == UserRole.MANAGER and strategy.manager_id != user_id) or \
           (user.role == UserRole.TRADER and strategy.client_id != user_id):
            return jsonify({'error': 'Not authorized to view this strategy'}), 403
        
        # Mock performance data (in production, calculate from actual trades)
        performance = {
            'strategy_id': strategy_id,
            'total_trades': 25,
            'winning_trades': 18,
            'losing_trades': 7,
            'win_rate': 72.0,
            'total_pnl': 1250.75,
            'avg_trade_pnl': 50.03,
            'max_drawdown': -125.50,
            'profit_factor': 2.3,
            'sharpe_ratio': 1.85,
            'active_since': strategy.created_at.isoformat(),
            'last_trade': '2024-01-08T14:30:00Z',
            'status': 'active' if strategy.is_active else 'inactive'
        }
        
        return jsonify({'performance': performance}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
