# AI Debator 🎤

An advanced AI-powered debate platform with real-time voice integration, structured scoring, and comprehensive analysis. Practice your debate skills against an intelligent AI opponent powered by OpenAI's GPT-4.

## 🌟 Features

### Core Features
- **Real-Time Speech-to-Speech Debates**: Natural conversation flow using Web Speech API
- **Timer-Based Evaluation**: Each round has a 90-second time limit for fair debate pacing
- **Structured Scoring System**: Evaluated on three dimensions:
  - **Relevance** (0-35 points): How well your argument aligns with the topic
  - **Strength** (0-40 points): Logical coherence, evidence, and persuasiveness
  - **Engagement** (0-25 points): Time management and clarity
- **Live Transcription**: Real-time display of your spoken arguments
- **Post-Debate Analysis**: Comprehensive summary with round-by-round breakdown
- **Performance Insights**: Identify strengths and areas for improvement
- **Leaderboard**: Track and compare performance with other debaters

### Additional Features
- **Multiple Debate Topics**: Choose from various categories (Technology, Society, Ethics, etc.)
- **Difficulty Levels**: Topics range from Easy to Hard
- **Stance Selection**: Argue for (Pro) or against (Con) any topic
- **WebSocket Integration**: Real-time debate updates
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Socket.io Client** for real-time communication
- **Web Speech API** for voice recognition and synthesis
- **Axios** for HTTP requests
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **Socket.io** for WebSocket communication
- **OpenAI API (GPT-4)** for AI opponent responses
- **MongoDB** (optional) for data persistence
- **CORS** for cross-origin requests
- **dotenv** for environment configuration

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key (get one at https://platform.openai.com)
- Modern browser with Web Speech API support (Chrome, Edge recommended)

## 🚀 Quick Start

### 1. Clone and Install

\`\`\`bash
# Navigate to the project directory
cd "ai debator"

# Install dependencies for all packages
npm run install-all
\`\`\`

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

\`\`\`bash
cd server
cp .env.example .env
\`\`\`

Edit `server/.env` and add your OpenAI API key:

\`\`\`env
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
MONGODB_URI=mongodb://localhost:27017/ai-debator
NODE_ENV=development
CLIENT_URL=http://localhost:5173
\`\`\`

### 3. Run the Application

\`\`\`bash
# From the root directory
npm run dev
\`\`\`

This will start:
- Frontend at http://localhost:5173
- Backend at http://localhost:3000

## 📖 Usage Guide

### Starting a Debate

1. **Enter Your Name**: Provide your name for tracking
2. **Select a Topic**: Choose from available debate topics
3. **Choose Your Stance**: Select Pro (for) or Con (against)
4. **Start Debate**: Click "Start Debate" to begin

### During the Debate

1. **Click the Microphone**: Start speaking when it's your turn
2. **Watch the Timer**: You have 90 seconds per round
3. **See Your Transcription**: Your words appear in real-time
4. **Listen to AI Response**: The AI opponent will respond with speech
5. **View Scores**: Track your performance after each round

### After the Debate

- Review your **Final Score** and compare with the AI
- Analyze **Round-by-Round Performance**
- Read **Performance Insights** for improvement tips
- Check the **Leaderboard** to see how you rank

## 📁 Project Structure

\`\`\`
ai-debator/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── DebateRoom.tsx
│   │   │   ├── Summary.tsx
│   │   │   └── Leaderboard.tsx
│   │   ├── hooks/         # Custom React hooks
│   │   │   ├── useSpeechRecognition.ts
│   │   │   └── useSpeechSynthesis.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/
│   │   │   └── debateController.js
│   │   ├── routes/
│   │   │   └── debateRoutes.js
│   │   ├── services/
│   │   │   ├── openaiService.js
│   │   │   └── scoringService.js
│   │   ├── socket/
│   │   │   └── socketHandler.js
│   │   ├── data/
│   │   │   └── topics.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── package.json           # Root package.json
\`\`\`

## 🎯 Scoring System Details

### Relevance (0-35 points)
- Measures how well your argument relates to the debate topic
- Keywords and topic alignment are analyzed

### Strength (0-40 points)
- Evaluates logical structure and coherence
- Checks for evidence indicators (research, studies, data)
- Looks for logical connectors (however, therefore, moreover)

### Engagement (0-25 points)
- **Time Management** (0-15): Optimal speaking time is 45-75 seconds
- **Clarity** (0-10): Balance of simple and complex vocabulary

## 🔧 Available Scripts

### Root Directory
- `npm run dev` - Run both frontend and backend concurrently
- `npm run install-all` - Install all dependencies
- `npm run server` - Run backend only
- `npm run client` - Run frontend only
- `npm run build` - Build frontend for production

### Server
- `npm run dev` - Run server with hot reload (nodemon)
- `npm start` - Run server in production mode

### Client
- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌐 API Endpoints

### Debates
- `GET /api/debates/topics` - Get all debate topics
- `POST /api/debates/create` - Create a new debate session
- `GET /api/debates/:debateId` - Get debate details
- `POST /api/debates/:debateId/argument` - Submit an argument

### WebSocket Events
- `join-debate` - Join a debate room
- `user-speaking` - Notify that user is speaking
- `user-stopped-speaking` - Notify that user stopped
- `transcription-update` - Send live transcription
- `ai-response` - Receive AI response
- `ai-thinking` - AI is processing

## 🎨 Customization

### Adding New Topics
Edit `server/src/data/topics.js`:

\`\`\`javascript
{
  id: 11,
  title: "Your debate topic here",
  category: "Category",
  difficulty: "Easy|Medium|Hard"
}
\`\`\`

### Modifying Scoring
Edit `server/src/services/scoringService.js` to adjust scoring algorithms.

### Changing AI Model
Edit `server/src/services/openaiService.js` to use different OpenAI models or parameters.

## 🔐 Security Notes

- Never commit your `.env` file
- Keep your OpenAI API key secure
- Use environment variables for sensitive data
- Implement rate limiting for production use

## 🚀 Deployment

### Frontend (Vercel/Netlify)
\`\`\`bash
cd client
npm run build
# Deploy the 'dist' folder
\`\`\`

### Backend (Heroku/Railway/Render)
- Set environment variables
- Deploy the `server` directory
- Ensure PORT is configured correctly

## 📝 Future Enhancements

- [ ] User authentication and profiles
- [ ] MongoDB integration for persistence
- [ ] Advanced analytics and statistics
- [ ] Group debates (multiple participants)
- [ ] Topic recommendation system
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Video debate recording

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Web Speech API for voice capabilities
- React and Node.js communities

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for better debate practice and interview preparation**
