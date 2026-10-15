import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, TrendingUp, AlertCircle, Home, BarChart3, Sparkles, Trophy, Target, CheckCircle, BookOpen, Lightbulb, Clock, MessageCircle } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';

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
  content_reasoning: 'from-[#89bda6] to-[#c3e879]',
  clarity_delivery: 'from-cyan-500 to-teal-500',
  confidence_composure: 'from-amber-500 to-orange-500',
  examples_application: 'from-[#c3e879] to-rose-500',
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
    <div className="min-h-screen bg-[#0c1118]">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-[#c3e879]/20 rounded-full mx-auto mb-6"></div>
              <div className="w-20 h-20 border-4 border-[#c3e879] border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 -translate-x-1/2"></div>
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
    <div className="min-h-screen relative isolate overflow-hidden bg-[#0c1118]">
      <Navbar />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_0%,rgba(195,232,121,0.07),transparent_34%),radial-gradient(ellipse_at_90%_24%,rgba(137,189,166,0.06),transparent_30%)]" />
      
      <main className="px-4 pb-16 pt-24 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-white/[0.08] bg-[#111817]/90 p-4 backdrop-blur lg:sticky lg:top-24">
            <div className="mb-4 px-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a9d5bd]">Session report</p>
              <p className="mt-1 truncate text-sm font-medium text-white">{summary.topic}</p>
            </div>
            <nav aria-label="Summary sections" className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
              {[
                { label: 'Overview', href: '#overview', icon: Sparkles },
                { label: 'Performance', href: '#performance', icon: TrendingUp },
                { label: 'Discussion topic', href: '#discussion', icon: Target },
                { label: 'Contributions', href: '#contributions', icon: MessageCircle },
                { label: 'Insights', href: '#insights', icon: Lightbulb },
              ].map((item, index) => (
                <a key={item.href} href={item.href} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${index === 0 ? 'bg-[#c3e879]/10 text-[#d4f49c]' : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'}`}>
                  <item.icon className="h-4 w-4" />{item.label}
                </a>
              ))}
            </nav>
            <div className="mt-5 hidden rounded-xl border border-white/[0.07] bg-black/20 p-3 lg:block">
              <div className="flex items-center justify-between text-xs text-slate-400"><span>Overall score</span><span className="text-[#c3e879]">{summary.performance}</span></div>
              <div className="mt-2 flex items-end gap-1"><span className="text-3xl font-semibold text-white">{summary.averageScore}</span><span className="pb-1 text-xs text-slate-500">/ 100</span></div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#89bda6] to-[#c3e879]" style={{ width: `${scoreProgress}%` }} /></div>
            </div>
          </aside>

          <div className="min-w-0">
          <div id="overview" className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div><p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#a9d5bd]">Your practice · Session summary</p><h1 className="text-2xl font-semibold text-white sm:text-3xl">Discussion overview</h1></div>
            <div className="flex items-center gap-2 text-xs text-slate-500"><span className="h-2 w-2 rounded-full bg-[#c3e879]" />Personal performance report</div>
          </div>
          {/* Performance Hero Section */}
          <div className="card relative mb-6 overflow-hidden border border-white/[0.08] text-left animate-scale-in" aria-label="Session performance overview">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#89bda6] to-transparent"></div>
            
            <div className="mb-6">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#a9d5bd] mb-3">
                  <Sparkles className="w-4 h-4" /> Session debrief
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">Your discussion, <span className="gradient-text">in focus</span></h2>
                <p className="text-sm md:text-base leading-7 text-slate-400">
                  {report?.summary || (summary.performance === 'Excellent'
                    ? "Strong work. Your ideas came through clearly and made an impact."
                    : summary.performance === 'Good'
                      ? "A solid discussion. Review the profile below to sharpen your next contribution."
                      : summary.performance === 'Average'
                        ? "You have a useful foundation. The analysis below highlights practical next steps."
                        : "Every practice makes the next discussion easier. Start with the insights below.")}
                </p>
                </div>
                <div className="flex min-w-[150px] items-center gap-3 rounded-2xl border border-[#c3e879]/20 bg-[#c3e879]/[0.07] px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c3e879]/15 text-lg">{getPerformanceIcon(summary.performance)}</div>
                  <div><div className="text-2xl font-semibold leading-none text-white">{summary.averageScore}<span className="ml-1 text-xs font-normal text-slate-400">/100</span></div><div className="mt-1 text-xs text-[#c3e879]">{summary.performance}</div></div>
                </div>
              </div>
            </div>
            
            {/* Dashboard metric cards */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 border-t border-white/[0.07] pt-5">
              {[
                { label: 'Average score', value: `${summary.averageScore}`, suffix: '/100', icon: Target },
                { label: 'Highest contribution', value: contributionScores.length ? `${Math.max(...contributionScores)}` : '—', suffix: '/100', icon: Trophy },
                { label: 'Contributions reviewed', value: `${report?.contributions_evaluated ?? summary.rounds.length}`, suffix: '', icon: MessageCircle },
                { label: 'Skill dimensions', value: `${Object.keys(categoryScores).length || '—'}`, suffix: '', icon: BarChart3 },
              ].map((stat, index) => (
                <div key={index} className="rounded-xl border border-white/[0.07] bg-[#131918]/80 p-4 animate-slide-up" style={{ animationDelay: `${index * 80}ms` }}>
                  <div className="mb-3 flex items-center justify-between"><span className="text-xs text-slate-400">{stat.label}</span><stat.icon className="h-4 w-4 text-[#c3e879]" /></div>
                  <div className="text-2xl font-semibold text-[#edf3e8]">{stat.value}<span className="ml-1 text-xs font-normal text-slate-500">{stat.suffix}</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual performance analysis */}
          <div id="performance" className="grid scroll-mt-28 xl:grid-cols-[1.25fr_0.75fr] gap-5 mb-8">
            <section className="card border border-white/[0.08] animate-slide-up" aria-labelledby="progress-heading">
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
                          <stop offset="0%" stopColor="#c3e879" stopOpacity="0.24" />
                          <stop offset="100%" stopColor="#89bda6" stopOpacity="0.01" />
                        </linearGradient>
                        <linearGradient id="trendStroke" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#c3e879" />
                          <stop offset="100%" stopColor="#89bda6" />
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
                          <circle cx={point.x} cy={point.y} r="8" fill="#131918" stroke="#c3e879" strokeWidth="3" />
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

            <section className="card border border-white/[0.08] bg-gradient-to-br from-[#131918] to-[#101514] animate-slide-up" aria-labelledby="skills-heading">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#a9d5bd] mb-2">Communication profile</p>
                  <h2 id="skills-heading" className="text-xl font-semibold text-white">Skill balance</h2>
                  <p className="text-sm text-slate-500 mt-1">A closer look at the habits behind your score.</p>
                </div>
                <BarChart3 className="w-5 h-5 text-[#a9d5bd] mt-1" />
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
          <div id="discussion" className="card scroll-mt-28 border border-white/[0.08] mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#89bda6] to-[#c3e879] flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Discussion Topic</h2>
            </div>
            <p className="text-lg text-slate-200 mb-3">{summary.topic}</p>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#c3e879] rounded-full"></span>
              {summary.rounds.length} contribution{summary.rounds.length !== 1 ? 's' : ''} reviewed · Bob and Jannet responded to each one
            </p>
          </div>

          {/* Contribution Analysis */}
          <div id="contributions" className="card scroll-mt-28 border border-white/[0.08] mb-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
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
                      <span className="w-8 h-8 bg-gradient-to-br from-[#89bda6] to-[#c3e879] rounded-lg flex items-center justify-center text-sm font-bold text-white">
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
                    <div className="p-4 rounded-xl bg-[#89bda6]/[0.04] border border-[#89bda6]/15">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-[#a9d5bd]" />
                        <span className="font-medium text-[#a9d5bd] text-sm">Bob’s response</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed italic">{round.aiArgument}</p>
                    </div>
                    {round.ai2Argument && (
                      <div className="p-4 rounded-xl bg-[#c3e879]/[0.04] border border-[#c3e879]/15">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-[#c3e879]" />
                          <span className="font-medium text-[#c3e879] text-sm">Jannet’s response</span>
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
          <div id="insights" className="card scroll-mt-28 border border-white/[0.08] mb-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
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
            <div className="p-5 rounded-xl bg-[#89bda6]/[0.04] border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[#a9d5bd]" />
                <h4 className="font-semibold text-[#a9d5bd]">AI Overall Assessment</h4>
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
                <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-[#89bda6]/15 italic">
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
      </main>
    </div>
  );
}

export default Summary;
