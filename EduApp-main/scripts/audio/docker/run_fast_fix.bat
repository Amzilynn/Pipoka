@echo off
SET WORKSPACE=C:\Users\Dr.console\Desktop\EDUAPP-Antigravity
SET CACHE=%WORKSPACE%\xtts-cache

echo ===================================================
echo   XTTS TARGETED FIX (FR GIRL) WITH CACHE
echo ===================================================
echo Workspace: %WORKSPACE%
echo Cache:     %CACHE%
echo.

:: Ensure cache directory exists
if not exist "%CACHE%" mkdir "%CACHE%"

:: Run the main generation script
docker run --rm ^
  -v "%WORKSPACE%:/mnt/EDUAPP" ^
  -v "%CACHE%:/home/user/.local/share/tts" ^
  -e TTS_HOME=/home/user/.local/share/tts ^
  -w /mnt/EDUAPP ^
  xtts-tester python scripts/audio/fix/fix_fr_girl_targeted.py

echo.
echo Process complete.
pause
