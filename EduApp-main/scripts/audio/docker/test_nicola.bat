@echo off
echo Testing XTTS with LE PETIT NICOLA reference voice...
docker run --rm --dns 8.8.8.8 -v "C:\Users\Dr.console\Desktop\EDUAPP-Antigravity:/mnt/EDUAPP" -w /mnt/EDUAPP xtts-tester python scripts/audio/test/test_xtts.py
echo Test complete. Press any key to exit.
pause
