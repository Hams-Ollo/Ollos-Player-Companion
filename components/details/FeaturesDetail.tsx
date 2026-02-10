import React, { useState } from 'react';
import { CharacterData, Feature } from '../../types';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface FeaturesDetailProps {
  data: CharacterData;
}

const FeaturesDetail: React.FC<FeaturesDetailProps> = ({ data }) => {
  const [openFeature, setOpenFeature] = useState<string | null>(null);

  const toggleFeature = (name: string) => {
    setOpenFeature(openFeature === name ? null : name);
  };

  const renderFeatureSection = (source: string, features: Feature[]) => {
    if (features.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 pl-1 border-l-2 border-purple-500">{source} Features</h3>
        <div className="space-y-3">
          {features.map((feature) => (
            <div 
              key={feature.name} 
              className={`bg-zinc-800 rounded-xl overflow-hidden border transition-colors ${openFeature === feature.name ? 'border-purple-500/50' : 'border-zinc-700'}`}
            >
              <button 
                onClick={() => toggleFeature(feature.name)}
                className="w-full p-4 flex items-center justify-between hover:bg-zinc-700/50 transition-colors text-left"
              >
                <div>
                  <h4 className="font-display font-bold text-lg text-purple-100">{feature.name}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{feature.description}</p>
                </div>
                <div className={`text-purple-400 transition-transform duration-300 ${openFeature === feature.name ? 'rotate-180' : ''}`}>
                  <ChevronDown size={20} />
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openFeature === feature.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-4 pt-0 text-sm text-zinc-300 leading-relaxed border-t border-zinc-700/50 bg-black/20">
                  <div className="flex items-center gap-2 mb-2 text-purple-300/60 text-xs uppercase tracking-wider">
                     <BookOpen size={12} />
                     <span>Player's Handbook Source</span>
                  </div>
                  <p className="whitespace-pre-wrap">{feature.fullText}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const racialFeatures = data.features.filter(f => f.source === 'Race');
  const classFeatures = data.features.filter(f => f.source === 'Class');

  return (
    <div>
      {renderFeatureSection('Class', classFeatures)}
      {renderFeatureSection('Race', racialFeatures)}
      
      <div className="mt-8 p-4 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 text-center">
        <p className="text-zinc-500 text-sm italic">Unlock more features at Level 2</p>
      </div>
    </div>
  );
};

export default FeaturesDetail;
