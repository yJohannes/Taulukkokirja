@echo off
:loop
start http://localhost:5500
echo Starting app.js...
start /B node app.js
echo App.js is running.
choice /C re /N /M "Press 'r' to Restart or 'e' to Exit: "

if errorlevel 2 (
    echo Exiting...
    taskkill /IM node.exe /F
    exit
)
if errorlevel 1 (
    cls
    echo Restarting app.js...
    taskkill /IM node.exe /F
    echo.
    goto loop
)

echo Invalid option. Please press 'r' to restart or 'e' to exit.
goto loop

