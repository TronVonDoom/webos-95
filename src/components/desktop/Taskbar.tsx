// ============================================================================
// Taskbar Component
// ============================================================================

import React from 'react';
import { WindowState } from '../../types';
import { SYSTEM_ICONS } from '../../config';
import { useSystem, useWindowManager } from '../../contexts';
import { RetroButton } from '../ui/RetroButton';
import { soundSystem } from '../../services/sounds';

interface TaskbarProps {
  startMenuOpen: boolean;
  onToggleStartMenu: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ startMenuOpen, onToggleStartMenu }) => {
  const { currentTime, soundEnabled, toggleSound } = useSystem();
  const { windows, topZIndex, focusWindow, minimizeWindow } = useWindowManager();

  const openWindows = Object.values(windows).filter((w: WindowState) => w.isOpen);

  const handleToggleStartMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!startMenuOpen) soundSystem.menuOpen();
    onToggleStartMenu();
  };

  const handleTaskbarItemClick = (win: WindowState) => {
    if (win.isMinimized) {
      focusWindow(win.id);
    } else {
      minimizeWindow(win.id);
    }
  };

  return (
    <div className="h-10 bg-[#c0c0c0] border-t-2 border-white flex items-center p-1 gap-1 z-50">
      {/* Start Button */}
      <RetroButton
        startMenu
        active={startMenuOpen}
        onClick={handleToggleStartMenu}
        className="flex items-center"
      >
        <img src={SYSTEM_ICONS.START} className="w-5 h-5 mr-1" alt="Start" />
        Start
      </RetroButton>

      {/* Divider */}
      <div className="w-[2px] h-full border-l border-[#808080] border-r border-white mx-1" />

      {/* Taskbar Items */}
      <div className="flex-1 flex gap-1 overflow-x-auto">
        {openWindows.map((win: WindowState) => (
          <RetroButton
            key={win.id}
            active={!win.isMinimized && win.zIndex === topZIndex}
            onClick={() => handleTaskbarItemClick(win)}
            className="w-40 justify-start truncate shrink-0"
          >
            <img src={win.icon} className="w-4 h-4 mr-2 pixelated" alt="" />
            {win.title}
          </RetroButton>
        ))}
      </div>

      {/* System Tray */}
      <div className="bevel-in px-2 py-1 bg-[#c0c0c0] flex items-center gap-2 text-xs font-sans whitespace-nowrap">
        <img
          src={soundEnabled ? SYSTEM_ICONS.SOUND_ON : SYSTEM_ICONS.SOUND_OFF}
          className="w-4 h-4 cursor-pointer"
          onClick={toggleSound}
          title={soundEnabled ? 'Sound On - Click to Mute' : 'Sound Off - Click to Unmute'}
          alt="Sound"
        />
        <span>{currentTime}</span>
      </div>
    </div>
  );
};
