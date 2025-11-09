import { Clock, MessageCircle, User, Bot } from 'lucide-react';

interface Round {
  roundNumber: number;
  userArgument: string;
  aiArgument: string;
  scores: {
    relevance: number;
    strength: number;
    engagement: number;
  };
  timestamp: Date;
}

interface HistorySidebarProps {
  rounds: Round[];
  currentRound: number;
}

const HistorySidebar = ({ rounds, currentRound }: HistorySidebarProps) => {
  if (rounds.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-4 border border-purple-500/20 h-full">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-purple-400" />
          Debate History
        </h2>
        <div className="text-center py-8 text-gray-400">
          <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No rounds yet</p>
          <p className="text-xs mt-1">History will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl p-4 border border-purple-500/20 h-full overflow-y-auto max-h-[calc(100vh-120px)]">
      <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2 sticky top-0 bg-slate-900/50 backdrop-blur-sm pb-2">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-8 h-8 rounded-xl flex items-center justify-center">
          <Clock className="h-4 w-4 text-white" />
        </div>
        Debate History
      </h2>
      
      <div className="space-y-3">
        {rounds.map((round) => (
          <div
            key={round.roundNumber}
            className={`glass-effect rounded-lg p-3 border transition-all duration-200 ${
              round.roundNumber === currentRound
                ? 'border-purple-500/50 bg-purple-500/5'
                : 'border-purple-500/10 hover:border-purple-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-400">
                Round {round.roundNumber}
              </span>
              <span className="text-[10px] text-gray-400">
                {new Date(round.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>

            {/* User Argument */}
            <div className="mb-2">
              <div className="flex items-center gap-1 mb-1">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-5 h-5 rounded-lg flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                <span className="text-[10px] font-semibold text-blue-300">You</span>
              </div>
              <p className="text-[10px] text-gray-300 line-clamp-2 pl-4">
                {round.userArgument}
              </p>
            </div>

            {/* AI Response */}
            <div className="mb-2">
              <div className="flex items-center gap-1 mb-1">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-5 h-5 rounded-lg flex items-center justify-center">
                  <Bot className="h-3 w-3 text-white" />
                </div>
                <span className="text-[10px] font-semibold text-purple-300">AI Moderator</span>
              </div>
              <p className="text-[10px] text-gray-300 line-clamp-2 pl-4">
                {round.aiArgument}
              </p>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-purple-500/10">
              <ScorePill label="Rel" score={round.scores.relevance} max={35} />
              <ScorePill label="Str" score={round.scores.strength} max={40} />
              <ScorePill label="Eng" score={round.scores.engagement} max={25} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ScorePillProps {
  label: string;
  score: number;
  max: number;
}

const ScorePill = ({ label, score, max }: ScorePillProps) => {
  const percentage = (score / max) * 100;
  const getColor = () => {
    if (percentage >= 80) return 'text-green-400 bg-green-500/20';
    if (percentage >= 60) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-orange-400 bg-orange-500/20';
  };

  return (
    <div className={`${getColor()} rounded px-2 py-1 text-center`}>
      <div className="text-[10px] font-medium opacity-70">{label}</div>
      <div className="text-xs font-bold">{score}/{max}</div>
    </div>
  );
};

export default HistorySidebar;
