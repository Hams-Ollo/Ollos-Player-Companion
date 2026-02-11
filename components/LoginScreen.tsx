
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Chrome, UserCircle, Shield, Sword, Crown } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const { signInWithGoogle, signInAsGuest } = useAuth();

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center relative overflow-hidden">
      {/* Mystical Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(79,70,229,0.15)_0%,_rgba(5,5,5,1)_70%)]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />
      
      {/* Animated Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />

      <div className="relative z-10 w-full max-w-md px-8 text-center space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        
        {/* Branding */}
        <div className="space-y-6">
          <div className="inline-flex p-4 bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl shadow-2xl shadow-orange-900/50 transform -rotate-3 ring-1 ring-white/20">
            <Crown size={48} className="text-white drop-shadow-lg" />
          </div>
          <div className="space-y-2">
            <h1 className="text-6xl font-display font-black text-white tracking-tighter drop-shadow-2xl">
              VESPER
            </h1>
            <p className="text-zinc-500 text-lg font-medium max-w-[280px] mx-auto leading-tight">
              The next generation digital grimoire for D&D 5e.
            </p>
          </div>
        </div>

        {/* Feature Icons */}
        <div className="flex justify-center gap-4 opacity-40">
            <div className="flex flex-col items-center p-3 bg-zinc-900/40 rounded-2xl border border-white/5 w-20">
                <Shield size={20} className="text-blue-500 mb-1" />
                <span className="text-[9px] uppercase font-black text-zinc-500 tracking-widest">Secure</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-zinc-900/40 rounded-2xl border border-white/5 w-20">
                <Sword size={20} className="text-red-500 mb-1" />
                <span className="text-[9px] uppercase font-black text-zinc-500 tracking-widest">Combat</span>
            </div>
             <div className="flex flex-col items-center p-3 bg-zinc-900/40 rounded-2xl border border-white/5 w-20">
                <Crown size={20} className="text-amber-500 mb-1" />
                <span className="text-[9px] uppercase font-black text-zinc-500 tracking-widest">Party</span>
            </div>
        </div>

        {/* Auth Actions */}
        <div className="space-y-4 pt-4">
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-black font-black py-4 px-6 rounded-2xl transition-all shadow-xl hover:-translate-y-1 active:scale-95"
          >
            <Chrome size={20} />
            Enter with Google
          </button>
          
          <div className="flex items-center gap-4 px-4 py-2">
            <div className="h-px bg-zinc-800 flex-grow" />
            <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">or</span>
            <div className="h-px bg-zinc-800 flex-grow" />
          </div>

          <button
            onClick={signInAsGuest}
            className="w-full flex items-center justify-center gap-3 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold py-4 px-6 rounded-2xl transition-all border border-zinc-800 hover:border-zinc-700 active:scale-95"
          >
            <UserCircle size={20} />
            Guest Adventurer
          </button>
        </div>

        <p className="text-[10px] text-zinc-700 max-w-[240px] mx-auto leading-relaxed">
            By embarking, you accept our <span className="underline cursor-pointer">Covenant of Service</span>. May your rolls be high and your deaths few.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
