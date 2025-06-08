
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { MarketTicker } from '@/components/MarketTicker';
import { FinancialAssetsBanner } from './FinancialAssetsBanner';
import { NewsBanner } from './NewsBanner';
import { FloatingElements } from './FloatingElements';
import { CandlestickPattern } from './CandlestickPattern';
import { AnimatedChart } from './AnimatedChart';
import { ThemeToggle } from '../ThemeToggle';
import { TrendingUp, TrendingDown, BarChart3, Shield, Users, Zap, Menu, X } from 'lucide-react';

export function HomePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleTradingAccess = () => {
    if (user) {
      navigate('/trading');
    } else {
      navigate('/auth');
    }
  };

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

  const navItems = [
    { label: 'Início', href: '#home' },
    { label: 'Recursos', href: '#features' },
    { label: 'Sobre', href: '#about' },
    { label: 'Contato', href: '#contact' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden transition-colors">
      {/* Market Ticker - Novo componente no topo */}
      <MarketTicker />
      
      {/* Floating Background Elements */}
      <FloatingElements />
      <CandlestickPattern />
      <AnimatedChart />
      
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-green-500/5 animate-pulse" />
      
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b shadow-sm sticky top-0 z-50 relative transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="relative">
                <BarChart3 className="h-8 w-8 text-blue-600 mr-3 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InvestPro
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {user ? (
                <>
                  <span className="hidden md:block text-sm text-gray-700 dark:text-gray-300">
                    Olá, {user.full_name || user.email}
                  </span>
                  <Badge variant={user.role === 'manager' ? 'default' : 'secondary'} className="animate-bounce">
                    {user.role}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/dashboard')}
                    className="hover:scale-105 transition-transform"
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={signOut} 
                    className="hover:scale-105 transition-transform"
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/auth')}
                    className="hover:scale-105 transition-transform"
                  >
                    Entrar
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/auth')}
                    className="hover:scale-105 transition-transform"
                  >
                    Cadastrar
                  </Button>
                </>
              )}
              
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Financial Assets Banner */}
      <div className="relative z-10">
        <FinancialAssetsBanner />
      </div>

      {/* Hero Section */}
      <section id="home" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Invista com <span className="text-blue-600 animate-pulse">Inteligência</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Plataforma completa para trading e investimentos com tecnologia de ponta, 
              análise em tempo real e gestão profissional de portfólio.
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                size="lg" 
                className="px-8 py-3 hover:scale-105 transition-transform animate-bounce"
                onClick={handleGetStarted}
              >
                {user ? 'Ir para Dashboard' : 'Começar a Investir'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-3 hover:scale-105 transition-transform"
                onClick={handleTradingAccess}
              >
                {user ? 'Plataforma de Trading' : 'Ver Demo'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-blue-600 mb-2 animate-pulse">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Banner */}
      <div className="relative z-10">
        <NewsBanner />
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Por que escolher nossa plataforma?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Oferecemos as melhores ferramentas e recursos para maximizar seus investimentos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4 hover:rotate-12 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 relative z-10 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pronto para começar a investir?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Junte-se a milhares de investidores que já confiam em nossa plataforma
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="px-8 py-3 hover:scale-110 transition-transform animate-bounce"
              onClick={handleGetStarted}
            >
              {user ? 'Acessar Plataforma' : 'Criar Conta Gratuita'}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 relative z-10 transition-colors">
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
