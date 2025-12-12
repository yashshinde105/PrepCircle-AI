import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import debateRoutes from './routes/debateRoutes.js';
import { initializeSocket } from './socket/socketHandler.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/debates', debateRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Debator Server Running' });
});

// Initialize Socket.io
initializeSocket(io);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 WebSocket ready for real-time GD sessions`);
  console.log('🤖 AI Agents ready (Bob & Jannet)');
  console.log(`📡 Model API: ${process.env.MODEL_API_URL || 'Not configured'}`);
});
