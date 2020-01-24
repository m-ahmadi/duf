@echo off
call set.cmd
title build sass
if "%1" == "-b" (set W=) else set W=--watch
sass %SRC%/scss/style.scss:%DEST%/css/style.css %W%