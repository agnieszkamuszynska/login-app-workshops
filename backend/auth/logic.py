import os

import jwt

from passlib.context import CryptContext


# Simulated user "database"
users_db = {
      "alice@example.com": {
          "id": 1,
          "name": "Alice",
          "email": "alice@example.com",
          "password": "password123"
      }
}

SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-key")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(email: str, password: str) -> str | None:
    user = users_db.get(email)
    if not user or password != user["password"]:
        return None

    token = jwt.encode(
        {
            "user_id": user["id"],
            "user_name": user["name"]
        },
        SECRET_KEY,
        algorithm="HS256"
    )
    return token
