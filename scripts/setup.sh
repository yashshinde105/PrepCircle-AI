#!/bin/bash

echo "🎤 AI Debator - Quick Setup Script"
echo "=================================="
echo ""

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client && npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi

# Install server dependencies  
echo "📦 Installing server dependencies..."
cd ../server && npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
cd .. && npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install root dependencies"
    exit 1
fi

# Check if .env exists
if [ ! -f "server/.env" ]; then
    echo "⚠️  Warning: server/.env file not found!"
    echo "📝 Creating .env from example..."
    cp server/.env.example server/.env
    echo "✅ Created server/.env - Please add your OpenAI API key"
    echo ""
    echo "📌 To add your API key:"
    echo "   1. Get your key from https://platform.openai.com/api-keys"
    echo "   2. Edit server/.env"
    echo "   3. Replace 'your_openai_api_key_here' with your actual key"
    echo ""
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "   npm run dev"
echo ""
echo "📚 For more details, see SETUP.md"
