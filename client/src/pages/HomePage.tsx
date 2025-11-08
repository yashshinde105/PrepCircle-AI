import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Trophy, BookOpen } from 'lucide-react';
import axios from 'axios';

interface Topic {
  id: number;
  title: string;
  category: string;
  difficulty: string;
}

function HomePage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await axios.get('/api/debates/topics');
      setTopics(response.data.topics);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const startGD = async () => {
    if (!selectedTopic || !userName.trim()) {
      alert('Please select a topic and enter your name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/debates/create', {
        topic: selectedTopic.title,
        stance: 'participant',  // No pro/con for GD
        userName
      });
      navigate(`/debate/${response.data.debateId}`);
    } catch (error) {
      console.error('Error creating GD session:', error);
      alert('Failed to start GD practice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            GD Practice Simulator 🎤💼
          </h1>
          <p className="text-xl text-gray-600">
            Master Group Discussions for job interviews with AI guidance
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <Mic className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Voice Practice</h3>
            <p className="text-gray-600">Real-time speech practice with AI moderator</p>
          </div>
          <div className="card text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h3 className="text-lg font-semibold mb-2">Dynamic Challenges</h3>
            <p className="text-gray-600">AI asks probing questions & challenges your thinking</p>
          </div>
          <div className="card text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-warning" />
            <h3 className="text-lg font-semibold mb-2">Performance Feedback</h3>
            <p className="text-gray-600">Get scored on clarity, logic & communication</p>
          </div>
        </div>

        {/* Setup Form */}
        <div className="card max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Start a GD Practice Session</h2>
          
          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

            {/* Topic Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Topic</label>
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedTopic?.id === topic.id
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        topic.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        topic.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {topic.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{topic.category}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startGD}
              disabled={loading || !selectedTopic || !userName.trim()}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Starting...' : 'Start GD Practice 🚀'}
            </button>
            <p className="text-sm text-gray-500 text-center mt-2">
              💡 The AI moderator will challenge your points and ask questions to help you improve
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/leaderboard')}
            className="btn-secondary"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
