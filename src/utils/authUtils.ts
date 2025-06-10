
import { User } from '@/types/trading';
import { FlaskAuthResponse } from '@/types/auth';
import { AUTH_STORAGE_KEYS } from '@/constants/auth';

export const storeAuthData = (data: FlaskAuthResponse): void => {
  localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, data.access_token);
  localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
  localStorage.setItem(AUTH_STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
};

export const clearAuthData = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER_DATA);
};

export const getStoredAuthData = (): { token: string | null; userData: User | null } => {
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  const userData = localStorage.getItem(AUTH_STORAGE_KEYS.USER_DATA);
  
  let parsedUser: User | null = null;
  if (userData) {
    try {
      parsedUser = JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      clearAuthData();
    }
  }
  
  return { token, userData: parsedUser };
};

export const convertFlaskUserToUser = (flaskUser: FlaskAuthResponse['user']): User => {
  // Ensure role is a valid user role
  const validRoles = ['trader', 'manager', 'admin', 'superadmin'] as const;
  const role = validRoles.includes(flaskUser.role as any) ? flaskUser.role as User['role'] : 'trader';
  
  // Ensure risk_profile is a valid risk level
  const validRiskProfiles = ['low', 'medium', 'high'] as const;
  const riskProfile = flaskUser.risk_profile && validRiskProfiles.includes(flaskUser.risk_profile as any) 
    ? flaskUser.risk_profile as User['risk_profile'] 
    : 'medium';

  return {
    id: flaskUser.id,
    email: flaskUser.email,
    full_name: flaskUser.full_name,
    role: role,
    risk_profile: riskProfile,
    balance: 10000,
    plan: 'free',
    avatar_url: null,
    phone: null,
    date_of_birth: null,
    country: null,
    company: null,
    experience_level: 'beginner',
    investment_goals: null,
    created_at: flaskUser.created_at,
    updated_at: new Date().toISOString(),
  };
};
