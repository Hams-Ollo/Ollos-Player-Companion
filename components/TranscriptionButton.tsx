
import React, { useState, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { getAuth } from 'firebase/auth';

interface TranscriptionButtonProps {
  onTranscription: (text: string) => void;
  className?: string;
}

const LIVE_MODEL = 'models/gemini-2.5-flash-native-audio-preview-12-2025';

const TranscriptionButton: React.FC<TranscriptionButtonProps> = ({ onTranscription, className }) => {
  const [isListening, setIsListening] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Base64-encode raw bytes (avoids btoa string-from-codePoint issues with high bytes)
  const encode = (bytes: Uint8Array): string => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Convert microphone Float32Array to raw 16-bit PCM, return base64 string
  const float32ToPcmBase64 = (data: Float32Array): string => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) {
      int16[i] = Math.max(-32768, Math.min(32767, data[i] * 32768));
    }
    return encode(new Uint8Array(int16.buffer));
  };

  const stopListening = () => {
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setIsListening(false);
    setIsInitializing(false);
  };

  const startListening = async () => {
    setIsInitializing(true);

    try {
      // Get Firebase ID token — the key never leaves the server
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) { setIsInitializing(false); return; }
      const idToken = await user.getIdToken();

      // Request microphone before opening WS to detect permission errors early
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Connect to our server-side WS proxy; it forwards to Gemini with the real key
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(
        `${wsProtocol}//${window.location.host}/api/gemini/live?token=${encodeURIComponent(idToken)}`
      );
      wsRef.current = ws;

      ws.onopen = () => {
        // 1. Send Gemini Live setup — request TEXT modality so we only get transcription back
        ws.send(JSON.stringify({
          setup: {
            model: LIVE_MODEL,
            generationConfig: {
              responseModalities: ['AUDIO'],
            },
            inputAudioTranscription: {},
            systemInstruction: {
              parts: [{ text: 'You are a transcription service. Transcribe the user\'s speech accurately. Do not respond verbally.' }],
            },
          },
        }));

        // 2. Start audio capture pipeline
        const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        audioContextRef.current = inputAudioContext;

        const source = inputAudioContext.createMediaStreamSource(stream);
        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);

        scriptProcessor.onaudioprocess = (e) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          const pcmB64 = float32ToPcmBase64(e.inputBuffer.getChannelData(0));
          ws.send(JSON.stringify({
            realtimeInput: {
              mediaChunks: [{ data: pcmB64, mimeType: 'audio/pcm;rate=16000' }],
            },
          }));
        };

        source.connect(scriptProcessor);
        scriptProcessor.connect(inputAudioContext.destination);

        setIsListening(true);
        setIsInitializing(false);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string);
          const text = msg?.serverContent?.inputTranscription?.text;
          if (text) onTranscription(text);
        } catch {
          // ignore non-JSON frames
        }
      };

      ws.onerror = () => stopListening();
      ws.onclose = () => stopListening();

    } catch (err) {
      console.error('Failed to start transcription:', err);
      stopListening();
    }
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
