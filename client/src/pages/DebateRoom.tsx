import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Clock, User, Bot, Sparkles, Brain, Zap } from 'lucide-react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import HistorySidebar from '../components/HistorySidebar';
import Navbar from '../components/Navbar';

interface Debate {
  id: string;
  topic: string;
  userStance: string;
  aiStance: string;
  currentRound: number;
}

interface Round {
  roundNumber: number;
  userArgument: string;
  aiArgument: string;
  scores: {
    relevance: number;
    strength: number;
    engagement: number;
  };
  timestamp: Date;
}

function DebateRoom() {
  const { debateId } = useParams();
  const navigate = useNavigate();
  const [debate, setDebate] = useState<Debate | null>(null);
  const [userTranscript, setUserTranscript] = useState('');
  const [moderatorResponse, setModeratorResponse] = useState('');
  const [timeLeft, setTimeLeft] = useState(90);
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [userScore, setUserScore] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [rounds, setRounds] = useState<Round[]>([]);
  const socketRef = useRef<Socket | null>(null);
  
  const { isListening, startListening, stopListening } = useSpeechRecognition(
    (transcript) => setUserTranscript(transcript)
  );
  
  const { speak, isSpeaking } = useSpeechSynthesis();

  useEffect(() => {
    // Fetch GD session details
    fetchDebateDetails();
    
    // Initialize socket
    socketRef.current = io('http://localhost:3000');
    socketRef.current.emit('join-debate', debateId);
    
    socketRef.current.on('ai-response', (data) => {
      setModeratorResponse(data.text);
      speak(data.text);
      // Don't stop timer - AI speaks within the same 90-second round
    });

    // Start the timer when component mounts
    setIsTimerActive(true);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [debateId]);

  useEffect(() => {
    // Timer countdown
    if (isTimerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
  }, [timeLeft, isTimerActive]);

  const fetchDebateDetails = async () => {
    try {
      const response = await axios.get(`/api/debates/${debateId}`);
      setDebate(response.data.debate);
    } catch (error) {
      console.error('Error fetching debate:', error);
    }
  };

  const handleStartSpeaking = () => {
    startListening();
    socketRef.current?.emit('user-speaking', { debateId });
  };

  const handleStopSpeaking = () => {
    stopListening();
    socketRef.current?.emit('user-stopped-speaking', { debateId });
    submitArgument();
  };

  const handleTimeUp = () => {
    if (isListening) {
      stopListening();
    }
    setIsTimerActive(false);
    
    // End the round when time is up
    if (userTranscript) {
      submitArgument();
    } else {
      // Move to next round even if no input
      setTimeout(() => {
        setRoundNumber(roundNumber + 1);
        setUserTranscript('');
        setModeratorResponse('');
        setTimeLeft(90);
        setIsTimerActive(true);
        setIsUserTurn(true);
      }, 1000);
    }
  };

  const submitArgument = async () => {
    if (!userTranscript.trim()) return;

    try {
      const duration = 90 - timeLeft;
      const response = await axios.post(`/api/debates/${debateId}/argument`, {
        argument: userTranscript,
        duration
      });

      setUserScore(response.data.totalUserScore);
      setModeratorResponse(response.data.aiResponse);
      
      // Add to rounds history
      const newRound: Round = {
        roundNumber: roundNumber,
        userArgument: userTranscript,
        aiArgument: response.data.aiResponse,
        scores: {
          relevance: response.data.scores?.relevance || 0,
          strength: response.data.scores?.strength || 0,
          engagement: response.data.scores?.engagement || 0
        },
        timestamp: new Date()
      };
      setRounds(prevRounds => [...prevRounds, newRound]);
      
      // AI speaks within the same round - timer keeps running
      setIsUserTurn(false);
      speak(response.data.aiResponse);
      
      // After AI speaks, allow user to respond again in the same round
      setTimeout(() => {
        setIsUserTurn(true);
        setUserTranscript(''); // Clear for next input
      }, 3000); // Short delay to let AI finish speaking
      
    } catch (error) {
      console.error('Error submitting argument:', error);
    }
  };

  const startNewRound = () => {
    setRoundNumber(roundNumber + 1);
    setUserTranscript('');
    setModeratorResponse('');
    setTimeLeft(90);
    setIsTimerActive(true);
    setIsUserTurn(true);
  };

  const endGD = () => {
    navigate(`/summary/${debateId}`);
  };

  if (!debate) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-300 text-lg">Initializing AI Session...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="pt-16 px-3 pb-4 relative z-10">
        <div className="max-w-7xl mx-auto flex gap-4">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="glass-effect rounded-xl border border-purple-500/20 p-4 mb-4 ai-glow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-10 h-10 rounded-2xl flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold gradient-text">{debate.topic}</h1>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                      Round {roundNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      Live AI Session
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="px-4 py-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl text-white shadow-lg shadow-purple-500/30">
                <div className="text-xs font-medium opacity-90">Performance Score</div>
                <div className="text-2xl font-bold">{userScore}</div>
                <div className="text-xs opacity-75">points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="card mb-4 text-center ai-glow py-3">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className={`rounded-2xl flex items-center justify-center ${
              timeLeft <= 10 
                ? 'bg-gradient-to-br from-red-500 to-red-600 w-10 h-10 animate-pulse' 
                : 'bg-gradient-to-br from-purple-500 to-purple-600 w-10 h-10'
            }`}>
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className={`text-4xl font-bold gradient-text ${timeLeft <= 10 ? 'animate-pulse' : ''}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="w-full glass-effect rounded-full h-3 mb-2 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${
                timeLeft > 30 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : timeLeft > 10 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                    : 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse'
              }`}
              style={{ width: `${(timeLeft / 90) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-300 flex items-center justify-center gap-2">
            {isTimerActive ? (
              <>
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Timer running for the discussion round
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                Round paused
              </>
            )}
          </p>
        </div>

        {/* GD Area */}
        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          {/* User Side */}
          <div className="card ai-glow group py-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-10 h-10 rounded-2xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Your Response</h3>
              {isListening && (
                <div className="flex gap-1 ml-auto">
                  <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
              )}
            </div>
            <div className="glass-effect border border-blue-500/30 p-4 rounded-xl min-h-40 mb-3">
              <p className="text-slate-200 leading-relaxed">
                {userTranscript || (
                  <span className="text-slate-500 italic flex items-center gap-2 text-sm">
                    <Mic className="w-4 h-4" />
                    Click the microphone to start speaking...
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={isListening ? handleStopSpeaking : handleStartSpeaking}
              disabled={!isUserTurn || isSpeaking}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                isListening
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-red-500/50 animate-pulse-glow'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5" />
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>Start Speaking</span>
                </>
              )}
            </button>
          </div>

          {/* AI Moderator Side */}
          <div className="card ai-glow group py-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-10 h-10 rounded-2xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">AI Moderator</h3>
              {isSpeaking && (
                <div className="flex items-center gap-2 ml-auto">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span className="text-xs text-purple-400">Speaking...</span>
                </div>
              )}
            </div>
            <div className="glass-effect border border-purple-500/30 p-4 rounded-xl min-h-40 mb-3 relative">
              {isSpeaking && (
                <div className="absolute top-3 right-3">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-6 bg-purple-400 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-6 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-6 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-6 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              )}
              <p className="text-slate-200 leading-relaxed">
                {moderatorResponse || (
                  <span className="text-slate-500 italic flex items-center gap-2 text-sm">
                    <Brain className="w-4 h-4" />
                    AI is analyzing your point...
                  </span>
                )}
              </p>
            </div>
            {isSpeaking && (
              <div className="w-full glass-effect rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 h-2 rounded-full animate-pulse shimmer" />
              </div>
            )}
            {!isSpeaking && moderatorResponse && (
              <div className="glass-effect p-2 rounded-xl border border-purple-500/30">
                <p className="text-xs text-purple-300 italic flex items-center justify-center gap-2">
                  <Brain className="w-3 h-3" />
                  AI is challenging you to think deeper!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="card text-center ai-glow py-3">
          <div className="flex gap-3 justify-center mb-3">
            <button
              onClick={startNewRound}
              disabled={timeLeft > 0 && isTimerActive}
              className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              Start New Round
            </button>
            <button
              onClick={endGD}
              className="btn-secondary px-6 py-2 flex items-center gap-2 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>End Session & View Feedback</span>
            </button>
          </div>
          <div className="glass-effect p-2 rounded-xl border border-purple-500/30 max-w-2xl mx-auto">
            <p className="text-xs text-slate-300 flex items-center justify-center gap-2">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span>Both you and the AI share the same 90-second timer. Engage in dynamic discussion!</span>
            </p>
          </div>
        </div>
          </div>
          
          {/* History Sidebar */}
          <div className="hidden lg:block w-80">
            <HistorySidebar rounds={rounds} currentRound={roundNumber} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebateRoom;
