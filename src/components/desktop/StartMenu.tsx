// ============================================================================
// Start Menu Component
// ============================================================================

import React from 'react';
import { AppId } from '../../types';
import { APP_ICONS, SYSTEM_ICONS } from '../../config';
import { useWindowManager } from '../../contexts';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose }) => {
  const { openWindow } = useWindowManager();

  if (!isOpen) return null;

  const handleOpenApp = (id: AppId) => {
    openWindow(id);
    onClose();
  };

  return (
    <div
      className="fixed bottom-[40px] left-0 bg-[#c0c0c0] bevel-out flex w-64 z-50 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Sidebar Banner */}
      <div className="bg-gradient-to-b from-[#000080] to-[#1084d0] text-white font-bold px-1 py-4 flex items-end w-7 relative">
        <div
          className="absolute bottom-2 left-1 text-lg whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          <span className="tracking-wide">RetroWave</span>
          <span className="text-base font-normal"> 95</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 flex flex-col p-1">
        {/* Programs Submenu */}
        <div className="relative group">
          <div className="flex items-center justify-between px-8 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer text-sm">
            <div className="flex items-center gap-3">
              <img src={SYSTEM_ICONS.FOLDER_PROGRAMS} className="w-5 h-5" alt="" />
              <span>Programs</span>
            </div>
            <span className="text-xs">▶</span>
          </div>
          {/* Submenu */}
          <div className="hidden group-hover:block absolute left-full top-0 ml-0.5 bg-[#c0c0c0] bevel-out p-1 min-w-[180px] shadow-xl">
            <MenuItem icon={APP_ICONS[AppId.PIXEL_ART]} label="Pixel Studio" onClick={() => handleOpenApp(AppId.PIXEL_ART)} />
            <MenuItem icon={APP_ICONS[AppId.MINESWEEPER]} label="Minesweeper" onClick={() => handleOpenApp(AppId.MINESWEEPER)} />
            <MenuItem icon={APP_ICONS[AppId.TRIVIA]} label="Nostalgia Trivia" onClick={() => handleOpenApp(AppId.TRIVIA)} />
            <MenuItem icon={APP_ICONS[AppId.MEDIA_PLAYER]} label="Media Player" onClick={() => handleOpenApp(AppId.MEDIA_PLAYER)} />
            <div className="border-t border-[#808080] border-b border-white my-1" />
            <MenuItem icon={APP_ICONS[AppId.WEB_BROWSER]} label="NetWorld Navigator" onClick={() => handleOpenApp(AppId.WEB_BROWSER)} />
          </div>
        </div>

        {/* Accessories Submenu */}
        <div className="relative group">
          <div className="flex items-center justify-between px-8 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer text-sm">
            <div className="flex items-center gap-3">
              <img src={SYSTEM_ICONS.FOLDER} className="w-5 h-5" alt="" />
              <span>Accessories</span>
            </div>
            <span className="text-xs">▶</span>
          </div>
          <div className="hidden group-hover:block absolute left-full top-0 ml-0.5 bg-[#c0c0c0] bevel-out p-1 min-w-[160px] shadow-xl">
            <MenuItem icon={APP_ICONS[AppId.TEXTCRAFT]} label="TextCraft" onClick={() => handleOpenApp(AppId.TEXTCRAFT)} />
          </div>
        </div>

        <div className="border-t border-[#808080] border-b border-white my-1" />

        <MenuItem icon={APP_ICONS[AppId.MY_COMPUTER]} label="My Computer" onClick={() => handleOpenApp(AppId.MY_COMPUTER)} />

        <div className="border-t border-[#808080] border-b border-white my-1" />

        <MenuItem icon={SYSTEM_ICONS.SEARCH} label="Find" onClick={() => alert('Find: Files or Folders...')} />
        <MenuItem icon={SYSTEM_ICONS.HELP} label="Help" onClick={() => alert('Help coming soon!')} />
        <MenuItem icon={APP_ICONS[AppId.REGISTER]} label="Register" onClick={() => handleOpenApp(AppId.REGISTER)} />

        <div className="border-t border-[#808080] border-b border-white my-1" />

        <MenuItem icon={SYSTEM_ICONS.SHUTDOWN} label="Shut Down..." onClick={() => alert('Shutting down... Just kidding! 😄')} />
      </div>
    </div>
  );
};

// Helper component for menu items
const MenuItem: React.FC<{ icon: string; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-8 py-1.5 hover:bg-[#000080] hover:text-white text-sm flex items-center gap-3 relative"
  >
    <img src={icon} className="w-4 h-4 absolute left-2" alt="" />
    {label}
  </button>
);
