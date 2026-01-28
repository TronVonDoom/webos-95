import React, { useState, useEffect } from 'react';
import { soundSystem } from '../services/sounds';

interface BootScreenProps {
  onBootComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [bootText, setBootText] = useState('Starting RetroWave OS 95...');

  useEffect(() => {
    // Play startup sound
    setTimeout(() => {
      soundSystem.startup();
    }, 1000);

    // Show logo after brief delay
    setTimeout(() => setShowLogo(true), 500);

    // Boot sequence messages
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

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onBootComplete, 500);
          return 100;
        }
        return p + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onBootComplete]);

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center">
      {/* Windows 95 Logo */}
      {showLogo && (
        <div className="flex flex-col items-center gap-8 animate-fadeIn">
          {/* Windows Logo Placeholder - using retro colors */}
          <div className="flex gap-1">
            <div className="w-20 h-20 bg-red-600 animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="w-20 h-20 bg-green-600 animate-pulse" style={{ animationDelay: '100ms' }}></div>
            <div className="w-20 h-20 bg-blue-600 animate-pulse" style={{ animationDelay: '200ms' }}></div>
            <div className="w-20 h-20 bg-yellow-500 animate-pulse" style={{ animationDelay: '300ms' }}></div>
          </div>

          {/* WebOS 95 Text */}
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-white text-4xl font-bold tracking-wider" style={{ fontFamily: 'Arial, sans-serif' }}>
              RetroWave
            </h1>
            <h2 className="text-white text-5xl font-bold tracking-wider" style={{ fontFamily: 'Arial, sans-serif' }}>
              OS <span className="text-blue-400">95</span>
            </h2>
          </div>

          {/* Boot Message */}
          <div className="text-white text-sm mt-8 font-mono h-6">
            {bootText}
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-4 bg-[#808080] border-2 border-[#000] mt-4">
            <div 
              className="h-full bg-[#000080] transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* BIOS-style text at top */}
      <div className="absolute top-4 left-4 text-gray-400 text-xs font-mono">
        <div>WebOS BIOS v2.5</div>
        <div>Copyright (C) 1995-2026 Nostalgia Corp.</div>
        <div className="mt-2">Press DEL to enter SETUP</div>
      </div>
    </div>
  );
};
