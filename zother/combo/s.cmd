@echo off
title sass
mode con:cols=60 lines=5
cmdow sass /mov 876 615
sass app/style.scss:app/style.css --no-source-map --watch