import logging
import jwt
from fastapi.testclient import TestClient

from backend.auth.logic import SECRET_KEY
from backend.main import app


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Using TestClient to simulate HTTP requests
client = TestClient(app)


# This testing API endpoints, checkking HTTP status codes and token contents
def test_successful_login():
    """Test that valid credentials return a token with correct payload"""
    # Log available routes for debugging
    for route in app.routes:
        logger.info(f"{route.methods} {route.path}")

    request_data = {
        "email": "alice@example.com",
        "password": "password123"
    }

    # Send request to login endpoint
    response = client.post("/login", json=request_data)

    # Assert status code
    assert response.status_code == 200

    # Validate response structure
    data = response.json()
    assert "token" in data

    # Decode and validate token contents
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
