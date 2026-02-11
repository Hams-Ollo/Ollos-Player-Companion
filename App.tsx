
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

  // Load characters and campaigns on mount
  useEffect(() => {
    const savedChars = localStorage.getItem('vesper_chars');
    if (savedChars) {
      try {
        const parsed = JSON.parse(savedChars);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCharacters(parsed);
        } else {
          setCharacters([VESPER_DATA]);
        }
      } catch (e) {
        console.error("Corrupted character data found. Resetting to default.", e);
        setCharacters([VESPER_DATA]);
      }
    } else {
      setCharacters([VESPER_DATA]);
    }
    
    const savedCamps = localStorage.getItem('vesper_campaigns');
    if (savedCamps) {
      try {
        setCampaigns(JSON.parse(savedCamps));
      } catch (e) {
        console.error("Failed to load campaigns", e);
      }
    }
  }, []);

  // Persist characters on every change
  useEffect(() => {
    if (characters && characters.length > 0) {
      localStorage.setItem('vesper_chars', JSON.stringify(characters));
    }
  }, [characters]);

  // Persist campaigns
  useEffect(() => {
    localStorage.setItem('vesper_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

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
      onCreate={(newChar) => {
        setCharacters(prev => [...prev, newChar]);
      }}
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
