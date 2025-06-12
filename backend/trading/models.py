from django.db import models
from users.models import User

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
