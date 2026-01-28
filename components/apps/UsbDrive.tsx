import React from 'react';
import { FileItem } from '../../types';

interface UsbDriveProps {
  files: FileItem[];
  onFileDrop: (fileId: string) => void;
}

export const UsbDrive: React.FC<UsbDriveProps> = ({ files, onFileDrop }) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
    console.log('Drag over USB drive');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    console.log('Drag leave USB drive');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const fileId = e.dataTransfer.getData('text/plain');
    console.log('Dropped file ID:', fileId);
    if (fileId) {
      onFileDrop(fileId);
    }
  };

  return (
    <div 
      className={`h-full w-full bevel-in p-2 overflow-y-auto ${isDragOver ? 'bg-blue-200' : 'bg-white'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {files.map(file => (
          <div key={file.id} className="flex flex-col items-center gap-1 p-2 hover:bg-[#000080] hover:text-white group cursor-default">
            <img src={file.icon} className="w-8 h-8 pixelated" />
            <span className="text-[10px] text-center break-all text-black group-hover:text-white leading-tight">
              {file.name}
            </span>
          </div>
        ))}
        {files.length === 0 && (
          <div className="col-span-full text-center text-gray-400 text-xs mt-10 italic">
            Drive is empty. Drag files here to copy.
          </div>
        )}
      </div>
    </div>
  );
};