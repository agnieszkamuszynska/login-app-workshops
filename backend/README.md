Backend API Service

## How to run this service
1. Install dependencies ```pip install -r requirements.txt```
2. Run the service ```uvicorn main:app --reload```

Testing Guide

This project uses a multi-layered testing approach with unit tests, integration tests, and end-to-end (E2E) tests.

Test Structure

Unit tests: ```backend/auth/test_logic.py```
Integration tests: ```backend/tests/integration```
E2E tests: ```backend/tests/e2e```

## How to run unit tests
1. Navigate to the backend directory:
 ```cd backend```
2. Make sure you're using Python 3.12 for consistency
3. Install required packages for tests:
   ```/Library/Frameworks/Python.framework/Versions/3.12/bin/python3 -m pip install pyjwt pytest passlib bcrypt```
4. Verify pytest installation:
   ```python3 -m pytest --version```
5. Set up PYTHONPATH to find your modules:
   ```cd .. && export PYTHONPATH=$PYTHONPATH:$(pwd) && cd backend```
6. Run unit tests:
   ```python3 -m pytest auth/test_logic.py -v```

## How to run integration tests
1) Install FastAPI and its dependencies: ```/Library/Frameworks/Python.framework/Versions/3.12/bin/python3 -m pip install fastapi httpx```
2) Install other required packages:
```/Library/Frameworks/Python.framework/Versions/3.12/bin/python3 -m pip install pytest pyjwt passlib bcrypt```
3) Make sure you're in the backend directory:
```cd /login-app-workshops/backend```
4) Set up PYTHONPATH: ```cd .. && export PYTHONPATH=$PYTHONPATH:$(pwd) && cd backend```
5) Run the integration tests:
```python -m pytest tests/integration/test_auth_model.py -v```
6) For more detailed output including logging information:
```python -m pytest tests/integration/test_auth_model.py -v -s```

## Running E2E Tests
1. Make sure your backend API is running:
```cd backend```
```uvicorn main:app --reload```
2. First, reinstall the requests package with correct dependencies:
```/Library/Frameworks/Python.framework/Versions/3.12/bin/python3 -m pip uninstall -y charset-normalizer requests```
```/Library/Frameworks/Python.framework/Versions/3.12/bin/python3 -m pip install --force-reinstall requests```
3. From the project root:
```cd login-app-workshops```
```export PYTHONPATH=$PYTHONPATH:$(pwd)```
```python -m pytest backend/tests/e2e/test_crud_flow.py -v -m e2e```
