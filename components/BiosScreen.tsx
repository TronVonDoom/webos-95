import React, { useState, useEffect } from 'react';

interface BiosScreenProps {
  onBiosComplete: () => void;
  onSkipToDesktop?: () => void;
}

export const BiosScreen: React.FC<BiosScreenProps> = ({ onBiosComplete, onSkipToDesktop }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const biosLines = [
    'RetroWave BIOS v4.51PG, An Energy Star Ally',
    'Copyright (C) 1984-1995, RetroWave Corp.',
    '',
    '00065536 OK',
    '',
    'Detecting Primary Master    ... PCemHD-1024',
    'Detecting Primary Slave     ... None',
    'Detecting Secondary Master  ... ATAPI CD-ROM',
    'Detecting Secondary Slave   ... None',
    '',
    'Press DEL to run SETUP',
    '',
    'Initializing Plug and Play Cards...',
    '',
    'Floppy Disk(s)  : 1.44MB 3.5 in.',
    '',
    '',
    'Starting RetroWave OS 95....',
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      console.log('Key pressed:', e.key); // Debug log
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        console.log('ESC pressed - skipping to desktop'); // Debug log
        if (onSkipToDesktop) {
          onSkipToDesktop();
        } else {
          onBiosComplete();
        }
      }
    };

    // Use capture phase to catch the event earlier
    document.addEventListener('keydown', handleKeyPress, true);

    return () => {
      document.removeEventListener('keydown', handleKeyPress, true);
    };
  }, [onBiosComplete, onSkipToDesktop]);

  useEffect(() => {
    if (currentLineIndex < biosLines.length) {
      // Vary the timing to emulate real BIOS
      let delay = 120; // default delay
      
      // Specific timing for authentic feel
      if (currentLineIndex === 0) delay = 200; // First line
      if (currentLineIndex === 1) delay = 150; // Copyright
      if (currentLineIndex === 3) delay = 1200; // Memory test - longer pause
      if (currentLineIndex === 5) delay = 600; // Detecting primary master
      if (currentLineIndex === 6) delay = 400; // Primary slave
      if (currentLineIndex === 7) delay = 600; // Secondary master (CD-ROM)
      if (currentLineIndex === 8) delay = 400; // Secondary slave
      if (currentLineIndex === 10) delay = 150; // Press DEL
      if (currentLineIndex === 12) delay = 800; // Initializing PnP
      if (currentLineIndex === 14) delay = 500; // Floppy detection
      if (currentLineIndex === 17) delay = 2000; // Starting OS - longer pause
      
      const timer = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
      }, delay);

      return () => {
        clearTimeout(timer);
      };
    } else {
      // All lines shown, wait then boot
      const timer = setTimeout(() => {
        onBiosComplete();
      }, 3000);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [currentLineIndex, onBiosComplete]);

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
      
      {/* Static F1 message at bottom */}
      <div className="absolute bottom-4 right-4 text-gray-300 text-sm font-bold">
        Press ESC to skip boot sequence
      </div>
    </div>
  );
};
