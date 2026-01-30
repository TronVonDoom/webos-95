// ============================================================================
// Matrix Crash Screen - Easter egg when deleting System32
// ============================================================================

import React, { useEffect, useState, useRef, useCallback } from 'react';

interface MatrixCrashProps {
  onComplete?: () => void;
}

// Matrix characters (mix of katakana-like and code symbols)
const MATRIX_CHARS = 'ァアィイゥウェエォオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@%&*';

interface Drop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  length: number;
}

export const MatrixCrash: React.FC<MatrixCrashProps> = ({ onComplete: _onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fadeOpacity, setFadeOpacity] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [pressedF, setPressedF] = useState(false);
  const dropsRef = useRef<Drop[]>([]);
  const animationRef = useRef<number>();

  const getRandomChar = () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];

  const initDrops = useCallback((width: number, height: number) => {
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: Drop[] = [];
    
    for (let i = 0; i < columns; i++) {
      drops.push({
        x: i * fontSize,
        y: Math.random() * -height, // Start above screen
        speed: 2 + Math.random() * 8,
        chars: Array.from({ length: 20 + Math.floor(Math.random() * 15) }, getRandomChar),
        length: 15 + Math.floor(Math.random() * 15),
      });
    }
    
    dropsRef.current = drops;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDrops(canvas.width, canvas.height);
    };
    
    resize();
    window.addEventListener('resize', resize);

    // Start fade to black
    setTimeout(() => {
      setFadeOpacity(1);
    }, 100);

    const fontSize = 14;

    // Animation loop
    const animate = () => {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      dropsRef.current.forEach((drop, index) => {
        // Update characters occasionally for glitch effect
        if (Math.random() > 0.95) {
          const charIndex = Math.floor(Math.random() * drop.chars.length);
          drop.chars[charIndex] = getRandomChar();
        }

        // Draw the column of characters
        drop.chars.forEach((char, i) => {
          const y = drop.y + i * fontSize;
          if (y > 0 && y < canvas.height) {
            // Gradient from white (head) to green (tail)
            if (i === 0) {
              ctx.fillStyle = '#FFFFFF';
            } else if (i < 3) {
              ctx.fillStyle = '#88FF88';
            } else {
              const brightness = Math.max(0.2, 1 - (i / drop.chars.length));
              ctx.fillStyle = `rgba(0, ${Math.floor(180 * brightness + 75)}, 0, ${brightness})`;
            }
            ctx.fillText(char, drop.x, y);
          }
        });

        // Move drop down
        drop.y += drop.speed;

        // Reset when off screen
        if (drop.y > canvas.height + drop.chars.length * fontSize) {
          dropsRef.current[index] = {
            x: drop.x,
            y: -drop.chars.length * fontSize,
            speed: 2 + Math.random() * 8,
            chars: Array.from({ length: 15 + Math.floor(Math.random() * 15) }, getRandomChar),
            length: drop.length,
          };
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation after brief pause
    setTimeout(() => {
      animate();
    }, 500);

    // Show final message after a delay
    const messageTimer = setTimeout(() => {
      setShowFinalMessage(true);
    }, 5000);

    // Listen for F key press
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        setPressedF(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(messageTimer);
    };
  }, [initDrops]);

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${fadeOpacity})`,
        transition: 'background-color 2s ease-in',
      }}
    >
      {/* Matrix rain canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{
          opacity: fadeOpacity,
          transition: 'opacity 2s ease-in',
        }}
      />

      {/* Final message overlay */}
      {showFinalMessage && (
        <div 
          className="relative z-10 p-6 max-w-5xl w-full"
          style={{
            animation: 'fadeInMessage 2s ease-in forwards',
          }}
        >
          {/* Header */}
          <div className="text-center mb-4">
            <div className="text-green-400 font-mono text-2xl mb-2 glitch-text">
              FATAL EXCEPTION: 0x5953543332
            </div>
            <div className="text-red-500 font-mono text-xl mb-1 animate-pulse">
              ⚠️ SYSTEM32 HAS BEEN DELETED ⚠️
            </div>
            <div className="text-green-300 font-mono text-base">
              Windows is unable to continue. <span className="text-green-500 italic">"Have you tried turning it off and on again?"</span>
            </div>
          </div>
          
          {/* Two column layout */}
          <div className="flex gap-4 mb-4">
            {/* Left column - Crash dump */}
            <div className="flex-1 text-green-200 font-mono text-xs text-left bg-black/30 p-3 rounded border border-green-800">
              <div className="text-green-400 mb-1 font-bold">--- CRASH DUMP ---</div>
              <div>• ERROR: kernel32.dll not found (it was in System32, genius)</div>
              <div>• ERROR: user32.dll is on vacation</div>
              <div>• ERROR: shell32.dll has left the building</div>
              <div>• WARNING: Computer is now a very expensive paperweight</div>
              <div>• INFO: Your warranty has been voided... retroactively</div>
              <div>• DEBUG: ID-10-T error detected between keyboard and chair</div>
              <div>• CRITICAL: The files are IN the computer! ...were in the computer</div>
            </div>
            
            {/* Right column - Status & Fun facts */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="text-green-300 font-mono text-xs space-y-0.5">
                <div>📧 An error report will NOT be sent to Microsoft.</div>
                <div>📞 Tech support has been notified and is laughing at you.</div>
                <div>🔥 Your IT department will hear about this on Monday.</div>
                <div>☎️ For emergencies, call: 0118 999 881 999 119 725... 3</div>
              </div>
              
              <div className="text-yellow-400 font-mono text-xs p-2 border border-yellow-600 bg-yellow-900/20 rounded">
                <span className="font-bold">💡 DID YOU KNOW?</span> System32 contained over 3,000 essential files. You deleted ALL of them!
              </div>
              
              <div className="text-green-200 font-mono text-xs space-y-0.5">
                <div>✓ The operation completed successfully... sort of.</div>
                <div>✓ This was entirely your fault. We warned you. Multiple times.</div>
                <div>✓ "I'm a computer expert!" - You, apparently, 30 seconds ago</div>
                <div>✓ At least you'll have a great story for Reddit</div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center">
            <div className="text-gray-500 font-mono text-xs mb-3 italic">
              "A person who never made a mistake never tried anything new." - Albert Einstein (who never deleted System32)
            </div>
            
            <button
              onClick={handleRestart}
              className="px-6 py-2 bg-green-900/50 border border-green-500 text-green-300 font-mono 
                       hover:bg-green-800/50 hover:border-green-400 transition-colors cursor-pointer"
            >
              [ Restart Computer ]
            </button>
            
            <div className="text-yellow-400 font-mono text-sm mt-3 animate-pulse">
              Press F to pay respects to your system files
            </div>
            
            {pressedF && (
              <div className="text-red-400 font-mono text-sm mt-2 animate-bounce">
                😤 Really?! You just deleted System32 and NOW you're paying respects?!<br/>
                A little late for that, don't you think?!
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInMessage {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .glitch-text {
          text-shadow: 
            2px 0 #ff0000,
            -2px 0 #00ff00;
          animation: glitch 0.3s infinite;
        }
        
        @keyframes glitch {
          0%, 100% { text-shadow: 2px 0 #ff0000, -2px 0 #00ff00; }
          25% { text-shadow: -2px 0 #ff0000, 2px 0 #00ff00; }
          50% { text-shadow: 2px 2px #ff0000, -2px -2px #00ff00; }
          75% { text-shadow: -2px -2px #ff0000, 2px 2px #00ff00; }
        }
      `}</style>
    </div>
  );
};
