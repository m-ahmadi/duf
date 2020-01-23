@echo off
for /f "tokens=2" %%i in ('tasklist /fi "windowtitle eq gulp *" /nh') do taskkill /pid %%i
for /f "tokens=2" %%i in ('tasklist /fi "windowtitle eq build *" /nh') do taskkill /pid %%i