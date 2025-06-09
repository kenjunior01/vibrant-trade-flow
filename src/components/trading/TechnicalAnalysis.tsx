
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  strength: number; // 0-100
}

interface TechnicalAnalysisData {
  overall: 'buy' | 'sell' | 'neutral';
  strength: number;
  indicators: TechnicalIndicator[];
  summary: {
    buy: number;
    sell: number;
    neutral: number;
  };
}

export function TechnicalAnalysis() {
  const [analysis, setAnalysis] = useState<TechnicalAnalysisData>({
    overall: 'neutral',
    strength: 0,
    indicators: [],
    summary: { buy: 0, sell: 0, neutral: 0 }
  });

  const generateAnalysis = (): TechnicalAnalysisData => {
    const indicators: TechnicalIndicator[] = [
      {
        name: 'RSI (14)',
        value: 45 + Math.random() * 20,
        signal: 'neutral',
        strength: 60 + Math.random() * 30
      },
      {
        name: 'MACD',
        value: (Math.random() - 0.5) * 0.002,
        signal: Math.random() > 0.6 ? 'buy' : Math.random() > 0.3 ? 'sell' : 'neutral',
        strength: 50 + Math.random() * 40
      },
      {
        name: 'SMA 20',
        value: 1.0856 + (Math.random() - 0.5) * 0.01,
        signal: Math.random() > 0.5 ? 'buy' : 'sell',
        strength: 70 + Math.random() * 25
      },
      {
        name: 'EMA 12',
        value: 1.0856 + (Math.random() - 0.5) * 0.008,
        signal: Math.random() > 0.4 ? 'buy' : 'sell',
        strength: 65 + Math.random() * 30
      },
      {
        name: 'Bollinger Bands',
        value: 0.8,
        signal: Math.random() > 0.7 ? 'buy' : Math.random() > 0.4 ? 'neutral' : 'sell',
        strength: 55 + Math.random() * 35
      },
      {
        name: 'Stochastic',
        value: 20 + Math.random() * 60,
        signal: 'neutral',
        strength: 60 + Math.random() * 25
      },
      {
        name: 'Williams %R',
        value: -20 - Math.random() * 60,
        signal: Math.random() > 0.6 ? 'buy' : 'neutral',
        strength: 50 + Math.random() * 40
      },
      {
        name: 'CCI (20)',
        value: (Math.random() - 0.5) * 200,
        signal: Math.random() > 0.5 ? 'sell' : 'neutral',
        strength: 45 + Math.random() * 35
      }
    ];

    // Determine signal based on value for some indicators
    indicators.forEach(indicator => {
      switch (indicator.name) {
        case 'RSI (14)':
          if (indicator.value > 70) indicator.signal = 'sell';
          else if (indicator.value < 30) indicator.signal = 'buy';
          else indicator.signal = 'neutral';
          break;
        
        case 'Stochastic':
          if (indicator.value > 80) indicator.signal = 'sell';
          else if (indicator.value < 20) indicator.signal = 'buy';
          else indicator.signal = 'neutral';
          break;
        
        case 'Williams %R':
          if (indicator.value > -20) indicator.signal = 'sell';
          else if (indicator.value < -80) indicator.signal = 'buy';
          else indicator.signal = 'neutral';
          break;
        
        case 'CCI (20)':
          if (indicator.value > 100) indicator.signal = 'sell';
          else if (indicator.value < -100) indicator.signal = 'buy';
          else indicator.signal = 'neutral';
          break;
      }
    });

    const summary = {
      buy: indicators.filter(i => i.signal === 'buy').length,
      sell: indicators.filter(i => i.signal === 'sell').length,
      neutral: indicators.filter(i => i.signal === 'neutral').length
    };

    let overall: 'buy' | 'sell' | 'neutral' = 'neutral';
    let strength = 50;

    if (summary.buy > summary.sell) {
      overall = 'buy';
      strength = 50 + (summary.buy / indicators.length) * 50;
    } else if (summary.sell > summary.buy) {
      overall = 'sell';
      strength = 50 + (summary.sell / indicators.length) * 50;
    }

    return {
      overall,
      strength: Math.round(strength),
      indicators,
      summary
    };
  };

  useEffect(() => {
    const updateAnalysis = () => {
      setAnalysis(generateAnalysis());
    };

    updateAnalysis();
    const interval = setInterval(updateAnalysis, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'buy':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'sell':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy':
        return 'text-green-600';
      case 'sell':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const getOverallBadgeVariant = (signal: string) => {
    switch (signal) {
      case 'buy':
        return 'default';
      case 'sell':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Technical Analysis
          </CardTitle>
          
          <Badge variant={getOverallBadgeVariant(analysis.overall)} className="capitalize">
            {analysis.overall} {analysis.strength}%
          </Badge>
        </div>
        
        {/* Overall strength meter */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Signal Strength</span>
            <span>{analysis.strength}%</span>
          </div>
          <Progress value={analysis.strength} className="h-2" />
        </div>
        
        {/* Summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <div className="text-lg font-bold text-green-600">{analysis.summary.buy}</div>
            <div className="text-xs text-green-600">BUY</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-gray-500">{analysis.summary.neutral}</div>
            <div className="text-xs text-gray-500">NEUTRAL</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-red-600">{analysis.summary.sell}</div>
            <div className="text-xs text-red-600">SELL</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {analysis.indicators.map((indicator, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg border">
              <div className="flex items-center space-x-3">
                {getSignalIcon(indicator.signal)}
                <div>
                  <div className="font-medium text-sm">{indicator.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {typeof indicator.value === 'number' ? indicator.value.toFixed(4) : indicator.value}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={cn("text-sm font-semibold capitalize", getSignalColor(indicator.signal))}>
                  {indicator.signal}
                </div>
                <div className="text-xs text-muted-foreground">
                  {indicator.strength.toFixed(0)}%
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="text-xs text-muted-foreground text-center">
            Analysis based on multiple technical indicators. Not financial advice.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
