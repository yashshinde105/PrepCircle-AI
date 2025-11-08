import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🏆 Leaderboard</h1>
          <p className="text-gray-600">Top debaters ranked by performance</p>
        </div>

        <div className="card mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4">Rank</th>
                  <th className="text-left py-4 px-4">Name</th>
                  <th className="text-center py-4 px-4">Wins</th>
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
                    <td className="py-4 px-4 text-center">{entry.totalDebates}</td>
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
  );
}

export default Leaderboard;
