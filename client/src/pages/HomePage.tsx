import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Trophy, BookOpen, Sparkles, Brain, Zap, Target, ArrowRight, Search, X } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { HeroSection } from '../components/ui/hero-section-dark';

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
  const [topicSearch, setTopicSearch] = useState('');
  const [userName, setUserName] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(10);
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
        userName,
        durationMinutes,
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

  const filteredTopics = topics.filter((topic) =>
    `${topic.title} ${topic.category} ${topic.difficulty}`
      .toLowerCase()
      .includes(topicSearch.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <HeroSection
        title="Group discussion interview practice"
        subtitle={{
          regular: "Make your point. ",
          gradient: "Own the discussion."
        }}
        description="Practice interview group discussions with Bob and Jannet. Build your argument, respond to other viewpoints, and get feedback after each session."
        ctaText="Set up a practice session"
        onCtaClick={scrollToForm}
      />

      {/* Features and Form Section */}
      <div className="py-10 sm:py-16 lg:py-20 px-3 sm:px-4 lg:px-8 relative" ref={formSectionRef}>
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              <span className="text-xs sm:text-sm font-medium text-[#c3e879]">A little practice goes a long way</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
              Practice that feels <span className="gradient-text">like practice</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
              Get comfortable speaking up, responding to different viewpoints, and making your ideas easy to follow.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-10 sm:mb-16 lg:mb-20">
            {[
              { icon: Mic, title: "Speak naturally", desc: "Use your voice or type a response.", color: "from-[#c3e879] to-[#93b84f]" },
              { icon: Brain, title: "Hear other views", desc: "Bob and Jannet bring different angles.", color: "from-[#89c9b2] to-[#579d85]" },
              { icon: Target, title: "See what works", desc: "Get clear scores with helpful context.", color: "from-[#91b9cf] to-[#5a8da6]" },
              { icon: Trophy, title: "Build a habit", desc: "Review sessions and notice progress.", color: "from-[#ddc485] to-[#b3995d]" },
            ].map((feature, index) => (
              <div key={index} className="group rounded-xl border border-white/[0.08] bg-[#131918] p-4 sm:p-6 transition-colors hover:bg-[#171f1b] animate-slide-up" style={{ animationDelay: `${index * 80}ms` }}>
                  <div className={`bg-gradient-to-br ${feature.color} w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4`}>
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold mb-1.5 text-white">{feature.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Setup Form */}
          <div className="relative animate-scale-in max-w-4xl mx-auto">
            {/* Glow effect behind form - hidden on mobile for performance */}
                <div className="absolute -inset-px rounded-2xl border border-[#c3e879]/10"></div>

            <div className="relative overflow-hidden bg-[linear-gradient(145deg,#111722_0%,#0c1118_55%,#10151c_100%)] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 border border-white/[0.09] shadow-[0_28px_90px_rgba(0,0,0,.38)]">
              <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-[#8ee5d0]/[0.06] blur-3xl" />
              {/* Form Header */}
              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between mb-5 sm:mb-8 gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-white/[0.08]">
                <div className="relative">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">Set up a practice session</h2>
                  <p className="text-slate-500 text-xs sm:text-sm">Choose a topic and how long you’d like to practice.</p>
                </div>
                <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 self-start">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] sm:text-xs font-semibold text-[#c3e879] uppercase tracking-wide">Session setup</span>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Name Input */}
                <div>
                  <label htmlFor="user-name" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-slate-300">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="user-name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    maxLength={60}
                    autoComplete="name"
                    className="w-full px-4 py-3 bg-[#0d1210] border border-white/10 rounded-lg text-white text-sm sm:text-base placeholder-slate-500 focus:outline-none focus:border-[#c3e879]/50 focus:ring-2 focus:ring-[#c3e879]/15 transition-all"
                    placeholder="e.g. Aditi Sharma"
                  />
                </div>

                {/* Session Duration */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 text-slate-300">
                    GD Session Length
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 15].map((minutes) => (
                      <button
                        key={minutes}
                        type="button"
                        onClick={() => setDurationMinutes(minutes)}
                        aria-pressed={durationMinutes === minutes}
                        className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${durationMinutes === minutes
                          ? 'border-[#c3e879]/50 bg-[#c3e879]/10 text-[#e8f3d3]'
                          : 'border-white/10 bg-[#111715] text-slate-400 hover:border-white/25 hover:text-white'
                          }`}
                      >
                        {minutes} minutes
                      </button>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500">The session ends automatically and opens your feedback when time is up.</p>
                </div>

                {/* Topic Selection */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-slate-300 flex items-center gap-2">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-[#c3e879]" />
                    Choose Discussion Topic <span className="text-rose-500">*</span>
                  </label>
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="group relative w-full sm:max-w-sm">
                      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-[#8ee5d0]" />
                      <input
                        type="search"
                        value={topicSearch}
                        onChange={(event) => setTopicSearch(event.target.value)}
                        placeholder="Search topics or categories"
                        aria-label="Search discussion topics"
                        className="peer h-11 w-full rounded-xl border border-white/[0.09] bg-[#090e14]/80 pl-10 pr-10 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 hover:border-white/[0.16] focus:border-[#8ee5d0]/45 focus:ring-4 focus:ring-[#8ee5d0]/[0.07] [&::-webkit-search-cancel-button]:hidden"
                      />
                      {topicSearch && (
                        <button
                          type="button"
                          onClick={() => setTopicSearch('')}
                          aria-label="Clear topic search"
                          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8ee5d0]"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{filteredTopics.length} {filteredTopics.length === 1 ? 'topic' : 'topics'}</span>
                  </div>
                  <div className="space-y-2.5 max-h-[250px] sm:max-h-[320px] overflow-y-auto pr-1">
                    {filteredTopics.map((topic) => (
                      <button
                        type="button"
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic)}
                        aria-pressed={selectedTopic?.id === topic.id}
                        className={`w-full text-left flex items-center justify-between p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-200 ${selectedTopic?.id === topic.id
                          ? 'bg-[#8ee5d0]/[0.08] border border-[#8ee5d0]/45 shadow-[0_0_0_1px_rgba(142,229,208,.08),0_8px_28px_rgba(0,0,0,.16)]'
                          : 'bg-white/[0.025] border border-white/[0.07] hover:bg-white/[0.045] hover:border-white/[0.16]'
                          }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                          {/* Radio Circle */}
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedTopic?.id === topic.id
                            ? 'border-[#8ee5d0] bg-[#8ee5d0]'
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
                      </button>
                    ))}
                    {filteredTopics.length === 0 && (
                      <div className="rounded-xl border border-dashed border-white/[0.12] px-4 py-10 text-center">
                        <Search className="mx-auto mb-2 h-5 w-5 text-slate-500" />
                        <p className="text-sm font-medium text-slate-300">No topics match “{topicSearch}”</p>
                        <p className="mt-1 text-xs text-slate-500">Try another topic or category.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={startGD}
                  disabled={loading || !selectedTopic || !userName.trim()}
                  className="w-full bg-[#c3e879] hover:bg-[#d1ef93] disabled:bg-[#384136] text-[#17200d] font-semibold py-3.5 sm:py-4 px-4 sm:px-6 rounded-lg transition-colors duration-200 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
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
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-[#c3e879] flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    <span className="text-[#c3e879] font-medium">Bob and Jannet</span> will respond to your ideas with different viewpoints and follow-up questions.
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
