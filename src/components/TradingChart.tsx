import { useEffect, useRef } from 'react';

interface TradingChartProps {
  symbol: string;
}

export function TradingChart({ symbol }: TradingChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // TradingView widget
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol === 'BTCUSD' ? 'BINANCE:BTCUSDT' : symbol === 'ETHUSD' ? 'BINANCE:ETHUSDT' : 'FX:' + symbol,
      interval: '1',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      allow_symbol_change: true,
      container_id: 'tradingview_chart'
    });

    // Clear previous chart
    chartRef.current.innerHTML = '';
    const container = document.createElement('div');
    container.id = 'tradingview_chart';
    container.style.height = '100%';
    container.style.width = '100%';
    chartRef.current.appendChild(container);
    chartRef.current.appendChild(script);

    return () => {
      if (chartRef.current) {
        chartRef.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div 
      ref={chartRef}
      className="w-full h-full min-h-[500px] bg-background rounded-lg"
      style={{ height: '100%' }}
    />
  );
}
