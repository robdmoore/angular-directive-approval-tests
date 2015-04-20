@echo off
echo restoring node packages...
call npm install
IF %ERRORLEVEL% NEQ 0 (
  exit /b 1
)
echo restoring bower packages...
set PATH=%~dp0node_modules\.bin;%PATH%
call bower install
IF %ERRORLEVEL% NEQ 0 (
  exit /b 1
)
echo running grunt...
call grunt %*
IF %ERRORLEVEL% NEQ 0 (
  exit /b 1
)
