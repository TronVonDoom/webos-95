import React from 'react';

interface SoundPromptProps {
  onContinue: (enableSound: boolean) => void;
}

export const SoundPrompt: React.FC<SoundPromptProps> = ({ onContinue }) => {
  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center p-8 relative">
      {/* ESC message */}
      <div className="absolute bottom-4 left-4 text-gray-300 text-sm" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
        Press ESC to skip boot sequence
      </div>
      
      {/* BIOS-style dialog box */}
      <div className="bg-[#0000AA] border-2 border-[#5555FF] shadow-2xl" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
        {/* Title bar */}
        <div className="bg-[#5555FF] border-b-2 border-[#0000AA] px-4 py-1 text-center">
          <span className="text-white font-bold text-sm" style={{ fontFamily: '"Courier New", Courier, monospace' }}>Allow Sound?</span>
        </div>

        {/* Content */}
        <div className="px-8 py-4 flex flex-col gap-4">
          <p className="text-white text-center text-sm" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
            Enable sound for authentic experience?
          </p>
          
          {/* Buttons */}
          <div className="flex gap-8 justify-center items-center pt-2">
            <button
              onClick={() => onContinue(true)}
              className="px-6 py-1 bg-[#0000AA] text-yellow-300 font-bold text-sm border-2 border-white hover:bg-[#0000CC] focus:outline-none focus:ring-2 focus:ring-yellow-300"
              style={{ fontFamily: '"Courier New", Courier, monospace' }}
            >
              Yes
            </button>
            <button
              onClick={() => onContinue(false)}
              className="px-6 py-1 bg-[#0000AA] text-white font-bold text-sm border-2 border-white hover:bg-[#0000CC] focus:outline-none focus:ring-2 focus:ring-white"
              style={{ fontFamily: '"Courier New", Courier, monospace' }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
