import { useState, useEffect } from 'react';

export const useSpeechRecognition = (onTranscript: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const hasSpeechApi = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    if (hasSpeechApi) {
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
        const errorMap: Record<string, string> = {
          'not-allowed': 'Microphone permission denied. Allow mic access in browser site settings.',
          'service-not-allowed': 'Speech service blocked by the browser. Check microphone/site permissions.',
          'audio-capture': 'No microphone detected. Connect a mic and try again.',
          'network': 'Speech recognition network error. Check internet connection and retry.',
          'no-speech': 'No speech detected. Please speak clearly and try again.',
          'aborted': 'Speech capture was interrupted. Try clicking Speak Now again.',
        };
        setLastError(errorMap[event.error] || `Speech recognition failed: ${event.error}`);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      console.error('Speech recognition not supported');
      setIsSupported(false);
      setLastError('This browser does not support speech recognition. Use Chrome/Edge or type your reply.');
    }
  }, []);

  const requestMicrophoneAccess = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setHasMicPermission(false);
      setLastError('Microphone API is unavailable in this browser. Use Chrome/Edge and HTTPS/localhost.');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setHasMicPermission(true);
      setLastError(null);
      return true;
    } catch (error: any) {
      setHasMicPermission(false);
      const permissionError = error?.name === 'NotAllowedError'
        ? 'Microphone permission was denied. Please allow mic access and reload the page.'
        : error?.name === 'NotFoundError'
          ? 'No microphone device was found. Connect a microphone and try again.'
          : 'Could not access microphone. Check browser/site permissions.';
      setLastError(permissionError);
      return false;
    }
  };

  const startListening = async () => {
    setLastError(null);
    if (!recognition) {
      setLastError('Microphone is not ready in this browser. Use Chrome/Edge or type your reply.');
      return;
    }

    if (!isSupported) {
      setLastError('Speech recognition is not supported in this browser.');
      return;
    }

    if (!window.isSecureContext) {
      setLastError('Web Speech requires a secure context (HTTPS or localhost). Open the app via HTTPS or localhost.');
      return;
    }

    if (hasMicPermission !== true) {
      const granted = await requestMicrophoneAccess();
      if (!granted) {
        return;
      }
    }

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
          setLastError('Could not start microphone. Check browser permissions and retry.');
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

  return { isListening, startListening, stopListening, isSupported, lastError, hasMicPermission };
};
