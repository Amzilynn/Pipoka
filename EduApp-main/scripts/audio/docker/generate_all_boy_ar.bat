@echo off
echo ============================================================
echo  Generating ALL Arabic boy voice recordings (arabic boyy ref)
echo ============================================================
docker run --rm --dns 8.8.8.8 ^
  -v "C:\Users\Dr.console\Desktop\EDUAPP-Antigravity:/mnt/EDUAPP" ^
  -v "C:\Users\Dr.console\Desktop\EDUAPP-Antigravity\xtts-cache:/home/user/.local/share/tts" ^
  -w /mnt/EDUAPP ^
  xtts-tester python scripts/audio/generate/generate_all_boy_ar.py
echo.
echo Operation terminee!
pause
