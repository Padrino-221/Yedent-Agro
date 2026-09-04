@echo off
cd /d "%~dp0"

REM Start backend API
start "Yedent Backend" cmd /k "cd /d "%~dp0backend" && npm install && npm run dev"

REM Give backend a moment to initialize
timeout /t 8 /nobreak >nul

REM Start frontend app
start "Yedent Frontend" cmd /k "cd /d "%~dp0frontend" && npm install && npm run dev"

echo.
echo Yedent dev servers started.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
exit /b 0
