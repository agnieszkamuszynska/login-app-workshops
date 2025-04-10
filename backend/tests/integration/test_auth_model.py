import json
import logging
import os

from backend.auth.logic import SECRET_KEY
from backend.main import app

from fastapi.testclient import TestClient

import jwt


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Using TestClient to simulate HTTP requests
client = TestClient(app)


class ApiTest:
    """Base class for API tests using JSON test data"""
    test_data_dir = os.path.dirname(__file__)

    def load_test_cases(self, filename):
        filepath = os.path.join(self.test_data_dir, filename)
        with open(filepath, 'r') as f:
            return json.load(f)


class TestAuth(ApiTest):
    def test_authentication(self):
        test_cases = self.load_test_cases("test_auth_model.json")

        for route in app.routes:
            logger.info(f"{route.methods} {route.path}")

        for case in test_cases:
            test_name = case.get('name', 'Unnamed test')
            logger.info(f"Running test case: {test_name}")

            # Making an HTTP POST request to an endpoint
            response = client.post(
                "/login",
                json=case["request"]["body"]
            )
            # Verifying HTTP status code
            assert response.status_code == case["response"]["status_code"]

            if response.status_code == 200 and case.get("verify_token", False):
                # Checking response body structure
                data = response.json()
                assert "token" in data

                token = data["token"]
                payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

                for key, value in case["token_payload"].items():
                    assert payload[key] == value
