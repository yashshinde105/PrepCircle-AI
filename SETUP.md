# AI Debator - Setup Instructions

## 🎯 Quick Setup Guide

### Step 1: Install Dependencies

**Option A: Install All at Once (Recommended)**
\`\`\`bash
# From the root directory
cd client
npm install
cd ../server
npm install
cd ..
npm install
\`\`\`

**Option B: Install Separately**
\`\`\`bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server  
npm install

# Install root dependencies
cd ..
npm install
\`\`\`

### Step 2: Configure Environment Variables

1. Navigate to the server directory:
\`\`\`bash
cd server
\`\`\`

2. Copy the example environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Open `.env` and add your OpenAI API key:
\`\`\`env
PORT=3000
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
MONGODB_URI=mongodb://localhost:27017/ai-debator
NODE_ENV=development
CLIENT_URL=http://localhost:5173
\`\`\`

**Get Your OpenAI API Key:**
- Go to https://platform.openai.com/api-keys
- Sign in or create an account
- Click "Create new secret key"
- Copy and paste it into your `.env` file

### Step 3: Start the Application

From the root directory:
\`\`\`bash
npm run dev
\`\`\`

This will start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

### Step 4: Test the Application

1. Open your browser to http://localhost:5173
2. Enter your name
3. Select a debate topic
4. Choose your stance (Pro or Con)
5. Click "Start Debate"
6. Allow microphone access when prompted
7. Click the microphone button to start speaking

## 🔧 Troubleshooting

### Issue: Dependencies won't install
**Solution**: Try deleting `node_modules` folders and reinstalling:
\`\`\`bash
rm -rf node_modules client/node_modules server/node_modules
npm run install-all
\`\`\`

### Issue: OpenAI API errors
**Solution**: 
- Check that your API key is correct in `server/.env`
- Ensure you have credits in your OpenAI account
- Verify the API key has proper permissions

### Issue: Microphone not working
**Solution**:
- Use Chrome or Edge browser (best Web Speech API support)
- Allow microphone permissions when prompted
- Check browser settings for microphone access

### Issue: Cannot connect to server
**Solution**:
- Ensure backend is running on port 3000
- Check if another application is using port 3000
- Verify `CLIENT_URL` in `.env` matches your frontend URL

## 📋 Requirements Checklist

- [ ] Node.js v18+ installed
- [ ] npm installed
- [ ] OpenAI API key obtained
- [ ] Modern browser (Chrome/Edge recommended)
- [ ] Microphone access enabled
- [ ] Ports 3000 and 5173 available

## 🚀 Next Steps

Once setup is complete:
1. Practice debates to improve your skills
2. Try different topics and difficulty levels
3. Review your performance summaries
4. Check the leaderboard
5. Customize topics in `server/src/data/topics.js`

## 💡 Tips

- **Best Performance**: Use a good quality microphone
- **Clear Audio**: Speak in a quiet environment
- **Preparation**: Think about your arguments before starting
- **Time Management**: Watch the timer and pace yourself
- **Practice**: Regular practice improves your debate skills

## 📞 Need Help?

Check the main README.md for detailed documentation or open an issue on GitHub.

Happy Debating! 🎤✨
