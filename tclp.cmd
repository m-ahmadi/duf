@echo off
echo Toggling custom livereload port...
cmd /c npm run toggleLive
call set.cmd -b
cmd /c rollup -c
cmd /c htmlbilder %SRC%/html/ -o %DEST%/index.html -t index.hbs
echo.
echo Done.
pause