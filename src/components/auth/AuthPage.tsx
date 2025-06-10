
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { LoginTest } from '@/components/LoginTest';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="flex flex-col justify-center">
          {isSignUp ? (
            <SignUpForm onToggleMode={() => setIsSignUp(false)} />
          ) : (
            <LoginForm onToggleMode={() => setIsSignUp(true)} />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">Test Login</h3>
            <p className="text-gray-300 text-sm mb-4">
              Use these demo accounts to test the platform
            </p>
          </div>
          <LoginTest />
        </div>
      </div>
    </div>
  );
}
