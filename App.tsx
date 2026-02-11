import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import CharacterSelection from './components/CharacterSelection';
import LoginScreen from './components/LoginScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { VESPER_DATA } from './constants';
import { CharacterData } from './types';

const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Load from local storage on mount (or when user changes)
  useEffect(() => {
    if (authLoading) return;
    
    if (user) {
        // User is logged in: Load their specific data
        // In a real app, this would be: await firestore.collection('users').doc(user.uid).get()
        const storageKey = `dnd-characters-${user.uid}`;
        const saved = localStorage.getItem(storageKey);
        
        if (saved) {
            try {
                setCharacters(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse characters", e);
                setCharacters([]);
            }
        } else {
            // New user (or just cleared cache) -> Give them Vesper template if empty
            // Only if it's the guest account for demo purposes
            if (user.isAnonymous) {
                 setCharacters([VESPER_DATA]);
            } else {
                 setCharacters([]);
            }
        }
    } else {
        setCharacters([]);
    }
    setDataLoading(false);
  }, [user, authLoading]);

  // Save to local storage whenever characters change
  useEffect(() => {
    if (!authLoading && !dataLoading && user) {
      const storageKey = `dnd-characters-${user.uid}`;
      localStorage.setItem(storageKey, JSON.stringify(characters));
    }
  }, [characters, authLoading, dataLoading, user]);

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

  if (authLoading || (user && dataLoading)) {
      return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">Loading...</div>;
  }

  if (!user) {
      return <LoginScreen />;
  }

  const activeCharacter = characters.find(c => c.id === activeCharacterId);

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

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;