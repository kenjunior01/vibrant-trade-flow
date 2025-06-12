from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/trading/', include('trading.urls')),
    path('api/market_data/', include('market_data.urls')),
    path('api/news/', include('news.urls')),
    path('api/automation/', include('automation.urls')),
]
