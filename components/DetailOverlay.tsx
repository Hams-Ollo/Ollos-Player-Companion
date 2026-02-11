import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { StackType } from '../types';

interface DetailOverlayProps {
  isOpen: boolean;
  type: StackType | null;
  onClose: () => void;
  title: string;
  color: string;
  children: React.ReactNode;
}

const DetailOverlay: React.FC<DetailOverlayProps> = ({ isOpen, type, onClose, title, color, children }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
    // Delay unmounting for animation
    else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  // Header Colors
  const headerColors: Record<string, string> = {
    red: "bg-red-950/80 border-b-red-900/50 text-red-100",
    orange: "bg-orange-950/80 border-b-orange-900/50 text-orange-100",
    blue: "bg-blue-950/80 border-b-blue-900/50 text-blue-100",
    purple: "bg-purple-950/80 border-b-purple-900/50 text-purple-100",
    amber: "bg-amber-950/80 border-b-amber-900/50 text-amber-100",
    cyan: "bg-cyan-950/80 border-b-cyan-900/50 text-cyan-100",
  };

  const headerClass = headerColors[color] || "bg-zinc-900 border-b-zinc-800";

  return (
    <div 
      className={`fixed inset-0 z-40 flex flex-col bg-black/90 backdrop-blur-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Header */}
      <div className={`pt-safe-area flex items-center justify-between p-4 sm:p-5 lg:p-6 border-b ${headerClass} shadow-lg shrink-0`}>
         <h2 className="text-2xl md:text-3xl font-display font-bold tracking-wide">{title}</h2>
         <button 
           onClick={onClose}
           className="p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
           aria-label="Close"
           title="Close"
         >
           <X size={24} />
         </button>
      </div>

      {/* Scrollable Content */}
      <div className={`flex-grow overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 pb-24 animate-in slide-in-from-bottom-10 duration-300 no-scrollbar`}>
        <div className="max-w-2xl lg:max-w-4xl mx-auto w-full">
           {children}
        </div>
      </div>
      
      {/* Bottom fade hint */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
    </div>
  );
};

export default DetailOverlay;