import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DebateRoom from './pages/DebateRoom.tsx';
import Summary from './pages/Summary.tsx';
import Leaderboard from './pages/Leaderboard.tsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/debate/:debateId" element={<DebateRoom />} />
          <Route path="/summary/:debateId" element={<Summary />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
