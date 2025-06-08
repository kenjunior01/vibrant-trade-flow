
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, ChartCandlestick, Activity } from 'lucide-react';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  icon: React.ReactNode;
  color: string;
  speed: number;
}

export function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  const icons = [
    { icon: <TrendingUp className="w-6 h-6" />, color: 'text-green-400' },
    { icon: <TrendingDown className="w-6 h-6" />, color: 'text-red-400' },
    { icon: <DollarSign className="w-6 h-6" />, color: 'text-yellow-400' },
    { icon: <BarChart3 className="w-6 h-6" />, color: 'text-blue-400' },
    { icon: <ChartCandlestick className="w-6 h-6" />, color: 'text-purple-400' },
    { icon: <Activity className="w-6 h-6" />, color: 'text-cyan-400' },
  ];

  useEffect(() => {
    const generateElements = () => {
      const newElements: FloatingElement[] = [];
      for (let i = 0; i < 15; i++) {
        const iconData = icons[Math.floor(Math.random() * icons.length)];
        newElements.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
          opacity: 0.1 + Math.random() * 0.3,
          icon: iconData.icon,
          color: iconData.color,
          speed: 0.5 + Math.random() * 1,
        });
      }
      setElements(newElements);
    };

    generateElements();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElements(prev => prev.map(element => ({
        ...element,
        rotation: element.rotation + element.speed,
        y: element.y + element.speed * 0.1 > 100 ? -10 : element.y + element.speed * 0.1,
      })));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map(element => (
        <div
          key={element.id}
          className={`absolute transition-all duration-1000 ${element.color}`}
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
            opacity: element.opacity,
          }}
        >
          {element.icon}
        </div>
      ))}
    </div>
  );
}
