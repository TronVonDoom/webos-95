// ============================================================================
// Screensaver Component
// ============================================================================

import React, { useEffect, useState } from 'react';

interface ScreensaverProps {
  onExit: () => void;
}

export const Screensaver: React.FC<ScreensaverProps> = ({ onExit }) => {
  useEffect(() => {
    const handleActivity = () => onExit();

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
      <Starfield />
    </div>
  );
};

// Starfield Screensaver
const Starfield: React.FC = () => {
  const [stars, setStars] = useState<Array<{ x: number; y: number; z: number }>>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setDimensions({ width, height });

    const centerX = width / 2;
    const centerY = height / 2;
    const numStars = 200;
    
    const initialStars = Array.from({ length: numStars }, () => ({
      x: Math.random() * width - centerX,
      y: Math.random() * height - centerY,
      z: Math.random() * width,
    }));
    
    setStars(initialStars);

    const interval = setInterval(() => {
      setStars(prevStars => 
        prevStars.map(star => {
          const newZ = star.z - 10;
          if (newZ <= 0) {
            return {
              x: Math.random() * width - centerX,
              y: Math.random() * height - centerY,
              z: width,
            };
          }
          return { ...star, z: newZ };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  return (
    <svg className="w-full h-full">
      {stars.map((star, i) => {
        const k = 128 / star.z;
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;
        const size = (1 - star.z / dimensions.width) * 3;
        const opacity = 1 - star.z / dimensions.width;

        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={Math.max(0.5, size)}
            fill="white"
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
};
