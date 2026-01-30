// ============================================================================
// Boot Screen Component
// ============================================================================

import React, { useState, useEffect } from 'react';

interface BootScreenProps {
  onBootComplete: () => void;
  onSkipToDesktop?: () => void;
  soundEnabled?: boolean;
}

export const BootScreen: React.FC<BootScreenProps> = ({ 
  onBootComplete, 
  onSkipToDesktop
}) => {
  const [progress, setProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [bootText, setBootText] = useState('Starting RetroWave OS 95...');

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onSkipToDesktop?.() || onBootComplete();
      }
    };

    document.addEventListener('keydown', handleKeyPress, true);
    return () => document.removeEventListener('keydown', handleKeyPress, true);
  }, [onBootComplete, onSkipToDesktop]);

  useEffect(() => {
    setTimeout(() => setShowLogo(true), 500);

    const messages = [
      { time: 1000, text: 'Loading system files...' },
      { time: 2000, text: 'Initializing devices...' },
      { time: 3000, text: 'Loading user profile...' },
      { time: 4000, text: 'Starting networking...' },
      { time: 4500, text: 'Welcome to RetroWave OS 95' }
    ];

    messages.forEach(({ time, text }) => {
      setTimeout(() => setBootText(text), time);
    });

    let isPaused = false;
    let pauseTimer: ReturnType<typeof setTimeout> | null = null;
    
    const interval = setInterval(() => {
      if (!isPaused) {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            if (pauseTimer) clearTimeout(pauseTimer);
            setTimeout(onBootComplete, 500);
            return 100;
          }
          
          if ((p >= 15 && p < 16) || (p >= 45 && p < 46) || (p >= 75 && p < 76)) {
            isPaused = true;
            pauseTimer = setTimeout(() => { isPaused = false; }, 1500);
          }
          
          return p + 0.5;
        });
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (pauseTimer) clearTimeout(pauseTimer);
    };
  }, [onBootComplete]);

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      
      {showLogo && (
        <div className="relative z-10 flex flex-col items-center gap-8 animate-fadeIn">
          {/* Windows Logo */}
          <div className="flex gap-2 mb-4">
            {['red', 'green', 'blue', 'yellow'].map((color, i) => (
              <div 
                key={color}
                className={`w-24 h-24 bg-${color}-${color === 'yellow' ? '500' : '600'} shadow-2xl animate-pulse`}
                style={{ animationDuration: '2s', animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 mb-8">
            <h1 className="text-white text-5xl font-bold tracking-wide font-mono">
              RetroWave
            </h1>
            <h2 className="text-gray-300 text-3xl font-light tracking-widest font-mono">
              operating system
            </h2>
          </div>

          <div className="text-gray-400 text-base mb-6 h-6 tracking-wide font-mono">
            {bootText}
          </div>

          {/* Progress Bar */}
          <div className="w-80 bg-gray-800 p-1 shadow-inner">
            <div className="w-full h-6 bg-[#000080] relative overflow-hidden">
              <div 
                className="h-full bg-[#0000FF] transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
                }}
              />
            </div>
          </div>

          <div className="text-gray-500 text-xs mt-8 font-mono">
            Copyright © 1995-2026 RetroWave Corporation
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 text-gray-300 text-sm z-20 font-mono">
        Press ESC to skip boot sequence
      </div>
    </div>
  );
};
