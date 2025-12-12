import { useState, useEffect } from 'react';

export const useSpeechRecognition = (onTranscript: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript || interimTranscript) {
          onTranscript(finalTranscript || interimTranscript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      console.error('Speech recognition not supported');
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      // Check if already listening to avoid InvalidStateError
      if (isListening) {
        console.log('🎤 Already listening, skipping start');
        return;
      }
      try {
        recognition.start();
        setIsListening(true);
        console.log('🎤 Started listening');
      } catch (error: any) {
        // Handle case where recognition is already started
        if (error.name === 'InvalidStateError') {
          console.log('🎤 Recognition already active');
          setIsListening(true);
        } else {
          console.error('Error starting recognition:', error);
        }
      }
    }
  };

  const stopListening = () => {
    if (recognition) {
      try {
        recognition.stop();
        console.log('🎤 Stopped listening');
      } catch (error) {
        console.log('🎤 Recognition already stopped');
      }
      setIsListening(false);
    }
  };

  return { isListening, startListening, stopListening };
};
