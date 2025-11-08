import { v4 as uuidv4 } from 'uuid';
import { debateTopics } from '../data/topics.js';
import { generateAIResponse } from '../services/openaiService.js';
import { calculateScore } from '../services/scoringService.js';

// In-memory storage (replace with database in production)
const debates = new Map();

export const getDebateTopics = (req, res) => {
  res.json({ topics: debateTopics });
};

export const createDebate = (req, res) => {
  const { topic, stance, userName } = req.body;
  
  const debateId = uuidv4();
  const debate = {
    id: debateId,
    topic,
    userStance: stance,
    aiStance: stance === 'pro' ? 'con' : 'pro',
    userName: userName || 'User',
    rounds: [],
    currentRound: 0,
    userScore: 0,
    aiScore: 0,
    status: 'active',
    createdAt: new Date()
  };
  
  debates.set(debateId, debate);
  
  res.json({ 
    debateId, 
    debate: {
      id: debate.id,
      topic: debate.topic,
      userStance: debate.userStance,
      aiStance: debate.aiStance
    }
  });
};

export const getDebateById = (req, res) => {
  const { debateId } = req.params;
  const debate = debates.get(debateId);
  
  if (!debate) {
    return res.status(404).json({ error: 'Debate not found' });
  }
  
  res.json({ debate });
};

export const submitArgument = async (req, res) => {
  const { debateId } = req.params;
  const { argument, duration } = req.body;
  
  const debate = debates.get(debateId);
  
  if (!debate) {
    return res.status(404).json({ error: 'Debate not found' });
  }
  
  try {
    // Calculate score for user's argument
    const userScore = calculateScore(argument, debate.topic, duration);
    
    // Generate AI response
    const aiResponse = await generateAIResponse(
      debate.topic,
      debate.aiStance,
      argument,
      debate.rounds
    );
    
    // Calculate score for AI's argument
    const aiScore = calculateScore(aiResponse, debate.topic, 60);
    
    // Update debate
    const round = {
      roundNumber: debate.currentRound + 1,
      userArgument: argument,
      userScore,
      aiArgument: aiResponse,
      aiScore,
      timestamp: new Date()
    };
    
    debate.rounds.push(round);
    debate.currentRound += 1;
    debate.userScore += userScore;
    debate.aiScore += aiScore;
    
    debates.set(debateId, debate);
    
    res.json({
      round,
      totalUserScore: debate.userScore,
      totalAIScore: debate.aiScore,
      aiResponse
    });
  } catch (error) {
    console.error('Error processing argument:', error);
    res.status(500).json({ error: 'Failed to process argument' });
  }
};
