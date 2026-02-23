import React, { useState, useRef } from 'react';
import { X, Wand2, Camera, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { checkRateLimit } from '../utils';
import { generatePortrait } from '../lib/gemini';

interface PortraitGeneratorProps {
  currentPortrait: string;
  onUpdate: (url: string) => void;
  onClose: () => void;
  characterDescription: string;
  initialTab?: 'text' | 'image';
}

const PortraitGenerator: React.FC<PortraitGeneratorProps> = ({ currentPortrait, onUpdate, onClose, characterDescription, initialTab }) => {
  const [prompt, setPrompt] = useState(characterDescription);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'image'>(initialTab ?? 'text');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {

    setLoading(true);
    setError(null);

    try {
      checkRateLimit(); // Enforce rate limit

      const parts: any[] = [];

      // Add image if in image mode
      if (activeTab === 'image' && selectedImage) {
        const base64Data = selectedImage.split(',')[1];
        const mimeType = selectedImage.split(';')[0].split(':')[1];
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
        // Prompt for editing/variation
        parts.push({ text: `Redraw this character portrait in a high-fantasy digital art style. ${prompt}` });
      } else {
        // Text only prompt
        parts.push({ text: `A high quality, high fantasy digital art portrait of a D&D character: ${prompt}. Aspect ratio 1:1.` });
      }

      const portraitPrompt = parts.length === 1 && parts[0].text ? parts[0].text : '';
      const result = await generatePortrait(portraitPrompt, parts.length > 1 || !parts[0].text ? parts : undefined);

      if (result) {
        onUpdate(result);
        onClose();
      } else {
         setError("No image generated. The model might have refused the prompt.");
      }

    } catch (err: any) {
      setError(err.message || "Failed to generate image");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm sm:p-4 animate-in fade-in">
      <div className="bg-zinc-900 sm:border border-zinc-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md md:max-w-lg overflow-hidden flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh]">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Wand2 className="text-purple-400" size={20} />
            Portrait Artificer
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white" aria-label="Close" title="Close"><X size={24} /></button>
        </div>

        <div className="p-4 flex gap-2 border-b border-zinc-800">
           <button 
             onClick={() => setActiveTab('text')}
             className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'text' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
           >
             Text to Image
           </button>
           <button 
             onClick={() => setActiveTab('image')}
             className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'image' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
           >
             Image to Image
           </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {activeTab === 'image' && (
            <div className="mb-6">
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="aspect-square bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-600 hover:border-purple-500 hover:bg-zinc-800/50 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden relative"
               >
                 {selectedImage ? (
                   <img src={selectedImage} alt="Reference" className="w-full h-full object-cover" />
                 ) : (
                   <div className="text-center p-4">
                     <Camera className="mx-auto mb-2 text-zinc-500" size={32} />
                     <span className="text-zinc-400 text-sm font-bold">Upload or Take Photo</span>
                   </div>
                 )}
                 <input 
                   ref={fileInputRef}
                   type="file" 
                   accept="image/*" 
                   className="hidden" 
                   onChange={handleFileSelect}
                   aria-label="Upload reference photo"
                 />
               </div>
               <p className="text-xs text-zinc-500 mt-2 text-center">Reference for the AI to redraw</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Description</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 resize-none"
              placeholder="Describe your character..."
            />
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-xs">
              {error}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
          <button
            onClick={handleGenerate}
            disabled={loading || (activeTab === 'image' && !selectedImage)}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Conjuring...
              </>
            ) : (
              <>
                <Wand2 size={20} />
                Generate Portrait
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortraitGenerator;