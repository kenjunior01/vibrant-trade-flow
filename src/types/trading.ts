
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  country?: string;
  company?: string;
  role: 'trader' | 'manager' | 'admin' | 'superadmin';
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  risk_profile: 'low' | 'medium' | 'high';
  manager_id?: string;
  balance: number;
  plan: string;
  investment_goals?: string[];
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Position {
  id: string;
  user_id: string;
  wallet_id?: string;
  automation_id?: string;
  asset_symbol: string;
  type: 'long' | 'short';
  amount: number;
  open_price: number;
  close_price?: number;
  leverage: number;
  status: 'open' | 'closed';
  pnl: number;
  opened_at: string;
  closed_at?: string;
}

export interface Order {
  id: string;
  user_id: string;
  wallet_id: string;
  asset_symbol: string;
  side: 'buy' | 'sell';
  order_type: 'market' | 'limit' | 'stop' | 'stop_limit' | 'trailing_stop';
  quantity: number;
  price?: number;
  stop_price?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'partially_filled';
  filled_quantity: number;
  remaining_quantity?: number;
  leverage: number;
  take_profit?: number;
  stop_loss?: number;
  trailing_stop_distance?: number;
  created_at: string;
  updated_at: string;
  filled_at?: string;
  cancelled_at?: string;
  expires_at?: string;
}

export interface Automation {
  id: string;
  client_user_id: string;
  manager_user_id: string;
  wallet_id?: string;
  strategy_id?: string;
  strategy_name?: string;
  asset_symbol: string;
  balance_percentage?: number;
  take_profit_percentage?: number;
  stop_loss_percentage?: number;
  interval_cron?: string;
  parameters: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  position_id?: string;
  type: 'deposit' | 'withdrawal' | 'trade' | 'commission';
  amount: number;
  description?: string;
  created_at: string;
}
