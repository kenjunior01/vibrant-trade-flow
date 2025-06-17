import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.views import View
from django.shortcuts import render

class NewsAPIView(APIView):
    """
    Uma view para buscar notícias de trading da NewsAPI.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        api_key = getattr(settings, 'NEWS_API_KEY', None)
        if not api_key:
            return Response(
                {"error": "A chave da API de notícias não está configurada."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        url = f'https://newsapi.org/v2/everything?q=stocks&language=en&apiKey={api_key}'
        try:
            api_response = requests.get(url)
            api_response.raise_for_status()
            data = api_response.json()
            return Response(data.get('articles', []), status=status.HTTP_200_OK)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": f"Erro ao comunicar com a API de notícias: {e}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

class NewsPageView(View):
    def get(self, request):
        return render(request, 'news/panel.html')
