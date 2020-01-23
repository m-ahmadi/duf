@echo off
call set.cmd
title sass
if "%1" == "-b" (set W=) else set W=--watch
sass %SRC%/sass/style.scss:%DEST%/css/style.css %W%