import { generateAIResponse } from '../services/openaiService.js';

export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    socket.on('join-debate', (debateId) => {
      socket.join(debateId);
      console.log(`User joined debate: ${debateId}`);
    });

    socket.on('user-speaking', (data) => {
      // Broadcast that user is speaking
      socket.to(data.debateId).emit('participant-speaking', {
        participant: 'user',
        isActive: true
      });
    });

    socket.on('user-stopped-speaking', (data) => {
      socket.to(data.debateId).emit('participant-speaking', {
        participant: 'user',
        isActive: false
      });
    });

    socket.on('transcription-update', (data) => {
      // Real-time transcription updates
      socket.to(data.debateId).emit('live-transcription', {
        text: data.text,
        participant: 'user'
      });
    });

    socket.on('ai-response-requested', async (data) => {
      try {
        socket.emit('ai-thinking', true);
        
        const response = await generateAIResponse(
          data.topic,
          data.aiStance,
          data.userArgument,
          data.previousRounds
        );
        
        socket.emit('ai-response', {
          text: response,
          debateId: data.debateId
        });
        
        socket.emit('ai-thinking', false);
      } catch (error) {
        console.error('Error generating AI response:', error);
        socket.emit('error', { message: 'Failed to generate AI response' });
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });
};
