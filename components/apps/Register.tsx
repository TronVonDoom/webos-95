import React from 'react';
import { RetroButton } from '../ui/RetroButton';

export const Register: React.FC = () => {
  const handleDonate = () => {
    window.open('https://ko-fi.com', '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] p-4 items-center text-center justify-between">
      <div className="flex flex-col items-center gap-4">
        <img 
          src="https://win98icons.alexmeub.com/icons/png/key_win-0.png" 
          alt="Register" 
          className="w-16 h-16 pixelated" 
        />
        
        <div className="border-2 border-l-white border-t-white border-r-[#808080] border-b-[#808080] p-4 w-full bg-white">
          <h2 className="text-xl font-bold text-[#000080] mb-2 font-serif italic">Unregistered Copy</h2>
          <p className="mb-4 text-sm text-black">
            You are using an unregistered version of WebOS 95. 
            This free version allows access to core desktop utilities.
          </p>
          <p className="text-sm text-black">
            To stop this notification and support the developer's server costs, 
            please purchase a registration key.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full mt-4">
        <RetroButton onClick={handleDonate} className="font-bold py-2">
          Register Now ($5.00)
        </RetroButton>
        <p className="text-xs text-gray-600">
          Secure payment via Ko-Fi / Stripe
        </p>
      </div>
    </div>
  );
};