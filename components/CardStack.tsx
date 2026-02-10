import React from 'react';
import { StackType } from '../types';

interface CardStackProps {
  type: StackType;
  title: string;
  color: string;
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ReactNode;
}

const CardStack: React.FC<CardStackProps> = ({ type, title, color, children, onClick, icon }) => {
  // Map color strings to tailwind classes
  const colorMap: Record<string, string> = {
    red: "border-l-red-500 shadow-red-900/10",
    orange: "border-l-orange-500 shadow-orange-900/10",
    blue: "border-l-blue-500 shadow-blue-900/10",
    purple: "border-l-purple-500 shadow-purple-900/10",
    amber: "border-l-amber-600 shadow-amber-900/10",
  };

  const bgHoverMap: Record<string, string> = {
    red: "hover:bg-red-950/20",
    orange: "hover:bg-orange-950/20",
    blue: "hover:bg-blue-950/20",
    purple: "hover:bg-purple-950/20",
    amber: "hover:bg-amber-950/20",
  };

  const borderColor = colorMap[color] || "border-l-zinc-500";
  const hoverColor = bgHoverMap[color] || "hover:bg-zinc-800";

  return (
    <div 
      onClick={onClick}
      className={`
        relative bg-zinc-900/80 rounded-xl p-4 cursor-pointer 
        border-l-4 border-y border-r border-y-zinc-800 border-r-zinc-800 
        shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98]
        ${borderColor} ${hoverColor}
        group h-full flex flex-col justify-between overflow-hidden
      `}
    >
      <div className="flex justify-between items-start mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
        <h3 className="font-display font-bold text-lg tracking-wide uppercase text-zinc-300">{title}</h3>
        {icon && <div className="text-zinc-500 group-hover:text-zinc-300 transition-colors">{icon}</div>}
      </div>
      
      <div className="flex-grow">
        {children}
      </div>

      <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-black/20 to-transparent pointer-events-none"></div>
      
      {/* Visual "Stack" effect */}
      <div className="absolute -bottom-1 left-2 right-2 h-1 bg-zinc-800 rounded-b-lg -z-10"></div>
      <div className="absolute -bottom-2 left-4 right-4 h-1 bg-zinc-800/60 rounded-b-lg -z-20"></div>
    </div>
  );
};

export default CardStack;
