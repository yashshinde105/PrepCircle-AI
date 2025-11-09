import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import DebateRoom from './pages/DebateRoom.tsx';
import Summary from './pages/Summary.tsx';
import Leaderboard from './pages/Leaderboard.tsx';
import AboutUs from './pages/AboutUs.tsx';

function App() {
  useEffect(() => {
    // Enable dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/debate/:debateId" element={<DebateRoom />} />
          <Route path="/summary/:debateId" element={<Summary />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
