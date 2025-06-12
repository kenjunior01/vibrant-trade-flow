from rest_framework import viewsets
from .models import Position, Order
from .serializers import PositionSerializer, OrderSerializer
from rest_framework.permissions import IsAuthenticated

class PositionViewSet(viewsets.ModelViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    permission_classes = [IsAuthenticated]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
