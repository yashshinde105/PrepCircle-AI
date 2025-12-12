import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, Trophy, Target, TrendingUp, MessageCircle, ArrowRight, Search, Filter, Trash2, ChevronDown, SortAsc, SortDesc } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { GlowingEffect } from '../components/ui/glowing-effect';

interface Round {
  roundNumber: number;
  userArgument: string;
  userScore: number;
  aiArgument: string;
}

interface DebateSession {
  id: string;
  topic: string;
  userStance: string;
  userName: string;
  rounds: Round[];
  userScore: number;
  status: string;
  createdAt: string;
}

function History() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<DebateSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'active'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'topic' | 'score'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/debates/history');
      setSessions(response.data.debates || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceLevel = (avgScore: number) => {
    if (avgScore >= 80) return { label: 'Excellent', color: 'from-emerald-400 to-green-500', bg: 'bg-emerald-500/20', text: 'text-emerald-400' };
    if (avgScore >= 70) return { label: 'Good', color: 'from-blue-400 to-cyan-500', bg: 'bg-blue-500/20', text: 'text-blue-400' };
    if (avgScore >= 60) return { label: 'Average', color: 'from-amber-400 to-orange-500', bg: 'bg-amber-500/20', text: 'text-amber-400' };
    return { label: 'Needs Work', color: 'from-orange-400 to-rose-500', bg: 'bg-orange-500/20', text: 'text-orange-400' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get unique topics for grouping
  const uniqueTopics = useMemo(() => {
    const topics = [...new Set(sessions.map(s => s.topic))];
    return topics.sort();
  }, [sessions]);

  // Date filter helper
  const isWithinDateRange = (dateString: string, range: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (range) {
      case 'today':
        return date >= today;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date >= weekAgo;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return date >= monthAgo;
      default:
        return true;
    }
  };

  const filteredSessions = useMemo(() => {
    return sessions
      .filter(session => {
        const matchesSearch = session.topic.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || session.status === filterStatus;
        const matchesDate = isWithinDateRange(session.createdAt, dateFilter);
        return matchesSearch && matchesFilter && matchesDate;
      })
      .sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'date':
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            break;
          case 'topic':
            comparison = a.topic.localeCompare(b.topic);
            break;
          case 'score':
            const avgA = a.rounds.length > 0 ? a.userScore / a.rounds.length : 0;
            const avgB = b.rounds.length > 0 ? b.userScore / b.rounds.length : 0;
            comparison = avgA - avgB;
            break;
        }
        
        return sortOrder === 'desc' ? -comparison : comparison;
      });
  }, [sessions, searchTerm, filterStatus, dateFilter, sortBy, sortOrder]);

  // Group sessions by date or topic
  const groupedSessions = useMemo(() => {
    if (sortBy === 'topic') {
      const groups: { [key: string]: DebateSession[] } = {};
      filteredSessions.forEach(session => {
        if (!groups[session.topic]) {
          groups[session.topic] = [];
        }
        groups[session.topic].push(session);
      });
      return groups;
    } else {
      const groups: { [key: string]: DebateSession[] } = {};
      filteredSessions.forEach(session => {
        const date = new Date(session.createdAt);
        const dateKey = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(session);
      });
      return groups;
    }
  }, [filteredSessions, sortBy]);

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const averageScore = sessions.length > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + (s.userScore / Math.max(s.rounds.length, 1)), 0) / sessions.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-purple-500/30 rounded-full mx-auto mb-6"></div>
              <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 -translate-x-1/2"></div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Loading History</h2>
            <p className="text-slate-400">Fetching your GD sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 mb-6 shadow-lg shadow-violet-500/30">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="gradient-text">Session History</span>
            </h1>
            <p className="text-slate-400 text-lg">Review your past GD practice sessions and track your progress</p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { icon: MessageCircle, label: 'Total Sessions', value: totalSessions.toString() },
              { icon: Trophy, label: 'Completed', value: completedSessions.toString() },
              { icon: TrendingUp, label: 'Avg Score', value: `${averageScore}%` },
            ].map((stat, index) => (
              <div key={index} className="glass-effect rounded-xl p-4 text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <stat.icon className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Search and Sort Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 transition-colors min-w-[160px]"
                >
                  {sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                  <span className="capitalize">By {sortBy}</span>
                  <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showSortDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e] border border-white/10 rounded-xl overflow-hidden shadow-xl z-20">
                    {(['date', 'topic', 'score'] as const).map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          if (sortBy === option) {
                            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                          } else {
                            setSortBy(option);
                            setSortOrder('desc');
                          }
                          setShowSortDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${
                          sortBy === option ? 'text-purple-400' : 'text-slate-300'
                        }`}
                      >
                        <span className="capitalize">By {option}</span>
                        {sortBy === option && (
                          <span className="text-xs text-slate-500">
                            {sortOrder === 'desc' ? '↓' : '↑'}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Filter Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Date Filter */}
              <div className="flex gap-2 flex-wrap">
                <span className="flex items-center gap-1.5 text-sm text-slate-400 mr-2">
                  <Calendar className="w-4 h-4" />
                  Date:
                </span>
                {(['all', 'today', 'week', 'month'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateFilter(range)}
                    className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all capitalize ${
                      dateFilter === range
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {range === 'all' ? 'All Time' : range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : 'Today'}
                  </button>
                ))}
              </div>
              
              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap sm:ml-auto">
                <span className="flex items-center gap-1.5 text-sm text-slate-400 mr-2">
                  <Filter className="w-4 h-4" />
                  Status:
                </span>
                {(['all', 'completed', 'active'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all capitalize ${
                      filterStatus === status
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sessions List */}
          {filteredSessions.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-6">
                <MessageCircle className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Sessions Found</h3>
              <p className="text-slate-400 mb-6">
                {sessions.length === 0 
                  ? "You haven't practiced any GD sessions yet. Start your first one!" 
                  : "No sessions match your search criteria."}
              </p>
              {sessions.length === 0 && (
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 
                           hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl 
                           shadow-lg shadow-purple-500/25 transition-all"
                >
                  Start Practice
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedSessions).map(([groupKey, groupSessions], groupIndex) => (
                <div key={groupKey} className="animate-fade-in" style={{ animationDelay: `${groupIndex * 100}ms` }}>
                  {/* Group Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      sortBy === 'topic' ? 'bg-indigo-500/20' : 'bg-violet-500/20'
                    }`}>
                      {sortBy === 'topic' ? (
                        <Target className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <Calendar className="w-4 h-4 text-violet-400" />
                      )}
                    </div>
                    <h2 className="text-lg font-semibold text-white">{groupKey}</h2>
                    <span className="text-sm text-slate-500">({groupSessions.length} session{groupSessions.length > 1 ? 's' : ''})</span>
                  </div>
                  
                  {/* Group Sessions */}
                  <div className="space-y-3 pl-2 border-l-2 border-white/5 ml-4">
                    {groupSessions.map((session, index) => {
                      const avgScore = session.rounds.length > 0 ? Math.round(session.userScore / session.rounds.length) : 0;
                      const performance = getPerformanceLevel(avgScore);
                      
                      return (
                        <div
                          key={session.id}
                          className="relative rounded-2xl border border-white/5 p-1 bg-white/[0.01] animate-slide-up cursor-pointer group ml-4"
                          style={{ animationDelay: `${index * 50}ms` }}
                          onClick={() => navigate(`/summary/${session.id}`)}
                        >
                          <GlowingEffect
                            spread={40}
                            glow={true}
                            disabled={false}
                            proximity={60}
                            inactiveZone={0.01}
                            borderWidth={1.5}
                          />
                          <div className="glass-effect rounded-xl p-5 transition-all group-hover:bg-white/[0.03]">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              {/* Left Section - Topic & Meta */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${performance.bg} ${performance.text}`}>
                                    {performance.label}
                                  </span>
                                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                                    session.status === 'completed' 
                                      ? 'bg-emerald-500/20 text-emerald-400' 
                                      : 'bg-amber-500/20 text-amber-400'
                                  }`}>
                                    {session.status === 'completed' ? 'Completed' : 'In Progress'}
                                  </span>
                                </div>
                                {sortBy !== 'topic' && (
                                  <h3 className="text-lg font-semibold text-white mb-2 truncate group-hover:text-purple-300 transition-colors">
                                    {session.topic}
                                  </h3>
                                )}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                  {sortBy === 'topic' && (
                                    <span className="flex items-center gap-1.5">
                                      <Calendar className="w-4 h-4" />
                                      {formatDate(session.createdAt)}
                                    </span>
                                  )}
                                  {sortBy !== 'topic' && (
                                    <span className="flex items-center gap-1.5">
                                      <Clock className="w-4 h-4" />
                                      {new Date(session.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1.5">
                                    <MessageCircle className="w-4 h-4" />
                                    {session.rounds.length} rounds
                                  </span>
                                  <span className="flex items-center gap-1.5 capitalize">
                                    <Target className="w-4 h-4" />
                                    {session.userStance} stance
                                  </span>
                                </div>
                              </div>

                              {/* Right Section - Score & Action */}
                              <div className="flex items-center gap-6">
                                <div className="text-center">
                                  <div className={`text-3xl font-bold bg-gradient-to-r ${performance.color} bg-clip-text text-transparent`}>
                                    {avgScore}%
                                  </div>
                                  <div className="text-xs text-slate-500">Avg Score</div>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
