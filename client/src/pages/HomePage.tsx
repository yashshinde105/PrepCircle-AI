import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Trophy, BookOpen, Sparkles, Brain, Zap, Target, ArrowRight } from 'lucide-react';
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

  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Hard':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
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
        description="Practice real-time Group Discussions with intelligent AI participants. Get instant feedback, improve your communication skills, and ace your next interview GD round."
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
      <div className="py-10 sm:py-16 lg:py-20 px-3 sm:px-4 lg:px-8 relative" ref={formSectionRef}>
        {/* Background decorations - hidden on mobile for performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
          <div className="absolute top-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-violet-600/10 rounded-full blur-[80px] sm:blur-[100px]"></div>
          <div className="absolute bottom-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-indigo-600/10 rounded-full blur-[80px] sm:blur-[100px]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              <span className="text-xs sm:text-sm font-medium text-purple-300">Why Choose PrepCircle AI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
              Everything You Need to <span className="gradient-text">Excel</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
              Our AI-powered platform provides comprehensive tools to prepare for group discussions
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-10 sm:mb-16 lg:mb-20">
            {[
              { icon: Mic, title: "Voice AI", desc: "Real-time speech recognition & natural synthesis", color: "from-violet-500 to-purple-600" },
              { icon: Brain, title: "Smart Challenges", desc: "AI asks probing questions in real-time", color: "from-blue-500 to-cyan-600" },
              { icon: Target, title: "Precision Scoring", desc: "Detailed analytics on every response", color: "from-emerald-500 to-teal-600" },
              { icon: Trophy, title: "Track Progress", desc: "Detailed insights & improvement metrics", color: "from-amber-500 to-orange-600" },
            ].map((feature, index) => (
              <div key={index} className="relative rounded-xl sm:rounded-2xl border border-white/5 p-1 sm:p-1.5 bg-white/[0.02] group animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                <div className="bg-[#0f0f1a]/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 text-center h-full group-hover:bg-[#12122a]/80 transition-colors duration-300">
                  <div className={`bg-gradient-to-br ${feature.color} w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2 text-white">{feature.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed hidden sm:block">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Setup Form */}
          <div className="relative animate-scale-in max-w-4xl mx-auto">
            {/* Glow effect behind form - hidden on mobile for performance */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/30 via-purple-600/30 to-indigo-600/30 rounded-2xl sm:rounded-3xl blur-xl opacity-70 hidden sm:block"></div>
            
            <div className="relative bg-[#0d0d1a] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 border border-white/10 shadow-2xl">
              {/* Form Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 sm:mb-8 gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-white/10">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">Start Your Practice Session</h2>
                  <p className="text-slate-500 text-xs sm:text-sm">Select a topic and begin your AI-powered GD practice</p>
                </div>
                <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 self-start">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 uppercase tracking-wide">AI Ready</span>
                </div>
              </div>
            
              <div className="space-y-4 sm:space-y-6">
                {/* Name Input */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-slate-300">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-[#1a1a2e] border border-white/10 rounded-lg sm:rounded-xl text-white text-sm sm:text-base placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="Enter your name to get started"
                  />
                </div>

                {/* Topic Selection */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-slate-300 flex items-center gap-2">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                    Choose Discussion Topic <span className="text-rose-500">*</span>
                  </label>
                  <div className="space-y-2 max-h-[250px] sm:max-h-[320px] overflow-y-auto pr-1">
                    {topics.map((topic) => (
                      <div
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic)}
                        className={`flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedTopic?.id === topic.id
                            ? 'bg-purple-500/20 border-2 border-purple-500'
                            : 'bg-[#1a1a2e] border border-transparent hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                          {/* Radio Circle */}
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            selectedTopic?.id === topic.id
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-slate-600'
                          }`}>
                            {selectedTopic?.id === topic.id && (
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          {/* Topic Info */}
                          <div className="min-w-0">
                            <h3 className="font-medium text-white text-sm sm:text-[15px] truncate">{topic.title}</h3>
                            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{topic.category}</p>
                          </div>
                        </div>
                        {/* Difficulty Badge */}
                        <span className={`text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium flex-shrink-0 ml-2 ${getDifficultyStyles(topic.difficulty)}`}>
                          {topic.difficulty}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={startGD}
                  disabled={loading || !selectedTopic || !userName.trim()}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:shadow-none text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Initializing AI Session...</span>
                      <span className="sm:hidden">Starting...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Launch GD Practice</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </>
                  )}
                </button>
                
                {/* Info Box */}
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-[#1a1a2e]/50 border border-white/5">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    <span className="text-purple-400 font-medium">AI Moderator</span> will challenge your thinking with probing questions, counterpoints, and real-time feedback
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center mt-8 sm:mt-12 lg:mt-16">
            <button
              onClick={() => navigate('/leaderboard')}
              className="btn-secondary text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3.5 flex items-center gap-2 sm:gap-3 mx-auto group"
            >
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              <span>View Leaderboard</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
