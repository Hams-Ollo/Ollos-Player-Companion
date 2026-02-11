import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import CharacterSelection from './components/CharacterSelection';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CharacterData, Campaign } from './types';
import { VESPER_DATA } from './constants';
import { recalculateCharacterStats } from './utils';

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
        // Robust check: Ensure parsed is an array and contains valid character objects
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed
            .filter(c => c && typeof c === 'object' && c.id)
            .map(c => recalculateCharacterStats(c));
          
          if (sanitized.length > 0) {
            setCharacters(sanitized);
          } else {
            setCharacters([recalculateCharacterStats(VESPER_DATA)]);
          }
        } else {
          setCharacters([recalculateCharacterStats(VESPER_DATA)]);
        }
      } catch (e) {
        console.error("Corrupted character data found. Resetting to default.", e);
        setCharacters([recalculateCharacterStats(VESPER_DATA)]);
      }
    } else {
      setCharacters([recalculateCharacterStats(VESPER_DATA)]);
    }
    
    const savedCamps = localStorage.getItem('vesper_campaigns');
    if (savedCamps) {
      try {
        const parsed = JSON.parse(savedCamps);
        if (Array.isArray(parsed)) {
          setCampaigns(parsed);
        }
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

  // Persist campaigns on every change
  useEffect(() => {
    localStorage.setItem('vesper_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-zinc-500 space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="font-display text-xs tracking-widest uppercase animate-pulse">Loading Hall...</p>
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  const activeChar = characters.find(c => c.id === activeCharacterId);

  if (activeChar) {
    return (
      <ErrorBoundary fallbackTitle="The Dashboard has collapsed">
        <Dashboard 
          data={activeChar}
          onUpdatePortrait={(url) => {
            setCharacters(prev => prev.map(c => c.id === activeChar.id ? { ...c, portraitUrl: url } : c));
          }}
          onUpdateData={(newData) => {
            setCharacters(prev => prev.map(c => c.id === activeChar.id ? recalculateCharacterStats({ ...c, ...newData }) : c));
          }}
          onExit={() => setActiveCharacterId(null)}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary fallbackTitle="The Hall has collapsed">
      <CharacterSelection 
        characters={characters}
        campaigns={campaigns}
        onUpdateCampaigns={(newCamps) => setCampaigns(newCamps as any)}
        onSelect={(id) => setActiveCharacterId(id)}
        onCreate={(newChar) => {
          setCharacters(prev => [...prev, newChar]);
          setActiveCharacterId(newChar.id);
        }}
        onDelete={(id) => setCharacters(prev => prev.filter(c => c.id !== id))}
      />
    </ErrorBoundary>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;