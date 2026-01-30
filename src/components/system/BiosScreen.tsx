// ============================================================================
// BIOS Screen Component - Simulates POST/BIOS startup
// ============================================================================

import React, { useState, useEffect } from 'react';

interface BiosScreenProps {
  onBiosComplete: () => void;
  onSkipToDesktop?: () => void;
  soundEnabled?: boolean;
}

export const BiosScreen: React.FC<BiosScreenProps> = ({ 
  onBiosComplete, 
  onSkipToDesktop, 
  soundEnabled = false 
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  // Play BIOS startup sound if enabled
  useEffect(() => {
    if (!soundEnabled) return;
    
    const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_131ec7cab2.mp3');
    audio.volume = 0.3;
    audio.play().catch(err => console.log('Audio playback failed:', err));

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [soundEnabled]);

  const biosLines = [
    'RetroWave BIOS v4.51PG, An Energy Star Ally',
    'Copyright (C) 1984-1995, RetroWave Corp.',
    '',
    '00065536 KB',
    '',
    'Detecting Primary Channel Primary   ... PCemHD-1024',
    'Detecting Primary Channel Secondary ... None',
    'Detecting Secondary Channel Primary ... ATAPI CD-ROM',
    'Detecting Secondary Channel Secondary ... None',
    '',
    'Initializing Plug and Play Cards...',
    '',
    'Floppy Disk(s)  : 1.44MB 3.5 in.',
    '',
    '',
    'Starting RetroWave OS 95....',
  ];

  // ESC key handler to skip
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (onSkipToDesktop) {
          onSkipToDesktop();
        } else {
          onBiosComplete();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress, true);
    return () => document.removeEventListener('keydown', handleKeyPress, true);
  }, [onBiosComplete, onSkipToDesktop]);

  // BIOS text animation
  useEffect(() => {
    if (currentLineIndex < biosLines.length) {
      // Vary the timing to emulate real BIOS
      let delay = 120; // default delay
      
      // Specific timing for authentic feel
      if (currentLineIndex === 0) delay = 200; // First line
      if (currentLineIndex === 1) delay = 150; // Copyright
      if (currentLineIndex === 3) delay = 1200; // Memory test - longer pause
      if (currentLineIndex === 5) delay = 600; // Detecting primary channel primary
      if (currentLineIndex === 6) delay = 2000; // Pause before primary channel secondary
      if (currentLineIndex === 7) delay = 600; // Detecting secondary channel primary
      if (currentLineIndex === 8) delay = 2000; // Pause before secondary channel secondary
      if (currentLineIndex === 10) delay = 800; // Initializing PnP
      if (currentLineIndex === 12) delay = 500; // Floppy detection
      if (currentLineIndex === 15) delay = 3500; // Starting OS - longer pause before boot
      
      const timer = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      // All lines shown, wait then boot
      const timer = setTimeout(() => {
        onBiosComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, onBiosComplete, biosLines.length]);

  return (
    <div className="w-screen h-screen bg-black flex flex-col p-4 font-mono text-gray-300 text-sm leading-relaxed overflow-hidden relative">
      {biosLines.slice(0, currentLineIndex).map((line, index) => (
        <div key={index} className="whitespace-pre">
          {line || '\u00A0'}
        </div>
      ))}
      {currentLineIndex < biosLines.length && (
        <div className="inline-block w-2 h-4 bg-gray-300 animate-pulse"></div>
      )}
      
      {/* Static ESC message at bottom */}
      <div className="absolute bottom-4 left-4 text-gray-300 text-sm font-mono">
        Press ESC to skip boot sequence
      </div>
    </div>
  );
};
