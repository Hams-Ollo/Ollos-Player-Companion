import React from 'react';
import { CharacterData, Item } from '../../types';
import { Coins, Package, Backpack, ShoppingBag } from 'lucide-react';

interface InventoryDetailProps {
  data: CharacterData;
  onShop?: () => void;
  onInspect?: (item: Item) => void;
}

const InventoryDetail: React.FC<InventoryDetailProps> = ({ data, onShop, onInspect }) => {
  return (
    <div className="space-y-6">
      {/* Wealth Header */}
      <div className="bg-amber-900/20 border border-amber-600/30 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/20 p-2 rounded-full text-amber-500">
            <Coins size={24} />
          </div>
          <div>
            <span className="block text-amber-100 font-display font-bold text-lg">Wealth</span>
            <span className="text-xs text-amber-200/60">Current Funds</span>
          </div>
        </div>
        <div className="text-right">
          <span className="block text-2xl font-mono font-bold text-amber-400">{data.inventory.gold} <span className="text-sm text-amber-600">gp</span></span>
        </div>
      </div>
      
      {onShop && (
        <button 
            onClick={onShop}
            className="w-full py-3 bg-zinc-800 hover:bg-amber-900/30 border border-zinc-700 hover:border-amber-500/50 rounded-xl flex items-center justify-center gap-2 text-zinc-300 hover:text-amber-400 transition-all group"
        >
            <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold">Visit Equipment Shop</span>
        </button>
      )}

      {/* Equipment List */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Backpack size={14} />
            Equipment
          </h3>
          <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-700">Load: {data.inventory.load}</span>
        </div>

        <div className="bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden divide-y divide-zinc-700/50">
          {data.inventory.items.map((item, idx) => (
            <div 
                key={idx} 
                onClick={() => onInspect && onInspect(item)}
                className="p-4 flex items-start justify-between hover:bg-zinc-700/30 transition-colors cursor-pointer group"
            >
              <div className="flex gap-3">
                 <div className="text-zinc-600 mt-1 group-hover:text-amber-500 transition-colors">
                    <Package size={16} />
                 </div>
                 <div>
                    <h4 className="text-zinc-200 font-bold group-hover:text-white transition-colors">{item.name}</h4>
                    {item.notes && <p className="text-xs text-zinc-500 italic mt-0.5">{item.notes}</p>}
                 </div>
              </div>
              <div className="bg-black/40 px-3 py-1 rounded text-sm font-mono text-zinc-400 border border-zinc-700/50">
                x{item.quantity}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryDetail;