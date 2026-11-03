@echo off
echo Generer toutes les pistes audio de la petite fille... 
echo Cela va prendre du temps. Merci de patienter ou de laisser le script tourner en arriere plan.
docker run --rm --dns 8.8.8.8 -v "C:\Users\Dr.console\Desktop\EDUAPP-Antigravity:/mnt/EDUAPP" -w /mnt/EDUAPP xtts-tester python scripts/audio/generate/generate_all_girl.py
echo.
echo Operation terminee!
pause
