from backend.auth.logic import (
    SECRET_KEY, authenticate_user, pwd_context, verify_password
)

import jwt


class TestAuthentication:
    def test_authenticate_user_success(self):
        """Test successful authentication with correct credentials"""
        # No mocking needed!
        token = authenticate_user("alice@example.com", "password123")

        assert token is not None
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        assert payload["user_id"] == 1
        assert payload["user_name"] == "Alice"

    def test_authenticate_user_wrong_password(self):
        """Test authentication fails with wrong password"""
        token = authenticate_user("alice@example.com", "wrong_password")
        assert token is None

    def test_authenticate_user_nonexistent_email(self):
        """Test authentication fails with nonexistent email"""
        token = authenticate_user("nonexistent@example.com", "password123")
        assert token is None

    def test_verify_password(self):
        """Test password verification function"""
        # Create a hash of a test password
        hashed_password = pwd_context.hash("test_password")

        assert verify_password("test_password", hashed_password) is True
        assert verify_password("wrong_password", hashed_password) is False
