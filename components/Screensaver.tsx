import React, { useEffect, useState } from 'react';

type ScreensaverType = 'pipes' | 'starfield' | 'matrix' | null;

interface ScreensaverProps {
  onExit: () => void;
}

export const Screensaver: React.FC<ScreensaverProps> = ({ onExit }) => {
  const [type] = useState<ScreensaverType>('starfield'); // Can be randomized

  useEffect(() => {
    const handleActivity = () => {
      onExit();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [onExit]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      {type === 'starfield' && <Starfield />}
      {type === 'matrix' && <Matrix />}
      {type === 'pipes' && <Pipes />}
    </div>
  );
};

// Starfield Screensaver
const Starfield: React.FC = () => {
  const [stars, setStars] = useState<Array<{ x: number; y: number; z: number; px: number; py: number }>>([]);

  useEffect(() => {
    const numStars = 200;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const initialStars = Array.from({ length: numStars }, () => ({
      x: Math.random() * window.innerWidth - centerX,
      y: Math.random() * window.innerHeight - centerY,
      z: Math.random() * window.innerWidth,
      px: 0,
      py: 0
    }));
    
    setStars(initialStars);

    const interval = setInterval(() => {
      setStars(prevStars => 
        prevStars.map(star => {
          const newZ = star.z - 10;
          if (newZ <= 0) {
            return {
              x: Math.random() * window.innerWidth - centerX,
              y: Math.random() * window.innerHeight - centerY,
              z: window.innerWidth,
              px: star.px,
              py: star.py
            };
          }
          return { ...star, z: newZ };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  return (
    <svg className="w-full h-full">
      {stars.map((star, i) => {
        const k = 128 / star.z;
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;
        const size = (1 - star.z / window.innerWidth) * 3;
        const opacity = 1 - star.z / window.innerWidth;

        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={size}
            fill="white"
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
};

// Matrix-style falling code
const Matrix: React.FC = () => {
  const [drops, setDrops] = useState<number[]>([]);
  const columns = Math.floor(window.innerWidth / 20);

  useEffect(() => {
    setDrops(Array.from({ length: columns }, () => Math.random() * -100));

    const interval = setInterval(() => {
      setDrops(prevDrops =>
        prevDrops.map((drop, i) => {
          if (drop * 20 > window.innerHeight && Math.random() > 0.95) {
            return 0;
          }
          return drop + 1;
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const chars = '01アイウエオカキクケコサシスセソタチツテト';

  return (
    <div className="w-full h-full relative overflow-hidden font-mono text-green-500">
      {drops.map((drop, i) => (
        <div
          key={i}
          className="absolute text-xl font-bold"
          style={{
            left: `${i * 20}px`,
            top: `${drop * 20}px`,
            textShadow: '0 0 8px #0f0'
          }}
        >
          {chars[Math.floor(Math.random() * chars.length)]}
        </div>
      ))}
    </div>
  );
};

// Pipes screensaver (simplified)
const Pipes: React.FC = () => {
  const [pipes, setPipes] = useState<Array<{ x: number; y: number; direction: number; color: string; path: string }>>([]);

  useEffect(() => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const initialPipes = Array.from({ length: 5 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      direction: Math.floor(Math.random() * 4), // 0: right, 1: down, 2: left, 3: up
      color: colors[Math.floor(Math.random() * colors.length)],
      path: ''
    }));
    
    setPipes(initialPipes);

    const interval = setInterval(() => {
      setPipes(prevPipes =>
        prevPipes.map(pipe => {
          let { x, y, direction, color, path } = pipe;
          const step = 20;
          
          // Move in current direction
          if (direction === 0) x += step;
          else if (direction === 1) y += step;
          else if (direction === 2) x -= step;
          else if (direction === 3) y -= step;

          // Randomly change direction
          if (Math.random() > 0.9) {
            direction = Math.floor(Math.random() * 4);
          }

          // Wrap around screen
          if (x < 0) x = window.innerWidth;
          if (x > window.innerWidth) x = 0;
          if (y < 0) y = window.innerHeight;
          if (y > window.innerHeight) y = 0;

          path += ` L${x} ${y}`;
          if (path.length > 1000) path = `M${x} ${y}`;

          return { x, y, direction, color, path: path || `M${x} ${y}` };
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <svg className="w-full h-full">
      {pipes.map((pipe, i) => (
        <path
          key={i}
          d={pipe.path}
          stroke={pipe.color}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
};
