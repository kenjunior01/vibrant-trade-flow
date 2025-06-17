import requests
from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse
from django.views import View

class NewsPanelView(View):
    def get(self, request):
        api_key = getattr(settings, 'NEWS_API_KEY', None)
        articles = []
        if api_key:
            url = f'https://newsapi.org/v2/everything?q=stocks&language=en&apiKey={api_key}'
            try:
                api_response = requests.get(url)
                api_response.raise_for_status()
                data = api_response.json()
                articles = data.get('articles', [])
            except Exception:
                pass
        return render(request, 'news/partials/news_list.html', {'articles': articles})
