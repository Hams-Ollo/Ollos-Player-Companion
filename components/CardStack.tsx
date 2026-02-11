
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

const CardStack: React.FC<CardStackProps> = ({ title, color, children, onClick, icon }) => {
  const colorMap: Record<string, string> = {
    red: "border-l-red-600 shadow-red-900/10 hover:border-red-500",
    orange: "border-l-orange-600 shadow-orange-900/10 hover:border-orange-500",
    blue: "border-l-blue-600 shadow-blue-900/10 hover:border-blue-500",
    purple: "border-l-purple-600 shadow-purple-900/10 hover:border-purple-500",
    amber: "border-l-amber-600 shadow-amber-900/10 hover:border-amber-500",
    cyan: "border-l-cyan-600 shadow-cyan-900/10 hover:border-cyan-500",
  };

  const glowMap: Record<string, string> = {
    red: "group-hover:shadow-red-500/5",
    orange: "group-hover:shadow-orange-500/5",
    blue: "group-hover:shadow-blue-500/5",
    purple: "group-hover:shadow-purple-500/5",
    amber: "group-hover:shadow-amber-500/5",
    cyan: "group-hover:shadow-cyan-500/5",
  };

  const borderColor = colorMap[color] || "border-l-zinc-700";
  const glowShadow = glowMap[color] || "";

  return (
    <div 
      onClick={onClick}
      className={`
        relative bg-zinc-900/80 rounded-2xl p-4 lg:p-5 cursor-pointer 
        border-l-4 border-y border-r border-zinc-800/50 
        shadow-2xl backdrop-blur-md transition-all duration-300 transform 
        hover:-translate-y-1 hover:bg-zinc-800/80 active:scale-[0.98]
        ${borderColor} ${glowShadow}
        group h-full flex flex-col justify-between overflow-hidden
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-display font-bold text-sm tracking-widest uppercase text-zinc-400 group-hover:text-zinc-200 transition-colors">
          {title}
        </h3>
        {icon && <div className="text-zinc-600 group-hover:text-zinc-300 transition-colors">{icon}</div>}
      </div>
      
      <div className="flex-grow flex flex-col justify-center">
        {children}
      </div>

      {/* Decorative layering effect */}
      <div className="absolute -bottom-1.5 left-3 right-3 h-1 bg-zinc-800/40 rounded-b-xl -z-10 group-hover:bottom-[-8px] transition-all"></div>
      <div className="absolute -bottom-3 left-6 right-6 h-1 bg-zinc-800/20 rounded-b-xl -z-20 group-hover:bottom-[-14px] transition-all"></div>
    </div>
  );
};

export default CardStack;
