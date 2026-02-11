import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Chrome, UserCircle, Shield, Sword, Crown } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const { signInWithGoogle, signInAsGuest } = useAuth();

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/30 via-[#09090b] to-[#09090b]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30" />

      <div className="relative z-10 w-full max-w-md px-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Logo / Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-900/40 rotate-3 ring-4 ring-black ring-offset-2 ring-offset-amber-500/20">
            <Crown size={40} className="text-white drop-shadow-md" strokeWidth={2} />
          </div>
          <h1 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 tracking-tight">
            Vesper
          </h1>
          <p className="text-zinc-500 text-lg">
            The next generation character sheet for D&D 5e.
          </p>
        </div>

        {/* Feature Grid (Decorative) */}
        <div className="grid grid-cols-3 gap-2 opacity-50">
            <div className="flex flex-col items-center p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <Shield size={20} className="text-blue-500 mb-2" />
                <span className="text-[10px] uppercase font-bold text-zinc-500">Secure</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <Sword size={20} className="text-red-500 mb-2" />
                <span className="text-[10px] uppercase font-bold text-zinc-500">Combat</span>
            </div>
             <div className="flex flex-col items-center p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <Crown size={20} className="text-amber-500 mb-2" />
                <span className="text-[10px] uppercase font-bold text-zinc-500">Party</span>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-black font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Chrome size={20} />
            Sign in with Google
          </button>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#09090b] px-2 text-zinc-600 font-medium">Or continue as</span>
            </div>
          </div>

          <button
            onClick={signInAsGuest}
            className="w-full flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold py-3.5 px-6 rounded-xl transition-all border border-zinc-800 hover:border-zinc-700"
          >
            <UserCircle size={20} />
            Guest
          </button>
        </div>

        <p className="text-xs text-zinc-600 max-w-xs mx-auto">
            By entering the dungeon, you agree to our Terms of Service. 
            May your rolls be high and your deaths few.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;