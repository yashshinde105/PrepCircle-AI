import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, TrendingUp, AlertCircle, Home, BarChart3, Sparkles, Trophy, Target, CheckCircle, BookOpen, Lightbulb, Clock, MessageCircle } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { GlowingEffect } from '../components/ui/glowing-effect';

interface Round {
  roundNumber: number;
  userArgument: string;
  userScore: number;
  aiArgument: string;
  ai2Argument?: string;
  detailedScores?: Record<string, number>;
  timestamp?: string | Date;
}

interface FinalReport {
  overall_score: number;
  category_scores: Record<string, number>;
  category_weights?: Record<string, number>;
  summary: string;
  strengths: string[];
  improvements: string[];
  practice_plan: string[];
  contributions_evaluated?: number;
  evidence_note?: string;
}

interface GDSummary {
  topic: string;
  rounds: Round[];
  userScore: number;
  performance: string;
  averageScore: number;
  finalReport: FinalReport | null;
  durationMinutes?: number;
}

const SCORE_LABELS: Record<string, string> = {
  fluency: 'Fluency',
  topic_relevance: 'Topic Relevance',
  content_reasoning: 'Content & Reasoning',
  clarity_delivery: 'Clarity & Delivery',
  confidence_composure: 'Confidence & Composure',
  examples_application: 'Practical Examples',
  participation: 'Participation',
};

const SCORE_COLORS: Record<string, string> = {
  fluency: 'from-blue-500 to-cyan-500',
  topic_relevance: 'from-emerald-500 to-green-500',
  content_reasoning: 'from-violet-500 to-purple-500',
  clarity_delivery: 'from-cyan-500 to-teal-500',
  confidence_composure: 'from-amber-500 to-orange-500',
  examples_application: 'from-pink-500 to-rose-500',
  participation: 'from-teal-500 to-emerald-500',
};

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
      const finalReport = debate.finalReport || null;

      let performance: string;
      let averageScore: number;

      if (finalReport) {
        // Use the Colab backend's comprehensive report
        const overall = finalReport.overall_score || 0;
        averageScore = Math.round(overall * 10); // Convert 0-10 to display percentage-like
        if (overall >= 8.5) performance = 'Excellent';
        else if (overall >= 7) performance = 'Good';
        else if (overall >= 5) performance = 'Average';
        else performance = 'Needs Improvement';
      } else {
        // Fallback to local calculation
        const avgScore = debate.rounds.length > 0 ? debate.userScore / debate.rounds.length : 0;
        averageScore = Math.round(avgScore);
        if (avgScore >= 80) performance = 'Excellent';
        else if (avgScore >= 70) performance = 'Good';
        else if (avgScore >= 60) performance = 'Average';
        else performance = 'Needs Improvement';
      }

      setSummary({
        topic: debate.topic,
        rounds: debate.rounds,
        userScore: debate.userScore,
        performance,
        averageScore,
        finalReport,
        durationMinutes: debate.durationMinutes || 10,
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

  const getPerformanceIcon = (perf: string) => {
    if (perf === 'Excellent') return '🌟';
    if (perf === 'Good') return '👍';
    if (perf === 'Average') return '💪';
    return '📚';
  };

  const report = summary.finalReport;
  const contributionScores = summary.rounds.map((item) => item.userScore);
  const trendPoints = contributionScores.map((score, index) => {
    const x = contributionScores.length === 1 ? 300 : 42 + (516 * index) / (contributionScores.length - 1);
    const y = 180 - (Math.max(0, Math.min(100, score)) / 100) * 150;
    return { x, y, score };
  });
  const trendPath = trendPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const trendArea = trendPoints.length
    ? `${trendPath} L ${trendPoints[trendPoints.length - 1].x} 190 L ${trendPoints[0].x} 190 Z`
    : '';
  const categoryScores = report?.category_scores || summary.rounds.reduce<Record<string, number>>((totals, item) => {
    Object.entries(item.detailedScores || {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined) totals[key] = (totals[key] || 0) + value;
    });
    return totals;
  }, {});
  if (!report?.category_scores && summary.rounds.length) {
    Object.keys(categoryScores).forEach((key) => {
      const count = summary.rounds.filter((item) => item.detailedScores?.[key] !== undefined).length;
      if (count) categoryScores[key] = categoryScores[key] / count;
    });
  }
  const scoreProgress = Math.max(0, Math.min(100, summary.averageScore));

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Performance Hero Section */}
          <div className="card border border-purple-500/20 text-center mb-10 animate-scale-in overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            
            <div className="grid lg:grid-cols-[220px_1fr] items-center gap-6 lg:gap-10 text-left mb-9">
              <div className="flex flex-col items-center">
                <div className="relative w-44 h-44">
                  <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90" role="img" aria-label={`Overall score ${summary.averageScore} out of 100`}>
                    <circle cx="80" cy="80" r="66" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="11" />
                    <circle
                      cx="80" cy="80" r="66" fill="none" stroke="url(#scoreRing)" strokeWidth="11" strokeLinecap="round"
                      strokeDasharray={`${(scoreProgress / 100) * 414.7} 414.7`}
                    />
                    <defs>
                      <linearGradient id="scoreRing" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#a78bfa" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-white">{summary.averageScore}</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-500">out of 100</span>
                  </div>
                </div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                  <span>{getPerformanceIcon(summary.performance)}</span>{summary.performance} performance
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-violet-300 mb-3">
                  <Sparkles className="w-4 h-4" /> Session debrief
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Your discussion, <span className="gradient-text">in focus</span></h1>
                <p className="text-base md:text-lg text-slate-400 max-w-3xl">
                  {report?.summary || (summary.performance === 'Excellent'
                    ? "Strong work. Your ideas came through clearly and made an impact."
                    : summary.performance === 'Good'
                      ? "A solid discussion. Review the profile below to sharpen your next contribution."
                      : summary.performance === 'Average'
                        ? "You have a useful foundation. The analysis below highlights practical next steps."
                        : "Every practice makes the next discussion easier. Start with the insights below.")}
                </p>
                <div className="grid sm:grid-cols-3 gap-3 mt-6">
                  {[
                    { label: 'Your contributions', value: report?.contributions_evaluated ?? summary.rounds.length, icon: MessageCircle },
                    { label: 'Session length', value: `${summary.durationMinutes || 10} min`, icon: Clock },
                    { label: 'Score trend', value: contributionScores.length > 1 && contributionScores[contributionScores.length - 1] > contributionScores[0] ? 'Improving' : 'In progress', icon: TrendingUp },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                      <stat.icon className="w-4 h-4 text-cyan-300 mb-2" />
                      <div className="text-lg font-semibold text-white">{stat.value}</div>
                      <div className="text-[11px] text-slate-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {[
                { label: 'Average contribution score', value: `${summary.averageScore}/100`, icon: Target },
                { label: 'Highest contribution', value: contributionScores.length ? `${Math.max(...contributionScores)}/100` : '—', icon: Trophy },
                { label: 'Category insights', value: Object.keys(categoryScores).length || '—', icon: BarChart3 },
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

          {/* Visual performance analysis */}
          <div className="grid xl:grid-cols-[1.25fr_0.75fr] gap-5 mb-8">
            <section className="card border border-cyan-500/15 bg-gradient-to-br from-[#101827] via-[#10121f] to-[#171126] animate-slide-up" aria-labelledby="progress-heading">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-2">Progress picture</p>
                  <h2 id="progress-heading" className="text-xl font-semibold text-white">Contribution score trend</h2>
                  <p className="text-sm text-slate-500 mt-1">See how your scores moved through the discussion.</p>
                </div>
                <div className="rounded-xl bg-cyan-400/10 border border-cyan-300/15 p-3 text-cyan-200">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              {trendPoints.length > 0 ? (
                <>
                  <div className="rounded-2xl border border-white/5 bg-black/20 p-3 sm:p-5">
                    <svg viewBox="0 0 600 210" className="w-full h-48 sm:h-56 overflow-visible" role="img" aria-label="Line chart of your contribution scores from 0 to 100">
                      <defs>
                        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.28" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.01" />
                        </linearGradient>
                        <linearGradient id="trendStroke" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#a78bfa" />
                        </linearGradient>
                      </defs>
                      {[30, 67.5, 105, 142.5, 180].map((y, index) => (
                        <g key={y}>
                          <line x1="42" y1={y} x2="558" y2={y} stroke="rgba(148,163,184,.13)" strokeDasharray="4 6" />
                          <text x="30" y={y + 4} textAnchor="end" fill="#64748b" fontSize="10">{100 - index * 25}</text>
                        </g>
                      ))}
                      <path d={trendArea} fill="url(#trendFill)" />
                      <path d={trendPath} fill="none" stroke="url(#trendStroke)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                      {trendPoints.map((point, index) => (
                        <g key={`${index}-${point.score}`}>
                          <circle cx={point.x} cy={point.y} r="8" fill="#101827" stroke="#67e8f9" strokeWidth="3" />
                          <title>{`${point.score} out of 100`}</title>
                        </g>
                      ))}
                    </svg>
                    <div className="flex justify-between text-[11px] text-slate-500 px-5 -mt-1">
                      <span>Earlier</span><span>Most recent</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <div className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                      <span className="block text-[10px] uppercase tracking-wider text-slate-500">Starting score</span>
                      <span className="text-lg font-semibold text-white">{contributionScores[0]}/100</span>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                      <span className="block text-[10px] uppercase tracking-wider text-slate-500">Latest score</span>
                      <span className="text-lg font-semibold text-cyan-200">{contributionScores[contributionScores.length - 1]}/100</span>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                      <span className="block text-[10px] uppercase tracking-wider text-slate-500">Change</span>
                      <span className={`text-lg font-semibold ${contributionScores[contributionScores.length - 1] >= contributionScores[0] ? 'text-emerald-300' : 'text-amber-300'}`}>
                        {contributionScores[contributionScores.length - 1] - contributionScores[0] > 0 ? '+' : ''}{contributionScores[contributionScores.length - 1] - contributionScores[0]}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="rounded-xl border border-white/5 bg-white/[0.02] p-5 text-sm text-slate-400">There are no scored contributions to plot yet.</p>
              )}
            </section>

            <section className="card border border-violet-500/15 bg-gradient-to-br from-[#171126] to-[#10121f] animate-slide-up" aria-labelledby="skills-heading">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-violet-300 mb-2">Communication profile</p>
                  <h2 id="skills-heading" className="text-xl font-semibold text-white">Skill balance</h2>
                  <p className="text-sm text-slate-500 mt-1">A closer look at the habits behind your score.</p>
                </div>
                <BarChart3 className="w-5 h-5 text-violet-300 mt-1" />
              </div>
              {Object.entries(categoryScores).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(categoryScores).map(([key, value]) => {
                    const score = Math.max(0, Math.min(10, Number(value) || 0));
                    const gradient = SCORE_COLORS[key] || 'from-slate-500 to-slate-600';
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <span className="text-xs text-slate-300">{SCORE_LABELS[key] || key.replace(/_/g, ' ')}</span>
                          <span className="text-xs font-semibold text-white">{score.toFixed(1)}<span className="text-slate-500"> / 10</span></span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000`} style={{ width: `${score * 10}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-xl border border-white/5 bg-white/[0.02] p-5 text-sm text-slate-400">Detailed skill scores are not available for this session.</p>
              )}
            </section>
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
              {summary.rounds.length} contribution{summary.rounds.length !== 1 ? 's' : ''} reviewed · Bob and Jannet responded to each one
            </p>
          </div>

          {/* Contribution Analysis */}
          <div className="card border border-purple-500/20 mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Conversation Highlights</h2>
            </div>
            
            <div className="space-y-6">
              {summary.rounds.map((round, index) => (
                <div 
                  key={`${round.timestamp || 'contribution'}-${index}`} 
                  className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${(index + 3) * 100}ms` }}
                >
                  {/* Contribution Header */}
                  <div className="flex items-center justify-between p-4 bg-white/[0.03] border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold text-white">
                        <MessageCircle className="w-4 h-4" />
                      </span>
                      <span className="font-semibold text-white">Your contribution</span>
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

                      {/* Per-round detailed scores if available */}
                      {round.detailedScores && (
                        <div className="mt-3 pt-3 border-t border-blue-500/10">
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(round.detailedScores).map(([key, val]) => {
                              if (val === null || val === undefined) return null;
                              const label = SCORE_LABELS[key] || key.replace(/_/g, ' ');
                              return (
                                <span key={key} className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                                  {label}: <span className="text-white font-medium">{val}/10</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* AI Challenge */}
                    <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="font-medium text-purple-400 text-sm">Bob’s response</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed italic">{round.aiArgument}</p>
                    </div>
                    {round.ai2Argument && (
                      <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/10">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-pink-400" />
                          <span className="font-medium text-pink-400 text-sm">Jannet’s response</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed italic">{round.ai2Argument}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Section — Uses Colab's final report if available */}
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
                  {report?.strengths && report.strengths.length > 0 ? (
                    report.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))
                  ) : (
                    <>
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
                          Good stamina - maintained engagement throughout the session
                        </li>
                      )}
                    </>
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
                  {report?.improvements && report.improvements.length > 0 ? (
                    report.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                        <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        {imp}
                      </li>
                    ))
                  ) : (
                    <>
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
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Practice Plan from Colab */}
            {report?.practice_plan && report.practice_plan.length > 0 && (
              <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-blue-400">Recommended Practice Plan</h3>
                </div>
                <ol className="space-y-2">
                  {report.practice_plan.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                      <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            
            {/* Overall AI Feedback */}
            <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h4 className="font-semibold text-purple-400">AI Overall Assessment</h4>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {report?.summary || (
                  summary.averageScore >= 80
                    ? 'Outstanding performance! You demonstrated strong critical thinking, clear communication, and excellent use of examples. You\'re ready for a live group discussion.'
                    : summary.averageScore >= 70
                      ? 'Good job! You showed solid understanding and decent communication. Focus on adding more concrete examples and addressing counterpoints to reach the next level.'
                      : summary.averageScore >= 60
                        ? 'Average performance. You have the basics down but need to work on logical reasoning, providing evidence, and structuring your arguments better.'
                        : 'Keep practicing! Work on organizing your thoughts, providing specific examples, and speaking clearly. Regular practice will help you improve significantly.'
                )}
              </p>
              {report?.evidence_note && (
                <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-purple-500/10 italic">
                  {report.evidence_note}
                </p>
              )}
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
