@echo off
title sass
mode con:cols=60 lines=5
cmdow sass /mov 1430 915
sass app/style.scss:app/style.css --no-source-map --watch