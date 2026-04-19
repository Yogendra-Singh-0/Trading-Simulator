@echo off
echo Starting Trading Simulator Backend...
if exist ".venv\Scripts\uvicorn.exe" (
    start cmd /k ".venv\Scripts\uvicorn main:app --reload --port 8000"
) else (
    start cmd /k "uvicorn main:app --reload --port 8000"
)

echo Starting Trading Simulator Frontend...
if exist "trading-frontend" (
    cd trading-frontend
    start cmd /k "npm run dev"
) else (
    echo Frontend directory not found!
)

echo Both servers started!
