import React, { useState } from 'react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AskDMModalProps {
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AskDMModal: React.FC<AskDMModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'I am the Dungeon Master. Ask me anything about your abilities, spells, or the rules of 5th Edition.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!process.env.API_KEY) {
        setMessages(prev => [...prev, {role: 'model', text: 'Error: API Key missing.'}]);
        return;
    }

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Using gemini-3-flash-preview for text chat
      const model = 'gemini-3-flash-preview'; 

      const chat = ai.chats.create({
        model: model,
        config: {
            systemInstruction: "You are an expert Dungeon Master for Dungeons & Dragons 5th Edition. You have comprehensive knowledge of the Player's Handbook, Dungeon Master's Guide, Xanathar's, and Tasha's. Answer the player's questions about rules concisely but thoroughly. If asking about a specific spell or ability, cite the rule mechanics clearly. You are helpful, authoritative, and immersive.",
        },
        history: messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }))
      });

      const result = await chat.sendMessage({ message: userMsg });
      
      setMessages(prev => [...prev, { role: 'model', text: result.text || "The spirits are silent..." }]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "A magical disturbance prevents me from answering." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm sm:p-4 animate-in fade-in">
      <div className="bg-zinc-900 border-t sm:border border-zinc-700 rounded-t-2xl sm:rounded-2xl w-full max-w-md h-[80vh] flex flex-col shadow-2xl">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 rounded-t-2xl">
          <h3 className="text-xl font-display font-bold text-amber-500 flex items-center gap-2">
            <Bot size={24} />
            Ask the DM
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={24} /></button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-[#111]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-700' : 'bg-amber-900/50'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-amber-500" />}
              </div>
              <div className={`p-3 rounded-xl max-w-[80%] text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-zinc-800 text-zinc-200' 
                  : 'bg-amber-950/30 text-amber-100 border border-amber-900/30'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-900/50 flex items-center justify-center shrink-0">
                    <Loader2 className="animate-spin text-amber-500" size={16} />
                </div>
                <div className="p-3 bg-amber-950/30 rounded-xl">
                    <span className="text-xs text-amber-500/70">Consulting the ancient texts...</span>
                </div>
             </div>
          )}
        </div>

        <div className="p-4 bg-zinc-950 border-t border-zinc-800">
            <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a rule question..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="absolute right-2 top-1.5 p-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full transition-colors disabled:opacity-50 disabled:bg-zinc-700"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AskDMModal;
