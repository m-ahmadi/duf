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
set top=-35
set left=875
set step=95
for /f %%i in ('cmdow /t') do (
	cmdow %%i /mov !left! !top!
	set /a "top=!top!+!step!"
	set /a "count=!count!+1"
	if "!count!" == "8" goto :done
)
:done
setlocal DisableDelayedExpansion
REM laptop: top=-35 left=875 step=95 (set.cmd: lines=4)