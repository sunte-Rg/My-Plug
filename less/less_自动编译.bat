@echo off
set filepath = %1%
for /f %%i in ('dir /a-d /b '%filepath% ) do (
    ping -n 3 127.0.0.0>nul
    echo %%i
)
pause