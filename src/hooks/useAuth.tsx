
import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '@/types/trading';
import { AuthContextType, AuthProviderProps } from '@/types/auth';
import { AuthService } from '@/services/authService';
import { 
  storeAuthData, 
  clearAuthData, 
  getStoredAuthData, 
  convertFlaskUserToUser 
} from '@/utils/authUtils';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { token, userData } = getStoredAuthData();
    
    if (token && userData) {
      setUser(userData);
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const data = await AuthService.signIn(email, password);
      
      storeAuthData(data);
      const userData = convertFlaskUserToUser(data.user);
      
      setUser(userData);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setLoading(true);
      
      const data = await AuthService.signUp(email, password, userData);
      
      storeAuthData(data);
      const newUserData = convertFlaskUserToUser(data.user);
      
      setUser(newUserData);
      toast.success('Conta criada com sucesso!');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao criar conta');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      clearAuthData();
      setUser(null);
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erro ao fazer logout');
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Erro ao atualizar perfil');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
