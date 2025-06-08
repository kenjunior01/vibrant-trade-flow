
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import requests
import os
from datetime import datetime, timedelta
from models import NewsArticle
from app import db

news_bp = Blueprint('news', __name__)

NEWS_API_BASE_URL = "https://newsapi.org/v2"

def analyze_sentiment(text):
    """Analyze sentiment of news text (mock implementation)"""
    # In production, use NLTK, TextBlob, or a dedicated sentiment API
    
    positive_words = ['bull', 'rise', 'gain', 'profit', 'growth', 'up', 'high', 'positive', 'strong', 'boost']
    negative_words = ['bear', 'fall', 'loss', 'drop', 'decline', 'down', 'low', 'negative', 'weak', 'crash']
    
    text_lower = text.lower()
    
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    if positive_count > negative_count:
        return 'positive', (positive_count - negative_count) / (positive_count + negative_count + 1)
    elif negative_count > positive_count:
        return 'negative', (negative_count - positive_count) / (positive_count + negative_count + 1) * -1
    else:
        return 'neutral', 0.0

@news_bp.route('/latest', methods=['GET'])
@jwt_required()
def get_latest_news():
    """Get latest financial news with sentiment analysis"""
    try:
        category = request.args.get('category', 'business')
        limit = int(request.args.get('limit', 20))
        
        # Check if we have recent news in database
        recent_news = NewsArticle.query.filter(
            NewsArticle.created_at > datetime.utcnow() - timedelta(hours=1)
        ).order_by(NewsArticle.published_at.desc()).limit(limit).all()
        
        if recent_news:
            return jsonify({
                'articles': [article.to_dict() for article in recent_news],
                'source': 'database'
            }), 200
        
        # Fetch from News API
        api_key = os.environ.get('NEWS_API_KEY')
        if not api_key:
            return get_mock_news()
        
        params = {
            'category': category,
            'language': 'en',
            'pageSize': limit,
            'apiKey': api_key
        }
        
        response = requests.get(f"{NEWS_API_BASE_URL}/top-headlines", params=params, timeout=10)
        data = response.json()
        
        if response.status_code != 200 or data.get('status') != 'ok':
            return get_mock_news()
        
        articles = []
        
        for article_data in data.get('articles', []):
            # Analyze sentiment
            title = article_data.get('title', '')
            description = article_data.get('description', '')
            content_for_analysis = f"{title} {description}"
            
            sentiment_label, sentiment_score = analyze_sentiment(content_for_analysis)
            
            # Create news article record
            article = NewsArticle(
                title=title,
                content=article_data.get('content', description),
                url=article_data.get('url', ''),
                source=article_data.get('source', {}).get('name', 'Unknown'),
                sentiment_score=sentiment_score,
                sentiment_label=sentiment_label,
                published_at=datetime.fromisoformat(
                    article_data.get('publishedAt', datetime.utcnow().isoformat()).replace('Z', '+00:00')
                )
            )
            
            db.session.add(article)
            articles.append(article.to_dict())
        
        db.session.commit()
        
        return jsonify({
            'articles': articles,
            'source': 'api'
        }), 200
        
    except Exception as e:
        print(f"Error fetching news: {e}")
        return get_mock_news()

def get_mock_news():
    """Return mock news data when API is not available"""
    mock_articles = [
        {
            'id': '1',
            'title': 'Fed Signals Potential Rate Cut as Inflation Cools',
            'content': 'The Federal Reserve indicated today that interest rates may be reduced in the coming months as inflation continues to moderate from its recent highs.',
            'url': 'https://example.com/fed-rate-cut',
            'source': 'Financial Times',
            'sentiment_score': 0.3,
            'sentiment_label': 'positive',
            'published_at': (datetime.utcnow() - timedelta(hours=2)).isoformat(),
            'created_at': datetime.utcnow().isoformat()
        },
        {
            'id': '2',
            'title': 'Bitcoin Rallies Above $45,000 on ETF Optimism',
            'content': 'Bitcoin surged past $45,000 today as investors grew increasingly optimistic about potential approval of spot Bitcoin ETFs.',
            'url': 'https://example.com/bitcoin-rally',
            'source': 'CoinDesk',
            'sentiment_score': 0.7,
            'sentiment_label': 'positive',
            'published_at': (datetime.utcnow() - timedelta(hours=4)).isoformat(),
            'created_at': datetime.utcnow().isoformat()
        },
        {
            'id': '3',
            'title': 'European Markets Mixed Amid ECB Policy Uncertainty',
            'content': 'European stock markets traded mixed today as investors await clearer signals from the European Central Bank regarding future monetary policy.',
            'url': 'https://example.com/eu-markets',
            'source': 'Reuters',
            'sentiment_score': 0.0,
            'sentiment_label': 'neutral',
            'published_at': (datetime.utcnow() - timedelta(hours=6)).isoformat(),
            'created_at': datetime.utcnow().isoformat()
        },
        {
            'id': '4',
            'title': 'Oil Prices Drop on Weak Demand Forecasts',
            'content': 'Crude oil prices fell sharply today following reports of weakening global demand and increasing supply from major producers.',
            'url': 'https://example.com/oil-drop',
            'source': 'Bloomberg',
            'sentiment_score': -0.5,
            'sentiment_label': 'negative',
            'published_at': (datetime.utcnow() - timedelta(hours=8)).isoformat(),
            'created_at': datetime.utcnow().isoformat()
        }
    ]
    
    return jsonify({
        'articles': mock_articles,
        'source': 'mock'
    }), 200

@news_bp.route('/search', methods=['GET'])
@jwt_required()
def search_news():
    """Search news articles by keyword"""
    try:
        query = request.args.get('q', '')
        limit = int(request.args.get('limit', 10))
        
        if not query:
            return jsonify({'error': 'Search query is required'}), 400
        
        # Search in database first
        db_articles = NewsArticle.query.filter(
            NewsArticle.title.contains(query)
        ).order_by(NewsArticle.published_at.desc()).limit(limit).all()
        
        if db_articles:
            return jsonify({
                'articles': [article.to_dict() for article in db_articles],
                'source': 'database'
            }), 200
        
        # Search via News API
        api_key = os.environ.get('NEWS_API_KEY')
        if not api_key:
            return jsonify({
                'articles': [],
                'message': 'No results found'
            }), 200
        
        params = {
            'q': query,
            'language': 'en',
            'pageSize': limit,
            'apiKey': api_key
        }
        
        response = requests.get(f"{NEWS_API_BASE_URL}/everything", params=params, timeout=10)
        data = response.json()
        
        if response.status_code != 200 or data.get('status') != 'ok':
            return jsonify({
                'articles': [],
                'message': 'Search failed'
            }), 200
        
        articles = []
        
        for article_data in data.get('articles', []):
            title = article_data.get('title', '')
            description = article_data.get('description', '')
            sentiment_label, sentiment_score = analyze_sentiment(f"{title} {description}")
            
            articles.append({
                'title': title,
                'content': article_data.get('content', description),
                'url': article_data.get('url', ''),
                'source': article_data.get('source', {}).get('name', 'Unknown'),
                'sentiment_score': sentiment_score,
                'sentiment_label': sentiment_label,
                'published_at': article_data.get('publishedAt', datetime.utcnow().isoformat()),
                'created_at': datetime.utcnow().isoformat()
            })
        
        return jsonify({
            'articles': articles,
            'source': 'api'
        }), 200
        
    except Exception as e:
        print(f"Error searching news: {e}")
        return jsonify({'error': 'Search failed'}), 500

@news_bp.route('/sentiment-summary', methods=['GET'])
@jwt_required()
def get_sentiment_summary():
    """Get overall market sentiment based on recent news"""
    try:
        # Get news from last 24 hours
        recent_news = NewsArticle.query.filter(
            NewsArticle.published_at > datetime.utcnow() - timedelta(hours=24)
        ).all()
        
        if not recent_news:
            return jsonify({
                'overall_sentiment': 'neutral',
                'sentiment_score': 0.0,
                'total_articles': 0,
                'breakdown': {
                    'positive': 0,
                    'neutral': 0,
                    'negative': 0
                }
            }), 200
        
        total_score = 0
        breakdown = {'positive': 0, 'neutral': 0, 'negative': 0}
        
        for article in recent_news:
            if article.sentiment_score:
                total_score += article.sentiment_score
            if article.sentiment_label:
                breakdown[article.sentiment_label] += 1
        
        avg_score = total_score / len(recent_news)
        
        if avg_score > 0.1:
            overall_sentiment = 'positive'
        elif avg_score < -0.1:
            overall_sentiment = 'negative'
        else:
            overall_sentiment = 'neutral'
        
        return jsonify({
            'overall_sentiment': overall_sentiment,
            'sentiment_score': round(avg_score, 3),
            'total_articles': len(recent_news),
            'breakdown': breakdown
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
