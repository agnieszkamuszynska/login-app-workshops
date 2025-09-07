import os

import jwt

from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Simulated user "database"
users_db = {
      "alice@example.com": {
          "id": 1,
          "name": "Alice",
          "email": "alice@example.com",
          "password": pwd_context.hash("password123")  # Store hashed password
      }
}

# critical security component used for JWT(The secret key is used to sign the
# JWT, creating a digital signature that verifies the token's authenticity.)
SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-key")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(email: str, password: str) -> str | None:
    user = users_db.get(email)
    if not user or not verify_password(password, user["password"]):
        return None

# Generate JSON Web Token for successful logins
    token = jwt.encode(
        {
            "user_id": user["id"],
            "user_name": user["name"]
        },
        SECRET_KEY,
        algorithm="HS256"
    )
    return token
