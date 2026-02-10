import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import CharacterSelection from './components/CharacterSelection';
import { VESPER_DATA } from './constants';
import { CharacterData } from './types';

const App: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dnd-characters');
    if (saved) {
      try {
        setCharacters(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse characters", e);
        setCharacters([VESPER_DATA]);
      }
    } else {
      setCharacters([VESPER_DATA]);
    }
    setLoading(false);
  }, []);

  // Save to local storage whenever characters change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('dnd-characters', JSON.stringify(characters));
    }
  }, [characters, loading]);

  const handleCreate = (newChar: CharacterData) => {
    setCharacters(prev => [...prev, newChar]);
    setActiveCharacterId(newChar.id);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this character? This cannot be undone.")) {
      setCharacters(prev => prev.filter(c => c.id !== id));
      if (activeCharacterId === id) setActiveCharacterId(null);
    }
  };

  const handleUpdateActiveCharacter = (newData: Partial<CharacterData>) => {
    if (!activeCharacterId) return;

    setCharacters(prev => prev.map(c => {
      if (c.id === activeCharacterId) {
        return { ...c, ...newData };
      }
      return c;
    }));
  };

  const handleUpdatePortrait = (url: string) => {
    handleUpdateActiveCharacter({ portraitUrl: url });
  };

  const activeCharacter = characters.find(c => c.id === activeCharacterId);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">Loading...</div>;

  if (activeCharacter) {
    return (
      <Dashboard 
        data={activeCharacter} 
        onUpdatePortrait={handleUpdatePortrait} 
        onUpdateData={handleUpdateActiveCharacter}
        onExit={() => setActiveCharacterId(null)}
      />
    );
  }

  return (
    <CharacterSelection 
      characters={characters}
      onSelect={setActiveCharacterId}
      onCreate={handleCreate}
      onDelete={handleDelete}
    />
  );
};

export default App;
