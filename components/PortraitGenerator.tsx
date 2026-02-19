import React, { useState, useRef } from 'react';
import { X, Wand2, Camera, Loader2, Image as ImageIcon, Upload, ShieldCheck } from 'lucide-react';
import { checkRateLimit } from '../utils';
import { generatePortrait } from '../lib/gemini';

interface PortraitGeneratorProps {
  currentPortrait: string;
  onUpdate: (url: string) => void;
  onClose: () => void;
  characterDescription: string;
  /** Pre-select a tab when opened from the lightbox */
  initialTab?: 'text' | 'image';
}

const PortraitGenerator: React.FC<PortraitGeneratorProps> = ({ currentPortrait, onUpdate, onClose, characterDescription, initialTab }) => {
  const [prompt, setPrompt] = useState(characterDescription);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'image'>(initialTab ?? 'text');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // Privacy consent — stored in localStorage so users aren't shown it on every visit
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(
    () => localStorage.getItem('portrait_image_consent_v1') === 'granted'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reject unexpectedly large files before sending to AI (10 MB guard)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image is too large. Please choose a file under 10 MB.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAcknowledgePrivacy = () => {
    localStorage.setItem('portrait_image_consent_v1', 'granted');
    setPrivacyAcknowledged(true);
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
            <div className="mb-6 space-y-4">

              {/* ── Privacy consent notice (shown once per device) ── */}
              {!privacyAcknowledged && (
                <div className="flex gap-3 p-3 bg-zinc-800/80 border border-zinc-600 rounded-xl text-xs text-zinc-300">
                  <ShieldCheck className="shrink-0 text-blue-400 mt-0.5" size={18} />
                  <div>
                    <p className="font-bold text-zinc-200 mb-1">Before you upload a photo</p>
                    <p className="text-zinc-400 leading-relaxed">
                      Your image is sent securely to Google Gemini solely to generate your character portrait.
                      It is <span className="text-zinc-200 font-semibold">never stored on our servers</span> or
                      saved to your character — only the AI-generated result is kept.
                    </p>
                    <button
                      onClick={handleAcknowledgePrivacy}
                      className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
                    >
                      I Understand
                    </button>
                  </div>
                </div>
              )}

              {/* ── Image preview / upload target ── */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-600 hover:border-purple-500 hover:bg-zinc-800/50 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden relative"
              >
                {selectedImage ? (
                  <img src={selectedImage} alt="Reference" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="mx-auto mb-2 text-zinc-500" size={32} />
                    <span className="text-zinc-400 text-sm font-bold">Tap to Upload Image</span>
                    <span className="block text-zinc-600 text-xs mt-1">PNG, JPG, WEBP · max 10 MB</span>
                  </div>
                )}
                {/* Hidden file input — gallery / filesystem */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                  aria-label="Upload reference photo from library"
                />
              </div>

              {/* ── OR divider + selfie button ── */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-zinc-700" />
                <span className="text-zinc-600 text-xs font-bold uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-zinc-700" />
              </div>

              <button
                onClick={() => selfieInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm font-bold rounded-xl transition-colors"
                aria-label="Use device camera to take a selfie"
              >
                <Camera size={16} />
                Use Camera / Take Selfie
              </button>
              {/* Hidden file input — device camera (front-facing on mobile) */}
              <input
                ref={selfieInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={handleFileSelect}
                aria-label="Take a selfie with your camera"
              />

              {selectedImage && (
                <p className="text-xs text-zinc-500 text-center">
                  AI will redraw this image in a high-fantasy art style
                </p>
              )}
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