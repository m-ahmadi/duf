@echo off
mode con:cols=60 lines=5
title live
cmdow live /mov 870 600
PATH=%PATH%;..\..\node_modules\.bin
gulp