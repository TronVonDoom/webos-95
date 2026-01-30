// ============================================================================
// Context Menu Component
// ============================================================================

import React, { useEffect, useRef } from 'react';
import { ContextMenuItem } from '../../types';

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const cleanupRef = useRef<(() => void) | null>(null);
  
  useEffect(() => {
    // Delay adding listeners to avoid catching the same event that opened the menu
    const timeoutId = setTimeout(() => {
      const handleClick = () => onClose();
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        onClose();
      };
      
      window.addEventListener('click', handleClick);
      window.addEventListener('contextmenu', handleContextMenu);
      
      cleanupRef.current = () => {
        window.removeEventListener('click', handleClick);
        window.removeEventListener('contextmenu', handleContextMenu);
      };
    }, 10);
    
    return () => {
      clearTimeout(timeoutId);
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [onClose]);

  return (
    <div
      className="fixed bg-[#c0c0c0] bevel-out p-0.5 min-w-[180px] z-[9999] shadow-xl font-sans"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item, i) => 
        item.separator ? (
          <div key={i} className="border-t border-[#808080] border-b border-white my-1" />
        ) : (
          <button
            key={i}
            onClick={() => {
              if (!item.disabled && item.onClick) {
                item.onClick();
                onClose();
              }
            }}
            disabled={item.disabled}
            className={`
              w-full text-left px-6 py-1 text-sm flex items-center gap-2 relative
              ${item.disabled 
                ? 'text-[#808080] cursor-not-allowed' 
                : 'hover:bg-[#000080] hover:text-white cursor-pointer'
              }
            `}
          >
            {item.icon && (
              <img 
                src={item.icon} 
                alt="" 
                className="w-4 h-4 absolute left-1 pixelated"
              />
            )}
            {item.label}
          </button>
        )
      )}
    </div>
  );
};
