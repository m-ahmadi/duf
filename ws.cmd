@echo off
call set.cmd
title buildsass
if "%1" == "-b" (set W=) else set W=--watch
sass %SRC%/sass/style.scss:%DEST%/css/style.css %W%