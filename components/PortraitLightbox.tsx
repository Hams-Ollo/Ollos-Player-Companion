import React, { useEffect } from 'react';
import { X, Wand2, Image as ImageIcon } from 'lucide-react';

interface PortraitLightboxProps {
  portraitUrl: string;
  characterName: string;
  onClose: () => void;
  /** Open the portrait editor pre-set to a specific tab */
  onEdit: (initialTab: 'text' | 'image') => void;
}

const PortraitLightbox: React.FC<PortraitLightboxProps> = ({
  portraitUrl,
  characterName,
  onClose,
  onEdit,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${characterName}'s portrait`}
    >
      {/* ── Header bar ── */}
      <div
        className="absolute top-0 left-0 right-0 flex justify-between items-center px-5 py-4 bg-gradient-to-b from-black/80 to-transparent z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-white font-display font-bold text-lg truncate drop-shadow-md">
          {characterName}
        </span>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          aria-label="Close portrait"
        >
          <X size={26} />
        </button>
      </div>

      {/* ── Portrait image ── */}
      <div
        className="relative max-w-xs sm:max-w-sm w-full mx-6 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={portraitUrl}
          alt={`${characterName}'s portrait`}
          className="w-full h-auto object-cover"
          draggable={false}
        />
      </div>

      {/* ── Action buttons ── */}
      <div
        className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-28 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex justify-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onEdit('text')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-bold rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <Wand2 size={15} />
          Regenerate Portrait
        </button>
        <button
          onClick={() => onEdit('image')}
          className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-xl shadow-lg border border-zinc-700 transition-all hover:scale-105 active:scale-95"
        >
          <ImageIcon size={15} />
          Change Image
        </button>
      </div>
    </div>
  );
};

export default PortraitLightbox;
