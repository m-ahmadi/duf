@echo off
title build js
if "%1" == "-b" (set W=) else set W=-w
if "%W%"=="" (set B=-b) else set B=
call set.cmd %B%
rollup -c %W%