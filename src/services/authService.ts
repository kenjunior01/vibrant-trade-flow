import { User } from '@/types/trading';
import { FlaskAuthResponse } from '@/types/auth';
import { FLASK_API_URL } from '@/constants/auth';
import { toast } from 'sonner';

export class AuthService {
  static async signIn(email: string, password: string): Promise<any> {
    // Django SimpleJWT espera 'username' por padrão, mas pode ser configurado para aceitar 'email'.
    // Aqui tentamos ambos, mas o ideal é alinhar o backend para aceitar 'email'.
    const response = await fetch(`${FLASK_API_URL}/auth/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username: email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }

    // O backend Django retorna { access, refresh }
    // Para manter compatibilidade, retornamos um objeto similar ao FlaskAuthResponse
    return {
      access_token: data.access,
      refresh_token: data.refresh,
      user: {
        id: '', // Será necessário buscar o perfil do usuário depois do login
        email: email,
        full_name: '',
        role: '',
        created_at: '',
      },
    };
  }

  static async signUp(
    email: string, 
    password: string, 
    userData: Partial<User>
  ): Promise<FlaskAuthResponse> {
    // Mantém o fluxo antigo, mas o ideal é criar um endpoint de registro no Django
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
