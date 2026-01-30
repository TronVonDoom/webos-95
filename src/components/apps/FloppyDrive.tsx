// ============================================================================
// Floppy Drive (A:) Component - File explorer for floppy disk
// ============================================================================

import React, { useState, useCallback } from 'react';
import { useFileSystem } from '../../contexts';
import { DRAG_TYPE_FILE } from '../desktop/DesktopIcon';

export const FloppyDrive: React.FC = () => {
  const { floppyFiles, moveFile } = useFileSystem();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const fileId = e.dataTransfer.getData(DRAG_TYPE_FILE) || e.dataTransfer.getData('text/plain');
    console.log('[FloppyDrive] Drop received, fileId:', fileId);
    
    if (fileId) {
      moveFile(fileId, 'floppy');
    }
  }, [moveFile]);

  const handleFileDragStart = useCallback((e: React.DragEvent, fileId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData(DRAG_TYPE_FILE, fileId);
    e.dataTransfer.setData('text/plain', fileId);
    console.log('[FloppyDrive] Dragging file:', fileId);
  }, []);

  return (
    <div 
      className={`h-full w-full bevel-in p-2 overflow-y-auto transition-colors ${
        isDragOver ? 'bg-blue-200' : 'bg-white'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {floppyFiles.map(file => (
          <div 
            key={file.id}
            draggable
            onDragStart={(e) => handleFileDragStart(e, file.id)}
            className="flex flex-col items-center gap-1 p-2 hover:bg-[#000080] hover:text-white group cursor-move"
          >
            <img 
              src={file.icon} 
              className="w-8 h-8 pixelated pointer-events-none" 
              alt={file.name}
              draggable={false}
            />
            <span className="text-[10px] text-center break-all text-black group-hover:text-white leading-tight">
              {file.name}
            </span>
          </div>
        ))}
        
        {floppyFiles.length === 0 && (
          <div className="col-span-full text-center text-gray-400 text-xs mt-10 italic">
            Drive is empty. Drag files here to copy.
          </div>
        )}
      </div>
    </div>
  );
};
