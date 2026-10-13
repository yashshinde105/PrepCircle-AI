import { v4 as uuidv4 } from 'uuid';
import { debateTopics } from '../data/topics.js';
import { generateAIResponse, generateAI2Response, resetModelSession, initializeModelSession } from '../services/openaiService.js';
import { calculateScore } from '../services/scoringService.js';
import { Debate } from '../models/debateModel.js';

export const getDebateTopics = (req, res) => {
  res.json({ topics: debateTopics });
};

export const createDebate = async (req, res) => {
  const { topic, stance, userName } = req.body;

  try {
    resetModelSession();
    const modelSession = await initializeModelSession(userName || 'User', topic);
    const debate = await Debate.create({
      id: uuidv4(),
      topic,
      userStance: stance,
      aiStance: stance === 'pro' ? 'con' : 'pro',
      userName: userName || 'User',
      modelSessionId: modelSession?.sessionId || null
    });

    res.json({
      debateId: debate.id,
      debate: {
        id: debate.id,
        topic: debate.topic,
        userStance: debate.userStance,
        aiStance: debate.aiStance
      },
      initialMessage: modelSession?.assistantOutput || null
    });
  } catch (error) {
    console.error('Error creating debate:', error.message);
    res.status(500).json({ error: 'Failed to create debate' });
  }
};

export const getDebateById = async (req, res) => {
  try {
    const debate = await Debate.findOne({ id: req.params.debateId }).lean();
    if (!debate) {
      return res.status(404).json({ error: 'Debate not found' });
    }

    res.json({ debate });
  } catch (error) {
    console.error('Error fetching debate:', error.message);
    res.status(500).json({ error: 'Failed to fetch debate' });
  }
};

export const submitArgument = async (req, res) => {
  const { debateId } = req.params;
  const { argument, duration } = req.body;

  try {
    const debate = await Debate.findOne({ id: debateId }).lean();
    if (!debate) {
      return res.status(404).json({ error: 'Debate not found' });
    }

    const userScore = argument ? calculateScore(argument, debate.topic, duration) : 0;
    const aiResult = await generateAIResponse(
      debate.topic,
      debate.aiStance,
      argument || 'Start the discussion',
      debate.rounds
    );

    if (aiResult.debateEnded) {
      await Debate.updateOne(
        { id: debateId, status: 'active' },
        { $set: { status: 'completed', completedAt: new Date() } }
      );
      return res.json({
        debateEnded: true,
        round: debate.currentRound,
        totalUserScore: debate.userScore,
        totalAIScore: debate.aiScore,
        message: 'The GD session has concluded. Thank you for participating!'
      });
    }

    const aiResponse = aiResult.response;
    const ai2Response = await generateAI2Response(
      debate.topic,
      debate.aiStance,
      argument || 'Start the discussion',
      aiResponse,
      debate.rounds
    );
    const aiScore = calculateScore(aiResponse, debate.topic, 60);
    const ai2Score = ai2Response ? calculateScore(ai2Response, debate.topic, 60) : 0;

    let currentRound = debate.currentRound;
    let totalUserScore = debate.userScore;
    let totalAIScore = debate.aiScore;

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
      const updatedDebate = await Debate.findOneAndUpdate(
        { id: debateId, currentRound: debate.currentRound, status: 'active' },
        {
          $push: { rounds: round },
          $inc: {
            currentRound: 1,
            userScore,
            aiScore: aiScore + ai2Score
          }
        },
        { new: true, lean: true }
      );

      if (!updatedDebate) {
        return res.status(409).json({ error: 'Debate was updated concurrently; please retry' });
      }
      currentRound = updatedDebate.currentRound;
      totalUserScore = updatedDebate.userScore;
      totalAIScore = updatedDebate.aiScore;
    }

    res.json({
      debateEnded: false,
      round: currentRound,
      totalUserScore,
      totalAIScore,
      aiResponse,
      ai2Response,
      scores: {
        relevance: Math.round(userScore * 0.4),
        strength: Math.round(userScore * 0.35),
        engagement: Math.round(userScore * 0.25)
      }
    });
  } catch (error) {
    console.error('Error processing argument:', error.message);
    res.status(500).json({ error: 'Failed to process argument' });
  }
};

export const getAllDebates = async (req, res) => {
  try {
    const debates = await Debate.find({})
      .sort({ createdAt: -1 })
      .select('id topic userStance userName rounds userScore status createdAt')
      .lean();

    res.json({
      debates: debates.map((debate) => ({
        id: debate.id,
        topic: debate.topic,
        userStance: debate.userStance,
        userName: debate.userName,
        rounds: debate.rounds.map((round) => ({
          roundNumber: round.roundNumber,
          userArgument: round.userArgument,
          userScore: round.userScore,
          aiArgument: round.aiArgument,
          ai2Argument: round.ai2Argument,
          timestamp: round.timestamp
        })),
        userScore: debate.userScore,
        status: debate.status,
        createdAt: debate.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching debates history:', error.message);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};
