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
          <div className="text-center animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-purple-500/30 rounded-full mx-auto mb-6"></div>
              <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 -translate-x-1/2"></div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Initializing AI Session</h2>
            <p className="text-slate-400">Preparing your debate environment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      
      {/* Animated Background - Hidden on small screens for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute top-20 right-20 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-violet-600/10 rounded-full blur-[100px] md:blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/10 rounded-full blur-[100px] md:blur-[150px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="pt-16 sm:pt-20 px-3 sm:px-4 lg:px-6 pb-4 sm:pb-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-3 sm:space-y-4 lg:space-y-5">
            {/* Header Card */}
            <div className="card border border-purple-500/20 animate-slide-up p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="bg-gradient-to-br from-violet-500 to-purple-600 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
                      <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white leading-tight truncate">{debate.topic}</h1>
                      <div className="flex items-center gap-2 sm:gap-3 mt-1">
                        <span className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-slate-400">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                          Round {roundNumber}
                        </span>
                        <span className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-slate-400">
                          <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                          Live
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 self-end sm:self-auto">
                  <div className="px-3 sm:px-5 py-2 sm:py-3 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl sm:rounded-2xl text-white shadow-xl shadow-purple-500/25">
                    <div className="text-[10px] sm:text-xs font-medium opacity-80 uppercase tracking-wider">Score</div>
                    <div className="text-2xl sm:text-3xl font-bold">{userScore}</div>
                    <div className="text-[10px] sm:text-xs opacity-70">points</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timer Card */}
            <div className="card border border-purple-500/20 text-center animate-slide-up p-4 sm:p-6" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg ${
                  timeLeft <= 10 
                    ? 'bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/40 animate-pulse' 
                    : timeLeft <= 30
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30'
                      : 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/30'
                }`}>
                  <Clock className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <span className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${
                  timeLeft <= 10 ? 'text-rose-400' : timeLeft <= 30 ? 'text-amber-400' : 'gradient-text'
                } ${timeLeft <= 10 ? 'animate-pulse' : ''}`}>
                  {timeLeft}s
                </span>
              </div>
              
              <div className="w-full bg-white/5 rounded-full h-2 sm:h-3 overflow-hidden mb-2 sm:mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    timeLeft > 30 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-400' 
                      : timeLeft > 10 
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                        : 'bg-gradient-to-r from-rose-500 to-red-400 animate-pulse'
                  }`}
                  style={{ width: `${(timeLeft / 90) * 100}%` }}
                />
              </div>
              
              <p className="text-xs sm:text-sm text-slate-400 flex items-center justify-center gap-2">
                {isTimerActive ? (
                  <>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></span>
                    <span className="hidden sm:inline">Discussion round in progress</span>
                    <span className="sm:hidden">In progress</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-500 rounded-full"></span>
                    Round paused
                  </>
                )}
              </p>
            </div>

            {/* Discussion Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
              {/* User Side */}
              <div className="card border border-blue-500/20 animate-slide-up p-4 sm:p-6" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between mb-3 sm:mb-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm sm:text-base">Your Response</h3>
                      <p className="text-[10px] sm:text-xs text-slate-500">Speak your argument</p>
                    </div>
                  </div>
                  {isListening && (
                    <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                      <div className="flex items-end gap-0.5">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div 
                            key={i} 
                            className="w-1 bg-rose-400 rounded-full animate-pulse" 
                            style={{ 
                              height: `${8 + (i % 3) * 5}px`,
                              animationDelay: `${i * 80}ms` 
                            }}
                          ></div>
                        ))}
                      </div>
                      <span className="text-xs text-rose-400 font-medium hidden sm:inline">Recording</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-[#12121f] border border-white/10 rounded-xl min-h-[120px] sm:min-h-[150px] lg:min-h-[180px] mb-3 sm:mb-4">
                  <div className="p-3 sm:p-5">
                    <p className="text-slate-200 leading-relaxed text-sm sm:text-[15px]">
                      {userTranscript || (
                        <span className="text-slate-500 flex items-center gap-2 text-xs sm:text-sm">
                          <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
                          Click the microphone to start speaking...
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={isListening ? handleStopSpeaking : handleStartSpeaking}
                  disabled={!isUserTurn || isSpeaking}
                  className={`w-full py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 sm:gap-3 transition-all text-sm sm:text-base ${
                    isListening
                      ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-xl shadow-rose-500/30 animate-pulse-glow'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-xl shadow-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Start Speaking</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Moderator Side */}
              <div className="card border border-purple-500/20 animate-slide-up p-4 sm:p-6" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center justify-between mb-3 sm:mb-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-gradient-to-br from-violet-500 to-purple-600 w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm sm:text-base">AI Moderator</h3>
                      <p className="text-[10px] sm:text-xs text-slate-500">Powered by Gemini</p>
                    </div>
                  </div>
                  {isSpeaking && (
                    <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 animate-pulse" />
                      <span className="text-xs text-purple-400 font-medium hidden sm:inline">Speaking</span>
                      <div className="flex items-end gap-0.5">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div 
                            key={i} 
                            className="w-1 bg-purple-400 rounded-full animate-pulse" 
                            style={{ 
                              height: `${8 + (i % 3) * 5}px`,
                              animationDelay: `${i * 80}ms` 
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-[#12121f] border border-white/10 rounded-xl min-h-[120px] sm:min-h-[150px] lg:min-h-[180px] mb-3 sm:mb-4">
                  <div className="p-3 sm:p-5">
                    <p className="text-slate-200 leading-relaxed text-sm sm:text-[15px]">
                      {moderatorResponse || (
                        <span className="text-slate-500 flex items-center gap-2 text-xs sm:text-sm">
                          <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
                          AI is analyzing your point...
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                {isSpeaking ? (
                  <div className="w-full bg-white/5 rounded-full h-1.5 sm:h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 h-full rounded-full shimmer" />
                  </div>
                ) : moderatorResponse && (
                  <div className="p-2 sm:p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
                    <p className="text-[10px] sm:text-xs text-purple-300 text-center flex items-center justify-center gap-1 sm:gap-2">
                      <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">AI is challenging you to think deeper!</span>
                      <span className="sm:hidden">Think deeper!</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Controls Card */}
            <div className="card border border-purple-500/20 animate-slide-up p-4 sm:p-6" style={{ animationDelay: '400ms' }}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-3 sm:mb-4">
                <button
                  onClick={startNewRound}
                  disabled={timeLeft > 0 && isTimerActive}
                  className="btn-primary flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-3 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Zap className="w-4 h-4" />
                  Start New Round
                </button>
                <button
                  onClick={endGD}
                  className="btn-secondary flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-3"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">End Session & View Feedback</span>
                  <span className="sm:hidden">End & View Feedback</span>
                </button>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <p className="text-sm text-slate-400 text-center flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Both you and the AI share the same 90-second timer for dynamic discussion
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
