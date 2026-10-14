import { v4 as uuidv4 } from 'uuid';
import { debateTopics } from '../data/topics.js';
import { generateAIResponse, initializeModelSession, finishModelSession } from '../services/openaiService.js';
import { calculateScore } from '../services/scoringService.js';
import { Debate } from '../models/debateModel.js';

export const getDebateTopics = (req, res) => {
  res.json({ topics: debateTopics });
};

export const createDebate = async (req, res) => {
  const { topic, stance, userName } = req.body;

  try {
    const modelSession = await initializeModelSession(userName || 'User', topic);
    const debate = await Debate.create({
      id: uuidv4(),
      topic,
      userStance: stance,
      aiStance: stance === 'pro' ? 'con' : 'pro',
      userName: userName || 'User',
      initialMessage: modelSession?.bobResponse || '',
      modelSessionId: modelSession?.sessionId || null
    });

    res.json({
      debateId: debate.id,
      debate: {
        id: debate.id,
        topic: debate.topic,
        userStance: debate.userStance,
        aiStance: debate.aiStance,
        initialMessage: debate.initialMessage || ''
      },
      initialMessage: modelSession?.bobResponse || null
    });
  } catch (error) {
    console.error('Error creating debate:', error.message);
    res.status(error.status || 500).json({
      error: error.message || 'Failed to create debate',
      code: error.code || 'DEBATE_CREATE_FAILED',
    });
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

    // Get both AI participant responses from Colab, along with live scores.
    const aiResult = await generateAIResponse(
      debate.topic,
      debate.aiStance,
      argument || 'Start the discussion',
      debate.rounds,
      debate.modelSessionId
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

    const aiResponse = aiResult.response || '';
    // Keep each response mapped to its participant for persistence and scoring.
    const ai2Response = aiResult.jannetResponse || null;
    const aiTurns = aiResult.responses || [];

    // Use Colab's rich 7-category live_scores if available; fall back to local heuristic
    const colabScores = aiResult.liveScores;
    let userScore;
    let detailedScores = null;

    if (colabScores && argument) {
      // Colab returns scores on a 0-10 scale per category; compute weighted total
      const weightedTotal = (
        (colabScores.fluency || 0) * 20 +
        (colabScores.topic_relevance || 0) * 20 +
        (colabScores.content_reasoning || 0) * 20 +
        (colabScores.clarity_delivery || 0) * 15 +
        (colabScores.confidence_composure || 0) * 10 +
        (colabScores.examples_application || 0) * 10 +
        (colabScores.participation || 0) * 5
      ) / 10; // Convert to 0-100 scale
      userScore = Math.round(weightedTotal);
      detailedScores = colabScores;
    } else {
      userScore = argument ? calculateScore(argument, debate.topic, duration) : 0;
    }

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
        detailedScores: detailedScores,
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

    // Build score breakdown for the frontend
    const scores = detailedScores
      ? {
          fluency: detailedScores.fluency,
          topic_relevance: detailedScores.topic_relevance,
          content_reasoning: detailedScores.content_reasoning,
          clarity_delivery: detailedScores.clarity_delivery,
          confidence_composure: detailedScores.confidence_composure,
          examples_application: detailedScores.examples_application,
          participation: detailedScores.participation,
          // Legacy fields for backward compat
          relevance: Math.round(userScore * 0.4),
          strength: Math.round(userScore * 0.35),
          engagement: Math.round(userScore * 0.25),
        }
      : {
          relevance: Math.round(userScore * 0.4),
          strength: Math.round(userScore * 0.35),
          engagement: Math.round(userScore * 0.25),
        };

    res.json({
      debateEnded: false,
      round: currentRound,
      totalUserScore,
      totalAIScore,
      aiResponse,
      ai2Response,
      aiTurns,
      scores,
    });
  } catch (error) {
    console.error('Error processing argument:', error.message);
    res.status(error.status || 500).json({
      error: error.message || 'Failed to process argument',
      code: error.code || 'DEBATE_ARGUMENT_FAILED',
    });
  }
};

// Finish a debate session — calls the Colab backend's finish endpoint for the final report
export const finishDebate = async (req, res) => {
  const { debateId } = req.params;

  try {
    const debate = await Debate.findOne({ id: debateId }).lean();
    if (!debate) {
      return res.status(404).json({ error: 'Debate not found' });
    }

    // Call Colab backend's finish endpoint
    const finishResult = await finishModelSession(debate.modelSessionId);
    const finalReport = finishResult?.finalReport || null;

    // Update the debate in the database
    await Debate.updateOne(
      { id: debateId },
      {
        $set: {
          status: 'completed',
          completedAt: new Date(),
          finalReport: finalReport,
        },
      }
    );

    res.json({
      debateId,
      isComplete: true,
      finalReport: finalReport,
      totalUserScore: debate.userScore,
      rounds: debate.rounds.length,
    });
  } catch (error) {
    console.error('Error finishing debate:', error.message);
    res.status(error.status || 500).json({
      error: error.message || 'Failed to finish debate',
      code: error.code || 'DEBATE_FINISH_FAILED',
    });
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
          detailedScores: round.detailedScores || null,
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
