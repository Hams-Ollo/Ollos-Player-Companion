import React, { useState, useEffect } from 'react';
import { Feature, Item } from '../types';
import { X, Book, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { checkRateLimit } from '../utils';

interface ItemDetailModalProps {
  item: Item | Feature;
  onClose: () => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  const [details, setDetails] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Check if it's a feature or item to show existing info first
  const initialText = 'fullText' in item ? item.fullText : (item as Item).notes || '';
  const isFeature = 'fullText' in item;

  useEffect(() => {
    if (initialText && initialText.length > 50) {
        setDetails(initialText);
    } else {
        fetchDetails();
    }
  }, [item]);

  const fetchDetails = async () => {
    if (!process.env.API_KEY) return;
    setLoading(true);
    try {
        checkRateLimit(); // Enforce rate limit

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Provide a detailed, rules-accurate description for the D&D 5e ${isFeature ? 'feature' : 'item'}: "${item.name}". Include mechanics, stats (if item), and flavor text. Format with Markdown.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });
        
        setDetails(response.text || "No details found.");
    } catch (e: any) {
        console.error(e);
        setDetails(e.message || "Failed to retrieve ancient knowledge.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50 rounded-t-2xl">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Book className="text-amber-500" size={20} />
            {item.name}
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={24} /></button>
        </div>

        <div className="p-6 overflow-y-auto text-zinc-300 text-sm leading-relaxed">
            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-amber-500" size={32} />
                </div>
            ) : (
                <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{details || initialText}</ReactMarkdown>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;