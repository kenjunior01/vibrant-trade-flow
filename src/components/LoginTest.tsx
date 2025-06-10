
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginTest() {
  const { signIn, user, loading } = useAuth();
  const [testing, setTesting] = useState(false);

  const testUsers = [
    { email: 'trader@test.com', password: '123456', role: 'Trader' },
    { email: 'manager@test.com', password: '123456', role: 'Manager' },
    { email: 'admin@test.com', password: '123456', role: 'Admin' },
    { email: 'superadmin@test.com', password: '123456', role: 'Super Admin' }
  ];

  const testLogin = async (email: string, password: string) => {
    try {
      setTesting(true);
      await signIn(email, password);
    } catch (error) {
      console.error('Test login failed:', error);
    } finally {
      setTesting(false);
    }
  };

  if (user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-green-600">Login Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.full_name}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>ID:</strong> {user.id}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Demo Logins</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {testUsers.map((testUser, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full"
              onClick={() => testLogin(testUser.email, testUser.password)}
              disabled={loading || testing}
            >
              {testing ? 'Testing...' : `Login as ${testUser.role}`}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
