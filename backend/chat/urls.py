from django.urls import path
from .views import ChatPanelHTMXView, ChatMessageHTMXView

urlpatterns = [
    # ...existing url patterns...
]

urlpatterns += [
    path('panel/htmx/', ChatPanelHTMXView.as_view(), name='chat-panel-htmx'),
    path('message/htmx/', ChatMessageHTMXView.as_view(), name='chat-message-htmx'),
]