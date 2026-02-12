
import React, { useState, useEffect } from 'react';
import { Feature, Item, Spell } from '../types';
import { X, Book, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { checkRateLimit } from '../utils';
import { generateWithContext } from '../lib/gemini';

interface ItemDetailModalProps {
  // Fix: Added Spell to the union type to resolve assignment errors from Dashboard.tsx
  item: Item | Feature | Spell;
  onClose: () => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  const [details, setDetails] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Fix: Check if it's a feature, spell, or item to show existing info first
  const isFeature = 'fullText' in item;
  const isSpell = 'level' in item;
  const initialText = isFeature ? (item as Feature).fullText : 
                      isSpell ? (item as Spell).description : 
                      (item as Item).notes || '';

  useEffect(() => {
    if (initialText && initialText.length > 50) {
        setDetails(initialText);
    } else {
        fetchDetails();
    }
  }, [item]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
        checkRateLimit(); // Enforce rate limit

        // Fix: Determine the correct category for the prompt based on type checks
        const category = isFeature ? 'feature' : isSpell ? 'spell' : 'item';
        const prompt = `Using the reference documents, provide a detailed, rules-accurate description for the D&D 5e ${category}: "${item.name}". Include mechanics, stats (if item), and flavor text. Cite the source book and page number. Format with Markdown. Use tables for stats if applicable.`;
        
        const responseText = await generateWithContext(prompt);
        
        setDetails(responseText || "No details found.");
    } catch (e: any) {
        console.error(e);
        setDetails(initialText || e.message || "Failed to retrieve ancient knowledge.");
    } finally {
        setLoading(false);
    }
  };

  // Custom components to style Markdown elements to match the dark aesthetic
  const MarkdownComponents = {
    p: ({node, ...props}: any) => <p className="mb-3 leading-relaxed text-zinc-300" {...props} />,
    h1: ({node, ...props}: any) => <h1 className="text-xl font-bold mb-3 text-amber-500 font-display uppercase tracking-widest border-b border-zinc-700 pb-1" {...props} />,
    h2: ({node, ...props}: any) => <h2 className="text-lg font-bold mb-2 text-amber-400 font-display mt-4" {...props} />,
    h3: ({node, ...props}: any) => <h3 className="text-md font-bold mb-2 text-zinc-200 font-display mt-3 uppercase text-xs tracking-wider" {...props} />,
    ul: ({node, ...props}: any) => <ul className="list-disc pl-5 mb-3 space-y-1 text-zinc-300" {...props} />,
    ol: ({node, ...props}: any) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-zinc-300" {...props} />,
    li: ({node, ...props}: any) => <li className="pl-1" {...props} />,
    strong: ({node, ...props}: any) => <strong className="font-bold text-zinc-100" {...props} />,
    em: ({node, ...props}: any) => <em className="italic text-zinc-400" {...props} />,
    blockquote: ({node, ...props}: any) => <blockquote className="border-l-4 border-amber-600/50 pl-4 py-1 italic text-zinc-400 my-3 bg-black/20 rounded-r" {...props} />,
    table: ({node, ...props}: any) => (
      <div className="overflow-x-auto my-4 rounded border border-zinc-700">
        <table className="min-w-full divide-y divide-zinc-700 text-sm" {...props} />
      </div>
    ),
    thead: ({node, ...props}: any) => <thead className="bg-zinc-800" {...props} />,
    tbody: ({node, ...props}: any) => <tbody className="divide-y divide-zinc-700/50 bg-black/20" {...props} />,
    tr: ({node, ...props}: any) => <tr className="hover:bg-white/5 transition-colors" {...props} />,
    th: ({node, ...props}: any) => <th className="px-3 py-2 text-left text-xs font-bold text-amber-500 uppercase tracking-wider whitespace-nowrap" {...props} />,
    td: ({node, ...props}: any) => <td className="px-3 py-2 text-zinc-300 whitespace-nowrap" {...props} />,
    code: ({node, ...props}: any) => <code className="bg-zinc-950 px-1.5 py-0.5 rounded text-xs font-mono text-amber-300 border border-zinc-700/50" {...props} />,
    a: ({node, ...props}: any) => <a className="text-amber-500 hover:text-amber-400 underline" {...props} />,
    hr: ({node, ...props}: any) => <hr className="border-zinc-700 my-4" {...props} />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-[#111] border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 rounded-t-2xl">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2 uppercase tracking-wide">
            <Book className="text-amber-500" size={20} />
            {item.name}
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors" aria-label="Close"><X size={24} /></button>
        </div>

        <div className="p-6 overflow-y-auto">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="animate-spin text-amber-600" size={40} />
                    <p className="text-zinc-500 text-sm animate-pulse">Consulting the archives...</p>
                </div>
            ) : (
                <div className="text-zinc-300 text-sm">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={MarkdownComponents}
                    >
                        {details || initialText}
                    </ReactMarkdown>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;
