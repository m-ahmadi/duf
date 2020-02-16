@echo off
title build html
if "%1"=="-b" (set W=) else set W=-w
if "%W%"=="" (set B=-b) else set B=
call set.cmd %B%
htmlbilder %SRC%/html/ -o %DEST%/index.html -t index.hbs %W%