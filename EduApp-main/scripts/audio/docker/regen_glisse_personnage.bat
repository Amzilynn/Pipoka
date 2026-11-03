@echo off
echo Regenerer glisse_le_mot_vers_le_bon_personnage pour voix fille FR...
docker run --rm --dns 8.8.8.8 -v "C:\Users\Dr.console\Desktop\EDUAPP-Antigravity:/mnt/EDUAPP" -w /mnt/EDUAPP xtts-tester python scripts/audio/regen/regen_glisse_personnage.py
echo.
echo Operation terminee!
pause