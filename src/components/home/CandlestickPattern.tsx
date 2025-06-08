
import { useEffect, useState } from 'react';

interface Candle {
  id: number;
  x: number;
  y: number;
  height: number;
  isGreen: boolean;
  opacity: number;
}

export function CandlestickPattern() {
  const [candles, setCandles] = useState<Candle[]>([]);

  useEffect(() => {
    const generateCandles = () => {
      const newCandles: Candle[] = [];
      for (let i = 0; i < 20; i++) {
        newCandles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          height: 20 + Math.random() * 40,
          isGreen: Math.random() > 0.5,
          opacity: 0.05 + Math.random() * 0.15,
        });
      }
      setCandles(newCandles);
    };

    generateCandles();

    const interval = setInterval(() => {
      setCandles(prev => prev.map(candle => ({
        ...candle,
        height: 20 + Math.random() * 40,
        isGreen: Math.random() > 0.5,
        y: candle.y + 0.5 > 100 ? -5 : candle.y + 0.5,
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {candles.map(candle => (
        <div
          key={candle.id}
          className="absolute transition-all duration-1000"
          style={{
            left: `${candle.x}%`,
            top: `${candle.y}%`,
            opacity: candle.opacity,
          }}
        >
          {/* Candlestick body */}
          <div
            className={`w-3 rounded-sm ${
              candle.isGreen ? 'bg-green-400' : 'bg-red-400'
            }`}
            style={{ height: `${candle.height}px` }}
          />
          {/* Candlestick wick top */}
          <div
            className={`w-0.5 mx-auto ${
              candle.isGreen ? 'bg-green-400' : 'bg-red-400'
            }`}
            style={{ height: `${candle.height * 0.3}px`, marginTop: `-${candle.height * 0.3}px` }}
          />
          {/* Candlestick wick bottom */}
          <div
            className={`w-0.5 mx-auto ${
              candle.isGreen ? 'bg-green-400' : 'bg-red-400'
            }`}
            style={{ height: `${candle.height * 0.3}px` }}
          />
        </div>
      ))}
    </div>
  );
}
