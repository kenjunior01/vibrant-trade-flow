
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Removidas importações de supabase e tipos de authService/authUtils, pois não são mais necessários aqui.
// Se houver tipos de usuário genéricos em `types/auth.ts` que ainda são úteis, eles podem ser mantidos.
// Por enquanto, vamos assumir que o tipo User também não é mais estritamente necessário aqui.

interface AuthContextType {
  user: any | null; // Pode ser um tipo mais específico se você tiver um mock de usuário
  isLoading: boolean;
  // Removidas funções login, logout, signup
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Não há mais estado de usuário real ou sessão, pois o login foi removido
  const [user, setUser] = useState<any | null>(null); // Usuário sempre null ou um mock se necessário
  const [isLoading, setIsLoading] = useState(false); // Carregamento sempre falso

  // Não há mais lógica de login, logout, signup ou onAuthStateChange

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
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
