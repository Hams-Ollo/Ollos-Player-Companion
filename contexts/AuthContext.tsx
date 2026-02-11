import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  signInAnonymously,
  Auth,
  User
} from 'firebase/auth';

// Helper to get env variables with fallbacks
const getEnv = (key: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
};

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY') || getEnv('FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN') || getEnv('FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID') || getEnv('FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET') || getEnv('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || getEnv('FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID') || getEnv('FIREBASE_APP_ID')
};

// Initialize Firebase using the Modular API
let auth: Auth | null = null;
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

const initFirebase = () => {
  try {
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'undefined') {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      auth = getAuth(app);
      return true;
    }
    return false;
  } catch (e) {
    console.error("Firebase initialization failed:", e);
    return false;
  }
};

// Run initial init
initFirebase();

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retry init if it failed earlier
    if (!auth) initFirebase();
    
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        setUser(profile);
        localStorage.setItem('vesper_user', JSON.stringify(profile));
      } else {
        setUser(null);
        localStorage.removeItem('vesper_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    // Try to re-init if auth is missing
    if (!auth) initFirebase();

    if (!auth) {
      alert("Auth system not initialized. Please verify that your environment variables (FIREBASE_API_KEY, etc.) are correctly set in the .env file.");
      return;
    }
    
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      
      if (error.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        alert(`Authentication failed: Domain "${domain}" is not authorized in your Firebase console. \n\nTo fix this: Go to Firebase Console > Authentication > Settings > Authorized Domains and add "${domain}".`);
      } else if (error.code === 'auth/popup-blocked') {
        alert("The sign-in popup was blocked by your browser. Please allow popups for this site.");
      } else if (error.code === 'auth/operation-not-allowed') {
        alert("Google sign-in is not enabled in your Firebase project. Please enable it in the Authentication > Sign-in method tab.");
      } else {
        alert(`Sign-in failed: ${error.message}`);
      }
    }
  };

  const signInAsGuest = async () => {
    if (!auth) initFirebase();

    if (!auth) {
      // Fallback local session if Firebase is totally unavailable
      const mockUser = { uid: 'guest-local-' + Date.now(), displayName: 'Local Adventurer', email: null, photoURL: null };
      setUser(mockUser);
      setLoading(false);
      return;
    }
    
    try {
      await signInAnonymously(auth);
    } catch (error: any) {
      console.error("Guest Sign-In Error:", error);
      const mockUser = { 
        uid: 'guest-' + Math.random().toString(36).substr(2, 5), 
        displayName: 'Guest Adventurer', 
        email: null, 
        photoURL: null 
      };
      setUser(mockUser);
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!auth) {
      setUser(null);
      return;
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
      setUser(null); // Force clear state anyway
    }
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