import { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Calendar,
  Trophy,
  MessageCircle,
  ArrowRight,
  Search,
  Filter,
  ChevronDown,
  SortAsc,
  SortDesc,
  X,
  User,
  Users
} from 'lucide-react';

interface Message {
  speaker: string;
  message: string;
  timestamp: string;
}

interface DebateSession {
  id: string;
  topic: string;
  participants: string[];
  userName: string;
  roundNumber: number;
  isComplete: boolean;
  createdAt: string;
  conversation?: Message[];
}

interface DebateRound {
  roundNumber: number;
  userArgument: string;
  aiArgument: string;
  ai2Argument?: string | null;
  timestamp: string;
}

interface DebateHistoryRecord {
  id: string;
  topic: string;
  userName: string;
  status: 'active' | 'completed';
  createdAt: string;
  rounds: DebateRound[];
}

const toDebateSession = (debate: DebateHistoryRecord): DebateSession => ({
  id: debate.id,
  topic: debate.topic,
  participants: [debate.userName, 'Bob', 'Jannet'],
  userName: debate.userName,
  roundNumber: debate.rounds?.length || 0,
  isComplete: debate.status === 'completed',
  createdAt: debate.createdAt,
  conversation:
    debate.rounds?.flatMap((round) => [
      {
        speaker: debate.userName,
        message: round.userArgument,
        timestamp: round.timestamp
      },
      {
        speaker: 'Bob',
        message: round.aiArgument,
        timestamp: round.timestamp
      },
      ...(round.ai2Argument
        ? [
            {
              speaker: 'Jannet',
              message: round.ai2Argument,
              timestamp: round.timestamp
            }
          ]
        : [])
    ]) || []
});

function History() {
  const [sessions, setSessions] = useState<DebateSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'completed' | 'active'
  >('all');
  const [sortBy, setSortBy] = useState<'date' | 'topic' | 'rounds'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateFilter, setDateFilter] = useState<
    'all' | 'today' | 'week' | 'month'
  >('all');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState<DebateSession | null>(null);
  const [loadingConversation, setLoadingConversation] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/debates/history');

      if (!response.ok) {
        throw new Error(`Failed to fetch history: ${response.status}`);
      }

      const data = await response.json();

      setSessions(
        (data.debates || []).map(toDebateSession)
      );
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

      const response = await fetch(`/api/debates/${sessionId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch conversation: ${response.status}`);
      }

      const data = await response.json();

      if (!data.debate) {
        throw new Error('Debate not found in response');
      }

      setSelectedSession(toDebateSession(data.debate));
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
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    switch (range) {
      case 'today':
        return date >= today;

      case 'week': {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date >= weekAgo;
      }

      case 'month': {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return date >= monthAgo;
      }

      default:
        return true;
    }
  };

  const filteredSessions = useMemo(() => {
    return sessions
      .filter((session) => {
        const matchesSearch = session.topic
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const matchesFilter =
          filterStatus === 'all' ||
          (filterStatus === 'completed'
            ? session.isComplete
            : !session.isComplete);

        const matchesDate = isWithinDateRange(
          session.createdAt,
          dateFilter
        );

        return matchesSearch && matchesFilter && matchesDate;
      })
      .sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case 'date':
            comparison =
              new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime();
            break;

          case 'topic':
            comparison = a.topic.localeCompare(b.topic);
            break;

          case 'rounds':
            comparison = a.roundNumber - b.roundNumber;
            break;
        }

        return sortOrder === 'desc' ? -comparison : comparison;
      });
  }, [sessions, searchTerm, filterStatus, dateFilter, sortBy, sortOrder]);

  const groupedSessions = useMemo(() => {
    const groups: Record<string, DebateSession[]> = {};

    filteredSessions.forEach((session) => {
      const date = new Date(session.createdAt);

      const groupKey =
        sortBy === 'topic'
          ? session.topic
          : date.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            });

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }

      groups[groupKey].push(session);
    });

    return groups;
  }, [filteredSessions, sortBy]);

  const totalSessions = sessions.length;

  const completedSessions = sessions.filter(
    (session) => session.isComplete
  ).length;

  const totalRounds = sessions.reduce(
    (total, session) => total + session.roundNumber,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="mx-auto h-20 w-20 rounded-full border-4 border-purple-500/30" />
              <div className="absolute left-1/2 top-0 h-20 w-20 -translate-x-1/2 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
            </div>

            <h2 className="mb-2 text-xl font-semibold text-white">
              Loading History
            </h2>

            <p className="text-slate-400">
              Fetching your debate sessions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -right-40 bottom-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
              <Clock className="h-10 w-10 text-white" />
            </div>

            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Session History
              </span>
            </h1>

            <p className="text-lg text-slate-400">
              Review your past debate sessions and track your progress
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mb-10 grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
              <MessageCircle className="mx-auto mb-2 h-5 w-5 text-purple-400" />
              <div className="text-xl font-bold text-white">
                {totalSessions}
              </div>
              <div className="text-xs text-slate-500">Total Sessions</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
              <Trophy className="mx-auto mb-2 h-5 w-5 text-purple-400" />
              <div className="text-xl font-bold text-white">
                {completedSessions}
              </div>
              <div className="text-xs text-slate-500">Completed</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
              <Calendar className="mx-auto mb-2 h-5 w-5 text-purple-400" />
              <div className="text-xl font-bold text-white">
                {totalRounds}
              </div>
              <div className="text-xs text-slate-500">Total Rounds</div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8 flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search by topic..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-slate-400 transition-colors focus:border-purple-500/50 focus:outline-none"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex min-w-[160px] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 transition-colors hover:bg-white/10"
                >
                  {sortOrder === 'desc' ? (
                    <SortDesc className="h-4 w-4" />
                  ) : (
                    <SortAsc className="h-4 w-4" />
                  )}

                  <span className="capitalize">By {sortBy}</span>

                  <ChevronDown
                    className={`ml-auto h-4 w-4 transition-transform ${
                      showSortDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showSortDropdown && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-xl">
                    {(['date', 'topic', 'rounds'] as const).map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          if (sortBy === option) {
                            setSortOrder(
                              sortOrder === 'desc' ? 'asc' : 'desc'
                            );
                          } else {
                            setSortBy(option);
                            setSortOrder('desc');
                          }

                          setShowSortDropdown(false);
                        }}
                        className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${
                          sortBy === option
                            ? 'text-purple-400'
                            : 'text-slate-300'
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

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-wrap gap-2">
                <span className="mr-2 flex items-center gap-1.5 text-sm text-slate-400">
                  <Calendar className="h-4 w-4" />
                  Date:
                </span>

                {(['all', 'today', 'week', 'month'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateFilter(range)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                      dateFilter === range
                        ? 'border-indigo-500/30 bg-indigo-500/20 text-indigo-400'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {range === 'all'
                      ? 'All Time'
                      : range === 'week'
                        ? 'This Week'
                        : range === 'month'
                          ? 'This Month'
                          : 'Today'}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 sm:ml-auto">
                <span className="mr-2 flex items-center gap-1.5 text-sm text-slate-400">
                  <Filter className="h-4 w-4" />
                  Status:
                </span>

                {(['all', 'completed', 'active'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                      filterStatus === status
                        ? 'border-purple-500/30 bg-purple-500/20 text-purple-400'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
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
            <div className="py-16 text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                <MessageCircle className="h-8 w-8 text-slate-500" />
              </div>

              <h3 className="mb-2 text-xl font-semibold text-white">
                No Sessions Found
              </h3>

              <p className="mb-6 text-slate-400">
                {sessions.length === 0
                  ? "You haven't started any debate sessions yet."
                  : 'No sessions match your search criteria.'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedSessions).map(
                ([groupKey, groupSessions]) => (
                  <div key={groupKey}>
                    <div className="mb-4 flex items-center gap-3">
                      <h2 className="text-lg font-semibold text-white">
                        {groupKey}
                      </h2>

                      <span className="text-sm text-slate-500">
                        ({groupSessions.length} session
                        {groupSessions.length !== 1 ? 's' : ''})
                      </span>
                    </div>

                    <div className="space-y-3">
                      {groupSessions.map((session) => (
                        <div
                          key={session.id}
                          onClick={() => fetchConversation(session.id)}
                          className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:bg-white/10"
                        >
                          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            <div className="min-w-0 flex-1">
                              <div className="mb-2 flex items-center gap-3">
                                <span
                                  className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                                    session.isComplete
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : 'bg-amber-500/20 text-amber-400'
                                  }`}
                                >
                                  {session.isComplete
                                    ? 'Completed'
                                    : 'In Progress'}
                                </span>
                              </div>

                              {sortBy !== 'topic' && (
                                <h3 className="mb-2 truncate text-lg font-semibold text-white transition-colors group-hover:text-purple-300">
                                  {session.topic}
                                </h3>
                              )}

                              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1.5">
                                  <User className="h-4 w-4" />
                                  {session.userName}
                                </span>

                                <span className="flex items-center gap-1.5">
                                  <Users className="h-4 w-4" />
                                  {session.participants.join(', ')}
                                </span>

                                <span className="flex items-center gap-1.5">
                                  <MessageCircle className="h-4 w-4" />
                                  {session.roundNumber} rounds
                                </span>

                                <span className="flex items-center gap-1.5">
                                  <Clock className="h-4 w-4" />
                                  {formatDate(session.createdAt)}
                                </span>
                              </div>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-purple-500/20">
                              <ArrowRight className="h-5 w-5 text-slate-400 transition-colors group-hover:text-purple-400" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Conversation Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 p-6">
              <div>
                <h2 className="mb-2 text-2xl font-bold text-white">
                  {selectedSession.topic}
                </h2>

                <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {selectedSession.userName}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {selectedSession.participants.join(', ')}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selectedSession.createdAt)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSession(null)}
                aria-label="Close conversation"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 transition-colors hover:bg-white/10"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            {/* Conversation Content */}
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {loadingConversation ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500" />
                    <p className="text-slate-400">
                      Loading conversation...
                    </p>
                  </div>
                </div>
              ) : selectedSession.conversation &&
                selectedSession.conversation.length > 0 ? (
                selectedSession.conversation.map((message, index) => (
                  <div
                    key={`${selectedSession.id}-${index}`}
                    className={`rounded-xl p-4 ${
                      message.speaker === selectedSession.userName
                        ? 'ml-8 border border-purple-500/20 bg-purple-500/10'
                        : 'mr-8 border border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-semibold text-white">
                        {message.speaker}
                      </span>

                      <span className="text-xs text-slate-500">
                        {new Date(message.timestamp).toLocaleTimeString(
                          'en-US',
                          {
                            hour: '2-digit',
                            minute: '2-digit'
                          }
                        )}
                      </span>
                    </div>

                    <p className="leading-relaxed text-slate-300">
                      {message.message}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-slate-400">
                    No conversation data available
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-white/10 bg-slate-950/50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  {selectedSession.roundNumber} rounds •{' '}
                  {selectedSession.isComplete ? 'Completed' : 'In Progress'}
                </span>

                <button
                  onClick={() => setSelectedSession(null)}
                  className="rounded-lg bg-purple-500/20 px-4 py-2 text-purple-400 transition-colors hover:bg-purple-500/30"
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