import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

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

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">🏆 Leaderboard</h1>
            <p className="text-gray-300">Top debaters ranked by performance</p>
          </div>

          <div className="glass-effect rounded-xl border border-purple-500/20 mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-purple-500/20">
                    <th className="text-left py-4 px-4 text-gray-300">Rank</th>
                    <th className="text-left py-4 px-4 text-gray-300">Name</th>
                    <th className="text-center py-4 px-4 text-gray-300">Wins</th>
                  <th className="text-center py-4 px-4">Avg Score</th>
                  <th className="text-center py-4 px-4">Total Debates</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry) => (
                  <tr
                    key={entry.rank}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span
                        className={`font-bold text-lg ${
                          entry.rank === 1
                            ? 'text-yellow-500'
                            : entry.rank === 2
                            ? 'text-gray-400'
                            : entry.rank === 3
                            ? 'text-orange-600'
                            : 'text-gray-700'
                        }`}
                      >
                        #{entry.rank}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold">{entry.name}</td>
                    <td className="py-4 px-4 text-center">{entry.wins}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-semibold text-primary">{entry.avgScore}</span>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-300">{entry.totalDebates}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <button onClick={() => navigate('/')} className="btn-primary flex items-center gap-2 mx-auto">
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
