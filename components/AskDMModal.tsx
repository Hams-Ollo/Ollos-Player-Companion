import React, { useState } from 'react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { checkRateLimit } from '../utils';
import { createChatWithContext } from '../lib/gemini';

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
      checkRateLimit(); // Enforce rate limit

      const chat = await createChatWithContext(
        messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        })),
        "You are an expert Dungeon Master for Dungeons & Dragons 5th Edition. Answer the player's questions about rules concisely but thoroughly. If asking about a specific spell or ability, cite the rule mechanics clearly. Reference page numbers from the source books when possible.\n\nFORMATTING RULES:\n- Use **Markdown** for all responses.\n- Use **Bold** for key terms, dice rolls (e.g., **1d6**), and mechanic names.\n- Use `Tables` when listing Item stats (Name, Cost, Weight, Damage) or Level progression.\n- Use Bullet points for lists of properties or options.\n- You are helpful, authoritative, and immersive."
      );

      const result = await chat.sendMessage({ message: userMsg });
      
      setMessages(prev => [...prev, { role: 'model', text: result.text || "The spirits are silent..." }]);

    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || "A magical disturbance prevents me from answering.";
      setMessages(prev => [...prev, { role: 'model', text: `*${errorMessage}*` }]);
    } finally {
      setLoading(false);
    }
  };

  // Custom components to style Markdown elements with Tailwind
  const MarkdownComponents = {
    p: ({node, ...props}: any) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
    ul: ({node, ...props}: any) => <ul className="list-disc pl-5 mb-3 space-y-1 text-zinc-300" {...props} />,
    ol: ({node, ...props}: any) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-zinc-300" {...props} />,
    li: ({node, ...props}: any) => <li className="pl-1" {...props} />,
    h1: ({node, ...props}: any) => <h1 className="text-xl font-bold mb-3 text-amber-500 font-display mt-4 first:mt-0" {...props} />,
    h2: ({node, ...props}: any) => <h2 className="text-lg font-bold mb-2 text-amber-400 font-display mt-3" {...props} />,
    h3: ({node, ...props}: any) => <h3 className="text-md font-bold mb-2 text-amber-300 font-display mt-2" {...props} />,
    strong: ({node, ...props}: any) => <strong className="font-bold text-amber-200" {...props} />,
    em: ({node, ...props}: any) => <em className="italic text-zinc-400" {...props} />,
    table: ({node, ...props}: any) => (
      <div className="overflow-x-auto my-3 rounded-lg border border-zinc-700">
        <table className="min-w-full divide-y divide-zinc-700 bg-zinc-900/50" {...props} />
      </div>
    ),
    thead: ({node, ...props}: any) => <thead className="bg-black/40" {...props} />,
    tbody: ({node, ...props}: any) => <tbody className="divide-y divide-zinc-700/50" {...props} />,
    tr: ({node, ...props}: any) => <tr className="hover:bg-white/5 transition-colors" {...props} />,
    th: ({node, ...props}: any) => <th className="px-4 py-2 text-left text-xs font-bold text-amber-500 uppercase tracking-wider" {...props} />,
    td: ({node, ...props}: any) => <td className="px-4 py-2 text-sm text-zinc-300" {...props} />,
    blockquote: ({node, ...props}: any) => <blockquote className="border-l-4 border-amber-600/50 pl-4 py-1 italic text-zinc-400 my-3 bg-amber-900/10 rounded-r" {...props} />,
    a: ({node, ...props}: any) => <a className="text-amber-500 hover:text-amber-400 underline decoration-amber-500/50 hover:decoration-amber-400" target="_blank" rel="noopener noreferrer" {...props} />,
    code: ({node, ...props}: any) => <code className="bg-zinc-950 px-1.5 py-0.5 rounded text-xs font-mono text-amber-300 border border-zinc-700/50" {...props} />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm sm:p-4 animate-in fade-in">
      <div className="bg-zinc-900 border-t sm:border border-zinc-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md md:max-w-lg lg:max-w-xl h-[80vh] sm:h-[70vh] md:h-[75vh] flex flex-col shadow-2xl">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 rounded-t-2xl">
          <h3 className="text-xl font-display font-bold text-amber-500 flex items-center gap-2">
            <Bot size={24} />
            Ask the DM
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white" aria-label="Close" title="Close"><X size={24} /></button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-[#111]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-700' : 'bg-amber-900/50'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-amber-500" />}
              </div>
              <div className={`p-3 rounded-xl max-w-[85%] text-sm ${
                msg.role === 'user' 
                  ? 'bg-zinc-800 text-zinc-200' 
                  : 'bg-amber-950/20 text-amber-100 border border-amber-900/30'
              }`}>
                {msg.role === 'user' ? (
                  msg.text
                ) : (
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={MarkdownComponents}
                  >
                    {msg.text}
                  </ReactMarkdown>
                )}
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
                  aria-label="Send message"
                  title="Send message"
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