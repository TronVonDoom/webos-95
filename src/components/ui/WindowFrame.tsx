// ============================================================================
// Window Frame Component
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Position } from '../../types';
import { RetroButton } from './RetroButton';

interface WindowFrameProps {
  title: string;
  icon: string;
  defaultPosition?: Position;
  defaultSize?: { width: number; height: number };
  resizable?: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  title,
  icon,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 700, height: 500 },
  resizable = true,
  onClose,
  onMinimize,
  onFocus,
  children
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    onFocus();
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!resizable) return;
    e.stopPropagation();
    onFocus();
    setIsResizing(true);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y
        });
      } else if (isResizing && resizable) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        
        setSize({
          width: Math.max(250, resizeStart.current.width + deltaX),
          height: Math.max(200, resizeStart.current.height + deltaY)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, resizable]);

  return (
    <div
      className="absolute bg-[#c0c0c0] p-1 bevel-out flex flex-col shadow-xl"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        maxWidth: '100vw',
        maxHeight: '100vh',
      }}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div 
        className="bg-[#000080] px-2 py-1 flex justify-between items-center cursor-move select-none mb-1"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide pointer-events-none">
          <img src={icon} alt="" className="w-4 h-4 pixelated" />
          <span className="truncate max-w-[80%]">{title}</span>
        </div>
        <div className="flex gap-1">
          <RetroButton 
            onClick={(e) => { e.stopPropagation(); onMinimize(); }} 
            className="h-5 w-5 !p-0 font-bold text-xs"
          >
            _
          </RetroButton>
          <RetroButton 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="h-5 w-5 !p-0 font-bold text-xs ml-1"
          >
            X
          </RetroButton>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-[#c0c0c0] h-full relative p-1">
        {children}
      </div>

      {/* Resize Handle */}
      {resizable && (
        <div 
          className="absolute bottom-1 right-1 w-4 h-4 cursor-se-resize z-50 flex items-end justify-end p-[2px]"
          onMouseDown={handleResizeMouseDown}
        >
          <div className="border-r-2 border-b-2 border-[#808080] w-full h-full">
            <div className="absolute bottom-[2px] right-[2px] w-[2px] h-[2px] bg-[#808080]" />
            <div className="absolute bottom-[5px] right-[5px] w-[2px] h-[2px] bg-[#808080]" />
            <div className="absolute bottom-[8px] right-[8px] w-[2px] h-[2px] bg-[#808080]" />
          </div>
        </div>
      )}
    </div>
  );
};
