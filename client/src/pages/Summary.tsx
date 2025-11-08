import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, TrendingUp, AlertCircle, Home, BarChart3 } from 'lucide-react';
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
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const getPerformanceColor = (perf: string) => {
    if (perf === 'Excellent') return 'text-green-500';
    if (perf === 'Good') return 'text-blue-500';
    if (perf === 'Average') return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getPerformanceMessage = (perf: string) => {
    if (perf === 'Excellent') return 'Outstanding! You\'re ready for real GD rounds! 🌟';
    if (perf === 'Good') return 'Well done! Keep practicing to reach excellence! 👍';
    if (perf === 'Average') return 'Good effort! Focus on the improvements suggested below. 💪';
    return 'Keep practicing! You\'ll improve with more GD sessions. 📚';
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Performance Announcement */}
        <div className="card text-center mb-8">
          <Award className={`w-16 h-16 mx-auto mb-4 ${getPerformanceColor(summary.performance)}`} />
          <h1 className="text-4xl font-bold mb-2">
            {summary.performance} Performance!
          </h1>
          <p className="text-xl text-gray-600 mb-6">{getPerformanceMessage(summary.performance)}</p>
          <div className="flex justify-center gap-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-lg text-white">
              <div className="text-sm opacity-90">Total Score</div>
              <div className="text-4xl font-bold">{summary.userScore}</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-lg text-white">
              <div className="text-sm opacity-90">Average Per Round</div>
              <div className="text-4xl font-bold">{summary.averageScore}</div>
            </div>
          </div>
        </div>

        {/* Topic */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-2">GD Topic</h2>
          <p className="text-gray-700 text-lg">{summary.topic}</p>
          <p className="text-sm text-gray-500 mt-2">
            You participated in {summary.rounds.length} round{summary.rounds.length > 1 ? 's' : ''} of discussion
          </p>
        </div>

        {/* Round by Round Feedback */}
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Round-by-Round Analysis
          </h2>
          <div className="space-y-6">
            {summary.rounds.map((round) => (
              <div key={round.roundNumber} className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-lg mb-3">Round {round.roundNumber}</h3>
                
                {/* User Response */}
                <div className="bg-blue-50 p-4 rounded-lg mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-primary">Your Response</span>
                    <span className={`font-bold text-lg ${
                      round.userScore >= 75 ? 'text-green-600' : 
                      round.userScore >= 60 ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {round.userScore}/100
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{round.userArgument}</p>
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <p className="text-xs text-gray-600">
                      {round.userScore >= 75 ? '✅ Excellent response!' : 
                       round.userScore >= 60 ? '👍 Good points made' : 
                       '💡 Room for improvement'}
                    </p>
                  </div>
                </div>

                {/* Moderator Feedback */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="font-semibold text-secondary">AI Moderator's Challenge</span>
                  </div>
                  <p className="text-gray-700 text-sm italic">{round.aiArgument}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Feedback & Improvements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                What You Did Well
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
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
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Areas to Focus On
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
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
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h4 className="font-semibold mb-2">📝 Overall Feedback:</h4>
            <p className="text-gray-700">
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
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Practice Another GD
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="btn-secondary flex items-center gap-2"
          >
            <Award className="w-5 h-5" />
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Summary;
