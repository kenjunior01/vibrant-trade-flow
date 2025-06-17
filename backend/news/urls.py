from django.urls import path
from .views import NewsAPIView, NewsPageView
from .views_htmx import NewsPanelView

urlpatterns = [
    path('', NewsAPIView.as_view(), name='get-news'),
    path('htmx/', NewsPanelView.as_view(), name='news-panel-htmx'),
    path('painel/', NewsPageView.as_view(), name='news-panel-page'),
]
