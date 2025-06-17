import pytest
from rest_framework.test import APIClient
from rest_framework import status

@pytest.mark.django_db
def test_get_positions_unauthenticated():
    """
    Verifica se um utilizador não autenticado recebe um erro 401 (Unauthorized)
    ao tentar aceder às posições.
    """
    client = APIClient()
    url = '/api/trading/positions/'
    response = client.get(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
