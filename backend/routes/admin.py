
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import User, UserRole, AutomationStrategy, Position, Order
from datetime import datetime, timedelta

admin_bp = Blueprint('admin', __name__)

def require_admin_role(required_roles):
    """Decorator to check if user has required admin role"""
    def decorator(f):
        def decorated_function(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user or user.role not in required_roles:
                return jsonify({'error': 'Insufficient permissions'}), 403
            
            return f(*args, **kwargs)
        decorated_function.__name__ = f.__name__
        return decorated_function
    return decorator

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@require_admin_role([UserRole.ADMIN, UserRole.SUPERADMIN])
def get_users():
    """Get all users with filtering options"""
    try:
        role_filter = request.args.get('role')
        active_only = request.args.get('active', 'false').lower() == 'true'
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 50))
        
        query = User.query
        
        if role_filter:
            try:
                role_enum = UserRole(role_filter)
                query = query.filter_by(role=role_enum)
            except ValueError:
                return jsonify({'error': 'Invalid role filter'}), 400
        
        if active_only:
            query = query.filter_by(is_active=True)
        
        users = query.order_by(User.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        user_data = []
        for user in users.items:
            user_info = user.to_dict()
            
            # Add additional info for admins
            if user.role == UserRole.TRADER:
                # Add wallet info
                if user.wallets:
                    user_info['wallet'] = user.wallets[0].to_dict()
                
                # Add strategy count
                strategy_count = AutomationStrategy.query.filter_by(
                    client_id=user.id,
                    is_active=True
                ).count()
                user_info['active_strategies'] = strategy_count
                
            elif user.role == UserRole.MANAGER:
                # Add client count
                client_count = User.query.filter_by(
                    manager_id=user.id,
                    is_active=True
                ).count()
                user_info['client_count'] = client_count
            
            user_data.append(user_info)
        
        return jsonify({
            'users': user_data,
            'pagination': {
                'page': users.page,
                'pages': users.pages,
                'per_page': users.per_page,
                'total': users.total
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<user_id>/toggle-status', methods=['POST'])
@jwt_required()
@require_admin_role([UserRole.ADMIN, UserRole.SUPERADMIN])
def toggle_user_status(user_id):
    """Activate or deactivate a user account"""
    try:
        admin_id = get_jwt_identity()
        admin = User.query.get(admin_id)
        
        target_user = User.query.get(user_id)
        if not target_user:
            return jsonify({'error': 'User not found'}), 404
        
        # Super admins can manage anyone, admins can only manage non-admin users
        if admin.role == UserRole.ADMIN and target_user.role in [UserRole.ADMIN, UserRole.SUPERADMIN]:
            return jsonify({'error': 'Cannot modify admin or super admin accounts'}), 403
        
        target_user.is_active = not target_user.is_active
        db.session.commit()
        
        action = 'activated' if target_user.is_active else 'deactivated'
        
        return jsonify({
            'message': f'User {action} successfully',
            'user': target_user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<user_id>/assign-manager', methods=['POST'])
@jwt_required()
@require_admin_role([UserRole.ADMIN, UserRole.SUPERADMIN])
def assign_manager(user_id):
    """Assign a manager to a trader"""
    try:
        data = request.get_json()
        manager_id = data.get('manager_id')
        
        trader = User.query.filter_by(id=user_id, role=UserRole.TRADER).first()
        if not trader:
            return jsonify({'error': 'Trader not found'}), 404
        
        if manager_id:
            manager = User.query.filter_by(id=manager_id, role=UserRole.MANAGER).first()
            if not manager:
                return jsonify({'error': 'Manager not found'}), 404
            trader.manager_id = manager_id
        else:
            trader.manager_id = None
        
        db.session.commit()
        
        return jsonify({
            'message': 'Manager assignment updated successfully',
            'trader': trader.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/dashboard-stats', methods=['GET'])
@jwt_required()
@require_admin_role([UserRole.ADMIN, UserRole.SUPERADMIN])
def get_dashboard_stats():
    """Get admin dashboard statistics"""
    try:
        # User statistics
        total_users = User.query.count()
        active_users = User.query.filter_by(is_active=True).count()
        traders = User.query.filter_by(role=UserRole.TRADER).count()
        managers = User.query.filter_by(role=UserRole.MANAGER).count()
        
        # Trading statistics
        total_positions = Position.query.count()
        open_positions = Position.query.filter_by(is_open=True).count()
        total_orders = Order.query.count()
        
        # Active strategies
        active_strategies = AutomationStrategy.query.filter_by(is_active=True).count()
        
        # Recent activity (last 24 hours)
        yesterday = datetime.utcnow() - timedelta(days=1)
        new_users_today = User.query.filter(User.created_at > yesterday).count()
        orders_today = Order.query.filter(Order.created_at > yesterday).count()
        
        # System health
        system_stats = {
            'uptime': '99.9%',  # Mock data
            'avg_response_time': '150ms',  # Mock data
            'active_connections': 1247,  # Mock data
            'cache_hit_rate': '94.2%'  # Mock data
        }
        
        stats = {
            'users': {
                'total': total_users,
                'active': active_users,
                'traders': traders,
                'managers': managers,
                'new_today': new_users_today
            },
            'trading': {
                'total_positions': total_positions,
                'open_positions': open_positions,
                'total_orders': total_orders,
                'orders_today': orders_today
            },
            'automation': {
                'active_strategies': active_strategies
            },
            'system': system_stats
        }
        
        return jsonify({'stats': stats}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/system-logs', methods=['GET'])
@jwt_required()
@require_admin_role([UserRole.ADMIN, UserRole.SUPERADMIN])
def get_system_logs():
    """Get system logs and audit trail"""
    try:
        log_type = request.args.get('type', 'all')  # all, error, warning, info
        limit = int(request.args.get('limit', 100))
        
        # Mock log data (in production, integrate with actual logging system)
        logs = [
            {
                'id': '1',
                'timestamp': (datetime.utcnow() - timedelta(minutes=5)).isoformat(),
                'level': 'INFO',
                'message': 'User login successful',
                'user_id': 'user_123',
                'ip_address': '192.168.1.100'
            },
            {
                'id': '2',
                'timestamp': (datetime.utcnow() - timedelta(minutes=15)).isoformat(),
                'level': 'WARNING',
                'message': 'API rate limit exceeded',
                'source': 'alpha_vantage_api',
                'details': 'Rate limit: 5 requests per minute'
            },
            {
                'id': '3',
                'timestamp': (datetime.utcnow() - timedelta(hours=1)).isoformat(),
                'level': 'ERROR',
                'message': 'Database connection timeout',
                'source': 'trading_service',
                'error_code': 'DB_TIMEOUT_001'
            },
            {
                'id': '4',
                'timestamp': (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                'level': 'INFO',
                'message': 'Automation strategy executed',
                'strategy_id': 'strategy_456',
                'result': 'success'
            }
        ]
        
        # Filter by log type if specified
        if log_type != 'all':
            logs = [log for log in logs if log['level'].lower() == log_type.lower()]
        
        # Limit results
        logs = logs[:limit]
        
        return jsonify({'logs': logs}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/create-manager', methods=['POST'])
@jwt_required()
@require_admin_role([UserRole.ADMIN, UserRole.SUPERADMIN])
def create_manager():
    """Create a new manager account"""
    try:
        data = request.get_json()
        
        required_fields = ['email', 'password', 'full_name']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        email = data['email'].lower().strip()
        
        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 409
        
        # Create manager
        manager = User(
            email=email,
            full_name=data['full_name'],
            role=UserRole.MANAGER
        )
        manager.set_password(data['password'])
        
        db.session.add(manager)
        db.session.commit()
        
        return jsonify({
            'message': 'Manager created successfully',
            'manager': manager.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
