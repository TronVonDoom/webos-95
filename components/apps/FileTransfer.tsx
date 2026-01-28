import React, { useState, useEffect } from 'react';
import { RetroButton } from '../ui/RetroButton';

interface FileTransferProps {
  fileName: string;
  onCancel: () => void;
  onFinish?: () => void;
}

export const FileTransfer: React.FC<FileTransferProps> = ({ fileName, onCancel }) => {
  const [progress, setProgress] = useState(0.49);
  const [seconds, setSeconds] = useState(1257);
  const [speed, setSpeed] = useState(4.61);
  const [mbCopied, setMbCopied] = useState(8.89);
  const totalMb = 180;
  const [timeRemainingText, setTimeRemainingText] = useState("39 years");

  useEffect(() => {
    const timer = setInterval(() => {
      // The joke: time remaining increases randomly
      setSeconds(prev => {
        const chance = Math.random();
        if (chance > 0.95) return prev + 3600 * 24 * 365; // Jump a year
        if (chance > 0.9) return prev + 3600 * 24 * 30; // Jump a month
        if (chance > 0.8) return prev + 3600 * 24; // Jump a day
        return prev + Math.floor(Math.random() * 300);
      });
      
      // Speed fluctuates wildly
      setSpeed(s => {
        const delta = (Math.random() - 0.5) * 2;
        return Math.max(0.01, Math.min(10.5, s + delta));
      });

      // Progress barely moves
      setProgress(p => Math.min(99.9, p + (Math.random() * 0.01)));
      
      // MB copied increases very slowly
      setMbCopied(mb => Math.min(totalMb - 0.1, mb + (Math.random() * 0.05)));
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (seconds < 60) {
      setTimeRemainingText(`${seconds} sec`);
    } else if (seconds < 3600) {
      setTimeRemainingText(`${Math.floor(seconds / 60)} min`);
    } else if (seconds < 86400) {
      setTimeRemainingText(`${Math.floor(seconds / 3600)} hours`);
    } else if (seconds < 31536000) {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      setTimeRemainingText(`${days} days ${hours} hours`);
    } else {
      const years = Math.floor(seconds / 31536000);
      const days = Math.floor((seconds % 31536000) / 86400);
      setTimeRemainingText(`${years} years, ${days} days`);
    }
  }, [seconds]);

  return (
    <div className="flex flex-col bg-[#c0c0c0] text-black font-sans relative">
      {/* Content Area */}
      <div className="p-4 flex flex-col gap-3">
        {/* Icons and animation */}
        <div className="flex items-center justify-center gap-6">
          <img 
            src="https://win98icons.alexmeub.com/icons/png/hard_disk_drive-0.png" 
            alt="source" 
            className="w-10 h-10 pixelated"
          />
          <div className="text-3xl animate-pulse">→</div>
          <img 
            src="https://win98icons.alexmeub.com/icons/png/directory_closed_cool-4.png" 
            alt="destination" 
            className="w-10 h-10 pixelated"
          />
        </div>

        {/* Status text */}
        <div className="text-xs">
          <span>Transferring: {fileName} from Desktop</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-5 bg-white bevel-in">
          <div 
            className="h-full transition-all duration-1000"
            style={{ 
              width: `${progress}%`,
              background: 'repeating-linear-gradient(90deg, #000080 0px, #000080 8px, #0000a0 8px, #0000a0 16px)'
            }}
          ></div>
        </div>

        {/* Transfer details */}
        <div className="text-xs space-y-1">
          <div className="grid grid-cols-[110px_1fr] gap-2">
            <span>Estimated time left:</span>
            <span className="font-bold">{timeRemainingText} ({mbCopied.toFixed(2)} MB of {totalMb} MB copied)</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-2">
            <span>Transfer to:</span>
            <span>F:\Magical Nedrysaurus.gif</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-2">
            <span>Transfer rate:</span>
            <span>{speed.toFixed(2)} KB/Sec</span>
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2 mt-1">
          <input type="checkbox" className="w-3 h-3" />
          <span className="text-xs">Close this dialog box when download completes</span>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="p-3 flex justify-end gap-3">
        <RetroButton className="px-6 py-1 opacity-50 cursor-not-allowed" disabled>Open</RetroButton>
        <RetroButton onClick={onCancel} className="px-6 py-1">Cancel</RetroButton>
      </div>
    </div>
  );
};