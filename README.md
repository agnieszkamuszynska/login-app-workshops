# Login App – React + FastAPI

A simple full-stack login application using **React** (frontend) and **FastAPI** (backend). Built for learning and testing best practices in API design, frontend integration, and test strategy.

## Features
- Login form with client-side validation
- FastAPI backend with JWT token generation
- Mock in-memory database (easy to swap with real DB)
- Clean code structure for unit, integration, and E2E testing

## Getting Started

### 🔧 Backend (FastAPI)
Setup instructions -> [Backend setup guide](backend/README.md)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 🔧 Frontend (React)
Setup instructions -> [Frontend setup guide](frontend/README.md)
```bash
cd frontend
npm install
npm run build
npm run dev
```
