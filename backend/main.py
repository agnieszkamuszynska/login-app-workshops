from fastapi import FastAPI, HTTPException
from auth.models import LoginRequest, LoginResponse
from auth.logic import authenticate_user
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

@app.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
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
