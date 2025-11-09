@echo off
echo 🎤 AI Debator - Quick Setup Script
echo ==================================
echo.

REM Install client dependencies
echo 📦 Installing client dependencies...
cd client
call npm install
if errorlevel 1 (
    echo ❌ Failed to install client dependencies
    exit /b 1
)

REM Install server dependencies
echo 📦 Installing server dependencies...
cd ..\server
call npm install
if errorlevel 1 (
    echo ❌ Failed to install server dependencies
    exit /b 1
)

REM Install root dependencies
echo 📦 Installing root dependencies...
cd ..
call npm install
if errorlevel 1 (
    echo ❌ Failed to install root dependencies
    exit /b 1
)

REM Check if .env exists
if not exist "server\.env" (
    echo ⚠️  Warning: server\.env file not found!
    echo 📝 Creating .env from example...
    copy server\.env.example server\.env
    echo ✅ Created server\.env - Please add your OpenAI API key
    echo.
    echo 📌 To add your API key:
    echo    1. Get your key from https://platform.openai.com/api-keys
    echo    2. Edit server\.env
    echo    3. Replace 'your_openai_api_key_here' with your actual key
    echo.
)

echo.
echo ✅ Setup complete!
echo.
echo 🚀 To start the application:
echo    npm run dev
echo.
echo 📚 For more details, see SETUP.md
pause
