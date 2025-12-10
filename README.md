# 🎙️ PrepCircle AI

> An advanced AI-powered Group Discussion (GD) practice platform with real-time voice integration, structured scoring, and comprehensive analysis for interview preparation.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Custom AI](https://img.shields.io/badge/Custom-AI-purple.svg)]()

## ✨ Features

### Core Capabilities
- 🎙️ **Real-Time Voice GD** - Natural conversation flow using Web Speech API
- ⏱️ **90-Second Rounds** - Timer-based evaluation for fair GD pacing
- 📊 **Structured Scoring** - Relevance (35pts), Strength (40pts), Engagement (25pts)
- 🤖 **AI Participants** - Two AI agents (Alex & Jordan) for realistic GD practice
- 📝 **Live Transcription** - Real-time display of your points
- 📈 **Performance Analytics** - Comprehensive post-GD analysis
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
CLIENT_URL=http://localhost:5173

# TODO: Add your custom model endpoint
# CUSTOM_MODEL_ENDPOINT=http://localhost:8000/api/generate
# CUSTOM_MODEL_API_KEY=your_api_key_here
```

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
prepcircle-ai/
├── client/                 # React frontend (TypeScript + Vite)
│   ├── src/
│   │   ├── pages/         # HomePage, GDRoom, Summary, Leaderboard
│   │   ├── hooks/         # useSpeechRecognition, useSpeechSynthesis
│   │   ├── App.tsx
│   │   └── index.css      # Tailwind + custom animations
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # gdController.js
│   │   ├── routes/        # gdRoutes.js
│   │   ├── services/      # aiService, scoringService
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
- **Custom AI Model** - AI GD participants (ready for your trained model)
- **UUID** - Unique identifiers

## 📖 How to Use

### Starting a GD Session
1. Enter your name
2. Select a GD topic (Technology, Society, Ethics, etc.)
3. Click "Start GD Practice"

### During the GD
1. Click the microphone to speak (90 seconds per round)
2. See your words transcribed in real-time
3. Listen to AI participants respond with text-to-speech
4. Track your score after each round

### After the GD
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
- [Project Summary](docs/PROJECT_SUMMARY.md)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use for learning and development.

## 🙏 Acknowledgments

- Web Speech API for voice capabilities
- React and Node.js communities

---

**Built with ❤️ for GD practice and interview preparation**
