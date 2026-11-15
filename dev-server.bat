@echo off
setlocal
REM Seasonal Overlays Library - Local dev server (Windows)
REM Usage: dev-server.bat [port] [--lan]
REM   port    default: 8000
REM   --lan   listen on all interfaces so phones/tablets on your network can
REM           connect (prints the addresses to open); default is 127.0.0.1 only
REM
REM The library and its demo site are static files (no build step, no server-side
REM config), so there's no DEV_MODE/production split to toggle - this script
REM just serves the repo root over HTTP without hand-configuring a static server.

set "DIR=%~dp0"
set "PORT=8000"
set "HOST=127.0.0.1"

:args
if "%~1"=="" goto run
if "%~1"=="--lan" (
    set "HOST=0.0.0.0"
    shift
    goto args
)
echo %~1| findstr /r "^[0-9][0-9]*$" >nul
if errorlevel 1 (
    echo Unknown option: %~1
    echo Usage: dev-server.bat [port] [--lan]
    exit /b 1
)
set "PORT=%~1"
shift
goto args

:run
set "SERVER="
where python >nul 2>&1 && set "SERVER=Python"
where php >nul 2>&1 && set "SERVER=PHP"
if "%SERVER%"=="" (
    echo Neither php nor python found on PATH - install one to run a local server.
    exit /b 1
)

echo Serving %DIR% at http://127.0.0.1:%PORT%
if "%HOST%"=="0.0.0.0" (
    echo On your local network ^(--lan^), open one of these on the other device:
    for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
        for /f "tokens=* delims= " %%b in ("%%a") do echo     http://%%b:%PORT%
    )
    echo   ^(usually the 192.168.x.x one; allow %SERVER% through the firewall if asked^)
)

if "%SERVER%"=="PHP" (
    php -S %HOST%:%PORT% -t "%DIR%."
) else (
    python -m http.server %PORT% --directory "%DIR%." --bind %HOST%
)
