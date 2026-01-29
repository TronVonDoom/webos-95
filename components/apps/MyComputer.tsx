import React, { useState } from 'react';
import { RetroButton } from '../ui/RetroButton';

interface FileSystemItem {
  name: string;
  type: 'folder' | 'file' | 'drive';
  icon: string;
  size?: string;
  modified?: string;
  items?: FileSystemItem[];
}

interface MyComputerProps {
  onOpenFloppyDrive: () => void;
}

const FILE_SYSTEM: FileSystemItem[] = [
  {
    name: 'My Computer',
    type: 'folder',
    icon: 'https://win98icons.alexmeub.com/icons/png/computer-1.png',
    items: [
      {
        name: '3½ Floppy (A:)',
        type: 'drive',
        icon: 'https://win98icons.alexmeub.com/icons/png/floppy_drive_3_5_cool-0.png',
        items: []
      },
      {
        name: 'C (C:)',
        type: 'drive',
        icon: 'https://win98icons.alexmeub.com/icons/png/hard_disk_drive-0.png',
        items: [
          {
            name: 'Program Files',
            type: 'folder',
            icon: 'https://win98icons.alexmeub.com/icons/png/directory_closed-2.png',
            items: [
              { name: 'Internet Explorer', type: 'folder', icon: 'https://win98icons.alexmeub.com/icons/png/directory_closed-2.png' },
              { name: 'Windows Media Player', type: 'folder', icon: 'https://win98icons.alexmeub.com/icons/png/directory_closed-2.png' },
              { name: 'Microsoft Office', type: 'folder', icon: 'https://win98icons.alexmeub.com/icons/png/directory_closed-2.png' },
            ]
          },
          {
            name: 'Windows',
            type: 'folder',
            icon: 'https://win98icons.alexmeub.com/icons/png/directory_windows-2.png',
            items: [
              { name: 'System32', type: 'folder', icon: 'https://win98icons.alexmeub.com/icons/png/directory_closed-2.png' },
              { name: 'Fonts', type: 'folder', icon: 'https://win98icons.alexmeub.com/icons/png/directory_fonts_2-1.png' },
            ]
          },
          {
            name: 'My Documents',
            type: 'folder',
            icon: 'https://win98icons.alexmeub.com/icons/png/directory_closed_cool-4.png',
            items: [
              { name: 'vacation.bmp', type: 'file', icon: 'https://win98icons.alexmeub.com/icons/png/paint_file-0.png', size: '2.4 MB', modified: '12/25/1999' },
              { name: 'resume.doc', type: 'file', icon: 'https://win98icons.alexmeub.com/icons/png/write_wordpad-2.png', size: '45 KB', modified: '03/15/1999' },
            ]
          },
        ]
      },
      {
        name: 'CD-ROM (D:)',
        type: 'drive',
        icon: 'https://win98icons.alexmeub.com/icons/png/cd_drive-0.png',
        items: []
      }
    ]
  }
];

export const MyComputer: React.FC<MyComputerProps> = ({ onOpenFloppyDrive }) => {
  const [currentPath, setCurrentPath] = useState<FileSystemItem[]>([FILE_SYSTEM[0]]);
  const [view, setView] = useState<'icons' | 'list'>('icons');

  const getCurrentItems = () => {
    const current = currentPath[currentPath.length - 1];
    return current.items || [];
  };

  const navigateTo = (item: FileSystemItem) => {
    if (item.type === 'file') {
      alert(`Opening ${item.name}...`);
      return;
    }
    // Check if it's the Floppy Drive - if so, open the floppy window instead of navigating
    if (item.name === '3½ Floppy (A:)') {
      onOpenFloppyDrive();
      return;
    }
    setCurrentPath([...currentPath, item]);
  };

  const navigateBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const navigateUp = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const getAddressBar = () => {
    return currentPath.map(p => p.name).join('\\');
  };

  const currentItems = getCurrentItems();

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans">
      {/* Menu Bar */}
      <div className="flex gap-4 text-sm border-b border-[#808080] pb-1 px-1">
        <span className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">File</span>
        <span className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">Edit</span>
        <span className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">View</span>
        <span className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">Go</span>
        <span className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">Favorites</span>
        <span className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">Help</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1 border-b border-[#808080]">
        <RetroButton 
          onClick={navigateBack} 
          disabled={currentPath.length <= 1}
          className="text-xs px-2"
        >
          ← Back
        </RetroButton>
        <RetroButton 
          onClick={navigateUp}
          disabled={currentPath.length <= 1}
          className="text-xs px-2"
        >
          ↑ Up
        </RetroButton>
        <div className="w-[2px] h-6 bg-[#808080]" />
        <RetroButton 
          onClick={() => setView('icons')}
          active={view === 'icons'}
          className="text-xs px-2"
        >
          Icons
        </RetroButton>
        <RetroButton 
          onClick={() => setView('list')}
          active={view === 'list'}
          className="text-xs px-2"
        >
          List
        </RetroButton>
      </div>

      {/* Address Bar */}
      <div className="flex items-center gap-2 px-2 py-1 border-b border-[#808080]">
        <span className="text-xs font-bold">Address:</span>
        <div className="flex-1 bg-white border-2 border-b-white border-r-white border-t-[#808080] border-l-[#808080] px-2 py-0.5 text-sm">
          {getAddressBar()}
        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 bg-white overflow-auto p-2">
        {view === 'icons' ? (
          <div className="grid grid-cols-4 gap-4 auto-rows-min">
            {currentItems.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1 cursor-pointer p-2 hover:bg-[#000080]/20 hover:border hover:border-dotted hover:border-[#000080]"
                onDoubleClick={() => navigateTo(item)}
              >
                <img src={item.icon} alt={item.name} className="w-12 h-12 pixelated" />
                <span className="text-xs text-center break-words max-w-full">{item.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#c0c0c0] border-b border-[#808080]">
                <th className="text-left p-1 font-normal">Name</th>
                <th className="text-left p-1 font-normal">Size</th>
                <th className="text-left p-1 font-normal">Type</th>
                <th className="text-left p-1 font-normal">Modified</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, i) => (
                <tr
                  key={i}
                  className="hover:bg-[#000080] hover:text-white cursor-pointer"
                  onDoubleClick={() => navigateTo(item)}
                >
                  <td className="p-1 flex items-center gap-2">
                    <img src={item.icon} alt="" className="w-4 h-4 pixelated" />
                    {item.name}
                  </td>
                  <td className="p-1">{item.size || ''}</td>
                  <td className="p-1">{item.type === 'folder' ? 'File Folder' : item.type === 'drive' ? 'Drive' : 'File'}</td>
                  <td className="p-1">{item.modified || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {currentItems.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            This folder is empty.
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#c0c0c0] border-t-2 border-white flex items-center px-2 text-xs gap-4">
        <span className="bevel-in px-2 py-0.5 bg-[#c0c0c0]">
          {currentItems.length} object(s)
        </span>
        <span className="flex-1"></span>
        <span className="bevel-in px-2 py-0.5 bg-[#c0c0c0]">
          My Computer
        </span>
      </div>
    </div>
  );
};
