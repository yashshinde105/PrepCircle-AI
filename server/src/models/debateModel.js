import mongoose from 'mongoose';

const detailedScoresSchema = new mongoose.Schema({
  fluency: { type: Number, default: null },
  topic_relevance: { type: Number, default: null },
  content_reasoning: { type: Number, default: null },
  clarity_delivery: { type: Number, default: null },
  confidence_composure: { type: Number, default: null },
  examples_application: { type: Number, default: null },
  participation: { type: Number, default: null },
}, { _id: false });

const roundSchema = new mongoose.Schema({
  roundNumber: { type: Number, required: true },
  userArgument: { type: String, required: true },
  userScore: { type: Number, required: true },
  aiArgument: { type: String, required: true },
  ai2Argument: { type: String, default: null },
  aiScore: { type: Number, required: true },
  ai2Score: { type: Number, required: true },
  detailedScores: { type: detailedScoresSchema, default: null },
  timestamp: { type: Date, required: true }
}, { _id: false });

const debateSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  topic: { type: String, required: true },
  userStance: { type: String, required: true },
  aiStance: { type: String, required: true },
  userName: { type: String, required: true },
  initialMessage: { type: String, default: '' },
  durationMinutes: { type: Number, enum: [5, 10, 15], default: 10 },
  sessionStartedAt: { type: Date, default: Date.now },
  sessionExpiresAt: { type: Date, default: null },
  rounds: { type: [roundSchema], default: [] },
  currentRound: { type: Number, default: 0 },
  userScore: { type: Number, default: 0 },
  aiScore: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  modelSessionId: { type: String, default: null },
  completedAt: { type: Date, default: null },
  // Comprehensive final report from the Colab backend
  finalReport: { type: mongoose.Schema.Types.Mixed, default: null },
}, { timestamps: true, versionKey: false });

export const Debate = mongoose.model('Debate', debateSchema);
