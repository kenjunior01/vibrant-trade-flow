from django.views import View
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponse
from django.template.loader import render_to_string
from .models import Automation

class AutomationPanelHTMXView(View):
    def get(self, request):
        automations = Automation.objects.filter(user=request.user)
        return render(request, 'automation/partials/automation_panel.html', {'automations': automations})

class ToggleAutomationView(View):
    def post(self, request, automation_id):
        automation = get_object_or_404(Automation, id=automation_id, user=request.user)
        automation.status = 'inactive' if automation.status == 'active' else 'active'
        automation.save()
        automations = Automation.objects.filter(user=request.user)
        html = render_to_string('automation/partials/automation_panel.html', {'automations': automations}, request=request)
        return HttpResponse(html)