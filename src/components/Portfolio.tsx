import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Position {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

interface PortfolioProps {
  balance: number;
  equity: number;
  positions: Position[];
  onClosePosition: (positionId: string) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ 
  balance, 
  equity, 
  positions, 
  onClosePosition 
}) => {
  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Portfolio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Account Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="text-lg font-bold">${balance.toLocaleString()}</p>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm text-muted-foreground">Equity</p>
            <p className="text-lg font-bold">${equity.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Total P&L</p>
          <p className={`text-lg font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
          </p>
        </div>

        {/* Open Positions */}
        <div>
          <h3 className="font-semibold mb-2">Open Positions ({positions.length})</h3>
          {positions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No open positions</p>
          ) : (
            <div className="space-y-2">
              {positions.map((position) => (
                <div key={position.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{position.symbol}</span>
                        <Badge variant={position.side === 'buy' ? 'default' : 'destructive'}>
                          {position.side.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Size: {position.size} | Entry: ${position.entryPrice.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onClosePosition(position.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      Current: ${position.currentPrice.toFixed(2)}
                    </span>
                    <div className="text-right">
                      <p className={`font-medium ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                      </p>
                      <p className={`text-xs ${position.pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
