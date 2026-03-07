@echo off
title AI Disaster Prediction System
color 0B

echo ===================================================
echo     STARTING DISASTER PREDICTION SYSTEM ENGINE     
echo ===================================================
echo.

:: Start the Flask Backend API in a new window
echo Starting Backend ML API (Flask)...
start "Flask Backend Engine" cmd /k "python backend/app.py"

:: Wait a brief moment to ensure backend initializes
timeout /t 3 /nobreak >nul

:: Start the React Frontend in a new window
echo Starting Frontend UI (React + Vite)...
start "React Frontend Interface" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are launching! 
echo Check your web browser at http://localhost:5173
echo.
pause
