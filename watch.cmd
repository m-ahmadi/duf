@echo off
start wp.cmd
start wt.cmd
start wl.cmd
timeout 1
start ws.cmd
start wj.cmd
start wh.cmd

where cmdow
if %errorlevel% == 1 (echo cmdow not installed. && exit /b 1)

setlocal EnableDelayedExpansion
set count=0
set top=250
for /f %%i in ('cmdow /t') do (
	cmdow %%i /mov 1410 !top!
	set /a "top=!top!+110"
	set /a "count=!count!+1"
	if "!count!" == "7" goto :done
)
:done
setlocal DisableDelayedExpansion