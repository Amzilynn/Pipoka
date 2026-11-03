@echo off
echo Generer les pistes audio manquantes (mises a jour)... 
docker run --rm --dns 8.8.8.8 -v "C:\Users\Dr.console\Desktop\EDUAPP-Antigravity:/mnt/EDUAPP" -w /mnt/EDUAPP xtts-tester python scripts/audio/generate/generate_fr_updates.py
echo.
echo Operation terminee!
