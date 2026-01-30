// ============================================================================
// Window Manager Context - Manages all window states
// ============================================================================

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { AppId, WindowState, Position } from '../types';
import { INITIAL_WINDOWS } from '../config';
import { soundSystem } from '../services/sounds';

interface WindowManagerContextType {
  windows: Record<AppId, WindowState>;
  topZIndex: number;
  
  // Window operations
  openWindow: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  updateWindowTitle: (id: AppId, title: string) => void;
  updateWindowPosition: (id: AppId, position: Position) => void;
  
  // Getters
  getOpenWindows: () => WindowState[];
  isWindowOpen: (id: AppId) => boolean;
  isWindowFocused: (id: AppId) => boolean;
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

export const WindowManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<Record<AppId, WindowState>>(INITIAL_WINDOWS);
  const [topZIndex, setTopZIndex] = useState(100);

  const openWindow = useCallback((id: AppId) => {
    console.log(`[WindowManager] Opening window: ${id}`);
    soundSystem.pop();
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: true,
        isMinimized: false,
        zIndex: topZIndex + 1,
      },
    }));
    setTopZIndex(z => z + 1);
  }, [topZIndex]);

  const closeWindow = useCallback((id: AppId) => {
    console.log(`[WindowManager] Closing window: ${id}`);
    soundSystem.close();
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false },
    }));
  }, []);

  const minimizeWindow = useCallback((id: AppId) => {
    console.log(`[WindowManager] Minimizing window: ${id}`);
    soundSystem.minimize();
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
  }, []);

  const focusWindow = useCallback((id: AppId) => {
    console.log(`[WindowManager] Focusing window: ${id}`);
    setWindows(prev => {
      if (prev[id].isMinimized) {
        soundSystem.maximize();
      }
      return {
        ...prev,
        [id]: { ...prev[id], zIndex: topZIndex + 1, isMinimized: false },
      };
    });
    setTopZIndex(z => z + 1);
  }, [topZIndex]);

  const updateWindowTitle = useCallback((id: AppId, title: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], title },
    }));
  }, []);

  const updateWindowPosition = useCallback((id: AppId, position: Position) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], position },
    }));
  }, []);

  const getOpenWindows = useCallback(() => {
    return Object.values(windows).filter(w => w.isOpen);
  }, [windows]);

  const isWindowOpen = useCallback((id: AppId) => {
    return windows[id]?.isOpen || false;
  }, [windows]);

  const isWindowFocused = useCallback((id: AppId) => {
    const win = windows[id];
    return win?.isOpen && !win?.isMinimized && win?.zIndex === topZIndex;
  }, [windows, topZIndex]);

  const value = useMemo(() => ({
    windows,
    topZIndex,
    openWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    updateWindowTitle,
    updateWindowPosition,
    getOpenWindows,
    isWindowOpen,
    isWindowFocused,
  }), [windows, topZIndex, openWindow, closeWindow, minimizeWindow, focusWindow, updateWindowTitle, updateWindowPosition, getOpenWindows, isWindowOpen, isWindowFocused]);

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider');
  }
  return context;
};
