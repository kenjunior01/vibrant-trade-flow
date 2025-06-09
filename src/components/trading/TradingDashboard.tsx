
import { WalletInfo } from './WalletInfo';
import { OrderForm } from './OrderForm';
import { PositionsList } from './PositionsList';
import { AdvancedChart } from './AdvancedChart';
import { AdvancedOrderBook } from './AdvancedOrderBook';
import { TechnicalAnalysis } from './TechnicalAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TradingDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trading Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Plataforma avançada de trading com gráficos, order book e análise técnica
        </p>
      </div>

      <WalletInfo />

      <Tabs defaultValue="trading" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="analysis">Análise</TabsTrigger>
          <TabsTrigger value="positions">Posições</TabsTrigger>
        </TabsList>

        <TabsContent value="trading" className="space-y-6">
          {/* Main Trading Interface */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Chart - Takes most space */}
            <div className="xl:col-span-3">
              <AdvancedChart />
            </div>
            
            {/* Order Book */}
            <div className="xl:col-span-1">
              <AdvancedOrderBook />
            </div>
          </div>

          {/* Order Form and Positions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderForm />
            <PositionsList />
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Technical Analysis */}
            <TechnicalAnalysis />
            
            {/* Chart for analysis */}
            <AdvancedChart />
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PositionsList />
            </div>
            <div>
              <OrderForm />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
