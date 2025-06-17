from rest_framework import viewsets
from .models import Position, Order
from .serializers import PositionSerializer, OrderSerializer
from rest_framework.permissions import IsAuthenticated
from django.views import View
from django.shortcuts import render
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils import timezone

class PositionViewSet(viewsets.ModelViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    permission_classes = [IsAuthenticated]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

class TradingDashboardView(View):
    def get(self, request):
        return render(request, 'trading/dashboard.html')

class PositionsListHTMXView(View):
    def get(self, request):
        positions = Position.objects.filter(user=request.user, is_open=True)
        return render(request, 'trading/partials/positions_list.html', {'positions': positions})

class ClosePositionView(View):
    def post(self, request, position_id):
        position = Position.objects.get(id=position_id, user=request.user)
        position.is_open = False
        position.close_time = timezone.now()
        position.save()
        positions = Position.objects.filter(user=request.user, is_open=True)
        html = render_to_string('trading/partials/positions_list.html', {'positions': positions}, request=request)
        return HttpResponse(html)

class OrderBookHTMXView(View):
    def get(self, request):
        # Exemplo: buscar ordens do modelo OrderBook (ajuste conforme seu modelo real)
        from .models import OrderBook
        orders = OrderBook.objects.all()[:20]
        return render(request, 'trading/partials/order_book.html', {'orders': orders})

class PortfolioHTMXView(View):
    def get(self, request):
        # Exemplo: buscar ativos do portfólio (ajuste conforme seu modelo real)
        from .models import Portfolio
        portfolio = Portfolio.objects.filter(user=request.user)
        return render(request, 'trading/partials/portfolio.html', {'portfolio': portfolio})

class RecentTradesHTMXView(View):
    def get(self, request):
        # Exemplo: buscar negociações recentes (ajuste conforme seu modelo real)
        from .models import Trade
        trades = Trade.objects.order_by('-timestamp')[:20]
        return render(request, 'trading/partials/recent_trades.html', {'trades': trades})

class PerformanceChartHTMXView(View):
    def get(self, request):
        # Exemplo: dados estáticos ou busque dados reais do modelo
        return render(request, 'trading/partials/performance_chart.html')

class MarketTickerHTMXView(View):
    def get(self, request):
        # Exemplo: dados estáticos ou busque dados reais do modelo
        from .models import MarketTicker
        tickers = MarketTicker.objects.all()[:10]
        return render(request, 'trading/partials/market_ticker.html', {'tickers': tickers})
