import { Home, Trophy, Medal, Crown, Star, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { GlowingEffect } from '../components/ui/glowing-effect';

function Leaderboard() {
  const navigate = useNavigate();

  // Mock leaderboard data - in production, fetch from backend
  const leaderboardData = [
    { rank: 1, name: 'Alex Chen', wins: 45, avgScore: 87, totalDebates: 50 },
    { rank: 2, name: 'Sarah Johnson', wins: 42, avgScore: 85, totalDebates: 52 },
    { rank: 3, name: 'Mike Rodriguez', wins: 38, avgScore: 82, totalDebates: 48 },
    { rank: 4, name: 'Emily Wang', wins: 35, avgScore: 80, totalDebates: 45 },
    { rank: 5, name: 'David Kim', wins: 32, avgScore: 78, totalDebates: 43 },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-amber-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-slate-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-slate-400">#{rank}</span>;
    }
  };

  const getRankStyles = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border-amber-500/30 hover:border-amber-500/50';
      case 2:
        return 'bg-gradient-to-r from-slate-400/10 via-slate-300/10 to-slate-400/10 border-slate-400/30 hover:border-slate-400/50';
      case 3:
        return 'bg-gradient-to-r from-amber-700/10 via-amber-600/10 to-amber-700/10 border-amber-600/30 hover:border-amber-600/50';
      default:
        return 'bg-white/[0.02] border-white/10 hover:border-purple-500/30';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 mb-6 shadow-lg shadow-amber-500/30">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="gradient-text-gold">Leaderboard</span>
            </h1>
            <p className="text-slate-400 text-lg">Top performers ranked by their GD practice scores</p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { icon: Users, label: 'Total Players', value: '1,247' },
              { icon: Star, label: 'Avg Score', value: '72.5' },
              { icon: TrendingUp, label: 'Sessions Today', value: '89' },
            ].map((stat, index) => (
              <div key={index} className="glass-effect rounded-xl p-4 text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <stat.icon className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Leaderboard Table */}
          <div className="relative rounded-2xl border border-white/5 p-1.5 bg-white/[0.01] animate-scale-in">
            <GlowingEffect
              spread={60}
              glow={true}
              disabled={false}
              proximity={80}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <div className="glass-effect rounded-xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/[0.03] border-b border-white/5">
                <div className="col-span-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Rank</div>
                <div className="col-span-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Player</div>
                <div className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Wins</div>
                <div className="col-span-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Avg Score</div>
                <div className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Sessions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-white/5">
                {leaderboardData.map((entry, index) => (
                  <div
                    key={entry.rank}
                    className={`grid grid-cols-12 gap-4 px-6 py-5 items-center transition-all duration-300 border-l-4 ${getRankStyles(entry.rank)} animate-slide-up`}
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                  >
                    {/* Rank */}
                    <div className="col-span-1 flex items-center justify-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        entry.rank <= 3 
                          ? 'bg-gradient-to-br from-white/10 to-white/5 shadow-inner' 
                          : ''
                      }`}>
                        {getRankIcon(entry.rank)}
                      </div>
                    </div>

                    {/* Player Name */}
                    <div className="col-span-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        entry.rank === 1 ? 'bg-gradient-to-br from-amber-500 to-yellow-600' :
                        entry.rank === 2 ? 'bg-gradient-to-br from-slate-400 to-slate-500' :
                        entry.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                        'bg-gradient-to-br from-violet-500 to-purple-600'
                      }`}>
                        {entry.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-white">{entry.name}</span>
                    </div>

                    {/* Wins */}
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold text-emerald-400">{entry.wins}</span>
                      </span>
                    </div>

                    {/* Avg Score */}
                    <div className="col-span-3 text-center">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              entry.avgScore >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                              entry.avgScore >= 70 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                              'bg-gradient-to-r from-amber-500 to-yellow-400'
                            }`}
                            style={{ width: `${entry.avgScore}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-white min-w-[3ch]">{entry.avgScore}</span>
                      </div>
                    </div>

                    {/* Total Debates */}
                    <div className="col-span-2 text-center">
                      <span className="text-slate-400 font-medium">{entry.totalDebates}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-10">
            <button 
              onClick={() => navigate('/')} 
              className="btn-secondary flex items-center gap-2 mx-auto"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
