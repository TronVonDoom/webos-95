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

    // Progress bar animation - 10 seconds total
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onBootComplete, 500);
          return 100;
        }
        return p + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onBootComplete]);

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Cloud background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
      
      {/* Windows 95 Logo */}
      {showLogo && (
        <div className="relative z-10 flex flex-col items-center gap-8 animate-fadeIn">
          {/* Windows Logo - cleaner, more official looking */}
          <div className="flex gap-2 mb-4">
            <div className="w-24 h-24 bg-red-600 shadow-2xl" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
            <div className="w-24 h-24 bg-green-600 shadow-2xl" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
            <div className="w-24 h-24 bg-blue-600 shadow-2xl" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
            <div className="w-24 h-24 bg-yellow-500 shadow-2xl" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
          </div>

          {/* RetroWave OS 95 Text - more professional */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="flex items-baseline gap-3">
              <h1 className="text-white text-5xl font-bold tracking-wide" style={{ fontFamily: 'Arial, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                RetroWave
              </h1>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-gray-300 text-3xl font-light tracking-widest" style={{ fontFamily: 'Arial, sans-serif', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                operating system
              </h2>
            </div>
          </div>

          {/* Boot Message */}
          <div className="text-gray-400 text-base mb-6 h-6 tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>
            {bootText}
          </div>

          {/* Progress Bar - more Windows 95 authentic */}
          <div className="w-80 bg-gray-800 p-1 shadow-inner">
            <div className="w-full h-6 bg-[#000080] relative overflow-hidden">
              <div 
                className="h-full bg-[#0000FF] transition-all duration-100"
                style={{ width: `${progress}%` }}
              ></div>
              {/* Animated stripes effect */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
                }}
              ></div>
            </div>
          </div>

          {/* Copyright notice */}
          <div className="text-gray-500 text-xs mt-8" style={{ fontFamily: 'Arial, sans-serif' }}>
            Copyright © 1995-2026 RetroWave Corporation
          </div>
        </div>
      )}
    </div>
  );
};
