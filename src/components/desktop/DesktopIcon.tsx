// ============================================================================
// Desktop Icon Component - Handles both app icons and file icons
// ============================================================================

import React, { useState, useRef } from 'react';
import { AppId, Position } from '../../types';
import { APP_ICONS } from '../../config';
import { useFileSystem } from '../../contexts';

// Drag data type constants
const DRAG_TYPE_FILE = 'application/x-webos-file';
const DRAG_TYPE_ICON = 'application/x-webos-icon';
const DRAG_TYPE_PROTECTED = 'application/x-webos-protected';
const DRAG_TYPE_SYSTEM32 = 'application/x-webos-system32';

interface DesktopIconProps {
  // For app icons
  appId?: AppId;
  // For file icons
  fileId?: string;
  // Common props
  label: string;
  icon?: string;
  position?: Position;
  isSelected?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
  onDoubleClick?: () => void;
  onFileDrop?: (fileId: string) => void;
  onProtectedDrop?: (name: string, isDrive: boolean) => void;
  onSystem32Drop?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  appId,
  fileId,
  label,
  icon,
  position,
  isSelected = false,
  onSelect,
  onDoubleClick,
  onFileDrop,
  onProtectedDrop,
  onSystem32Drop,
  onContextMenu: onContextMenuProp,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);
  const dragStartPos = useRef<Position | null>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  
  const { getFile } = useFileSystem();
  
  // Determine icon URL
  const file = fileId ? getFile(fileId) : null;
  const iconUrl = icon || (appId ? APP_ICONS[appId] : file?.icon) || '';
  
  // All icons are draggable on desktop
  const isFile = !!fileId;
  const isDraggable = true; // Allow dragging all icons
  const iconId = fileId || appId || '';

  const handleDragStart = (e: React.DragEvent) => {
    console.log(`[DesktopIcon] Drag start: ${iconId}`);
    
    // Set drag data - use file type for files, icon type for apps
    e.dataTransfer.effectAllowed = 'move';
    if (isFile) {
      e.dataTransfer.setData(DRAG_TYPE_FILE, fileId!);
    } else {
      e.dataTransfer.setData(DRAG_TYPE_ICON, appId!);
    }
    e.dataTransfer.setData('text/plain', iconId); // Fallback
    
    // Store initial position for potential revert
    if (position) {
      dragStartPos.current = { ...position };
    }
    
    setIsDragging(true);
    
    // Create drag image
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      e.dataTransfer.setDragImage(iconRef.current, rect.width / 2, rect.height / 2);
    }
  };

  const handleDragEnd = () => {
    console.log(`[DesktopIcon] Drag end: ${fileId}`);
    setIsDragging(false);
    dragStartPos.current = null;
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick?.();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(e);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (onContextMenuProp) {
      e.preventDefault();
      e.stopPropagation();
      onContextMenuProp(e);
    }
    // If no handler, let it bubble to the desktop
  };

  // Handle drag over for drop targets (like Recycle Bin)
  const handleDragOver = (e: React.DragEvent) => {
    if (onFileDrop || onProtectedDrop || onSystem32Drop) {
      e.preventDefault();
      e.stopPropagation();
      setIsDropTarget(true);
    }
  };

  const handleDragLeave = () => {
    setIsDropTarget(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropTarget(false);
    
    // Check for System32 easter egg first
    const system32Data = e.dataTransfer.getData(DRAG_TYPE_SYSTEM32);
    if (system32Data && onSystem32Drop) {
      onSystem32Drop();
      return;
    }
    
    // Check for protected items
    const protectedData = e.dataTransfer.getData(DRAG_TYPE_PROTECTED);
    if (protectedData && onProtectedDrop) {
      try {
        const { name, isDrive } = JSON.parse(protectedData);
        onProtectedDrop(name, isDrive);
        return;
      } catch (err) {
        console.error('Error parsing protected data:', err);
      }
    }
    
    if (onFileDrop) {
      const droppedFileId = e.dataTransfer.getData(DRAG_TYPE_FILE);
      if (droppedFileId) {
        onFileDrop(droppedFileId);
      }
    }
  };

  // Build class names - icon container sized to fit grid (75px)
  const containerClasses = [
    'flex flex-col items-center justify-start gap-1 cursor-pointer p-1 select-none',
    'hover:bg-[#000080]/30 hover:border hover:border-dotted hover:border-white',
    'absolute', // Always use absolute positioning for grid alignment
    isDragging ? 'opacity-50' : '',
    isSelected ? 'bg-[#000080]/30 border border-dotted border-white' : '',
    isDropTarget ? 'bg-[#000080]/50 border-2 border-solid border-white' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={iconRef}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={containerClasses}
      style={{ 
        left: position ? `${position.x}px` : 0, 
        top: position ? `${position.y}px` : 0,
        width: '80px',  // Slightly smaller than grid to have spacing
        height: '80px',
      }}
    >
      <img 
        src={iconUrl} 
        alt={label} 
        className="w-10 h-10 pixelated pointer-events-none" 
        draggable={false}
      />
      <span 
        className="text-white text-xs text-center drop-shadow-md font-sans leading-tight w-full px-1"
        style={{ 
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          wordBreak: 'break-word'
        }}
        title={label}
      >
        {label}
      </span>
    </div>
  );
};

// Export drag type constants for use in drop handlers
export { DRAG_TYPE_FILE, DRAG_TYPE_ICON };
