@echo off
start wp.cmd
start wt.cmd
start wl.cmd
start wsr.cmd
timeout 1
start ws.cmd
start wj.cmd
start wh.cmd

where cmdow
if %errorlevel% == 1 (echo cmdow not installed. && exit /b 1)

setlocal EnableDelayedExpansion
set count=0
set top=150
for /f %%i in ('cmdow /t') do (
	cmdow %%i /mov 1420 !top!
	set /a "top=!top!+110"
	set /a "count=!count!+1"
	if "!count!" == "8" goto :done
)
:done
setlocal DisableDelayedExpansion