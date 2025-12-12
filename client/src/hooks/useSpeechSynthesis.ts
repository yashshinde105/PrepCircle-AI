import { useState, useCallback, useRef } from 'react';

// Voice types for different speakers
export type VoiceType = 'male' | 'female';

// Get a voice by gender preference
const getVoiceByGender = (gender: VoiceType): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  
  if (gender === 'female') {
    // Try to find a female voice
    const femaleVoice = voices.find(v => 
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('woman') ||
      v.name.toLowerCase().includes('zira') ||
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('victoria') ||
      v.name.toLowerCase().includes('karen') ||
      v.name.toLowerCase().includes('moira') ||
      v.name.toLowerCase().includes('tessa') ||
      v.name.toLowerCase().includes('fiona') ||
      v.name.includes('Google UK English Female') ||
      v.name.includes('Google US English') && !v.name.toLowerCase().includes('male')
    );
    if (femaleVoice) return femaleVoice;
  } else {
    // Try to find a male voice
    const maleVoice = voices.find(v => 
      v.name.toLowerCase().includes('male') ||
      v.name.toLowerCase().includes('david') ||
      v.name.toLowerCase().includes('mark') ||
      v.name.toLowerCase().includes('james') ||
      v.name.toLowerCase().includes('daniel') ||
      v.name.toLowerCase().includes('google uk english male')
    );
    if (maleVoice) return maleVoice;
  }
  
  // Return first English voice as fallback
  return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
};

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, voiceType: VoiceType = 'male', onEnd?: () => void): Promise<void> => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech first and wait a bit
        window.speechSynthesis.cancel();
        currentUtteranceRef.current = null;
        
        // Small delay to ensure previous speech is fully cancelled
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1.0;
          utterance.volume = 1.0;
          utterance.lang = 'en-US';
          
          // Set voice based on gender
          const voice = getVoiceByGender(voiceType);
          if (voice) {
            utterance.voice = voice;
            console.log(`🎤 Using voice: ${voice.name} (${voiceType})`);
          }
          
          // Adjust pitch for gender (female slightly higher)
          utterance.pitch = voiceType === 'female' ? 1.2 : 0.9;
          
          currentUtteranceRef.current = utterance;

          utterance.onstart = () => {
            console.log('🔊 Speech started');
            setIsSpeaking(true);
          };

          utterance.onend = () => {
            console.log('🔇 Speech ended');
            setIsSpeaking(false);
            currentUtteranceRef.current = null;
            onEnd?.();
            resolve();
          };

          utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            setIsSpeaking(false);
            currentUtteranceRef.current = null;
            onEnd?.();
            resolve();
          };

          window.speechSynthesis.speak(utterance);
          
          // Chrome bug workaround: speech synthesis sometimes pauses on long text
          // This keeps it alive by checking periodically
          const keepAlive = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
              clearInterval(keepAlive);
            } else {
              window.speechSynthesis.pause();
              window.speechSynthesis.resume();
            }
          }, 10000);
          
          utterance.onend = () => {
            clearInterval(keepAlive);
            console.log('🔇 Speech ended');
            setIsSpeaking(false);
            currentUtteranceRef.current = null;
            onEnd?.();
            resolve();
          };
          
        }, 100);
      } else {
        console.error('Speech synthesis not supported');
        resolve();
      }
    });
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      currentUtteranceRef.current = null;
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking };
};
