@echo off
title Chanchiblock Web Server
echo ============================================
echo    Chanchiblock Local Web Server
echo ============================================
echo.
echo 1. Ensure START_MiniFlasher.bat is running (for backend).
echo 2. This window runs the frontend (website).
echo.
echo Opening http://localhost:8000 in your browser...
echo.

REM Use the python embedded in MiniFlasher_Package
set PYTHON_EXE="%~dp0MiniFlasher_Package\python\python.exe"

REM Check if python exists there, otherwise try system python
if not exist %PYTHON_EXE% (
    echo Embedded Python not found, trying system Python...
    set PYTHON_EXE=python
)

start "" "http://localhost:8000"
%PYTHON_EXE% -m http.server 8000

pause
