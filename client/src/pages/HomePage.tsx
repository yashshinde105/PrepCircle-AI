import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Trophy, BookOpen, Sparkles, Brain, Zap, Target } from 'lucide-react';
import axios from 'axios';

interface Topic {
  id: number;
  title: string;
  category: string;
  difficulty: string;
}

function HomePage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await axios.get('/api/debates/topics');
      setTopics(response.data.topics);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const startGD = async () => {
    if (!selectedTopic || !userName.trim()) {
      alert('Please select a topic and enter your name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/debates/create', {
        topic: selectedTopic.title,
        stance: 'participant',  // No pro/con for GD
        userName
      });
      navigate(`/debate/${response.data.debateId}`);
    } catch (error) {
      console.error('Error creating GD session:', error);
      alert('Failed to start GD practice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-float">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-purple-400 mr-4 animate-pulse" />
            <h1 className="text-6xl font-bold gradient-text">
              AI-Powered GD Simulator
            </h1>
            <Sparkles className="w-12 h-12 text-blue-400 ml-4 animate-pulse" />
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Master Group Discussions with cutting-edge AI technology. 
            <span className="text-purple-400 font-semibold"> Train smarter, perform better.</span>
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>AI Moderator Online</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Powered by Gemini AI</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="card text-center group hover:scale-105 ai-glow">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Voice AI</h3>
            <p className="text-slate-400 text-sm">Real-time speech recognition & synthesis</p>
          </div>
          
          <div className="card text-center group hover:scale-105 ai-glow" style={{ animationDelay: '0.1s' }}>
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Smart Challenges</h3>
            <p className="text-slate-400 text-sm">AI asks probing questions in real-time</p>
          </div>
          
          <div className="card text-center group hover:scale-105 ai-glow" style={{ animationDelay: '0.2s' }}>
            <div className="bg-gradient-to-br from-pink-500 to-pink-700 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Precision Scoring</h3>
            <p className="text-slate-400 text-sm">Advanced analytics on your performance</p>
          </div>
          
          <div className="card text-center group hover:scale-105 ai-glow" style={{ animationDelay: '0.3s' }}>
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Track Progress</h3>
            <p className="text-slate-400 text-sm">Detailed insights & improvement metrics</p>
          </div>
        </div>

        {/* Setup Form */}
        <div className="card max-w-3xl mx-auto ai-glow">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold gradient-text">Start Your Practice Session</h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Ready to Begin</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium mb-3 text-slate-300 flex items-center gap-2">
                <span>Your Name</span>
                <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-6 py-4 glass-effect rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 text-lg"
                placeholder="Enter your name"
              />
            </div>

            {/* Topic Selection */}
            <div>
              <label className="block text-sm font-medium mb-3 text-slate-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Choose Discussion Topic</span>
                <span className="text-purple-400">*</span>
              </label>
              <div className="grid gap-3 max-h-96 overflow-y-auto pr-2">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`p-5 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedTopic?.id === topic.id
                        ? 'bg-gradient-to-r from-purple-600/40 to-blue-600/40 border-2 border-purple-500 shadow-lg shadow-purple-500/30'
                        : 'glass-effect hover:bg-white/10 border border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-white text-lg">{topic.title}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        topic.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        topic.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {topic.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                      {topic.category}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startGD}
              disabled={loading || !selectedTopic || !userName.trim()}
              className="w-full btn-primary py-5 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Initializing AI...</span>
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <span>Launch GD Practice</span>
                  <Sparkles className="w-5 h-5 group-hover:scale-125 transition-transform" />
                </>
              )}
            </button>
            
            <div className="glass-effect p-4 rounded-xl border border-purple-500/30">
              <p className="text-sm text-slate-300 text-center flex items-center justify-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>AI Moderator will challenge your thinking with probing questions & counterpoints</span>
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/leaderboard')}
            className="btn-secondary text-lg px-8 py-3 flex items-center gap-3 mx-auto"
          >
            <Trophy className="w-5 h-5" />
            <span>View Leaderboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
