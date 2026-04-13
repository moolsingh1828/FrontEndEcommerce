import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  isAuthReady: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (fUser) => {
      setFirebaseUser(fUser);
      setIsAuthReady(true);
      if (!fUser) {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (firebaseUser) {
      const unsubscribeUser = onSnapshot(
        doc(db, 'users', firebaseUser.uid),
        (doc) => {
          if (doc.exists()) {
            setUser(doc.data() as User);
          }
          setLoading(false);
        },
        (error) => {
          console.error('User profile listener error:', error);
          setLoading(false);
        }
      );
      return () => unsubscribeUser();
    }
  }, [firebaseUser]);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
