import logging
import jwt
from fastapi.testclient import TestClient

from backend.auth.logic import SECRET_KEY
from backend.main import app


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Using TestClient to simulate HTTP requests,
# Doesn't use actual network connections
client = TestClient(app)


# Focus on API endpoint behavior and HTTP interactions
# check if system works correctly when all parts are connected
def test_successful_login():
    """Test that valid credentials return a token with correct payload"""

    #Verifies the entire flow from HTTP request → response

    request_data = {
        "email": "alice@example.com",
        "password": "password123"
    }

    # Send request to login endpoint
    response = client.post("/login", json=request_data)

    assert response.status_code == 200

    data = response.json()
    assert "token" in data

    token = data["token"]
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

    # Validate token payload
    assert payload["user_id"] == 1
    assert payload["user_name"] == "Alice"


def test_failed_login():
    """Test that invalid credentials return 401 Unauthorized"""
    # Test data
    request_data = {
        "email": "alice@example.com",
        "password": "wrong_password"
    }

    # Send request to login endpoint
    response = client.post("/login", json=request_data)

    # Assert status code
    assert response.status_code == 401
