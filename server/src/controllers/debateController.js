import { v4 as uuidv4 } from 'uuid';
import { debateTopics } from '../data/topics.js';
import { generateAIResponse, generateAI2Response, resetModelSession, initializeModelSession } from '../services/openaiService.js';
import { calculateScore } from '../services/scoringService.js';

// In-memory storage (replace with database in production)
const debates = new Map();

export const getDebateTopics = (req, res) => {
  res.json({ topics: debateTopics });
};

export const createDebate = async (req, res) => {
  const { topic, stance, userName } = req.body;
  
  // Reset model session for new GD
  resetModelSession();
  
  // Initialize new session with the custom model
  const modelSession = await initializeModelSession(userName || 'User', topic);
  
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
    createdAt: new Date(),
    modelSessionId: modelSession?.sessionId || null
  };
  
  debates.set(debateId, debate);
  
  res.json({ 
    debateId, 
    debate: {
      id: debate.id,
      topic: debate.topic,
      userStance: debate.userStance,
      aiStance: debate.aiStance
    },
    // Include initial AI greeting if available
    initialMessage: modelSession?.assistantOutput || null
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
    // Calculate score for user's argument (0 if empty - for initial AI response)
    const userScore = argument ? calculateScore(argument, debate.topic, duration) : 0;
    
    // Generate AI Agent 1 response (Alex)
    const aiResult = await generateAIResponse(
      debate.topic,
      debate.aiStance,
      argument || 'Start the discussion', // Default prompt if user hasn't spoken yet
      debate.rounds
    );
    
    // Check if debate has ended
    if (aiResult.debateEnded) {
      console.log('🏁 Debate completed - sending user to summary');
      debate.status = 'completed';
      debates.set(debateId, debate);
      
      return res.json({
        debateEnded: true,
        round: debate.currentRound,
        totalUserScore: debate.userScore,
        totalAIScore: debate.aiScore,
        message: 'The GD session has concluded. Thank you for participating!'
      });
    }
    
    const aiResponse = aiResult.response;
    
    // Generate AI Agent 2 response (Jannet)
    const ai2Response = await generateAI2Response(
      debate.topic,
      debate.aiStance,
      argument || 'Start the discussion',
      aiResponse,
      debate.rounds
    );
    
    // Calculate scores for AI arguments
    const aiScore = calculateScore(aiResponse, debate.topic, 60);
    const ai2Score = ai2Response ? calculateScore(ai2Response, debate.topic, 60) : 0;
    
    // Update debate (only add round if user actually spoke)
    if (argument) {
      const round = {
        roundNumber: debate.currentRound + 1,
        userArgument: argument,
        userScore,
        aiArgument: aiResponse,
        ai2Argument: ai2Response,
        aiScore,
        ai2Score,
        timestamp: new Date()
      };
      
      debate.rounds.push(round);
      debate.currentRound += 1;
      debate.userScore += userScore;
      debate.aiScore += aiScore + ai2Score;
      
      debates.set(debateId, debate);
    }
    
    res.json({
      debateEnded: false,
      round: debate.currentRound,
      totalUserScore: debate.userScore,
      totalAIScore: debate.aiScore,
      aiResponse,
      ai2Response,
      scores: {
        relevance: Math.round(userScore * 0.4),
        strength: Math.round(userScore * 0.35),
        engagement: Math.round(userScore * 0.25)
      }
    });
  } catch (error) {
    console.error('Error processing argument:', error);
    res.status(500).json({ error: 'Failed to process argument' });
  }
};
