@echo off
echo Testing Xtts with 5 Arabic girl phrases...
docker run --rm --dns 8.8.8.8 -v "C:\Users\Dr.console\Desktop\EDUAPP-Antigravity:/mnt/EDUAPP" -w /mnt/EDUAPP xtts-tester python scripts/audio/test/test_girlarb_5phrases.py
echo.
echo Operation terminee!
pause
