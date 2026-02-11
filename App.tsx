import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import CharacterSelection from './components/CharacterSelection';
import LoginScreen from './components/LoginScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { VESPER_DATA } from './constants';
import { CharacterData, Campaign } from './types';
import { initializeCache } from './lib/gemini';

const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Pre-warm Gemini cache with reference documents on app mount
  useEffect(() => {
    initializeCache();
  }, []);

  // Load from local storage on mount (or when user changes)
  useEffect(() => {
    if (authLoading) return;
    
    if (user) {
        const charKey = `dnd-characters-${user.uid}`;
        const campKey = `dnd-campaigns-${user.uid}`;
        
        const savedChars = localStorage.getItem(charKey);
        const savedCamps = localStorage.getItem(campKey);
        
        if (savedChars) {
            try { setCharacters(JSON.parse(savedChars)); } catch (e) { setCharacters([]); }
        } else {
            if (user.isAnonymous) setCharacters([VESPER_DATA]);
            else setCharacters([]);
        }

        if (savedCamps) {
            try { setCampaigns(JSON.parse(savedCamps)); } catch (e) { setCampaigns([]); }
        } else {
            setCampaigns([]);
        }
    } else {
        setCharacters([]);
        setCampaigns([]);
    }
    setDataLoading(false);
  }, [user, authLoading]);

  // Save to local storage whenever state changes
  useEffect(() => {
    if (!authLoading && !dataLoading && user) {
      localStorage.setItem(`dnd-characters-${user.uid}`, JSON.stringify(characters));
      localStorage.setItem(`dnd-campaigns-${user.uid}`, JSON.stringify(campaigns));
    }
  }, [characters, campaigns, authLoading, dataLoading, user]);

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
    setCharacters(prev => prev.map(c => c.id === activeCharacterId ? { ...c, ...newData } : c));
  };

  if (authLoading || (user && dataLoading)) {
      return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">Loading...</div>;
  }

  if (!user) return <LoginScreen />;

  const activeCharacter = characters.find(c => c.id === activeCharacterId);

  if (activeCharacter) {
    return (
      <Dashboard 
        data={activeCharacter} 
        onUpdatePortrait={(url) => handleUpdateActiveCharacter({ portraitUrl: url })} 
        onUpdateData={handleUpdateActiveCharacter}
        onExit={() => setActiveCharacterId(null)}
      />
    );
  }

  return (
    <CharacterSelection 
      characters={characters}
      campaigns={campaigns}
      onUpdateCampaigns={setCampaigns}
      onSelect={setActiveCharacterId}
      onCreate={handleCreate}
      onDelete={handleDelete}
    />
  );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;