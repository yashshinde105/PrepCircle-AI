import mongoose from 'mongoose';

const roundSchema = new mongoose.Schema({
  roundNumber: { type: Number, required: true },
  userArgument: { type: String, required: true },
  userScore: { type: Number, required: true },
  aiArgument: { type: String, required: true },
  ai2Argument: { type: String, default: null },
  aiScore: { type: Number, required: true },
  ai2Score: { type: Number, required: true },
  timestamp: { type: Date, required: true }
}, { _id: false });

const debateSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  topic: { type: String, required: true },
  userStance: { type: String, required: true },
  aiStance: { type: String, required: true },
  userName: { type: String, required: true },
  rounds: { type: [roundSchema], default: [] },
  currentRound: { type: Number, default: 0 },
  userScore: { type: Number, default: 0 },
  aiScore: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  modelSessionId: { type: String, default: null },
  completedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false });

export const Debate = mongoose.model('Debate', debateSchema);
