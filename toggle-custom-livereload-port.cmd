@echo off
cmd /c npm run toggleLive
call set.cmd -b
cmd /c rollup -c
cmd /c htmlbilder %SRC%/html/ -o %DEST%/index.html -t index.hbs
echo.
echo done.
pause