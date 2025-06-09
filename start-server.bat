@echo off
setlocal

:: Check if rhu and rhu-admin exist
if not exist "rhu\" (
  echo "rhu" folder not found.
  goto :extractZip
)
if not exist "rhu-admin\" (
  echo "rhu-admin" folder not found.
  goto :extractZip
)

goto :checkNode

:extractZip
echo Attempting to extract from zip...

:: Go up one level to look for the zip
cd ..
set "ZIP_NAME=project.zip"

if not exist "%ZIP_NAME%" (
  echo Zip file "%ZIP_NAME%" not found in parent directory. Exiting...
  pause
  exit /b
)

powershell -command "Expand-Archive -Force '%ZIP_NAME%' 'executable'"
echo Extraction complete.
cd executable

:checkNode
:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
  echo Node.js is not installed.
  echo Opening Node.js download page...
  start https://nodejs.org/en/download
  echo Please install Node.js and re-run this script.
  pause
  exit /b
)

:: Install and start RHU
echo Installing and starting RHU...
cd rhu
call npm install
start cmd /k "npm start & echo. & echo === RHU Test Account === & echo Email: testuser@gmail.com & echo Password: Test123"
cd ..

:: Install and start RHU-ADMIN
echo Installing and starting RHU-ADMIN...
cd rhu-admin
call npm install
start cmd /k "npm start & echo. & echo === RHU-ADMIN Test Account === & echo Email: testadmin@gmail.com & echo Password: Test123"
cd ..

echo All setup complete.
pause
