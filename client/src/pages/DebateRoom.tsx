import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Clock, User, Bot, Sparkles, Brain, Users } from 'lucide-react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import Navbar from '../components/Navbar';

interface Debate {
  id: string;
  topic: string;
  userStance: string;
  aiStance: string;
  currentRound: number;
  initialMessage?: string;
  durationMinutes?: number;
  sessionStartedAt?: string;
  sessionExpiresAt?: string;
}

const formatCountdown = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

function DebateRoom() {
  const { debateId } = useParams();
  const navigate = useNavigate();
  const [debate, setDebate] = useState<Debate | null>(null);
  const [userTranscript, setUserTranscript] = useState('');
  const [currentSpeaker, setCurrentSpeaker] = useState<'user' | 'ai1' | 'ai2' | null>(null);
  const [timeLeft, setTimeLeft] = useState(90);
  const [sessionSecondsLeft, setSessionSecondsLeft] = useState<number | null>(null);
  const [isUserTurn, setIsUserTurn] = useState(false); // Start with AI turn, not user
  const [isAISpeaking, setIsAISpeaking] = useState(false); // Track if any AI is currently speaking
  const [isProcessing, setIsProcessing] = useState(false); // Prevent double API calls
  const [isEnding, setIsEnding] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false); // Don't start timer until AI finishes
  const [aiHasSpoken, setAiHasSpoken] = useState(false); // Track if AI has spoken this round
  const socketRef = useRef<Socket | null>(null);
  const isProcessingRef = useRef(false);
  const sessionEndPendingRef = useRef(false);
  const finishStartedRef = useRef(false);
  
  const {
    isListening,
    startListening,
    stopListening,
    isSupported: isSpeechSupported,
    lastError: speechError,
  } = useSpeechRecognition(
    (transcript) => setUserTranscript(transcript)
  );
  
  const { speak, stop: stopSpeech } = useSpeechSynthesis();

  // Function to get AI responses and have them speak first
  const getAIResponses = async (userInput: string = '') => {
    // Prevent double calls
    if (isProcessing) {
      console.log('⚠️ Already processing, skipping...');
      return;
    }
    
    try {
      isProcessingRef.current = true;
      setIsProcessing(true);
      setIsUserTurn(false);
      setIsTimerActive(false);
      
      // Call the API to get AI responses
      const response = await axios.post(`/api/debates/${debateId}/argument`, {
        argument: userInput,
        duration: userInput ? (90 - timeLeft) : 0
      });

      // ============ CHECK IF DEBATE HAS ENDED ============
      if (response.data.debateEnded) {
        console.log('🏁 GD Session completed - redirecting to summary');
        isProcessingRef.current = false;
        setIsProcessing(false);
        if (sessionEndPendingRef.current) {
          await endGD();
          return;
        }
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
      }
      
      setIsAISpeaking(true); // Mark AI as speaking

      // Speak every Colab turn in order. Older notebooks return only one turn,
      // so build the same list from the legacy participant fields when needed.
      const aiTurns: Array<{ speaker: string; text: string }> = response.data.aiTurns?.length
        ? response.data.aiTurns
        : [
            { speaker: 'Bob', text: response.data.aiResponse || '' },
            { speaker: 'Jannet', text: response.data.ai2Response || '' },
          ].filter((turn) => turn.text);

      for (const [turnIndex, turn] of aiTurns.entries()) {
        const isBob = turn.speaker.toLowerCase() === 'bob';
        const text = turn.text;
        if (!text) continue;

        setCurrentSpeaker(isBob ? 'ai1' : 'ai2');
        await speak(text, isBob ? 'male' : 'female');
        setCurrentSpeaker(null);

        if (turnIndex < aiTurns.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 900));
        }
      }

      setIsAISpeaking(false); // AI finished speaking
      
      // ============ NOW IT'S USER'S TURN ============
      console.log('👤 Now it\'s user\'s turn to speak!');
      await new Promise(resolve => setTimeout(resolve, 500));
      setCurrentSpeaker(null);
      setIsAISpeaking(false); // Ensure AI speaking flag is off
      isProcessingRef.current = false;
      setIsProcessing(false); // Allow new API calls
      if (sessionEndPendingRef.current) {
        await endGD();
        return;
      }
      setIsUserTurn(true);
      setAiHasSpoken(true);
      setTimeLeft(90); // Reset timer for user
      setIsTimerActive(true); // Start timer for user's turn
      console.log('✅ User turn activated - mic should be enabled now');
      
    } catch (error) {
      console.error('Error getting AI responses:', error);
      if (userInput) {
        setUserTranscript(userInput);
      }
      isProcessingRef.current = false;
      if (sessionEndPendingRef.current) {
        await endGD();
        return;
      }
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
    socketRef.current = io('/', {
      path: '/socket.io',
      transports: ['websocket', 'polling']
    });
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

  // Play the opening message created with the Colab session. The test UI follows
  // this same flow: Bob opens, then a bot replies after each student turn.
  useEffect(() => {
    if (debate && !aiHasSpoken && !isProcessing) {
      const opening = debate.initialMessage?.trim();
      if (!opening) {
        console.error('GD session has no opening message');
        setIsUserTurn(true);
        setIsTimerActive(true);
        setAiHasSpoken(true);
        return;
      }

      setAiHasSpoken(true);
      setIsProcessing(true);
      setIsUserTurn(false);
      setIsTimerActive(false);
      setIsAISpeaking(true);
      setCurrentSpeaker('ai1');
      isProcessingRef.current = true;
      setIsProcessing(true);
      void speak(opening, 'male').then(() => {
        setCurrentSpeaker(null);
        setIsAISpeaking(false);
        isProcessingRef.current = false;
        setIsProcessing(false);
        if (sessionEndPendingRef.current) {
          void endGD();
          return;
        }
        setIsUserTurn(true);
        setTimeLeft(90);
        setIsTimerActive(true);
      });
    }
  }, [debate, aiHasSpoken, isProcessing, speak]);

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
    if (!isSpeechSupported) {
      return;
    }
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
    if (isEnding || sessionEndPendingRef.current || !userTranscript.trim()) return;
    
    setIsTimerActive(false);
    const userInput = userTranscript;
    setUserTranscript(''); // Clear for next input
    
    // AI speaks after user input (they will respond to what user said)
    await getAIResponses(userInput);
  };

  const endGD = useCallback(async () => {
    if (finishStartedRef.current) return;
    if (isProcessingRef.current) {
      sessionEndPendingRef.current = true;
      setIsEnding(true);
      setIsTimerActive(false);
      setIsUserTurn(false);
      stopListening();
      stopSpeech();
      return;
    }

    finishStartedRef.current = true;
    sessionEndPendingRef.current = false;
    setIsEnding(true);
    setIsTimerActive(false);
    setIsUserTurn(false);
    stopListening();
    stopSpeech();
    try {
      // Call the finish endpoint to get the final report from Colab
      await axios.post(`/api/debates/${debateId}/finish`);
    } catch (error) {
      console.error('Error finishing debate:', error);
    }
    navigate(`/summary/${debateId}`);
  }, [debateId, navigate, stopListening, stopSpeech]);

  useEffect(() => {
    if (!debate) return;

    const durationMinutes = debate.durationMinutes || 10;
    const storedExpiry = debate.sessionExpiresAt ? Date.parse(debate.sessionExpiresAt) : NaN;
    const sessionStart = Date.parse(debate.sessionStartedAt || '');
    const expiry = Number.isFinite(storedExpiry)
      ? storedExpiry
      : (Number.isFinite(sessionStart) ? sessionStart : Date.now()) + durationMinutes * 60 * 1000;

    const updateRemaining = () => {
      const seconds = Math.max(0, Math.ceil((expiry - Date.now()) / 1000));
      setSessionSecondsLeft(seconds);
      if (seconds === 0 && !finishStartedRef.current && !sessionEndPendingRef.current) {
        sessionEndPendingRef.current = true;
        setIsEnding(true);
        setIsTimerActive(false);
        setIsUserTurn(false);
        stopListening();
        stopSpeech();
        if (!isProcessingRef.current) void endGD();
      }
    };

    updateRemaining();
    const timer = window.setInterval(updateRemaining, 1000);
    return () => window.clearInterval(timer);
  }, [debate, endGD, stopListening, stopSpeech]);

  if (!debate) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-[#c3e879]/20 rounded-full mx-auto mb-6"></div>
              <div className="w-20 h-20 border-4 border-[#c3e879] border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 -translate-x-1/2"></div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Initializing AI Session</h2>
            <p className="text-slate-400">Preparing your debate environment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative isolate overflow-hidden bg-[#0c1118]">
      <Navbar />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(195,232,121,0.07),transparent_32%),radial-gradient(ellipse_at_90%_24%,rgba(137,189,166,0.06),transparent_30%)]" />
      
      <div className="pt-16 sm:pt-20 px-3 sm:px-4 lg:px-6 pb-4 sm:pb-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-5">
            {/* Header Card */}
            <div className="card border border-white/[0.08] animate-slide-up p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="bg-gradient-to-br from-[#89bda6] to-[#c3e879] w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-[#89bda6]/20 flex-shrink-0">
                      <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white leading-tight truncate">{debate.topic}</h1>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                        <span className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-slate-400">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                          Discussion in progress
                        </span>
                        <span className={`flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm ${sessionSecondsLeft !== null && sessionSecondsLeft <= 60 ? 'text-rose-300' : 'text-emerald-300'}`} aria-live="polite">
                          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          {isEnding ? 'Ending session…' : `Session ends in ${formatCountdown(sessionSecondsLeft ?? (debate.durationMinutes || 10) * 60)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 self-end sm:self-auto">
                  <div className="px-3 sm:px-5 py-2 sm:py-3 bg-gradient-to-br from-[#89bda6] to-[#c3e879] rounded-xl sm:rounded-2xl text-[#17200d] shadow-xl shadow-[#89bda6]/20">
                    <div className="text-[10px] sm:text-xs font-medium opacity-80 uppercase tracking-wider">Your Score</div>
                    <div className="text-2xl sm:text-3xl font-bold">{userScore}</div>
                    <div className="text-[10px] sm:text-xs opacity-70">points</div>
                  </div>
                </div>
              </div>
              
            </div>

            {/* Live discussion stage: conversation content stays in the background */}
            <section className="card flex min-h-[430px] flex-col overflow-hidden p-0" aria-label="Live group discussion">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 sm:px-7">
                <div>
                  <h2 className="text-base font-semibold text-white sm:text-lg">Live discussion</h2>
                  <p className="mt-1 text-xs text-slate-500" aria-live="polite">
                    {isListening
                      ? 'You are speaking'
                      : isAISpeaking
                        ? `${currentSpeaker === 'ai1' ? 'Bob' : currentSpeaker === 'ai2' ? 'Jannet' : 'Your group'} is speaking`
                        : isUserTurn
                          ? 'Your turn'
                          : 'Getting the discussion ready'}
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] text-slate-400">
                  <Users className="h-4 w-4" />
                </div>
              </div>

              <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
                <div className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                  {[
                    {
                      id: 'user',
                      name: 'You',
                      icon: User,
                      active: isListening || (isUserTurn && !isAISpeaking),
                      activeLabel: isListening ? 'Speaking' : 'Your turn',
                      accent: 'border-blue-400/25 bg-blue-400/[0.06] text-blue-200',
                      iconAccent: 'bg-blue-400/15 text-blue-200',
                    },
                    {
                      id: 'ai1',
                      name: 'Bob',
                      icon: Bot,
                      active: currentSpeaker === 'ai1',
                      activeLabel: 'Speaking',
                      accent: 'border-[#89bda6]/30 bg-[#89bda6]/[0.07] text-[#c5e6d4]',
                      iconAccent: 'bg-[#89bda6]/15 text-[#c5e6d4]',
                    },
                    {
                      id: 'ai2',
                      name: 'Jannet',
                      icon: Bot,
                      active: currentSpeaker === 'ai2',
                      activeLabel: 'Speaking',
                      accent: 'border-[#c3e879]/30 bg-[#c3e879]/[0.07] text-[#e0f2b2]',
                      iconAccent: 'bg-[#c3e879]/15 text-[#e0f2b2]',
                    },
                  ].map((participant) => {
                    const Icon = participant.icon;
                    return (
                      <div
                        key={participant.id}
                        className={`flex min-h-36 flex-col items-center justify-center rounded-2xl border px-4 py-6 text-center transition-all duration-300 ${
                          participant.active
                            ? participant.accent
                            : 'border-white/[0.07] bg-white/[0.02] text-slate-400'
                        }`}
                      >
                        <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full ${participant.active ? participant.iconAccent : 'bg-white/[0.05] text-slate-400'}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="text-sm font-semibold text-white">{participant.name}</div>
                        <div className="mt-2 h-4 text-[11px] text-slate-400">
                          {participant.active ? participant.activeLabel : ' '}
                        </div>
                        {participant.active && (
                          <div className="mt-1 flex h-4 items-center gap-1" aria-hidden="true">
                            {[0, 1, 2, 3, 4].map((bar) => (
                              <span
                                key={bar}
                                className="w-1 animate-pulse rounded-full bg-current"
                                style={{ height: `${6 + ((bar * 7) % 10)}px`, animationDelay: `${bar * 90}ms` }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-white/[0.06] bg-[#101514]/80 p-3 sm:p-4">
                {speechError && <p className="mb-2 rounded-lg border border-amber-400/15 bg-amber-400/[0.05] px-3 py-2 text-xs text-amber-200">{speechError}</p>}
                <div className="flex items-end gap-2 rounded-2xl border border-white/[0.1] bg-[#0c1110] p-2 focus-within:border-[#c3e879]/35">
                  {isListening ? (
                    <div className="flex min-h-12 flex-1 items-center gap-3 px-3 text-sm text-slate-400" aria-live="polite">
                      <span className="flex h-4 items-center gap-1" aria-hidden="true">
                        {[0, 1, 2, 3].map((bar) => (
                          <span key={bar} className="w-1 animate-pulse rounded-full bg-rose-300" style={{ height: `${6 + bar * 2}px`, animationDelay: `${bar * 100}ms` }} />
                        ))}
                      </span>
                      Listening…
                    </div>
                  ) : (
                    <textarea
                      value={userTranscript}
                      onChange={(event) => setUserTranscript(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey && isUserTurn && !isAISpeaking && userTranscript.trim() && !isEnding) {
                          event.preventDefault();
                          void submitArgument();
                        }
                      }}
                      placeholder="Add a point to the discussion…"
                      aria-label="Your discussion message"
                      rows={2}
                      className="max-h-36 min-h-12 flex-1 resize-y bg-transparent px-3 py-2 text-sm leading-6 text-slate-100 placeholder:text-slate-500 focus:outline-none"
                    />
                  )}
                  <button
                    type="button"
                    onClick={isListening ? handleStopSpeaking : handleStartSpeaking}
                    disabled={!isListening && (!isUserTurn || isAISpeaking || !isSpeechSupported || isEnding)}
                    aria-label={isListening ? 'Stop recording and submit' : 'Speak your message'}
                    title={isListening ? 'Stop recording and submit' : 'Speak your message'}
                    className={`mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${isListening ? 'bg-rose-500/15 text-rose-300' : 'text-slate-400 hover:bg-white/[0.08] hover:text-white'}`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  {!isListening && (
                    <button
                      type="button"
                      onClick={submitArgument}
                      disabled={!isUserTurn || isAISpeaking || !userTranscript.trim() || isEnding}
                      className="mb-1 rounded-full bg-[#c3e879] px-4 py-2 text-sm font-semibold text-[#17200d] transition-colors hover:bg-[#d1ef93] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Send
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Controls Card */}
            <div className="card border border-white/[0.08] animate-slide-up p-4 sm:p-6" style={{ animationDelay: '500ms' }}>
              <div className="flex justify-center">
                <button
                  onClick={endGD}
                  disabled={isEnding}
                  className="btn-secondary flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-3"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isEnding ? 'Ending session…' : 'End session & view feedback'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebateRoom;
