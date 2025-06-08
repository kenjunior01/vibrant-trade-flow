
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const testUsers = [
  {
    email: 'trader@test.com',
    password: '123456',
    role: 'Trader',
    name: 'João Trader',
    description: 'Usuário padrão para trading'
  },
  {
    email: 'manager@test.com',
    password: '123456',
    role: 'Gerente',
    name: 'Maria Gestora',
    description: 'Gerente de contas com acesso a automações'
  },
  {
    email: 'admin@test.com',
    password: '123456',
    role: 'Admin',
    name: 'Carlos Admin',
    description: 'Administrador com controle total'
  },
  {
    email: 'superadmin@test.com',
    password: '123456',
    role: 'Super Admin',
    name: 'Ana Super Admin',
    description: 'Super administrador com todos os privilégios'
  }
];

export function TestUserCredentials() {
  const copyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`Email: ${email}\nSenha: ${password}`);
    toast.success('Credenciais copiadas para a área de transferência!');
  };

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Usuários de Teste Disponíveis
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testUsers.map((user, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{user.name}</CardTitle>
                <Badge variant="secondary">{user.role}</Badge>
              </div>
              <CardDescription className="text-xs">
                {user.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Email:</span> {user.email}
                </div>
                <div>
                  <span className="font-medium">Senha:</span> {user.password}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => copyCredentials(user.email, user.password)}
                >
                  <Copy className="h-3 w-3 mr-2" />
                  Copiar Credenciais
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
