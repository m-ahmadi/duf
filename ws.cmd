@echo off
title build sass
if "%1"=="-b" (set W=) else set W=--watch
if "%W%"=="" (set B=-b) else set B=
call set.cmd %B%
sass %SRC%/scss/style.scss:%DEST%/css/style.css %W%