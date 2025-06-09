
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTradingAPI } from '@/hooks/useTradingAPI';
import { usePositions } from '@/hooks/usePositions';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

export function PositionsList() {
  const { positions, refetch } = usePositions();
  const { closePosition, loading } = useTradingAPI();

  const openPositions = positions.filter(pos => pos.status === 'open');

  const handleClosePosition = async (positionId: string) => {
    try {
      await closePosition(positionId);
      refetch();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  if (openPositions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Posições Abertas</CardTitle>
          <CardDescription>
            Suas posições ativas aparecerão aqui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Nenhuma posição aberta
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posições Abertas</CardTitle>
        <CardDescription>
          {openPositions.length} posição(ões) ativa(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {openPositions.map((position) => (
            <div
              key={position.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{position.asset_symbol}</span>
                    <Badge variant={position.type === 'long' ? 'default' : 'secondary'}>
                      {position.type === 'long' ? 'Long' : 'Short'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    {position.amount} @ ${position.open_price.toFixed(5)}
                  </div>
                </div>

                <div className="text-right">
                  <div className={`flex items-center gap-1 font-semibold ${
                    position.pnl && position.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {position.pnl && position.pnl >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    ${position.pnl?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {position.opened_at && new Date(position.opened_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleClosePosition(position.id)}
                disabled={loading}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
                Fechar
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
