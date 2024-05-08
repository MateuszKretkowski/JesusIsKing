import { createContext, useContext, useState } from 'react';

const OpacityContext = createContext(OpacityContextType | undefined);

interface OpacityContextType {
    user: firebase.User | null; 
    googleSignIn: () => void;
    logOut: () => void;
  }

export function useOpacity() {
    return useContext(OpacityContext);
}

export function OpacityProvider({ children }) {
    const [opacity, setOpacity] = useState(0);

    return (
        <OpacityContext.Provider value={{ opacity, setOpacity }}>
            {children}
        </OpacityContext.Provider>
    );
}