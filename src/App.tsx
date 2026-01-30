// ============================================================================
// WebOS-95 Main App Component
// Wires together all contexts and components
// ============================================================================

import React, { useState } from 'react';
import { AppId, WindowState } from './types';

// Contexts
import { FileSystemProvider } from './contexts/FileSystemContext';
import { WindowManagerProvider, useWindowManager } from './contexts/WindowManagerContext';
import { SystemProvider, useSystem } from './contexts/SystemContext';

// Components
import { DesktopArea } from './components/desktop/DesktopArea';
import { Taskbar } from './components/desktop/Taskbar';
import { StartMenu } from './components/desktop/StartMenu';
import { WindowFrame } from './components/ui/WindowFrame';
import { SoundPrompt } from './components/system/SoundPrompt';
import { BiosScreen } from './components/system/BiosScreen';
import { BootScreen } from './components/system/BootScreen';
import { Screensaver } from './components/system/Screensaver';
import { MatrixCrash } from './components/system/MatrixCrash';

// Apps
import { 
  FloppyDrive, 
  MyComputer, 
  RecycleBin,
  Notepad, 
  ImageViewer,
  PixelStudio,
  Trivia,
  WebBrowser,
  Register,
  Minesweeper,
  MediaPlayer
} from './components/apps';

// ============================================================================
// App Content - Needs to be inside context providers
// ============================================================================
const AppContent: React.FC = () => {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  
  const { windows, closeWindow, minimizeWindow, focusWindow } = useWindowManager();
  
  const { 
    soundPromptShown,
    soundEnabled,
    showBios,
    hasBooted,
    showScreensaver,
    isSystemCrashed,
    handleSoundPrompt,
    completeBios,
    skipToDesktop,
    completeBoot,
    exitScreensaver
  } = useSystem();

  // Render the appropriate app component
  const renderAppContent = (appId: AppId): React.ReactNode => {
    switch (appId) {
      case AppId.MY_COMPUTER:
        return <MyComputer />;
      case AppId.RECYCLE_BIN:
        return <RecycleBin />;
      case AppId.FLOPPY_DRIVE:
        return <FloppyDrive />;
      case AppId.TEXTCRAFT:
        return <Notepad />;
      case AppId.MEDIA_PLAYER:
        return <MediaPlayer />;
      case AppId.PIXEL_ART:
        return <PixelStudio />;
      case AppId.TRIVIA:
        return <Trivia />;
      case AppId.WEB_BROWSER:
        return <WebBrowser />;
      case AppId.REGISTER:
        return <Register />;
      case AppId.MINESWEEPER:
        return <Minesweeper />;
      case AppId.IMAGE_VIEWER:
        return <ImageViewer />;
      default:
        return <div className="p-4">App not implemented</div>;
    }
  };

  // Get windows as array and filter visible ones
  const windowsArray = Object.values(windows) as WindowState[];
  const visibleWindows = windowsArray.filter(w => w.isOpen && !w.isMinimized);

  const handleCloseStartMenu = () => setStartMenuOpen(false);

  // System crash easter egg - show Matrix screen
  if (isSystemCrashed) {
    return <MatrixCrash />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#008080]">
      {/* Sound Permission Prompt */}
      {!soundPromptShown && (
        <SoundPrompt onContinue={handleSoundPrompt} />
      )}

      {/* BIOS Screen */}
      {soundPromptShown && showBios && (
        <BiosScreen 
          onBiosComplete={completeBios}
          onSkipToDesktop={skipToDesktop}
          soundEnabled={soundEnabled}
        />
      )}

      {/* Boot Screen (after BIOS) */}
      {soundPromptShown && !showBios && !hasBooted && (
        <BootScreen 
          onBootComplete={completeBoot}
          soundEnabled={soundEnabled}
        />
      )}

      {/* Screensaver */}
      {showScreensaver && <Screensaver onExit={exitScreensaver} />}

      {/* Main Desktop (show only after booted) */}
      {hasBooted && !showScreensaver && (
        <>
          {/* Desktop Area */}
          <DesktopArea onCloseStartMenu={handleCloseStartMenu} />

          {/* Windows Layer */}
          <div className="fixed inset-0 bottom-10 pointer-events-none">
            {visibleWindows.map((window) => (
              <div 
                key={window.id}
                className="pointer-events-auto absolute"
                style={{ zIndex: 100 + window.zIndex }}
              >
                <WindowFrame
                  title={window.title}
                  icon={window.icon}
                  onClose={() => closeWindow(window.id)}
                  onMinimize={() => minimizeWindow(window.id)}
                  onFocus={() => focusWindow(window.id)}
                  defaultPosition={window.position}
                  defaultSize={window.size}
                >
                  {renderAppContent(window.id)}
                </WindowFrame>
              </div>
            ))}
          </div>

          {/* Taskbar */}
          <Taskbar 
            startMenuOpen={startMenuOpen}
            onToggleStartMenu={() => setStartMenuOpen(!startMenuOpen)}
          />

          {/* Start Menu */}
          <StartMenu 
            isOpen={startMenuOpen}
            onClose={handleCloseStartMenu}
          />
        </>
      )}
    </div>
  );
};

// ============================================================================
// Main App - Wraps content with providers
// ============================================================================
const App: React.FC = () => {
  return (
    <SystemProvider>
      <FileSystemProvider>
        <WindowManagerProvider>
          <AppContent />
        </WindowManagerProvider>
      </FileSystemProvider>
    </SystemProvider>
  );
};

export default App;
