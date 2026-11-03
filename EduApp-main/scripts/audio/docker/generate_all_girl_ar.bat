@echo off
echo ============================================================
echo  Generating ALL Arabic girl voice recordings (girlarb ref)
echo ============================================================
docker run --rm --dns 8.8.8.8 ^
  -v "C:\Users\Dr.console\Desktop\EDUAPP-Antigravity:/mnt/EDUAPP" ^
  -v "C:\Users\Dr.console\Desktop\EDUAPP-Antigravity\xtts-cache:/home/user/.local/share/tts" ^
  -w /mnt/EDUAPP ^
  xtts-tester python scripts/audio/generate/generate_all_girl_ar.py
echo.
echo Operation terminee!
pause
