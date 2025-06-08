
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { FinancialAssetsBanner } from './FinancialAssetsBanner';
import { NewsBanner } from './NewsBanner';
import { TrendingUp, TrendingDown, BarChart3, Shield, Users, Zap } from 'lucide-react';

export function HomePage() {
  const { user, signOut } = useAuth();

  const features = [
    {
      icon: BarChart3,
      title: 'Trading Avançado',
      description: 'Execute operações com ferramentas profissionais e análise técnica avançada'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Seus investimentos protegidos com tecnologia de ponta e criptografia'
    },
    {
      icon: Users,
      title: 'Gestão Profissional',
      description: 'Acesso a gestores especializados e estratégias automatizadas'
    },
    {
      icon: Zap,
      title: 'Execução Rápida',
      description: 'Ordens executadas em millisegundos no mercado global'
    }
  ];

  const stats = [
    { label: 'Usuários Ativos', value: '50K+', positive: true },
    { label: 'Volume Diário', value: '$2.5B', positive: true },
    { label: 'Ativos Disponíveis', value: '200+', positive: true },
    { label: 'Países Atendidos', value: '150+', positive: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">InvestPro</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <span className="text-sm text-gray-700">
                    Olá, {user.full_name || user.email}
                  </span>
                  <Badge variant={user.role === 'manager' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={signOut}>
                    Sair
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Financial Assets Banner */}
      <FinancialAssetsBanner />

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Invista com <span className="text-blue-600">Inteligência</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma completa para trading e investimentos com tecnologia de ponta, 
            análise em tempo real e gestão profissional de portfólio.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="px-8 py-3">
              Começar a Investir
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Banner */}
      <NewsBanner />

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher nossa plataforma?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Oferecemos as melhores ferramentas e recursos para maximizar seus investimentos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar a investir?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a milhares de investidores que já confiam em nossa plataforma
          </p>
          <Button size="lg" variant="secondary" className="px-8 py-3">
            Criar Conta Gratuita
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-lg font-bold">InvestPro</span>
              </div>
              <p className="text-gray-400">
                Sua plataforma completa para investimentos e trading profissional.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produtos</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Trading</li>
                <li>Investimentos</li>
                <li>Gestão</li>
                <li>Análises</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Central de Ajuda</li>
                <li>Contato</li>
                <li>Tutoriais</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre Nós</li>
                <li>Carreiras</li>
                <li>Imprensa</li>
                <li>Legal</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InvestPro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
