// ============================================================================
// Retro Button Component
// ============================================================================

import React from 'react';
import { soundSystem } from '../../services/sounds';

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  startMenu?: boolean;
}

export const RetroButton: React.FC<RetroButtonProps> = ({ 
  children, 
  className = '', 
  active = false, 
  startMenu = false,
  onClick,
  ...props 
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundSystem.click();
    onClick?.(e);
  };

  const baseStyle = "px-3 py-1 text-black font-sans text-sm outline-none active:bevel-in transition-none select-none flex items-center justify-center";
  const standardStyle = "bg-[#c0c0c0] bevel-out";
  const activeStyle = "bg-[#e0e0e0] bevel-in font-bold bg-[url('https://www.transparenttextures.com/patterns/checkerboard-cross.png')]";
  const startMenuStyle = "font-bold text-base px-2 py-1 gap-2";

  const computedClass = `
    ${baseStyle} 
    ${active ? activeStyle : standardStyle} 
    ${startMenu ? startMenuStyle : ''} 
    ${className}
  `;

  return (
    <button className={computedClass} onClick={handleClick} {...props}>
      {children}
    </button>
  );
};
