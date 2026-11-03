@echo off
echo Testing XTTS with 5 Arabic boy phrases...
docker run --rm --dns 8.8.8.8 ^
  -v "C:\Users\Dr.console\Desktop\EDUAPP-Antigravity:/mnt/EDUAPP" ^
  -v "C:\Users\Dr.console\Desktop\EDUAPP-Antigravity\xtts-cache:/home/user/.local/share/tts" ^
  -w /mnt/EDUAPP xtts-tester python scripts/audio/test/test_arabicboy_5phrases.py
echo.
echo Operation terminee!
pause
