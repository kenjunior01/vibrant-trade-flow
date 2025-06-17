from django.contrib import admin
from django.urls import path, include, re_path
from .views import index
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect

def toggle_theme(request):
    theme = request.session.get('theme', 'light')
    request.session['theme'] = 'dark' if theme == 'light' else 'light'
    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/trading/', include('trading.urls')),
    path('api/news/', include('news.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/docs/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('', index, name='index'),
    path('toggle-theme/', csrf_exempt(toggle_theme), name='toggle-theme'),
]
