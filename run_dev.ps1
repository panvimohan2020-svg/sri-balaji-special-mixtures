Write-Host "====================================================" -ForegroundColor DarkYellow
Write-Host "Starting Sri Balaji Wholesale Snacks Platform" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor DarkYellow
Write-Host ""

$root = $PSScriptRoot

Write-Host "[1/2] Launching Backend API on port 8000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Write-Host "[2/2] Launching Frontend and PWA on port 5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev"

Write-Host ""
Write-Host "Servers started successfully:" -ForegroundColor Green
Write-Host "  - Website and PWA:  http://localhost:5173" -ForegroundColor White
Write-Host "  - Backend API:      http://127.0.0.1:8000" -ForegroundColor White
Write-Host "  - API Swagger Docs: http://127.0.0.1:8000/api/v1/docs" -ForegroundColor White
Write-Host "====================================================" -ForegroundColor DarkYellow
