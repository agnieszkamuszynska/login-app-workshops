import logging

from auth.logic import SECRET_KEY, authenticate_user

from auth.models import LoginRequest, LoginResponse

from fastapi import Depends, FastAPI, HTTPException, Header

from fastapi.middleware.cors import CORSMiddleware

import jwt


app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
    logger.info(f"Incoming login request for email: {request.email}")

    print("Incoming login:", request.email, request.password)
    if not request.email or not request.password:
        raise HTTPException(status_code=400, detail="Bad request")
    token = authenticate_user(request.email, request.password)
    if not token:
        raise HTTPException(status_code=401, detail="User not authorized")
    return {"token": token}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def verify_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token")

    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.get("/protected-resource")
async def protected_resource(payload=Depends(verify_token)):
    """Protected resource that requires a valid JWT token"""
    return {
        "message": "You have successfully accessed a protected resource",
        "user_id": payload["user_id"],
        "user_name": payload["user_name"]
    }