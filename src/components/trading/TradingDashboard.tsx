
import { WalletInfo } from './WalletInfo';
import { OrderForm } from './OrderForm';
import { PositionsList } from './PositionsList';

export function TradingDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trading Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Gerencie suas posições e execute ordens
        </p>
      </div>

      <WalletInfo />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderForm />
        <PositionsList />
      </div>
    </div>
  );
}
