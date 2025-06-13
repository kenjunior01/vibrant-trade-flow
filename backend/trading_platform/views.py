from django.shortcuts import render

def index(request):
    """
    Esta view renderiza o template base que, por sua vez,
    carrega a aplicação React.
    """
    return render(request, "base.html")
