import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Clock, User, Bot } from 'lucide-react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface Debate {
  id: string;
  topic: string;
  userStance: string;
  aiStance: string;
  currentRound: number;
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
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="card mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">📋 {debate.topic}</h1>
              <p className="text-gray-600">Round {roundNumber} • GD Practice Session</p>
            </div>
            <div className="text-right">
              <div className="text-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
                <div className="text-sm font-medium">Your Performance</div>
                <div className="text-3xl font-bold">{userScore}</div>
                <div className="text-xs opacity-90">points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="card mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Clock className="w-6 h-6" />
            <span className="text-4xl font-bold">{timeLeft}s</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all ${
                timeLeft > 30 ? 'bg-green-500' : timeLeft > 10 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${(timeLeft / 90) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {isTimerActive ? '⏱️ Timer running for both you and AI moderator' : '⏸️ Round paused'}
          </p>
        </div>

        {/* GD Area */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* User Side */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Your Response</h3>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg min-h-48 mb-4">
              <p className="text-gray-800">{userTranscript || 'Click the microphone to start speaking...'}</p>
            </div>
            <button
              onClick={isListening ? handleStopSpeaking : handleStartSpeaking}
              disabled={!isUserTurn || isSpeaking}
              className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-primary hover:bg-blue-600 text-white disabled:opacity-50'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {isListening ? 'Stop Speaking' : 'Start Speaking'}
            </button>
          </div>

          {/* AI Moderator Side */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-6 h-6 text-secondary" />
              <h3 className="text-lg font-semibold">AI Moderator Feedback</h3>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg min-h-48 mb-4">
              <p className="text-gray-800">
                {isSpeaking ? '🔊 Speaking...' : moderatorResponse || 'Waiting for your point...'}
              </p>
            </div>
            {isSpeaking && (
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full animate-pulse w-full" />
              </div>
            )}
            {!isSpeaking && moderatorResponse && (
              <div className="text-sm text-gray-600 italic">
                💡 The moderator is challenging you to think deeper!
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="card text-center">
          <div className="flex gap-4 justify-center mb-4">
            <button
              onClick={startNewRound}
              disabled={timeLeft > 0 && isTimerActive}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start New Round
            </button>
            <button
              onClick={endGD}
              className="btn-secondary"
            >
              End Session & View Feedback
            </button>
          </div>
          <p className="text-sm text-gray-500">
            💡 Tip: Both you and the AI share the same 90-second timer. Respond quickly to have a back-and-forth discussion!
          </p>
        </div>
      </div>
    </div>
  );
}

export default DebateRoom;
