import React, { useState } from 'react';
import { CharacterData, Item } from '../../types';
import { Coins, Package, Backpack, ShoppingBag, Shield, Sword, Shirt } from 'lucide-react';
import { recalculateCharacterStats } from '../../utils';

interface InventoryDetailProps {
  data: CharacterData;
  onShop?: () => void;
  onInspect?: (item: Item) => void;
  onUpdate?: (newData: Partial<CharacterData>) => void; // Added for state updates
}

const InventoryDetail: React.FC<InventoryDetailProps> = ({ data, onShop, onInspect, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'equipped' | 'backpack'>('equipped');

  const toggleEquip = (targetItem: Item) => {
    if (!onUpdate) return;

    const newItems = data.inventory.items.map(item => {
      if (item === targetItem) {
        return { ...item, equipped: !item.equipped };
      }
      // Auto unequip other armor/shields if equipping one (Simple logic, could be more complex)
      if (targetItem.type === 'Armor' && !targetItem.equipped) {
         if (item.type === 'Armor' && item.equipped && targetItem.name !== 'Shield' && item.name !== 'Shield') {
             // Unequip current body armor if equipping new body armor
             return { ...item, equipped: false };
         }
      }
      return item;
    });

    const updatedInventoryData = {
        ...data,
        inventory: {
            ...data.inventory,
            items: newItems
        }
    };

    // Calculate derived stats (AC, Attacks)
    const finalData = recalculateCharacterStats(updatedInventoryData);

    onUpdate(finalData);
  };

  const equippedItems = data.inventory.items.filter(i => i.equipped);
  const backpackItems = data.inventory.items.filter(i => !i.equipped);

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
          <span className="block text-2xl font-mono font-bold text-amber-400">{data.inventory.gold.toFixed(2)} <span className="text-sm text-amber-600">gp</span></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-zinc-700">
          <button 
            onClick={() => setActiveTab('equipped')}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-2 ${activeTab === 'equipped' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Shield size={14} /> Equipped
          </button>
          <button 
            onClick={() => setActiveTab('backpack')}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-2 ${activeTab === 'backpack' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Backpack size={14} /> Backpack
          </button>
      </div>
      
      {activeTab === 'backpack' && onShop && (
        <button 
            onClick={onShop}
            className="w-full py-3 bg-zinc-800 hover:bg-amber-900/30 border border-zinc-700 hover:border-amber-500/50 rounded-xl flex items-center justify-center gap-2 text-zinc-300 hover:text-amber-400 transition-all group"
        >
            <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold">Visit Merchant</span>
        </button>
      )}

      {/* Item List */}
      <div className="bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden divide-y divide-zinc-700/50 min-h-[200px]">
          {(activeTab === 'equipped' ? equippedItems : backpackItems).length === 0 && (
              <div className="p-8 text-center text-zinc-600 text-sm italic">
                  {activeTab === 'equipped' ? "Nothing equipped." : "Backpack is empty."}
              </div>
          )}

          {(activeTab === 'equipped' ? equippedItems : backpackItems).map((item, idx) => (
            <div 
                key={idx} 
                className="p-4 flex items-start justify-between hover:bg-zinc-700/30 transition-colors group"
            >
              <div 
                className="flex gap-3 cursor-pointer flex-grow"
                onClick={() => onInspect && onInspect(item)}
              >
                 <div className={`mt-1 transition-colors ${item.equipped ? 'text-green-400' : 'text-zinc-600 group-hover:text-amber-500'}`}>
                    {item.type === 'Weapon' ? <Sword size={16} /> : item.type === 'Armor' ? <Shirt size={16} /> : <Package size={16} />}
                 </div>
                 <div>
                    <h4 className={`font-bold transition-colors ${item.equipped ? 'text-green-100' : 'text-zinc-200 group-hover:text-white'}`}>
                        {item.name}
                        {item.equipped && <span className="ml-2 text-[10px] bg-green-900/40 text-green-400 px-1.5 py-0.5 rounded border border-green-500/30 uppercase tracking-wide">Equipped</span>}
                    </h4>
                    {item.notes && <p className="text-xs text-zinc-500 italic mt-0.5 line-clamp-1">{item.notes}</p>}
                 </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                  <div className="bg-black/40 px-2 py-0.5 rounded text-xs font-mono text-zinc-400 border border-zinc-700/50">
                    x{item.quantity}
                  </div>
                  {onUpdate && (item.type === 'Weapon' || item.type === 'Armor' || item.type === 'Gear') && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleEquip(item); }}
                        className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${
                            item.equipped 
                            ? 'border-red-900/30 text-red-400 hover:bg-red-900/20' 
                            : 'border-zinc-600 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                        }`}
                      >
                          {item.equipped ? 'Unequip' : 'Equip'}
                      </button>
                  )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default InventoryDetail;