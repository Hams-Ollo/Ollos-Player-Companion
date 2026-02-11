import React, { useState } from 'react';
import { CharacterData, Item } from '../types';
import { SHOP_INVENTORY } from '../constants';
import { X, ShoppingBag, Coins, ShieldCheck, Sword, Package, Star, ArrowRightLeft, Trash2 } from 'lucide-react';

interface ShopModalProps {
  data: CharacterData;
  onUpdate: (newData: Partial<CharacterData>) => void;
  onClose: () => void;
}

const ShopModal: React.FC<ShopModalProps> = ({ data, onUpdate, onClose }) => {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [filter, setFilter] = useState<string>('All');

  const buyItem = (item: Item) => {
    if (data.inventory.gold < item.cost!) {
        alert("Not enough gold!");
        return;
    }

    // Explicitly round to 2 decimal places to handle JS float artifacts
    const newGold = Number((data.inventory.gold - item.cost!).toFixed(2));
    
    // Check if item exists to stack it
    const existingItemIndex = data.inventory.items.findIndex(i => i.name === item.name && !i.equipped);
    let newItems = [...data.inventory.items];
    
    if (existingItemIndex >= 0) {
        newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + 1
        };
    } else {
        newItems.push({ ...item, quantity: 1, equipped: false });
    }

    onUpdate({
        inventory: {
            ...data.inventory,
            gold: newGold,
            items: newItems
        }
    });
  };

  const sellItem = (item: Item) => {
      const sellPrice = Math.floor((item.cost || 0) / 2);
      
      if (confirm(`Sell ${item.name} for ${sellPrice} gp?`)) {
          // Explicitly round to 2 decimal places to handle JS float artifacts
          const newGold = Number((data.inventory.gold + sellPrice).toFixed(2));
          
          let newItems = [...data.inventory.items];
          const index = newItems.indexOf(item);
          
          if (item.quantity > 1) {
              newItems[index] = { ...item, quantity: item.quantity - 1 };
          } else {
              newItems.splice(index, 1);
          }

          onUpdate({
              inventory: {
                  ...data.inventory,
                  gold: newGold,
                  items: newItems
              }
          });
      }
  };

  const getIcon = (type?: string) => {
     switch(type) {
         case 'Weapon': return <Sword size={16} className="text-red-400" />;
         case 'Armor': return <ShieldCheck size={16} className="text-blue-400" />;
         case 'Magic Item': return <Star size={16} className="text-purple-400" />;
         default: return <Package size={16} className="text-amber-400" />;
     }
  };

  // Filter items for display
  const shopItems = filter === 'All' ? SHOP_INVENTORY : SHOP_INVENTORY.filter(i => i.type === filter);
  const playerItems = data.inventory.items.filter(i => !i.equipped); // Can only sell unequipped

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
          <h3 className="text-xl font-display font-bold text-amber-500 flex items-center gap-2">
            <ShoppingBag size={20} />
            Marketplace
          </h3>
          <div className="flex items-center gap-2 bg-amber-900/20 px-3 py-1 rounded-full border border-amber-500/30">
             <Coins size={14} className="text-amber-400" />
             <span className="font-mono font-bold text-amber-100">{data.inventory.gold.toFixed(2)} gp</span>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white" aria-label="Close"><X size={24} /></button>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-zinc-900 p-2 gap-2 border-b border-zinc-800">
            <button 
                onClick={() => setMode('buy')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${mode === 'buy' ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}
            >
                Buy Items
            </button>
            <button 
                onClick={() => setMode('sell')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 ${mode === 'sell' ? 'bg-green-700 text-white' : 'bg-zinc-800 text-zinc-500'}`}
            >
                <ArrowRightLeft size={14} /> Sell Items
            </button>
        </div>

        {mode === 'buy' && (
            <div className="flex gap-2 p-4 border-b border-zinc-800 bg-zinc-900 overflow-x-auto no-scrollbar">
                {['All', 'Weapon', 'Armor', 'Gear', 'Consumable'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${filter === f ? 'bg-amber-600/20 text-amber-400 border border-amber-600/50' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        )}

        <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mode === 'buy' ? (
                shopItems.map((item, idx) => (
                    <div key={idx} className="bg-zinc-800 border border-zinc-700 p-3 rounded-xl flex flex-col justify-between hover:border-amber-500/50 transition-colors">
                        <div>
                            <div className="flex justify-between items-start">
                                 <h4 className="font-bold text-zinc-200 flex items-center gap-2 text-sm">
                                    {getIcon(item.type)} {item.name}
                                 </h4>
                                 <span className="text-amber-400 font-mono text-xs font-bold whitespace-nowrap">{item.cost} gp</span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{item.notes || item.type}</p>
                        </div>
                        <button 
                            onClick={() => buyItem(item)}
                            disabled={data.inventory.gold < (item.cost || 0)}
                            className="mt-3 w-full py-2 bg-zinc-700 hover:bg-amber-600 disabled:opacity-50 disabled:hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition-colors flex justify-between px-4"
                        >
                            <span>Buy</span>
                            <span className="opacity-50 font-normal">to Backpack</span>
                        </button>
                    </div>
                ))
            ) : (
                playerItems.length > 0 ? (
                    playerItems.map((item, idx) => (
                        <div key={idx} className="bg-zinc-800 border border-zinc-700 p-3 rounded-xl flex flex-col justify-between hover:border-green-500/50 transition-colors">
                            <div>
                                <div className="flex justify-between items-start">
                                     <h4 className="font-bold text-zinc-200 flex items-center gap-2 text-sm">
                                        {getIcon(item.type)} {item.name} <span className="text-xs text-zinc-500">x{item.quantity}</span>
                                     </h4>
                                     <span className="text-green-400 font-mono text-xs font-bold whitespace-nowrap">
                                         {Math.floor((item.cost || 0) / 2)} gp
                                     </span>
                                </div>
                                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{item.notes || item.type}</p>
                            </div>
                            <button 
                                onClick={() => sellItem(item)}
                                className="mt-3 w-full py-2 bg-zinc-700 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors flex justify-center items-center gap-2"
                            >
                                <Coins size={14} /> Sell
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-zinc-500 italic">
                        Your backpack is empty. Unequip items to sell them.
                    </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default ShopModal;