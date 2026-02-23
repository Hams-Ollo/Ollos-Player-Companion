
import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup,
  GoogleAuthProvider, 
  signInAnonymously, 
  signOut
} from 'firebase/auth';
import { UserProfile } from '../types';

// Firebase client config — these are PUBLIC identifiers (not secrets).
// They are safe to commit; security is enforced server-side via Firebase
// Security Rules + the Express proxy for Gemini API calls.
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyDKVE6CZgRKHA4JJj8zK2B8VfLRwBO4n-g',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'gen-lang-client-0664125417.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0664125417',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'gen-lang-client-0664125417.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '350817164864',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:350817164864:web:a651f5d31dc2054a5949a5',
};

// Singleton pattern for Firebase initialization
const getFirebaseApp = () => {
  const existingApps = getApps();
  if (existingApps.length > 0) return existingApps[0];
  
  // Basic validation to prevent crashing on boot if keys are missing
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
    console.warn("Firebase API Key is missing. Auth features will not function.");
  }
  
  return initializeApp(firebaseConfig);
};

const app = getFirebaseApp();
export { app as firebaseApp };
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInError: string | null;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || (firebaseUser.isAnonymous ? 'Guest Adventurer' : 'Adventurer'),
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      setSignInError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      setSignInError(error?.message ?? 'Sign-in failed.');
    }
  };

  const signInAsGuest = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error: any) {
      console.error("Guest Sign-In Error:", error);
      // Fallback: if anonymous auth is not enabled or Firebase fails,
      // create a local-only guest session so the app is still usable
      if (error?.code === 'auth/operation-not-allowed' || error?.code === 'auth/admin-restricted-operation') {
        console.warn("Anonymous auth not enabled in Firebase. Using local guest session.");
        setUser({
          uid: 'guest-local-' + Date.now(),
          displayName: 'Guest Adventurer',
          email: null,
          photoURL: null,
        });
        setLoading(false);
      } else {
        alert(`Guest sign-in failed: ${error?.message || 'Unknown error'}`);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInError, signInWithGoogle, signInAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
