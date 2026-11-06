@echo off
echo ====================================================
echo Starting Sri Balaji Wholesale Snacks Platform
echo ====================================================
echo.
echo [1/2] Launching Backend API on port 8000...
start cmd /k "cd /d "%~dp0backend" && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Launching Frontend & PWA on port 5173...
start cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Servers started:
echo   - Website & PWA:  http://localhost:5173
echo   - Backend API:    http://127.0.0.1:8000
echo   - API Swagger:    http://127.0.0.1:8000/api/v1/docs
echo ====================================================
