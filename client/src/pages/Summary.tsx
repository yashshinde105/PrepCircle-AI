import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, TrendingUp, AlertCircle, Home, BarChart3, Sparkles, Trophy, Target } from 'lucide-react';
import axios from 'axios';

interface Round {
  roundNumber: number;
  userArgument: string;
  userScore: number;
  aiArgument: string;
}

interface GDSummary {
  topic: string;
  rounds: Round[];
  userScore: number;
  performance: string;
  averageScore: number;
}

function Summary() {
  const { debateId } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<GDSummary | null>(null);

  useEffect(() => {
    fetchSummary();
  }, [debateId]);

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`/api/debates/${debateId}`);
      const debate = response.data.debate;
      const avgScore = debate.userScore / debate.rounds.length;
      
      let performance = 'Needs Improvement';
      if (avgScore >= 80) performance = 'Excellent';
      else if (avgScore >= 70) performance = 'Good';
      else if (avgScore >= 60) performance = 'Average';
      
      setSummary({
        topic: debate.topic,
        rounds: debate.rounds,
        userScore: debate.userScore,
        performance,
        averageScore: Math.round(avgScore)
      });
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Analyzing Performance...</p>
        </div>
      </div>
    );
  }

  const getPerformanceColor = (perf: string) => {
    if (perf === 'Excellent') return 'from-green-400 to-emerald-500';
    if (perf === 'Good') return 'from-blue-400 to-cyan-500';
    if (perf === 'Average') return 'from-yellow-400 to-orange-500';
    return 'from-orange-400 to-red-500';
  };

  const getPerformanceIcon = (perf: string) => {
    if (perf === 'Excellent') return '🌟';
    if (perf === 'Good') return '👍';
    if (perf === 'Average') return '💪';
    return '📚';
  };

  const getPerformanceMessage = (perf: string) => {
    if (perf === 'Excellent') return 'Outstanding! You\'re ready for real GD rounds!';
    if (perf === 'Good') return 'Well done! Keep practicing to reach excellence!';
    if (perf === 'Average') return 'Good effort! Focus on the improvements suggested below.';
    return 'Keep practicing! You\'ll improve with more GD sessions.';
  };

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Performance Announcement */}
        <div className="card text-center mb-8 ai-glow animate-float">
          <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${getPerformanceColor(summary.performance)} rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform`}>
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-3 gradient-text">
            {summary.performance} Performance! {getPerformanceIcon(summary.performance)}
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">{getPerformanceMessage(summary.performance)}</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="glass-effect p-6 rounded-xl border border-purple-500/30">
              <div className="text-sm text-slate-400 mb-1">Total Score</div>
              <div className="text-5xl font-bold gradient-text">{summary.userScore}</div>
            </div>
            <div className="glass-effect p-6 rounded-xl border border-green-500/30">
              <div className="text-sm text-slate-400 mb-1">Average Per Round</div>
              <div className="text-5xl font-bold gradient-text">{summary.averageScore}</div>
            </div>
            <div className="glass-effect p-6 rounded-xl border border-blue-500/30">
              <div className="text-sm text-slate-400 mb-1">Rounds Completed</div>
              <div className="text-5xl font-bold gradient-text">{summary.rounds.length}</div>
            </div>
          </div>
        </div>

        {/* Topic */}
        <div className="card mb-8 ai-glow">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-semibold text-white">GD Topic</h2>
          </div>
          <p className="text-slate-200 text-xl mb-3">{summary.topic}</p>
          <p className="text-sm text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            You participated in {summary.rounds.length} round{summary.rounds.length > 1 ? 's' : ''} of discussion
          </p>
        </div>

        {/* Round by Round Feedback */}
        <div className="card mb-8 ai-glow">
          <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3 gradient-text">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            Round-by-Round Analysis
          </h2>
          <div className="space-y-6">
            {summary.rounds.map((round) => (
              <div key={round.roundNumber} className="glass-effect p-6 rounded-xl border-l-4 border-purple-500">
                <h3 className="font-bold text-xl mb-4 text-white flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-sm">
                    {round.roundNumber}
                  </span>
                  Round {round.roundNumber}
                </h3>
                
                {/* User Response */}
                <div className="glass-effect border border-blue-500/30 p-5 rounded-xl mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-blue-400 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Your Response
                    </span>
                    <span className={`font-bold text-xl px-4 py-1 rounded-full ${
                      round.userScore >= 75 ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 
                      round.userScore >= 60 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 
                      'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    }`}>
                      {round.userScore}/100
                    </span>
                  </div>
                  <p className="text-slate-200 text-base mb-3 leading-relaxed">{round.userArgument}</p>
                  <div className="mt-3 pt-3 border-t border-blue-500/20">
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      {round.userScore >= 75 ? '✅ Excellent response!' : 
                       round.userScore >= 60 ? '👍 Good points made' : 
                       '💡 Room for improvement'}
                    </p>
                  </div>
                </div>

                {/* Moderator Feedback */}
                <div className="glass-effect border border-purple-500/30 p-5 rounded-xl">
                  <div className="flex items-center mb-3">
                    <span className="font-semibold text-purple-400 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      AI Moderator's Challenge
                    </span>
                  </div>
                  <p className="text-slate-300 text-base italic leading-relaxed">{round.aiArgument}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="card mb-8 ai-glow">
          <h2 className="text-3xl font-semibold mb-6 gradient-text">Key Feedback & Improvements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-effect p-6 rounded-xl border border-green-500/30">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-green-400">
                <TrendingUp className="w-6 h-6" />
                What You Did Well
              </h3>
              <ul className="list-disc list-inside space-y-3 text-slate-300">
                {summary.averageScore >= 75 && (
                  <li>Strong logical reasoning and clear communication</li>
                )}
                {summary.rounds.filter(r => r.userScore >= 70).length >= summary.rounds.length * 0.7 && (
                  <li>Consistent performance throughout the GD</li>
                )}
                {summary.rounds.length >= 3 && (
                  <li>Good stamina - maintained engagement across rounds</li>
                )}
                {summary.averageScore >= 80 && (
                  <li>Excellent use of examples and evidence</li>
                )}
                {summary.averageScore < 80 && summary.averageScore >= 60 && (
                  <li>Demonstrated understanding of the topic</li>
                )}
              </ul>
            </div>
            <div className="glass-effect p-6 rounded-xl border border-orange-500/30">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-orange-400">
                <AlertCircle className="w-6 h-6" />
                Areas to Focus On
              </h3>
              <ul className="list-disc list-inside space-y-3 text-slate-300">
                {summary.averageScore < 60 && (
                  <>
                    <li>Provide more specific examples and evidence</li>
                    <li>Structure your points with clear logical flow</li>
                  </>
                )}
                {summary.averageScore >= 60 && summary.averageScore < 75 && (
                  <>
                    <li>Add more real-world examples to support claims</li>
                    <li>Consider multiple perspectives before concluding</li>
                  </>
                )}
                {summary.rounds.some(r => r.userScore < 50) && (
                  <li>Practice time management while speaking</li>
                )}
                {summary.averageScore >= 75 && (
                  <>
                    <li>Continue practicing to maintain consistency</li>
                    <li>Explore more complex arguments and counterpoints</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          
          {/* Overall Feedback */}
          <div className="mt-6 glass-effect p-6 rounded-xl border border-purple-500/30">
            <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-purple-400">
              <Sparkles className="w-5 h-5" />
              AI Moderator's Overall Feedback
            </h4>
            <p className="text-slate-300 leading-relaxed">
              {summary.averageScore >= 80 && 
                'Outstanding performance! You demonstrated strong critical thinking, clear communication, and excellent use of examples. You\'re ready for real GD rounds.'}
              {summary.averageScore >= 70 && summary.averageScore < 80 &&
                'Good job! You showed solid understanding and decent communication. Focus on adding more concrete examples and addressing counterpoints to reach the next level.'}
              {summary.averageScore >= 60 && summary.averageScore < 70 &&
                'Average performance. You have the basics down but need to work on logical reasoning, providing evidence, and structuring your arguments better.'}
              {summary.averageScore < 60 &&
                'Keep practicing! Work on organizing your thoughts, providing specific examples, and speaking clearly. Regular practice will help you improve significantly.'}
            </p>
          </div>
        </div>


        {/* Actions */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate('/')}
            className="btn-primary px-8 py-4 text-lg flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Practice Another GD
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="btn-secondary px-8 py-4 text-lg flex items-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Summary;
