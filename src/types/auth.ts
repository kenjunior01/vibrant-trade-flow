
import { ReactNode } from 'react';
import { User } from '@/types/trading';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface FlaskAuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    risk_profile?: string;
    created_at: string;
  };
}
