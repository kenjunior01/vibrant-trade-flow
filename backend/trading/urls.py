from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PositionViewSet, OrderViewSet

router = DefaultRouter()
router.register(r'positions', PositionViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
