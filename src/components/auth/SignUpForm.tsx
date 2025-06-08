
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

interface SignUpFormProps {
  onToggleMode: () => void;
}

export function SignUpForm({ onToggleMode }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'trader' | 'manager'>('trader');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signUp(email, password, { full_name: fullName, role });
    } catch (error) {
      // Error handling is done in the auth hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm transition-colors">
      <CardHeader>
        <CardTitle className="dark:text-gray-100">Criar Conta</CardTitle>
        <CardDescription className="dark:text-gray-300">
          Cadastre-se para acessar a plataforma de trading
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="dark:text-gray-200">Nome Completo</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="dark:text-gray-200">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="dark:text-gray-200">Tipo de Conta</Label>
            <Select value={role} onValueChange={(value: 'trader' | 'manager') => setRole(value)}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                <SelectValue placeholder="Selecione o tipo de conta" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectItem value="trader" className="dark:text-gray-100">Trader</SelectItem>
                <SelectItem value="manager" className="dark:text-gray-100">Gerente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onToggleMode}
          >
            Já tem conta? Faça login
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
