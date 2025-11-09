import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Trophy, BookOpen, Sparkles, Brain, Zap, Target } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { HeroSection } from '../components/ui/hero-section-dark';
import { GlowingEffect } from '../components/ui/glowing-effect';

interface Topic {
  id: number;
  title: string;
  category: string;
  difficulty: string;
}

function HomePage() {
  const [topics, setTopics] = useState<Topic[]>([
    { id: 1, title: "Should AI replace human jobs?", category: "Technology", difficulty: "Medium" },
    { id: 2, title: "Is remote work better than office work?", category: "Business", difficulty: "Easy" },
    { id: 3, title: "Should social media be regulated?", category: "Society", difficulty: "Medium" },
    { id: 4, title: "Is climate change the biggest threat to humanity?", category: "Environment", difficulty: "Hard" },
    { id: 5, title: "Should college education be free?", category: "Education", difficulty: "Medium" },
    { id: 6, title: "Is work-life balance achievable in modern times?", category: "Lifestyle", difficulty: "Easy" },
  ]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const formSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await axios.get('/api/debates/topics');
      setTopics(response.data.topics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      // Using fallback topics already set in state
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

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection
        title="AI-Powered Interview Preparation"
        subtitle={{
          regular: "Master Group Discussions with ",
          gradient: "Cutting-Edge AI Technology"
        }}
        description="Practice real-time debates with our intelligent AI moderator. Get instant feedback, improve your arguments, and ace your next interview GD round."
        ctaText="Start Practicing Now"
        onCtaClick={scrollToForm}
        gridOptions={{
          angle: 65,
          opacity: 0.3,
          cellSize: 50,
          lightLineColor: "#6366f1",
          darkLineColor: "#4f46e5",
        }}
      />
      
      {/* Features and Form Section */}
      <div className="py-16 px-8 relative" ref={formSectionRef}>
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Features Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="relative rounded-2xl border border-white/5 p-2 bg-white/[0.02]">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={2}
              />
              <div className="bg-[#1a1a2e]/50 backdrop-blur-sm rounded-xl p-6 text-center group hover:scale-105 transition-transform">
              <div className="bg-[#1a1a2e] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 transition-all border border-purple-500/20">
                <Mic className="w-10 h-10 text-purple-400" />
              </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Voice AI</h3>
                <p className="text-slate-400 text-sm">Real-time speech recognition & synthesis</p>
              </div>
            </div>
            
            <div className="relative rounded-2xl border border-white/5 p-2 bg-white/[0.02]">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={2}
              />
              <div className="bg-[#1a1a2e]/50 backdrop-blur-sm rounded-xl p-6 text-center group hover:scale-105 transition-transform">
              <div className="bg-[#1a1a2e] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 transition-all border border-purple-500/20">
                <Brain className="w-10 h-10 text-purple-400" />
              </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Smart Challenges</h3>
                <p className="text-slate-400 text-sm">AI asks probing questions in real-time</p>
              </div>
            </div>
            
            <div className="relative rounded-2xl border border-white/5 p-2 bg-white/[0.02]">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={2}
              />
              <div className="bg-[#1a1a2e]/50 backdrop-blur-sm rounded-xl p-6 text-center group hover:scale-105 transition-transform">
              <div className="bg-[#1a1a2e] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 transition-all border border-purple-500/20">
                <Target className="w-10 h-10 text-purple-400" />
              </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Precision Scoring</h3>
                <p className="text-slate-400 text-sm">Detailed analytics on every response</p>
              </div>
            </div>
            
            <div className="relative rounded-2xl border border-white/5 p-2 bg-white/[0.02]">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={2}
              />
              <div className="bg-[#1a1a2e]/50 backdrop-blur-sm rounded-xl p-6 text-center group hover:scale-105 transition-transform">
              <div className="bg-[#1a1a2e] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 transition-all border border-purple-500/20">
                <Trophy className="w-10 h-10 text-purple-400" />
              </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Track Progress</h3>
                <p className="text-slate-400 text-sm">Detailed insights & improvement metrics</p>
              </div>
            </div>
          </div>

          {/* Setup Form */}
          <div className="glass-effect rounded-xl p-8 border border-purple-500/20 max-w-3xl mx-auto">
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
    </div>
  );
}

export default HomePage;
