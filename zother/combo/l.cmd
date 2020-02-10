@echo off
mode con:cols=60 lines=5
title live
cmdow live /mov 876 500
PATH=%PATH%;..\..\node_modules\.bin
gulp