from django.urls import path
from .views import AutomationPanelHTMXView, ToggleAutomationView

urlpatterns = [
    path('panel/htmx/', AutomationPanelHTMXView.as_view(), name='automation-panel-htmx'),
    path('toggle/<int:automation_id>/', ToggleAutomationView.as_view(), name='toggle_automation'),
]
