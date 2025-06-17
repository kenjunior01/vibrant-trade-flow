from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PositionViewSet, OrderViewSet, TradingDashboardView, PositionsListHTMXView, ClosePositionView, OrderBookHTMXView, PortfolioHTMXView, RecentTradesHTMXView, PerformanceChartHTMXView, MarketTickerHTMXView

router = DefaultRouter()
router.register(r'positions', PositionViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', TradingDashboardView.as_view(), name='trading_dashboard'),
    path('positions/htmx/', PositionsListHTMXView.as_view(), name='positions-list-htmx'),
    path('positions/<int:position_id>/close/', ClosePositionView.as_view(), name='close_position'),
    path('orderbook/htmx/', OrderBookHTMXView.as_view(), name='orderbook-htmx'),
    path('portfolio/htmx/', PortfolioHTMXView.as_view(), name='portfolio-htmx'),
    path('recent-trades/htmx/', RecentTradesHTMXView.as_view(), name='recent-trades-htmx'),
    path('performance-chart/htmx/', PerformanceChartHTMXView.as_view(), name='performance-chart-htmx'),
    path('market-ticker/htmx/', MarketTickerHTMXView.as_view(), name='market-ticker-htmx'),
]
