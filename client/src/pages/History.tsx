import { useState, useEffect, useMemo } from 'react';
import { Clock, Calendar, Trophy, MessageCircle, ArrowRight, Search, Filter, ChevronDown, SortAsc, SortDesc, X, User, Users } from 'lucide-react';

const MODEL_API_URL = "https://charges-distribute-reproduction-barbara.trycloudflare.com";

interface Message {
  speaker: string;
  message: string;
  timestamp: string;
}

interface DebateSession {
  session_id: string;
  topic: string;
  participants: string[];
  user_name: string;
  round_number: number;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
  conversation?: Message[];
}

function History() {
  const [sessions, setSessions] = useState<DebateSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'active'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'topic' | 'rounds'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedSession, setSelectedSession] = useState<DebateSession | null>(null);
  const [loadingConversation, setLoadingConversation] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${MODEL_API_URL}/debate/sessions`);
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (sessionId: string) => {
    try {
      setLoadingConversation(true);
      const response = await fetch(`${MODEL_API_URL}/debate/conversation/${sessionId}`);
      const data = await response.json();
      setSelectedSession(data);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoadingConversation(false);
    }
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
        const matchesFilter = filterStatus === 'all' || 
          (filterStatus === 'completed' ? session.is_complete : !session.is_complete);
        const matchesDate = isWithinDateRange(session.created_at, dateFilter);
        return matchesSearch && matchesFilter && matchesDate;
      })
      .sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'date':
            comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            break;
          case 'topic':
            comparison = a.topic.localeCompare(b.topic);
            break;
          case 'rounds':
            comparison = a.round_number - b.round_number;
            break;
        }
        
        return sortOrder === 'desc' ? -comparison : comparison;
      });
  }, [sessions, searchTerm, filterStatus, dateFilter, sortBy, sortOrder]);

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
        const date = new Date(session.created_at);
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
  const completedSessions = sessions.filter(s => s.is_complete).length;
  const totalRounds = sessions.reduce((acc, s) => acc + s.round_number, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-purple-500/30 rounded-full mx-auto"></div>
              <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 -translate-x-1/2"></div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Loading History</h2>
            <p className="text-slate-400">Fetching your debate sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 mb-6 shadow-lg shadow-violet-500/30">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Session History
              </span>
            </h1>
            <p className="text-slate-400 text-lg">Review your past debate sessions and track your progress</p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
              <MessageCircle className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{totalSessions}</div>
              <div className="text-xs text-slate-500">Total Sessions</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
              <Trophy className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{completedSessions}</div>
              <div className="text-xs text-slate-500">Completed</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
              <Calendar className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{totalRounds}</div>
              <div className="text-xs text-slate-500">Total Rounds</div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col gap-4 mb-8">
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
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-xl z-20">
                    {(['date', 'topic', 'rounds'] as const).map((option) => (
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

            <div className="flex flex-col sm:flex-row gap-4">
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
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-6">
                <MessageCircle className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Sessions Found</h3>
              <p className="text-slate-400 mb-6">
                {sessions.length === 0 
                  ? "You haven't started any debate sessions yet." 
                  : "No sessions match your search criteria."}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedSessions).map(([groupKey, groupSessions]) => (
                <div key={groupKey}>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-lg font-semibold text-white">{groupKey}</h2>
                    <span className="text-sm text-slate-500">({groupSessions.length} session{groupSessions.length > 1 ? 's' : ''})</span>
                  </div>
                  
                  <div className="space-y-3">
                    {groupSessions.map((session) => (
                      <div
                        key={session.session_id}
                        onClick={() => fetchConversation(session.session_id)}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all cursor-pointer group"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                                session.is_complete 
                                  ? 'bg-emerald-500/20 text-emerald-400' 
                                  : 'bg-amber-500/20 text-amber-400'
                              }`}>
                                {session.is_complete ? 'Completed' : 'In Progress'}
                              </span>
                            </div>
                            {sortBy !== 'topic' && (
                              <h3 className="text-lg font-semibold text-white mb-2 truncate group-hover:text-purple-300 transition-colors">
                                {session.topic}
                              </h3>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                              <span className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                {session.user_name}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" />
                                {session.participants.join(', ')}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <MessageCircle className="w-4 h-4" />
                                {session.round_number} rounds
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {formatDate(session.created_at)}
                              </span>
                            </div>
                          </div>

                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Conversation Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedSession.topic}</h2>
                <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    {selectedSession.user_name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {selectedSession.participants.join(', ')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedSession.created_at)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Conversation Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loadingConversation ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading conversation...</p>
                  </div>
                </div>
              ) : selectedSession.conversation && selectedSession.conversation.length > 0 ? (
                selectedSession.conversation.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl ${
                      msg.speaker === selectedSession.user_name
                        ? 'bg-purple-500/10 border border-purple-500/20 ml-8'
                        : 'bg-white/5 border border-white/10 mr-8'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-white">{msg.speaker}</span>
                      <span className="text-xs text-slate-500">
                        {new Date(msg.timestamp).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{msg.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-400">No conversation data available</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-slate-950/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  {selectedSession.round_number} rounds • {selectedSession.is_complete ? 'Completed' : 'In Progress'}
                </span>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;