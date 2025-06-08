
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from config import Config
import os

# Initialize extensions
db = SQLAlchemy()
login_manager = LoginManager()
jwt = JWTManager()
socketio = SocketIO(cors_allowed_origins="*")
bcrypt = Bcrypt()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions with app
    db.init_app(app)
    login_manager.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app)
    bcrypt.init_app(app)
    
    # Configure CORS
    CORS(app, origins=["http://localhost:5173", "http://localhost:3000"])
    
    # Configure login manager
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Por favor, faça login para acessar esta página.'
    
    # Import and register blueprints
    from routes.auth import auth_bp
    from routes.market_data import market_bp
    from routes.trading import trading_bp
    from routes.automation import automation_bp
    from routes.news import news_bp
    from routes.chat import chat_bp
    from routes.admin import admin_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(market_bp, url_prefix='/api/market')
    app.register_blueprint(trading_bp, url_prefix='/api/trading')
    app.register_blueprint(automation_bp, url_prefix='/api/automation')
    app.register_blueprint(news_bp, url_prefix='/api/news')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
