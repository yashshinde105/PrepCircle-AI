# 🎤 PrepCircle AI

> An advanced AI-powered debate platform with real-time voice integration, structured scoring, and comprehensive analysis powered by Google Gemini AI.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-purple.svg)](https://ai.google.dev/)

## ✨ Features

### Core Capabilities
- 🎙️ **Real-Time Voice Debates** - Natural conversation flow using Web Speech API
- ⏱️ **90-Second Rounds** - Timer-based evaluation for fair debate pacing
- 📊 **Structured Scoring** - Relevance (35pts), Strength (40pts), Engagement (25pts)
- 🤖 **AI Opponent** - Powered by Google Gemini AI
- 📝 **Live Transcription** - Real-time display of arguments
- 📈 **Performance Analytics** - Comprehensive post-debate analysis
- 🏆 **Leaderboard** - Track and compare your performance

### Design
- 🎨 **Futuristic UI** - Dark theme with purple/blue gradients
- ✨ **Glass Morphism** - Modern frosted glass effects
- 🌟 **Smooth Animations** - Floating elements and glow effects
- 📱 **Responsive** - Works on desktop and mobile

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/06veer/Al-Debater.git
cd Al-Debater

# Install all dependencies (uses npm workspaces - single node_modules!)
npm install
```

### Configuration

Create `.env` file in the `server/` directory:

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
USE_MOCK_AI=false
```

Get your API key at [Google AI Studio](https://ai.google.dev/)

### Run the Application

```bash
# Run both client and server with one command
npm run dev
```

Visit: **http://localhost:5173**

### Available Commands

```bash
npm run dev         # Run both frontend and backend
npm run client      # Run frontend only
npm run server      # Run backend only
npm run build       # Build frontend for production
npm run clean       # Remove all node_modules folders
```

## 📁 Project Structure

```
ai-debator/
├── client/                 # React frontend (TypeScript + Vite)
│   ├── src/
│   │   ├── pages/         # HomePage, DebateRoom, Summary, Leaderboard
│   │   ├── hooks/         # useSpeechRecognition, useSpeechSynthesis
│   │   ├── App.tsx
│   │   └── index.css      # Tailwind + custom animations
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # debateController.js
│   │   ├── routes/        # debateRoutes.js
│   │   ├── services/      # openaiService, scoringService
│   │   ├── socket/        # socketHandler.js
│   │   ├── data/          # topics.js
│   │   └── server.js
│   ├── .env              # Environment variables
│   └── package.json
├── docs/                  # Documentation
├── scripts/               # Setup scripts
├── node_modules/          # ✨ Single shared node_modules
└── package.json          # Root package with workspaces
```

## 🏗️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Socket.io Client** - Real-time communication
- **Web Speech API** - Voice recognition/synthesis
- **Lucide React** - Beautiful icons

### Backend
- **Node.js + Express** - Server framework
- **Socket.io** - WebSocket support
- **Google Gemini AI** - AI debate opponent
- **UUID** - Unique identifiers

## 📖 How to Use

### Starting a Debate
1. Enter your name
2. Select a debate topic (Technology, Society, Ethics, etc.)
3. Choose your stance (Pro or Con)
4. Click "Start Debate"

### During the Debate
1. Click the microphone to speak (90 seconds per round)
2. See your words transcribed in real-time
3. Listen to AI's response with text-to-speech
4. Track your score after each round

### After the Debate
- Review final scores and performance insights
- Analyze round-by-round breakdown
- Check the leaderboard

## 🎯 Scoring System

- **Relevance (0-35 points)**: How well arguments align with the topic
- **Strength (0-40 points)**: Logical coherence, evidence, persuasiveness
- **Engagement (0-25 points)**: Time management and clarity

## 🔧 Development

### NPM Workspaces Setup

This project uses **npm workspaces** to manage dependencies efficiently:
- ✅ Single `node_modules` folder at the root
- ✅ Shared dependencies between client and server
- ✅ Faster installs and smaller disk usage
- ✅ Easier dependency management

The root `package.json` defines workspaces:
```json
{
  "workspaces": ["client", "server"]
}
```

### Adding Dependencies

```bash
# Add to client
npm install <package> --workspace=client

# Add to server
npm install <package> --workspace=server

# Add to root (dev tools like concurrently)
npm install <package> -D
```

## 📚 Documentation

- [User Guide](docs/USER_GUIDE.md)
- [Setup Instructions](docs/SETUP.md)
- [Gemini AI Setup](docs/GEMINI_SETUP.md)
- [Project Summary](docs/PROJECT_SUMMARY.md)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use for learning and development.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent debate responses
- Web Speech API for voice capabilities
- React and Node.js communities

---

**Built with ❤️ for debate practice and interview preparation**
