@echo off
mode con:cols=60 lines=5
title live
cmdow live /mov 1430 800
PATH=%PATH%;..\..\node_modules\.bin
gulp