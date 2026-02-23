import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import CharacterSelection from './components/CharacterSelection';
import Dashboard from './components/Dashboard';
import DMDashboard from './components/DMDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import RollRequestBanner from './components/RollRequestBanner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CharacterProvider, useCharacters } from './contexts/CharacterContext';
import { CampaignProvider, useCampaign } from './contexts/CampaignContext';
import { AlertTriangle } from 'lucide-react';

const SaveErrorBanner: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-full px-4">
    <div className="flex items-center gap-2 bg-red-900/90 border border-red-500/60 text-red-200 rounded-lg px-4 py-2 text-sm shadow-lg backdrop-blur-sm">
      <AlertTriangle size={16} className="flex-shrink-0 text-red-400" />
      <span className="truncate">{message}</span>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { isDM, activeCampaign, setActiveCampaignId } = useCampaign();
  const [dmReturnCharId, setDmReturnCharId] = useState<string | null>(null);

  const {
    characters,
    activeCharacter,
    activeCharacterId,
    setActiveCharacterId,
    createCharacter,
    updateCharacter,
    updatePortrait,
    deleteCharacter,
    isLoading: charsLoading,
    saveError,
  } = useCharacters();

  if (authLoading || charsLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-zinc-500 space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="font-display text-xs tracking-widest uppercase animate-pulse">Loading Hall...</p>
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  if (activeCharacter) {
    return (
      <ErrorBoundary fallbackTitle="The Dashboard has collapsed">
        {saveError && <SaveErrorBanner message={saveError} />}
        {!isDM && activeCampaign && <RollRequestBanner />}
        <Dashboard 
          data={activeCharacter}
          onUpdatePortrait={(url) => updatePortrait(url)}
          onUpdateData={(newData) => updateCharacter(newData)}
          onExit={() => setActiveCharacterId(null)}
          onSwitchToDM={isDM && activeCampaign ? () => { setDmReturnCharId(activeCharacterId); setActiveCharacterId(null); } : undefined}
        />
      </ErrorBoundary>
    );
  }

  if (!activeCharacter && isDM && activeCampaign) {
    return (
      <ErrorBoundary fallbackTitle="The DM Screen has collapsed">
        <DMDashboard
          onExit={() => { setDmReturnCharId(null); setActiveCampaignId(null); }}
          onReturnToCharacter={dmReturnCharId ? () => { setActiveCharacterId(dmReturnCharId); setDmReturnCharId(null); } : undefined}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary fallbackTitle="The Hall has collapsed">
      {saveError && <SaveErrorBanner message={saveError} />}
      {!isDM && activeCampaign && <RollRequestBanner />}
      <CharacterSelection 
        characters={characters}
        onSelect={(id) => setActiveCharacterId(id)}
        onCreate={(newChar) => createCharacter(newChar)}
        onDelete={(id) => deleteCharacter(id)}
      />
    </ErrorBoundary>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <CharacterProvider>
      <CampaignProvider>
        <AppContent />
      </CampaignProvider>
    </CharacterProvider>
  </AuthProvider>
);

export default App;