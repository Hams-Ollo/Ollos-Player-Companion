import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => void;
  signInAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('vesper_user');
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const signInWithGoogle = () => {
    const mockUser = { uid: 'google-123', displayName: 'Valeros Bold', email: 'val@bold.com', photoURL: null };
    setUser(mockUser);
    localStorage.setItem('vesper_user', JSON.stringify(mockUser));
  };

  const signInAsGuest = () => {
    const mockUser = { uid: 'guest-' + Math.random().toString(36).substr(2, 5), displayName: 'Stranger', email: null, photoURL: null };
    setUser(mockUser);
    localStorage.setItem('vesper_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vesper_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};