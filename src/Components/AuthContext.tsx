import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
  } from "firebase/auth";
  import { auth } from "./config/config";
import firebase from 'firebase/compat/app';
import LoadingScreen from './Loading Screen/LoadingScreen';

const authContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextType {
  user: firebase.User | null; 
  googleSignIn: () => void;
  logOut: () => void;
}
interface AuthContextProviderProps {
  children: ReactNode;
}


export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState<firebase.User | null>(null);
    const [loading, setLoading] = useState(true); // Dodajemy stan dla informacji o załadowaniu danych użytkownika
  
    const googleSignIn = () => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider);
    };
  
    const logOut = () => {
      signOut(auth);
    };
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser as firebase.User | null);
        setLoading(false); // Ustawiamy loading na false, gdy dane użytkownika zostaną załadowane
      });
      return () => unsubscribe();
    }, [user]);
  
    // Jeśli dane użytkownika są wciąż ładowane, możemy zwrócić komunikat o ładowaniu, zamiast renderować dzieci
    if (loading) {
      return <LoadingScreen />;
    }
  
    return <authContext.Provider value={{user, googleSignIn, logOut }}>{children}</authContext.Provider>;
  }

export const UserAuth = () => {
  const context = useContext(authContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
}