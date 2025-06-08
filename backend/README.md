
# Trading Platform Backend

Backend Flask completo para plataforma de trading com integração de APIs de dados reais, sistema de autenticação avançado e funcionalidades de automação.

## Características Principais

### 🔐 **Sistema de Autenticação Robusto**
- Autenticação JWT com refresh tokens
- Sistema de roles (SuperAdmin, Admin, Manager, Trader)
- Hashing seguro de senhas com bcrypt
- Controle de acesso granular por endpoint

### 📊 **Integração com APIs de Dados Reais**
- **Alpha Vantage**: Forex, ações, commodities
- **Finnhub**: Dados de ações em tempo real
- **CoinGecko**: Cotações de criptomoedas
- **NewsAPI**: Notícias financeiras com análise de sentimento
- Sistema de cache para otimização de performance

### 🤖 **Módulo de Automação Inteligente**
- Estratégias configuráveis (DCA, Grid Trading, Trailing Stop, etc.)
- Perfis de risco por cliente
- Backtesting simplificado
- Gestão de Stop Loss e Take Profit automáticos
- Celery para execução de tarefas em background

### 💬 **Chat em Tempo Real**
- WebSockets com Flask-SocketIO
- Salas de chat baseadas em roles
- Chat privado entre manager e clientes
- Indicadores de digitação
- Sistema de permissões por sala

### 📈 **Sistema de Trading Simulado**
- Execução de ordens (Market, Limit, Stop, OCO)
- Gestão de posições e carteiras
- Cálculo de P&L em tempo real
- Histórico de negociações
- Métricas de performance

## Instalação e Configuração

### 1. **Pré-requisitos**
```bash
# Python 3.8+
python --version

# Redis (para Celery e cache)
sudo apt-get install redis-server
# ou no macOS:
brew install redis

# PostgreSQL (recomendado para produção)
sudo apt-get install postgresql postgresql-contrib
```

### 2. **Instalação das Dependências**
```bash
cd backend
pip install -r requirements.txt
```

### 3. **Configuração das Variáveis de Ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
nano .env
```

### 4. **Obtenção das API Keys**

#### **Alpha Vantage** (Forex, Ações, Commodities)
1. Acesse: https://www.alphavantage.co/support/#api-key
2. Cadastre-se gratuitamente
3. Copie sua API key
4. Plano gratuito: 25 requisições/dia

#### **Finnhub** (Dados de Ações)
1. Acesse: https://finnhub.io/register
2. Cadastre-se gratuitamente
3. Copie sua API key
4. Plano gratuito: 60 chamadas/minuto

#### **NewsAPI** (Notícias Financeiras)
1. Acesse: https://newsapi.org/register
2. Cadastre-se gratuitamente
3. Copie sua API key
4. Plano gratuito: 1000 requisições/mês

### 5. **Configuração do Banco de Dados**

#### **Para Desenvolvimento (SQLite)**
```bash
# Altere no .env:
DATABASE_URL=sqlite:///trading_platform.db
```

#### **Para Produção (PostgreSQL)**
```bash
# Crie o banco
sudo -u postgres createdb trading_platform

# Configure no .env:
DATABASE_URL=postgresql://usuario:senha@localhost:5432/trading_platform
```

### 6. **Execução da Aplicação**

#### **Servidor Principal**
```bash
cd backend
python app.py
```

#### **Worker Celery (em outro terminal)**
```bash
cd backend
celery -A app.celery worker --loglevel=info
```

#### **Redis** 
```bash
redis-server
```

## Estrutura da API

### 🔐 **Autenticação (`/api/auth`)**
- `POST /register` - Registro de usuário
- `POST /login` - Login
- `GET /profile` - Perfil do usuário
- `POST /refresh` - Refresh token

### 📊 **Dados de Mercado (`/api/market`)**
- `GET /quotes` - Cotações em tempo real
- `GET /chart/<symbol>` - Dados históricos para gráficos
- `GET /symbols` - Lista de instrumentos disponíveis

### 💰 **Trading (`/api/trading`)**
- `GET /positions` - Posições do usuário
- `GET /orders` - Ordens do usuário
- `POST /place-order` - Executar ordem
- `POST /close-position/<id>` - Fechar posição
- `GET /wallet` - Informações da carteira
- `GET /performance` - Métricas de performance

### 🤖 **Automação (`/api/automation`)**
- `GET /strategies` - Estratégias de automação
- `POST /strategies` - Criar estratégia
- `PUT /strategies/<id>` - Atualizar estratégia
- `DELETE /strategies/<id>` - Deletar estratégia
- `GET /strategy-templates` - Templates disponíveis
- `GET /clients` - Clientes do manager
- `GET /performance/<id>` - Performance da estratégia

### 📰 **Notícias (`/api/news`)**
- `GET /latest` - Últimas notícias
- `GET /search` - Buscar notícias
- `GET /sentiment-summary` - Análise de sentimento

### 👥 **Administração (`/api/admin`)**
- `GET /users` - Lista de usuários
- `POST /users/<id>/toggle-status` - Ativar/desativar usuário
- `POST /users/<id>/assign-manager` - Atribuir manager
- `GET /dashboard-stats` - Estatísticas do dashboard
- `GET /system-logs` - Logs do sistema
- `POST /create-manager` - Criar conta de manager

### 💬 **Chat (`/api/chat`)**
- `GET /rooms` - Salas disponíveis
- `GET /rooms/<id>/participants` - Participantes da sala
- **WebSocket Events**: `connect`, `join_room`, `send_message`, `typing`

## Sistema de Roles e Permissões

### **SuperAdmin**
- Acesso total ao sistema
- Gerenciar admins e managers
- Configurações globais
- Logs e auditoria completa

### **Admin**
- Gerenciar managers e traders
- Monitorar atividades
- Relatórios de sistema
- Não pode modificar outros admins

### **Manager**
- Gerenciar clientes (traders)
- Criar estratégias de automação
- Executar ordens para clientes
- Chat com clientes

### **Trader**
- Visualizar própria carteira
- Acompanhar estratégias automatizadas
- Chat com manager
- Relatórios de performance

## Módulo de Automação

### **Tipos de Estratégia**

#### **Dollar Cost Averaging (DCA)**
```json
{
  "strategy_type": "dca",
  "parameters": {
    "interval_hours": 24,
    "amount_per_trade": 100,
    "max_trades": 10
  }
}
```

#### **Grid Trading**
```json
{
  "strategy_type": "grid",
  "parameters": {
    "grid_size": 0.001,
    "grid_levels": 10,
    "base_amount": 100
  }
}
```

#### **Trailing Stop**
```json
{
  "strategy_type": "trailing_stop",
  "parameters": {
    "trail_distance": 0.005,
    "min_profit": 0.002
  }
}
```

### **Configuração de Risco**
- **Stop Loss**: Percentual ou valor absoluto
- **Take Profit**: Percentual ou valor absoluto
- **Max Daily Loss**: Limite de perda diária
- **Capital Allocation**: Percentual do saldo a ser usado

## WebSockets (Chat)

### **Conectar**
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### **Eventos Principais**
```javascript
// Entrar em uma sala
socket.emit('join_room', {room: 'general'});

// Enviar mensagem
socket.emit('send_message', {
  room: 'general',
  message: 'Hello everyone!'
});

// Receber mensagens
socket.on('receive_message', (data) => {
  console.log(data.message);
});
```

## Análise de Sentimento

O sistema inclui análise básica de sentimento para notícias financeiras:

```python
def analyze_sentiment(text):
    positive_words = ['bull', 'rise', 'gain', 'profit', 'growth']
    negative_words = ['bear', 'fall', 'loss', 'drop', 'decline']
    
    # Calcula score baseado em palavras-chave
    # Retorna: 'positive', 'negative', 'neutral'
```

## Tarefas Celery

### **Monitoramento de Preços**
```python
@celery.task
def monitor_market_prices():
    # Atualiza preços em tempo real
    # Executa estratégias de automação
    # Verifica stop loss e take profit
```

### **Limpeza de Cache**
```python
@celery.task
def cleanup_expired_cache():
    # Remove dados expirados do cache
    # Executa a cada hora
```

## Segurança

### **Implementado**
- ✅ Hashing de senhas com bcrypt
- ✅ Autenticação JWT
- ✅ Validação de entrada
- ✅ Controle de acesso por roles
- ✅ Rate limiting implícito (via APIs externas)
- ✅ CORS configurado

### **Recomendações para Produção**
- 🔧 HTTPS obrigatório
- 🔧 Rate limiting personalizado
- 🔧 Logs de segurança
- 🔧 Backup automático do banco
- 🔧 Monitoramento de intrusão

## Testes

### **Executar Testes**
```bash
# Instalar pytest
pip install pytest pytest-flask

# Executar testes
pytest tests/
```

### **Estrutura de Testes**
```
tests/
├── test_auth.py          # Testes de autenticação
├── test_trading.py       # Testes de trading
├── test_automation.py    # Testes de automação
├── test_market_data.py   # Testes de dados de mercado
└── conftest.py          # Configuração dos testes
```

## Monitoramento e Logs

### **Logs Estruturados**
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### **Métricas de Performance**
- Tempo de resposta das APIs
- Taxa de cache hits
- Número de usuários ativos
- Volume de trading
- Erros de API

## Deploy para Produção

### **Docker** (Recomendado)
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["gunicorn", "--worker-class", "eventlet", "-w", "1", "--bind", "0.0.0.0:5000", "app:app"]
```

### **Variáveis de Ambiente de Produção**
```bash
FLASK_ENV=production
FLASK_DEBUG=false
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
SECRET_KEY=super-secure-production-key
```

## Próximos Passos

### **Funcionalidades Futuras**
1. **Machine Learning Avançado**
   - Predição de preços
   - Recomendações personalizadas
   - Detecção de padrões

2. **Integração com Brokers Reais**
   - MetaTrader 4/5
   - Interactive Brokers
   - Binance API

3. **Analytics Avançados**
   - Dashboard de BI
   - Relatórios customizados
   - Alertas inteligentes

4. **Mobile App**
   - React Native
   - Push notifications
   - Trading móvel

## Suporte e Documentação

### **Links Úteis**
- [Alpha Vantage Docs](https://www.alphavantage.co/documentation/)
- [Finnhub API Docs](https://finnhub.io/docs/api)
- [NewsAPI Docs](https://newsapi.org/docs)
- [Flask-SocketIO Docs](https://flask-socketio.readthedocs.io/)
- [Celery Docs](https://docs.celeryproject.org/)

### **Troubleshooting**

#### **API Rate Limits**
```python
# Implementar backoff exponencial
import time
import random

def api_call_with_retry(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except RateLimitError:
            wait_time = (2 ** attempt) + random.uniform(0, 1)
            time.sleep(wait_time)
    raise Exception("Max retries exceeded")
```

#### **Problemas de Conexão WebSocket**
```javascript
// Reconexão automática
socket.on('disconnect', () => {
  console.log('Disconnected, attempting to reconnect...');
  setTimeout(() => {
    socket.connect();
  }, 1000);
});
```

---

**Desenvolvido com ❤️ para uma experiência de trading de ponta**
