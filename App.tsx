import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import CharacterSelection from './components/CharacterSelection';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CharacterData, Campaign } from './types';
import { VESPER_DATA } from './constants';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const savedChars = localStorage.getItem('vesper_chars');
    if (savedChars) {
      setCharacters(JSON.parse(savedChars));
    } else {
      setCharacters([VESPER_DATA]);
    }
    
    const savedCamps = localStorage.getItem('vesper_campaigns');
    if (savedCamps) setCampaigns(JSON.parse(savedCamps));
  }, []);

  useEffect(() => {
    if (characters.length > 0) {
      localStorage.setItem('vesper_chars', JSON.stringify(characters));
    }
  }, [characters]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">Loading Hall...</div>;
  if (!user) return <LoginScreen />;

  const activeChar = characters.find(c => c.id === activeCharacterId);

  if (activeChar) {
    return (
      <Dashboard 
        data={activeChar}
        onUpdatePortrait={(url) => {
          setCharacters(prev => prev.map(c => c.id === activeChar.id ? { ...c, portraitUrl: url } : c));
        }}
        onUpdateData={(newData) => {
          setCharacters(prev => prev.map(c => c.id === activeChar.id ? { ...c, ...newData } : c));
        }}
        onExit={() => setActiveCharacterId(null)}
      />
    );
  }

  return (
    <CharacterSelection 
      characters={characters}
      campaigns={campaigns}
      onUpdateCampaigns={setCampaigns}
      onSelect={(id) => setActiveCharacterId(id)}
      onCreate={(newChar) => setCharacters(prev => [...prev, newChar])}
      onDelete={(id) => setCharacters(prev => prev.filter(c => c.id !== id))}
    />
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;