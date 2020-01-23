@echo off
if "%1" == "-b" (set W=) else set W=-w
call set.cmd
title js
rollup -c %W%