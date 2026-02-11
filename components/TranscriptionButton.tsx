
import React, { useState, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
// Correct import: Modality is required for Live API responseModalities configuration
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

interface TranscriptionButtonProps {
  onTranscription: (text: string) => void;
  className?: string;
}

const TranscriptionButton: React.FC<TranscriptionButtonProps> = ({ onTranscription, className }) => {
  const [isListening, setIsListening] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Manual implementation of base64 encoding as per @google/genai guidelines
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Convert microphone Float32Array to raw 16-bit PCM Blob for the Live API
  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      // Supported audio MIME type for Gemini Live API
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const startListening = async () => {
    if (!process.env.API_KEY) return;
    setIsInitializing(true);

    try {
      // Create a fresh GoogleGenAI instance right before the connection
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = inputAudioContext;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              // Ensure data is sent only after the session promise resolves to prevent race conditions
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
            
            setIsListening(true);
            setIsInitializing(false);
          },
          // Explicitly type the message as LiveServerMessage
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              if (text) onTranscription(text);
            }
            // Note: Even if only transcription is desired, any returned audio output must still be processed if it arrives.
          },
          onerror: (e) => {
            console.error('Transcription error:', e);
            stopListening();
          },
          onclose: () => {
            stopListening();
          },
        },
        config: {
          // Fix: responseModalities must be an array containing exactly one Modality.AUDIO element
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          systemInstruction: 'You are transcribing the user. Do not respond verbally. Just transcribe accurately.'
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start transcription:', err);
      setIsInitializing(false);
    }
  };

  const stopListening = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsListening(false);
    setIsInitializing(false);
  };

  const toggleListening = () => {
    if (isListening) stopListening();
    else startListening();
  };

  return (
    <button
      onClick={toggleListening}
      disabled={isInitializing}
      className={`p-2 rounded-lg transition-all flex items-center justify-center ${
        isListening 
          ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse' 
          : 'bg-zinc-800 text-zinc-500 hover:text-amber-500 border border-zinc-700'
      } ${className}`}
      title={isListening ? "Stop Dictation" : "Start Voice Dictation"}
    >
      {isInitializing ? (
        <Loader2 size={16} className="animate-spin" />
      ) : isListening ? (
        <MicOff size={16} />
      ) : (
        <Mic size={16} />
      )}
    </button>
  );
};

export default TranscriptionButton;
