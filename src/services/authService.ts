
import { User } from '@/types/trading';
import { FlaskAuthResponse } from '@/types/auth';
import { FLASK_API_URL } from '@/constants/auth';
import { toast } from 'sonner';

export class AuthService {
  static async signIn(email: string, password: string): Promise<FlaskAuthResponse> {
    const response = await fetch(`${FLASK_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  }

  static async signUp(
    email: string, 
    password: string, 
    userData: Partial<User>
  ): Promise<FlaskAuthResponse> {
    const response = await fetch(`${FLASK_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        full_name: userData.full_name,
        role: userData.role || 'trader',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  }
}
