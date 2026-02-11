
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
// Fix: Use namespaced imports for Firebase v8 compatibility to resolve "no exported member" errors
import firebase from 'firebase/app';
import 'firebase/auth';

// Firebase configuration using provided environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase safely using the namespaced API
let auth: any;
try {
  // Fix: Use namespaced initialization to resolve missing functional exports
  const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();
  auth = app.auth();
} catch (e) {
  console.error("Firebase initialization failed. Check your environment variables.", e);
}

// Fix: Use namespaced provider to resolve "no exported member 'GoogleAuthProvider'"
const googleProvider = new firebase.auth.GoogleAuthProvider();

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
    if (!auth) {
      setLoading(false);
      return;
    }

    // Fix: Use namespaced onAuthStateChanged to resolve "no exported member"
    const unsubscribe = auth.onAuthStateChanged((firebaseUser: any) => {
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
    if (!auth) return;
    try {
      // Fix: Use namespaced signInWithPopup
      await auth.signInWithPopup(googleProvider);
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      alert(`Sign-in failed: ${error.message}`);
    }
  };

  const signInAsGuest = async () => {
    if (!auth) {
      // Fallback if auth is completely missing
      const mockUser = { uid: 'guest-local', displayName: 'Guest (Local)', email: null, photoURL: null };
      setUser(mockUser);
      setLoading(false);
      return;
    }
    try {
      // Fix: Use namespaced signInAnonymously
      await auth.signInAnonymously();
    } catch (error) {
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
      // Fix: Use namespaced signOut
      await auth.signOut();
    } catch (error) {
      console.error("Logout Error:", error);
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
