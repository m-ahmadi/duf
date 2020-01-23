@echo off
if "%1" == "-b" (set W=) else set W=-w
title build html
call set.cmd
htmlbilder %SRC%/html/ -o %DEST%/index.html -t index.hbs %W%