@echo off
call set.cmd
sass %SRC%/sass/style.scss:%DEST%/css/style.css --watch