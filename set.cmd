@echo off
if "%path:;./node_modules/.bin=%" == "%path%" set PATH=%PATH%;./node_modules/.bin
set SRC=.
set DEST=./public
if "%1" neq "-b" mode con:cols=60 lines=5