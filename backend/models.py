from app import db, login_manager, bcrypt
from flask_login import UserMixin
from datetime import datetime
from enum import Enum
import uuid

class UserRole(Enum):
    SUPERADMIN = "superadmin"
    ADMIN = "admin"
    MANAGER = "manager"
    TRADER = "trader"

class RiskProfile(Enum):
    CONSERVATIVE = "conservative"
    MODERATE = "moderate"
    AGGRESSIVE = "aggressive"

class OrderType(Enum):
    MARKET = "market"
    LIMIT = "limit"
    STOP = "stop"
    STOP_LIMIT = "stop_limit"
    OCO = "oco"
    TRAILING_STOP = "trailing_stop"

class OrderStatus(Enum):
    PENDING = "pending"
    FILLED = "filled"
    PARTIALLY_FILLED = "partially_filled"
    CANCELLED = "cancelled"
    REJECTED = "rejected"

class ChatRoomType(Enum):
    PUBLIC = "public"
    SUPPORT = "support"
    MANAGER = "manager"
    PRIVATE = "private"
    ADMIN = "admin"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(str(user_id))

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.TRADER)
    risk_profile = db.Column(db.Enum(RiskProfile), default=RiskProfile.MODERATE)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Manager relationship
    manager_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)
    manager = db.relationship('User', remote_side=[id], backref='clients')
    
    # Wallet relationship
    wallets = db.relationship('Wallet', backref='user', lazy=True, cascade='all, delete-orphan')
    
    # Chat messages relationship
    chat_messages = db.relationship('ChatMessage', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'role': self.role.value,
            'risk_profile': self.risk_profile.value if self.risk_profile else None,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'manager_id': self.manager_id
        }

class Wallet(db.Model):
    __tablename__ = 'wallets'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    balance = db.Column(db.Numeric(15, 2), default=10000.00)  # Starting balance
    equity = db.Column(db.Numeric(15, 2), default=10000.00)
    margin_used = db.Column(db.Numeric(15, 2), default=0.00)
    free_margin = db.Column(db.Numeric(15, 2), default=10000.00)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'balance': float(self.balance),
            'equity': float(self.equity),
            'margin_used': float(self.margin_used),
            'free_margin': float(self.free_margin),
            'updated_at': self.updated_at.isoformat()
        }

class Position(db.Model):
    __tablename__ = 'positions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    symbol = db.Column(db.String(20), nullable=False)
    side = db.Column(db.String(10), nullable=False)  # 'buy' or 'sell'
    size = db.Column(db.Numeric(15, 6), nullable=False)
    entry_price = db.Column(db.Numeric(15, 6), nullable=False)
    current_price = db.Column(db.Numeric(15, 6), nullable=False)
    stop_loss = db.Column(db.Numeric(15, 6), nullable=True)
    take_profit = db.Column(db.Numeric(15, 6), nullable=True)
    unrealized_pnl = db.Column(db.Numeric(15, 2), default=0.00)
    is_open = db.Column(db.Boolean, default=True)
    opened_at = db.Column(db.DateTime, default=datetime.utcnow)
    closed_at = db.Column(db.DateTime, nullable=True)
    
    user = db.relationship('User', backref='positions')
    
    def calculate_pnl(self):
        if self.side == 'buy':
            pnl = (float(self.current_price) - float(self.entry_price)) * float(self.size)
        else:
            pnl = (float(self.entry_price) - float(self.current_price)) * float(self.size)
        return round(pnl, 2)
    
    def to_dict(self):
        return {
            'id': self.id,
            'symbol': self.symbol,
            'side': self.side,
            'size': float(self.size),
            'entry_price': float(self.entry_price),
            'current_price': float(self.current_price),
            'stop_loss': float(self.stop_loss) if self.stop_loss else None,
            'take_profit': float(self.take_profit) if self.take_profit else None,
            'unrealized_pnl': self.calculate_pnl(),
            'is_open': self.is_open,
            'opened_at': self.opened_at.isoformat(),
            'closed_at': self.closed_at.isoformat() if self.closed_at else None
        }

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    symbol = db.Column(db.String(20), nullable=False)
    side = db.Column(db.String(10), nullable=False)
    order_type = db.Column(db.Enum(OrderType), nullable=False)
    size = db.Column(db.Numeric(15, 6), nullable=False)
    price = db.Column(db.Numeric(15, 6), nullable=True)
    stop_price = db.Column(db.Numeric(15, 6), nullable=True)
    status = db.Column(db.Enum(OrderStatus), default=OrderStatus.PENDING)
    filled_size = db.Column(db.Numeric(15, 6), default=0)
    avg_fill_price = db.Column(db.Numeric(15, 6), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    filled_at = db.Column(db.DateTime, nullable=True)
    
    user = db.relationship('User', backref='orders')
    
    def to_dict(self):
        return {
            'id': self.id,
            'symbol': self.symbol,
            'side': self.side,
            'order_type': self.order_type.value,
            'size': float(self.size),
            'price': float(self.price) if self.price else None,
            'stop_price': float(self.stop_price) if self.stop_price else None,
            'status': self.status.value,
            'filled_size': float(self.filled_size),
            'avg_fill_price': float(self.avg_fill_price) if self.avg_fill_price else None,
            'created_at': self.created_at.isoformat(),
            'filled_at': self.filled_at.isoformat() if self.filled_at else None
        }

class AutomationStrategy(db.Model):
    __tablename__ = 'automation_strategies'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    manager_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    client_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    symbol = db.Column(db.String(20), nullable=False)
    strategy_type = db.Column(db.String(50), nullable=False)  # 'dca', 'grid', 'trailing_stop', etc.
    parameters = db.Column(db.JSON, nullable=False)  # Strategy-specific parameters
    capital_allocation = db.Column(db.Numeric(5, 2), nullable=False)  # Percentage of balance
    stop_loss_pct = db.Column(db.Numeric(5, 2), nullable=True)
    take_profit_pct = db.Column(db.Numeric(5, 2), nullable=True)
    max_daily_loss = db.Column(db.Numeric(15, 2), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    start_date = db.Column(db.DateTime, nullable=True)
    end_date = db.Column(db.DateTime, nullable=True)
    
    manager = db.relationship('User', foreign_keys=[manager_id], backref='managed_strategies')
    client = db.relationship('User', foreign_keys=[client_id], backref='automation_strategies')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'symbol': self.symbol,
            'strategy_type': self.strategy_type,
            'parameters': self.parameters,
            'capital_allocation': float(self.capital_allocation),
            'stop_loss_pct': float(self.stop_loss_pct) if self.stop_loss_pct else None,
            'take_profit_pct': float(self.take_profit_pct) if self.take_profit_pct else None,
            'max_daily_loss': float(self.max_daily_loss) if self.max_daily_loss else None,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
        }

class NewsArticle(db.Model):
    __tablename__ = 'news_articles'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(500), nullable=False)
    content = db.Column(db.Text, nullable=True)
    url = db.Column(db.String(1000), nullable=False)
    source = db.Column(db.String(100), nullable=False)
    sentiment_score = db.Column(db.Float, nullable=True)  # -1 to 1
    sentiment_label = db.Column(db.String(20), nullable=True)  # positive, negative, neutral
    published_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'url': self.url,
            'source': self.source,
            'sentiment_score': self.sentiment_score,
            'sentiment_label': self.sentiment_label,
            'published_at': self.published_at.isoformat(),
            'created_at': self.created_at.isoformat()
        }

class ChatRoom(db.Model):
    __tablename__ = 'chat_rooms'
    id = db.Column(db.String(64), primary_key=True)  # ex: 'general', 'support', 'manager_<id>'
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.Enum(ChatRoomType), nullable=False, default=ChatRoomType.PUBLIC)
    description = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    messages = db.relationship('ChatMessage', backref='room', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type.value,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
        }

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    room_id = db.Column(db.String(64), db.ForeignKey('chat_rooms.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    user_name = db.Column(db.String(100), nullable=False)
    user_role = db.Column(db.String(20), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(20), default='text')  # text, system, etc
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    user = db.relationship('User', backref='chat_messages')

    def to_dict(self):
        return {
            'id': self.id,
            'room_id': self.room_id,
            'user_id': self.user_id,
            'user_name': self.user_name,
            'user_role': self.user_role,
            'message': self.message,
            'type': self.type,
            'timestamp': self.timestamp.isoformat(),
        }
