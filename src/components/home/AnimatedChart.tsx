
import { useEffect, useState } from 'react';

interface ChartLine {
  points: { x: number; y: number }[];
  color: string;
  opacity: number;
}

export function AnimatedChart() {
  const [lines, setLines] = useState<ChartLine[]>([]);

  useEffect(() => {
    const generateLines = () => {
      const colors = ['stroke-green-400', 'stroke-red-400', 'stroke-blue-400', 'stroke-yellow-400'];
      const newLines: ChartLine[] = [];

      for (let i = 0; i < 4; i++) {
        const points: { x: number; y: number }[] = [];
        let currentY = 50 + Math.random() * 20;

        for (let x = 0; x <= 100; x += 10) {
          currentY += (Math.random() - 0.5) * 10;
          currentY = Math.max(10, Math.min(90, currentY));
          points.push({ x, y: currentY });
        }

        newLines.push({
          points,
          color: colors[i],
          opacity: 0.1 + Math.random() * 0.2,
        });
      }

      setLines(newLines);
    };

    generateLines();

    const interval = setInterval(generateLines, 5000);
    return () => clearInterval(interval);
  }, []);

  const createPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <svg className="w-full h-full">
        {lines.map((line, index) => (
          <path
            key={index}
            d={createPath(line.points)}
            fill="none"
            className={`${line.color} transition-all duration-2000`}
            strokeWidth="2"
            style={{ opacity: line.opacity }}
          />
        ))}
      </svg>
    </div>
  );
}
