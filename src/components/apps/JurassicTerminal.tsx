// ============================================================================
// Jurassic Park Security Terminal Easter Egg
// A fun recreation of the famous movie scene
// ============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface JurassicTerminalProps {
  onComplete?: () => void;
}

interface TerminalLine {
  text: string;
  isTyping?: boolean;
  isCommand?: boolean;
  isError?: boolean;
  isFlood?: boolean;
}

export const JurassicTerminal: React.FC<JurassicTerminalProps> = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [showVideo, setShowVideo] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const floodIntervalRef = useRef<number | null>(null);
  const hasStarted = useRef(false); // Prevent StrictMode double-run

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (floodIntervalRef.current) {
        clearInterval(floodIntervalRef.current);
      }
    };
  }, []);

  // Type out text character by character
  const typeText = useCallback((text: string, isCommand: boolean = false): Promise<void> => {
    return new Promise((resolve) => {
      let currentText = '';
      let index = 0;
      
      const typeInterval = setInterval(() => {
        if (index < text.length) {
          currentText += text[index];
          setLines(prev => {
            const newLines = [...prev];
            if (newLines.length > 0 && newLines[newLines.length - 1].isTyping) {
              newLines[newLines.length - 1] = { 
                text: isCommand ? `> ${currentText}` : currentText, 
                isTyping: true,
                isCommand 
              };
            }
            return newLines;
          });
          index++;
        } else {
          clearInterval(typeInterval);
          setLines(prev => {
            const newLines = [...prev];
            if (newLines.length > 0) {
              newLines[newLines.length - 1] = { 
                ...newLines[newLines.length - 1], 
                isTyping: false 
              };
            }
            return newLines;
          });
          resolve();
        }
      }, 50);
    });
  }, []);

  // Add a new line
  const addLine = useCallback((text: string, options: Partial<TerminalLine> = {}) => {
    setLines(prev => [...prev, { text, ...options }]);
  }, []);

  // Start the sequence
  useEffect(() => {
    // Prevent double-run from React StrictMode
    if (hasStarted.current) return;
    hasStarted.current = true;

    const runSequence = async () => {
      // Phase 0: Initial header
      await new Promise(r => setTimeout(r, 500));
      addLine('Jurassic Park, System Security Interface');
      await new Promise(r => setTimeout(r, 300));
      addLine('Version 4.0.5, Alpha E');
      await new Promise(r => setTimeout(r, 300));
      addLine('Ready...');
      await new Promise(r => setTimeout(r, 1500));
      
      // Phase 1: First command
      addLine('', { isTyping: true, isCommand: true });
      await typeText('access security', true);
      await new Promise(r => setTimeout(r, 500));
      addLine('access: PERMISSION DENIED', { isError: true });
      await new Promise(r => setTimeout(r, 1000));
      
      // Phase 2: Second command
      addLine('', { isTyping: true, isCommand: true });
      await typeText('access security grid', true);
      await new Promise(r => setTimeout(r, 500));
      addLine('access: PERMISSION DENIED', { isError: true });
      await new Promise(r => setTimeout(r, 1000));
      
      // Phase 3: Third command
      addLine('', { isTyping: true, isCommand: true });
      await typeText('access main security grid', true);
      await new Promise(r => setTimeout(r, 500));
      
      // Add PERMISSION DENIED, then append "....and...."
      const deniedIndex = lines.length;
      addLine('access: PERMISSION DENIED', { isError: true });
      await new Promise(r => setTimeout(r, 2000));
      
      setLines(prev => {
        const newLines = [...prev];
        const lastErrorIndex = newLines.findIndex((l, i) => i >= deniedIndex - 5 && l.isError);
        if (lastErrorIndex !== -1) {
          newLines[newLines.length - 1] = { 
            text: 'access: PERMISSION DENIED....and....', 
            isError: true 
          };
        }
        return newLines;
      });
      
      await new Promise(r => setTimeout(r, 1000));
      
      // Phase 4: Flood with magic word messages
      let floodCount = 0;
      floodIntervalRef.current = window.setInterval(() => {
        if (floodCount < 50) {
          setLines(prev => [...prev, { text: "YOU DIDN'T SAY THE MAGIC WORD!", isFlood: true }]);
          floodCount++;
        } else {
          if (floodIntervalRef.current) {
            clearInterval(floodIntervalRef.current);
          }
        }
      }, 100);
      
      // Show video after a moment of flooding
      await new Promise(r => setTimeout(r, 2000));
      setShowVideo(true);
    };

    runSequence();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="h-full w-full flex flex-col bg-[#012] font-mono text-sm relative overflow-hidden">
      {/* Terminal output */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-auto p-4 text-white"
        style={{ fontFamily: 'Consolas, Monaco, monospace' }}
      >
        {lines.map((line, i) => (
          <div 
            key={i} 
            className={`
              ${line.isCommand ? 'text-cyan-300' : ''}
              ${line.isError ? 'text-red-400 font-bold' : ''}
              ${line.isFlood ? 'text-red-500 font-bold animate-pulse' : ''}
              ${!line.isCommand && !line.isError && !line.isFlood ? 'text-green-400' : ''}
            `}
          >
            {line.text}
            {line.isTyping && <span className="animate-pulse">▌</span>}
          </div>
        ))}
      </div>
      
      {/* Video overlay - cannot be closed, must close the window */}
      {showVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10 p-8">
          <video
            src="/assets/magic_word.mp4"
            autoPlay
            loop
            className="max-w-full max-h-full object-contain rounded shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
