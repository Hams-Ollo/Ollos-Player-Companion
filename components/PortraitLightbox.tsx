import React from 'react';
import { X, Edit2, Image as ImageIcon } from 'lucide-react';

interface PortraitLightboxProps {
  portraitUrl: string;
  characterName: string;
  onClose: () => void;
  onEdit: (tab: 'text' | 'image') => void;
}

const PortraitLightbox: React.FC<PortraitLightboxProps> = ({ portraitUrl, characterName, onClose, onEdit }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full mx-4 rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Portrait image */}
        <img
          src={portraitUrl}
          alt={characterName}
          className="w-full object-cover block"
          style={{ maxHeight: '70vh' }}
        />

        {/* Overlay controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-xl transition-colors backdrop-blur-sm"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-3">
          <span className="font-black text-white text-lg drop-shadow-lg">{characterName}</span>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit('image')}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800/80 hover:bg-zinc-700/90 text-zinc-200 text-xs font-bold rounded-xl transition-colors backdrop-blur-sm border border-zinc-700/50"
              title="Replace with photo"
            >
              <ImageIcon size={13} />
              Upload
            </button>
            <button
              onClick={() => onEdit('text')}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-600/80 hover:bg-amber-500/90 text-white text-xs font-bold rounded-xl transition-colors backdrop-blur-sm"
              title="Generate new portrait with AI"
            >
              <Edit2 size={13} />
              Regenerate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortraitLightbox;
