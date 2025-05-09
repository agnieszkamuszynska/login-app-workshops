from backend.auth.logic import (
    SECRET_KEY, authenticate_user, users_db, verify_password
)

import jwt


class TestAuthentication:
    def test_successful_authentication(self):
        token = authenticate_user("alice@example.com", "password123")

        # Verify token is returned
        assert token is not None

        # Decode the token to verify expected user information
        # This confirms:
        # The function produces a token when given valid credentials
        # The token contains the expected data
        # The token is properly signed with the correct algorithm

        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        assert payload["user_id"] == 1
        assert payload["user_name"] == "Alice"

    def test_failed_authentication_wrong_password(self):
        token = authenticate_user("alice@example.com", "wrong_password")

        # Verify token is not returned
        assert token is None

    def test_authenticate_user_nonexistent_email(self):
        token = authenticate_user("nonexistent@example.com", "password123")

        assert token is None

    def test_verify_password(self):
        # Get Alice's hashed password from the users_db
        hashed_password = users_db["alice@example.com"]["password"]

        assert verify_password("test_password", hashed_password) is True
        assert verify_password("wrong_password", hashed_password) is False
