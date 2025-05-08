import React, { createContext, useContext, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
} 