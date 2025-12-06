import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, TrendingUp, AlertCircle, Home, BarChart3, Sparkles, Trophy, Target } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { GlowingEffect } from '../components/ui/glowing-effect';

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
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-purple-500/30 rounded-full mx-auto mb-6"></div>
              <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 -translate-x-1/2"></div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Analyzing Performance</h2>
            <p className="text-slate-400">Preparing your detailed feedback...</p>
          </div>
        </div>
      </div>
    );
  }

  const getPerformanceColor = (perf: string) => {
    if (perf === 'Excellent') return 'from-emerald-400 to-green-500';
    if (perf === 'Good') return 'from-blue-400 to-cyan-500';
    if (perf === 'Average') return 'from-amber-400 to-orange-500';
    return 'from-orange-400 to-rose-500';
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
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Performance Hero Section */}
          <div className="card border border-purple-500/20 text-center mb-10 animate-scale-in overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            
            <div className={`w-28 h-28 mx-auto mb-6 bg-gradient-to-br ${getPerformanceColor(summary.performance)} rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform`}>
              <Trophy className="w-14 h-14 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="gradient-text">{summary.performance} Performance!</span>
              <span className="ml-3">{getPerformanceIcon(summary.performance)}</span>
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">{getPerformanceMessage(summary.performance)}</p>
            
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {[
                { label: 'Total Score', value: summary.userScore, icon: Trophy },
                { label: 'Average Per Round', value: summary.averageScore, icon: Target },
                { label: 'Rounds Completed', value: summary.rounds.length, icon: BarChart3 },
              ].map((stat, index) => (
                <div key={index} className="relative rounded-2xl border border-white/5 p-1.5 bg-white/[0.02] animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={2}
                  />
                  <div className="bg-[#0f0f1a]/80 backdrop-blur-sm rounded-xl p-6">
                    <stat.icon className="w-6 h-6 text-purple-400 mx-auto mb-3" />
                    <div className="text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Card */}
          <div className="card border border-purple-500/20 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Discussion Topic</h2>
            </div>
            <p className="text-lg text-slate-200 mb-3">{summary.topic}</p>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
              Completed {summary.rounds.length} round{summary.rounds.length > 1 ? 's' : ''} of discussion
            </p>
          </div>

          {/* Round Analysis */}
          <div className="card border border-purple-500/20 mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Round-by-Round Analysis</h2>
            </div>
            
            <div className="space-y-6">
              {summary.rounds.map((round, index) => (
                <div 
                  key={round.roundNumber} 
                  className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${(index + 3) * 100}ms` }}
                >
                  {/* Round Header */}
                  <div className="flex items-center justify-between p-4 bg-white/[0.03] border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold text-white">
                        {round.roundNumber}
                      </span>
                      <span className="font-semibold text-white">Round {round.roundNumber}</span>
                    </div>
                    <span className={`text-xl font-bold px-4 py-1.5 rounded-lg ${
                      round.userScore >= 75 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                      round.userScore >= 60 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {round.userScore}/100
                    </span>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    {/* User Response */}
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="w-4 h-4 text-blue-400" />
                        <span className="font-medium text-blue-400 text-sm">Your Response</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{round.userArgument}</p>
                      <p className="text-sm text-slate-500 mt-3 pt-3 border-t border-blue-500/10 flex items-center gap-2">
                        {round.userScore >= 75 ? '✅ Excellent response!' : 
                         round.userScore >= 60 ? '👍 Good points made' : 
                         '💡 Room for improvement'}
                      </p>
                    </div>

                    {/* AI Challenge */}
                    <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="font-medium text-purple-400 text-sm">AI Moderator's Challenge</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed italic">{round.aiArgument}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="card border border-purple-500/20 mb-10 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h2 className="text-xl font-semibold text-white mb-6">Key Insights & Recommendations</h2>
            
            <div className="grid md:grid-cols-2 gap-5 mb-6">
              {/* Strengths */}
              <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-emerald-400">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {summary.averageScore >= 75 && (
                    <li className="flex items-start gap-2 text-slate-300 text-sm">
                      <span className="text-emerald-400 mt-1">•</span>
                      Strong logical reasoning and clear communication
                    </li>
                  )}
                  {summary.rounds.filter(r => r.userScore >= 70).length >= summary.rounds.length * 0.7 && (
                    <li className="flex items-start gap-2 text-slate-300 text-sm">
                      <span className="text-emerald-400 mt-1">•</span>
                      Consistent performance throughout the GD
                    </li>
                  )}
                  {summary.rounds.length >= 3 && (
                    <li className="flex items-start gap-2 text-slate-300 text-sm">
                      <span className="text-emerald-400 mt-1">•</span>
                      Good stamina - maintained engagement across rounds
                    </li>
                  )}
                  {summary.averageScore >= 80 && (
                    <li className="flex items-start gap-2 text-slate-300 text-sm">
                      <span className="text-emerald-400 mt-1">•</span>
                      Excellent use of examples and evidence
                    </li>
                  )}
                  {summary.averageScore < 80 && summary.averageScore >= 60 && (
                    <li className="flex items-start gap-2 text-slate-300 text-sm">
                      <span className="text-emerald-400 mt-1">•</span>
                      Demonstrated understanding of the topic
                    </li>
                  )}
                </ul>
              </div>

              {/* Areas to Improve */}
              <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-amber-400">Areas to Focus On</h3>
                </div>
                <ul className="space-y-2">
                  {summary.averageScore < 60 && (
                    <>
                      <li className="flex items-start gap-2 text-slate-300 text-sm">
                        <span className="text-amber-400 mt-1">•</span>
                        Provide more specific examples and evidence
                      </li>
                      <li className="flex items-start gap-2 text-slate-300 text-sm">
                        <span className="text-amber-400 mt-1">•</span>
                        Structure your points with clear logical flow
                      </li>
                    </>
                  )}
                  {summary.averageScore >= 60 && summary.averageScore < 75 && (
                    <>
                      <li className="flex items-start gap-2 text-slate-300 text-sm">
                        <span className="text-amber-400 mt-1">•</span>
                        Add more real-world examples to support claims
                      </li>
                      <li className="flex items-start gap-2 text-slate-300 text-sm">
                        <span className="text-amber-400 mt-1">•</span>
                        Consider multiple perspectives before concluding
                      </li>
                    </>
                  )}
                  {summary.rounds.some(r => r.userScore < 50) && (
                    <li className="flex items-start gap-2 text-slate-300 text-sm">
                      <span className="text-amber-400 mt-1">•</span>
                      Practice time management while speaking
                    </li>
                  )}
                  {summary.averageScore >= 75 && (
                    <>
                      <li className="flex items-start gap-2 text-slate-300 text-sm">
                        <span className="text-amber-400 mt-1">•</span>
                        Continue practicing to maintain consistency
                      </li>
                      <li className="flex items-start gap-2 text-slate-300 text-sm">
                        <span className="text-amber-400 mt-1">•</span>
                        Explore more complex arguments and counterpoints
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            
            {/* Overall AI Feedback */}
            <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h4 className="font-semibold text-purple-400">AI Moderator's Overall Assessment</h4>
              </div>
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '400ms' }}>
            <button
              onClick={() => navigate('/')}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Practice Another GD
            </button>
            <button
              onClick={() => navigate('/leaderboard')}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              View Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
