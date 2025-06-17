from django.views import View
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template.loader import render_to_string
from .models import Message

class ChatPanelHTMXView(View):
    def get(self, request):
        messages = Message.objects.order_by('-timestamp')[:30][::-1]
        return render(request, 'chat/partials/chat_panel.html', {'messages': messages})

class ChatMessageHTMXView(View):
    def post(self, request):
        text = request.POST.get('text')
        if text:
            Message.objects.create(user=request.user, text=text)
        messages = Message.objects.order_by('-timestamp')[:30][::-1]
        html = render_to_string('chat/partials/chat_panel.html', {'messages': messages}, request=request)
        return HttpResponse(html)