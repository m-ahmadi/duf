@echo off
call set.cmd
if "%1" == "-b" (set W=) else set W=-w
gulp temp%W%