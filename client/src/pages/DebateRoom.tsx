import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Clock, User, Bot, Sparkles, Brain, Zap, Users } from 'lucide-react';
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
  ai2Argument?: string;
  scores: {
    relevance: number;
    strength: number;
    engagement: number;
  };
  timestamp: Date;
}

// AI Participant names and personas (matching your trained model)
const AI_PARTICIPANTS = {
  ai1: {
    name: 'Bob (AI)',
    role: 'GD Participant',
    color: 'purple',
    gradient: 'from-violet-500 to-purple-600',
    shadowColor: 'shadow-purple-500/30',
    borderColor: 'border-purple-500/20',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400'
  },
  ai2: {
    name: 'Jannet (AI)',
    role: 'GD Participant',
    color: 'pink',
    gradient: 'from-pink-500 to-rose-600',
    shadowColor: 'shadow-pink-500/30',
    borderColor: 'border-pink-500/20',
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-400'
  }
};

// Custom hook for typewriter effect synced with speech
const useTypewriter = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate speed based on speech rate (approximately 150 words per minute at rate 1.0)
  // That's about 400ms per word
  const typeText = useCallback((fullText: string, wordsPerMinute: number = 150): Promise<void> => {
    return new Promise((resolve) => {
      setDisplayedText('');
      setIsTyping(true);
      
      const words = fullText.split(' ');
      let currentIndex = 0;
      
      // Calculate ms per word based on speech rate
      // 150 words per minute = 60000ms / 150 = 400ms per word
      const msPerWord = Math.round(60000 / wordsPerMinute);
      
      intervalRef.current = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedText(prev => prev + (currentIndex > 0 ? ' ' : '') + words[currentIndex]);
          currentIndex++;
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsTyping(false);
          resolve();
        }
      }, msPerWord);
    });
  }, []);

  // Complete typing immediately - show full text
  const complete = useCallback((fullText: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayedText(fullText);
    setIsTyping(false);
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayedText('');
    setIsTyping(false);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { displayedText, isTyping, typeText, complete, reset };
};

function DebateRoom() {
  const { debateId } = useParams();
  const navigate = useNavigate();
  const [debate, setDebate] = useState<Debate | null>(null);
  const [userTranscript, setUserTranscript] = useState('');
  const [ai1FullResponse, setAi1FullResponse] = useState('');
  const [ai2FullResponse, setAi2FullResponse] = useState('');
  const [currentSpeaker, setCurrentSpeaker] = useState<'user' | 'ai1' | 'ai2' | null>(null);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isUserTurn, setIsUserTurn] = useState(false); // Start with AI turn, not user
  const [isAISpeaking, setIsAISpeaking] = useState(false); // Track if any AI is currently speaking
  const [isProcessing, setIsProcessing] = useState(false); // Prevent double API calls
  const [userScore, setUserScore] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [isTimerActive, setIsTimerActive] = useState(false); // Don't start timer until AI finishes
  const [rounds, setRounds] = useState<Round[]>([]);
  const [aiHasSpoken, setAiHasSpoken] = useState(false); // Track if AI has spoken this round
  const socketRef = useRef<Socket | null>(null);
  
  // Typewriter hooks for each AI
  const ai1Typewriter = useTypewriter();
  const ai2Typewriter = useTypewriter();
  
  const { isListening, startListening, stopListening } = useSpeechRecognition(
    (transcript) => setUserTranscript(transcript)
  );
  
  const { speak, isSpeaking } = useSpeechSynthesis();

  // Function to get AI responses and have them speak first
  const getAIResponses = async (userInput: string = '') => {
    // Prevent double calls
    if (isProcessing) {
      console.log('⚠️ Already processing, skipping...');
      return;
    }
    
    try {
      setIsProcessing(true);
      setIsUserTurn(false);
      setIsTimerActive(false);
      
      // Reset typewriters for new responses
      ai1Typewriter.reset();
      ai2Typewriter.reset();
      setAi1FullResponse('');
      setAi2FullResponse('');
      
      // Call the API to get AI responses
      const response = await axios.post(`/api/debates/${debateId}/argument`, {
        argument: userInput,
        duration: userInput ? (90 - timeLeft) : 0
      });

      // ============ CHECK IF DEBATE HAS ENDED ============
      if (response.data.debateEnded) {
        console.log('🏁 GD Session completed - redirecting to summary');
        // Show a brief message before redirecting
        setCurrentSpeaker(null);
        setIsTimerActive(false);
        
        // Redirect to summary/feedback page after a short delay
        setTimeout(() => {
          navigate(`/summary/${debateId}`);
        }, 1500);
        return;
      }

      if (userInput) {
        setUserScore(response.data.totalUserScore);
        
        // Add to rounds history
        const newRound: Round = {
          roundNumber: roundNumber,
          userArgument: userInput,
          aiArgument: response.data.aiResponse,
          ai2Argument: response.data.ai2Response || '',
          scores: {
            relevance: response.data.scores?.relevance || 0,
            strength: response.data.scores?.strength || 0,
            engagement: response.data.scores?.engagement || 0
          },
          timestamp: new Date()
        };
        setRounds(prevRounds => [...prevRounds, newRound]);
      }
      
      // ============ STEP 1: BOB (AI1) SPEAKS FIRST ============
      console.log('🎤 Bob response:', response.data.aiResponse);
      const bobText = response.data.aiResponse;
      
      setIsAISpeaking(true); // Mark AI as speaking
      
      if (bobText) {
        setCurrentSpeaker('ai1');
        
        // Start Bob's typewriter synced with speech (150 WPM matches speech rate 1.0)
        ai1Typewriter.typeText(bobText, 150);
        
        // Wait for Bob's speech to FULLY complete before continuing (male voice)
        console.log('🔊 Bob starting to speak...');
        await speak(bobText, 'male');
        console.log('✅ Bob finished speaking');
        
        // Show Bob's full text after speech ends (for persistent display)
        ai1Typewriter.complete(bobText);
        setAi1FullResponse(bobText);
        
        // Clear current speaker
        setCurrentSpeaker(null);
      }
      
      // ============ PAUSE BETWEEN SPEAKERS ============
      console.log('⏸️ Pausing between speakers...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // ============ STEP 2: JANNET (AI2) SPEAKS SECOND ============
      const jannetText = response.data.ai2Response;
      console.log('🎤 Jannet response:', jannetText);
      
      if (jannetText) {
        setCurrentSpeaker('ai2');
        
        // Start Jannet's typewriter synced with speech
        ai2Typewriter.typeText(jannetText, 150);
        
        // Wait for Jannet's speech to FULLY complete before continuing (female voice)
        console.log('🔊 Jannet starting to speak...');
        await speak(jannetText, 'female');
        console.log('✅ Jannet finished speaking');
        
        // Show Jannet's full text after speech ends (for persistent display)
        ai2Typewriter.complete(jannetText);
        setAi2FullResponse(jannetText);
        
        // Clear current speaker
        setCurrentSpeaker(null);
      }
      
      setIsAISpeaking(false); // AI finished speaking
      
      // ============ NOW IT'S USER'S TURN ============
      console.log('👤 Now it\'s user\'s turn to speak!');
      await new Promise(resolve => setTimeout(resolve, 500));
      setCurrentSpeaker(null);
      setIsAISpeaking(false); // Ensure AI speaking flag is off
      setIsProcessing(false); // Allow new API calls
      setIsUserTurn(true);
      setAiHasSpoken(true);
      setTimeLeft(90); // Reset timer for user
      setIsTimerActive(true); // Start timer for user's turn
      console.log('✅ User turn activated - mic should be enabled now');
      
    } catch (error) {
      console.error('Error getting AI responses:', error);
      // Even on error, let user speak
      setIsProcessing(false);
      setIsAISpeaking(false);
      setIsUserTurn(true);
      setIsTimerActive(true);
    }
  };

  useEffect(() => {
    // Fetch GD session details
    fetchDebateDetails();
    
    // Initialize socket
    socketRef.current = io('http://localhost:3000');
    socketRef.current.emit('join-debate', debateId);
    
    socketRef.current.on('ai-response', (data) => {
      // Socket responses are handled by getAIResponses, don't speak here
      // This just updates the UI if needed
      console.log('📡 Socket received:', data.agent, data.text?.substring(0, 30) + '...');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [debateId]);

  // Trigger AI to speak first when debate is loaded
  useEffect(() => {
    if (debate && !aiHasSpoken && !isProcessing) {
      // AI speaks first when GD starts
      console.log('🎬 Starting GD - AI speaks first');
      getAIResponses('');
    }
  }, [debate, aiHasSpoken, isProcessing]);

  useEffect(() => {
    // Timer countdown - only when it's user's turn
    if (isTimerActive && timeLeft > 0 && isUserTurn) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isUserTurn) {
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
      // User didn't speak - just reset timer and wait for them to speak
      // Don't send anything to the model
      setTimeLeft(90);
      setIsTimerActive(true);
      // Keep isUserTurn true - still waiting for user
    }
  };

  const submitArgument = async () => {
    if (!userTranscript.trim()) return;
    
    setIsTimerActive(false);
    const userInput = userTranscript;
    setUserTranscript(''); // Clear for next input
    
    // Increment round and have AI respond
    setRoundNumber(roundNumber + 1);
    
    // AI speaks after user input (they will respond to what user said)
    await getAIResponses(userInput);
  };

  const startNewRound = () => {
    setRoundNumber(roundNumber + 1);
    setUserTranscript('');
    setAi1FullResponse('');
    setAi2FullResponse('');
    ai1Typewriter.reset();
    ai2Typewriter.reset();
    setCurrentSpeaker(null);
    // AI speaks first for new round
    getAIResponses('');
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
                          <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400" />
                          3 Participants
                        </span>
                        <span className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-slate-400">
                          <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                          Live GD
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 self-end sm:self-auto">
                  <div className="px-3 sm:px-5 py-2 sm:py-3 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl sm:rounded-2xl text-white shadow-xl shadow-purple-500/25">
                    <div className="text-[10px] sm:text-xs font-medium opacity-80 uppercase tracking-wider">Your Score</div>
                    <div className="text-2xl sm:text-3xl font-bold">{userScore}</div>
                    <div className="text-[10px] sm:text-xs opacity-70">points</div>
                  </div>
                </div>
              </div>
              
              {/* Participants Bar */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-center gap-4 sm:gap-8">
                  {/* User */}
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${currentSpeaker === null && isListening ? 'bg-blue-500/20 border border-blue-500/40' : 'bg-white/5'}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-white font-medium">You</span>
                    {isListening && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>}
                  </div>
                  
                  {/* AI 1 - Bob */}
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${currentSpeaker === 'ai1' ? 'bg-purple-500/20 border border-purple-500/40' : 'bg-white/5'}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-white font-medium hidden sm:inline">{AI_PARTICIPANTS.ai1.name}</span>
                    <span className="text-sm text-white font-medium sm:hidden">Bob</span>
                    {currentSpeaker === 'ai1' && <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>}
                  </div>
                  
                  {/* AI 2 - Jannet */}
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${currentSpeaker === 'ai2' ? 'bg-pink-500/20 border border-pink-500/40' : 'bg-white/5'}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-white font-medium hidden sm:inline">{AI_PARTICIPANTS.ai2.name}</span>
                    <span className="text-sm text-white font-medium sm:hidden">Jannet</span>
                    {currentSpeaker === 'ai2' && <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>}
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

            {/* Discussion Area - 3 Participants */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
              {/* User Side */}
              <div className="card border border-blue-500/20 animate-slide-up p-4 sm:p-5" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm sm:text-base">You</h3>
                      <p className="text-[10px] sm:text-xs text-slate-500">Participant</p>
                    </div>
                  </div>
                  {isListening && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20">
                      <div className="flex items-end gap-0.5">
                        {[0, 1, 2].map((i) => (
                          <div 
                            key={i} 
                            className="w-0.5 bg-rose-400 rounded-full animate-pulse" 
                            style={{ 
                              height: `${6 + (i % 3) * 4}px`,
                              animationDelay: `${i * 80}ms` 
                            }}
                          ></div>
                        ))}
                      </div>
                      <span className="text-[10px] text-rose-400 font-medium">REC</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-[#12121f] border border-white/10 rounded-xl min-h-[100px] sm:min-h-[120px] mb-3">
                  <div className="p-3 sm:p-4">
                    <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
                      {userTranscript || (
                        <span className="text-slate-500 flex items-center gap-2 text-xs">
                          <Mic className="w-3 h-3" />
                          Click mic to speak...
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={isListening ? handleStopSpeaking : handleStartSpeaking}
                  disabled={!isUserTurn || isAISpeaking}
                  className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-xs sm:text-sm ${
                    isListening
                      ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-500/30 animate-pulse-glow'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span>Stop & Submit</span>
                    </>
                  ) : isAISpeaking ? (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>AI Speaking...</span>
                    </>
                  ) : !isUserTurn ? (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Wait...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Speak Now</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Agent 1 - Bob */}
              <div className={`card border ${AI_PARTICIPANTS.ai1.borderColor} animate-slide-up p-4 sm:p-5`} style={{ animationDelay: '300ms' }}>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`bg-gradient-to-br ${AI_PARTICIPANTS.ai1.gradient} w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg ${AI_PARTICIPANTS.ai1.shadowColor}`}>
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm sm:text-base">{AI_PARTICIPANTS.ai1.name}</h3>
                      <p className="text-[10px] sm:text-xs text-slate-500">{AI_PARTICIPANTS.ai1.role}</p>
                    </div>
                  </div>
                  {currentSpeaker === 'ai1' && isSpeaking && (
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${AI_PARTICIPANTS.ai1.bgColor} border ${AI_PARTICIPANTS.ai1.borderColor}`}>
                      <Sparkles className={`w-3 h-3 ${AI_PARTICIPANTS.ai1.textColor} animate-pulse`} />
                      <div className="flex items-end gap-0.5">
                        {[0, 1, 2].map((i) => (
                          <div 
                            key={i} 
                            className={`w-0.5 bg-purple-400 rounded-full animate-pulse`}
                            style={{ 
                              height: `${6 + (i % 3) * 4}px`,
                              animationDelay: `${i * 80}ms` 
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-[#12121f] border border-white/10 rounded-xl min-h-[100px] sm:min-h-[120px] mb-3">
                  <div className="p-3 sm:p-4">
                    <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
                      {ai1Typewriter.displayedText || ai1FullResponse || (
                        <span className="text-slate-500 flex items-center gap-2 text-xs">
                          <Brain className="w-3 h-3" />
                          Waiting to respond...
                        </span>
                      )}
                      {ai1Typewriter.isTyping && (
                        <span className="inline-block w-1.5 h-4 bg-purple-400 ml-1 animate-pulse"></span>
                      )}
                    </p>
                  </div>
                </div>
                
                {currentSpeaker === 'ai1' && isSpeaking ? (
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 h-full rounded-full shimmer" />
                  </div>
                ) : ai1FullResponse && (
                  <div className={`p-2 rounded-xl ${AI_PARTICIPANTS.ai1.bgColor} border ${AI_PARTICIPANTS.ai1.borderColor}`}>
                    <p className={`text-[10px] sm:text-xs ${AI_PARTICIPANTS.ai1.textColor} text-center flex items-center justify-center gap-1`}>
                      <Brain className="w-3 h-3" />
                      Building on ideas
                    </p>
                  </div>
                )}
              </div>

              {/* AI Agent 2 - Jannet */}
              <div className={`card border ${AI_PARTICIPANTS.ai2.borderColor} animate-slide-up p-4 sm:p-5`} style={{ animationDelay: '400ms' }}>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`bg-gradient-to-br ${AI_PARTICIPANTS.ai2.gradient} w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg ${AI_PARTICIPANTS.ai2.shadowColor}`}>
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm sm:text-base">{AI_PARTICIPANTS.ai2.name}</h3>
                      <p className="text-[10px] sm:text-xs text-slate-500">{AI_PARTICIPANTS.ai2.role}</p>
                    </div>
                  </div>
                  {currentSpeaker === 'ai2' && isSpeaking && (
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${AI_PARTICIPANTS.ai2.bgColor} border ${AI_PARTICIPANTS.ai2.borderColor}`}>
                      <Sparkles className={`w-3 h-3 ${AI_PARTICIPANTS.ai2.textColor} animate-pulse`} />
                      <div className="flex items-end gap-0.5">
                        {[0, 1, 2].map((i) => (
                          <div 
                            key={i} 
                            className={`w-0.5 bg-emerald-400 rounded-full animate-pulse`}
                            style={{ 
                              height: `${6 + (i % 3) * 4}px`,
                              animationDelay: `${i * 80}ms` 
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-[#12121f] border border-white/10 rounded-xl min-h-[100px] sm:min-h-[120px] mb-3">
                  <div className="p-3 sm:p-4">
                    <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
                      {ai2Typewriter.displayedText || ai2FullResponse || (
                        <span className="text-slate-500 flex items-center gap-2 text-xs">
                          <Brain className="w-3 h-3" />
                          Waiting to respond...
                        </span>
                      )}
                      {ai2Typewriter.isTyping && (
                        <span className="inline-block w-1.5 h-4 bg-emerald-400 ml-1 animate-pulse"></span>
                      )}
                    </p>
                  </div>
                </div>
                
                {currentSpeaker === 'ai2' && isSpeaking ? (
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 h-full rounded-full shimmer" />
                  </div>
                ) : ai2FullResponse && (
                  <div className={`p-2 rounded-xl ${AI_PARTICIPANTS.ai2.bgColor} border ${AI_PARTICIPANTS.ai2.borderColor}`}>
                    <p className={`text-[10px] sm:text-xs ${AI_PARTICIPANTS.ai2.textColor} text-center flex items-center justify-center gap-1`}>
                      <Zap className="w-3 h-3" />
                      Challenging viewpoints
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Controls Card */}
            <div className="card border border-purple-500/20 animate-slide-up p-4 sm:p-6" style={{ animationDelay: '500ms' }}>
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
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 border border-white/5">
                <p className="text-sm text-slate-400 text-center flex items-center justify-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  3-way GD: You + 2 AI participants share the 90-second discussion round
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
