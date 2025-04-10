import logging

import requests


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = "http://localhost:8000"


class TestLoginWorkflow:
    def test_login_and_access_protected_resource(self):
        login_response = requests.post(
            f"{BASE_URL}/login",
            json={"email": "alice@example.com", "password": "password123"}
        )

        assert login_response.status_code == 200
        token = login_response.json()["token"]
        logger.info("Login successful, obtained token")

        # end-to-end authentication flow
        resource_response = requests.get(
            f"{BASE_URL}/protected-resource",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert resource_response.status_code == 200
        logger.info("Successfully accessed protected resource with token")