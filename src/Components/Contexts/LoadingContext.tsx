import { createContext, useContext, useState } from 'react';

const OpacityContext = createContext(OpacityContextType | undefined);

interface OpacityContextType {
    isLoading: boolean; 
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