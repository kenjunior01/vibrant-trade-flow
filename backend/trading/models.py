from django.db import models
from users.models import User
from django.utils import timezone

class Position(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='positions')
    asset = models.CharField(max_length=50)
    quantity = models.DecimalField(max_digits=20, decimal_places=8)
    open_price = models.DecimalField(max_digits=20, decimal_places=8)
    open_time = models.DateTimeField(auto_now_add=True)
    close_price = models.DecimalField(max_digits=20, decimal_places=8, null=True, blank=True)
    close_time = models.DateTimeField(null=True, blank=True)
    is_open = models.BooleanField(default=True)

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    asset = models.CharField(max_length=50)
    order_type = models.CharField(max_length=10, choices=[('buy', 'Buy'), ('sell', 'Sell')])
    quantity = models.DecimalField(max_digits=20, decimal_places=8)
    price = models.DecimalField(max_digits=20, decimal_places=8)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')

class MarketTicker(models.Model):
    symbol = models.CharField(max_length=20, unique=True)
    price = models.DecimalField(max_digits=18, decimal_places=8)
    volume_24h = models.DecimalField(max_digits=24, decimal_places=8)
    last_updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f'{self.symbol}: {self.price}'

class Trade(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trades')
    symbol = models.CharField(max_length=20)
    quantity = models.DecimalField(max_digits=18, decimal_places=8)
    price = models.DecimalField(max_digits=18, decimal_places=8)
    side = models.CharField(max_length=4, choices=[('buy', 'Buy'), ('sell', 'Sell')])
    timestamp = models.DateTimeField(default=timezone.now)
    def __str__(self):
        return f'Trade {self.side} de {self.quantity} {self.symbol} @ {self.price}'

class Portfolio(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='portfolio')
    total_value = models.DecimalField(max_digits=18, decimal_places=2, default=0.00)
    last_updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f'Portfólio de {self.user.username} - Valor: {self.total_value}'

class OrderBook(models.Model):
    symbol = models.CharField(max_length=20, unique=True)
    buy_orders = models.ManyToManyField(Order, related_name='buy_order_book')
    sell_orders = models.ManyToManyField(Order, related_name='sell_order_book')
    def __str__(self):
        return f'Livro de Ordens para {self.symbol}'
