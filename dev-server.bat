@echo off
setlocal
REM Soonpage - Local dev server (Windows)
REM Usage: dev-server.bat [port]
REM   port    default: 8000
REM
REM This project is a single static HTML page (no build step, no
REM server-side config), so there's no DEV_MODE/production split to
REM toggle - this script just serves the repo root over HTTP so
REM index.html can be opened without hand-configuring a static server
REM each time.

set "DIR=%~dp0"
set "PORT=%~1"
if "%PORT%"=="" set "PORT=8000"

echo Serving %DIR% at http://127.0.0.1:%PORT%

where php >nul 2>&1
if %errorlevel%==0 (
    php -S 127.0.0.1:%PORT% -t "%DIR%"
    goto :eof
)

where python >nul 2>&1
if %errorlevel%==0 (
    python -m http.server %PORT% --directory "%DIR%" --bind 127.0.0.1
    goto :eof
)

echo Neither php nor python found on PATH - install one to run a local server.
exit /b 1
