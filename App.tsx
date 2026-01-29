import React, { useState } from 'react';
import { AppId, WindowState, FileItem } from './types';
import { WindowFrame } from './components/ui/WindowFrame';
import { RetroButton } from './components/ui/RetroButton';
import { ContextMenu } from './components/ui/ContextMenu';
import { BootScreen } from './components/BootScreen';
import { BiosScreen } from './components/BiosScreen';
import { Screensaver } from './components/Screensaver';
import { PixelStudio } from './components/apps/PixelStudio';
import { Trivia } from './components/apps/Trivia';
import { WebBrowser } from './components/apps/WebBrowser';
import { Register } from './components/apps/Register';
import { FloppyDrive } from './components/apps/FloppyDrive';
import { FileTransfer } from './components/apps/FileTransfer';
import { Minesweeper } from './components/apps/Minesweeper';
import { Notepad } from './components/apps/Notepad';
import { MediaPlayer } from './components/apps/MediaPlayer';
import { MyComputer } from './components/apps/MyComputer';
import { ImageViewer } from './components/apps/ImageViewer';
import { soundSystem } from './services/sounds';

const ICONS = {
  [AppId.PIXEL_ART]: 'https://win98icons.alexmeub.com/icons/png/paint_file-2.png',
  [AppId.TRIVIA]: 'https://win98icons.alexmeub.com/icons/png/game_solitaire-1.png',
  [AppId.WEB_BROWSER]: 'https://win98icons.alexmeub.com/icons/png/world-0.png',
  [AppId.REGISTER]: 'https://win98icons.alexmeub.com/icons/png/key_win-0.png',
  [AppId.ABOUT]: 'https://win98icons.alexmeub.com/icons/png/help_question_mark-0.png',
  [AppId.FLOPPY_DRIVE]: 'https://win98icons.alexmeub.com/icons/png/floppy_drive_3_5_cool-0.png',
  [AppId.FILE_TRANSFER]: 'https://win98icons.alexmeub.com/icons/png/file_copy-0.png',
  [AppId.MINESWEEPER]: 'https://win98icons.alexmeub.com/icons/png/mine_sweeper-1.png',
  [AppId.TEXTCRAFT]: 'https://win98icons.alexmeub.com/icons/png/notepad-3.png',
  [AppId.MEDIA_PLAYER]: 'https://win98icons.alexmeub.com/icons/png/cd_audio_cd-0.png',
  [AppId.MY_COMPUTER]: 'https://win98icons.alexmeub.com/icons/png/computer-1.png',
  [AppId.RECYCLE_BIN]: 'https://win98icons.alexmeub.com/icons/png/recycle_bin_full-2.png',
  [AppId.IMAGE_VIEWER]: 'https://win98icons.alexmeub.com/icons/png/paint_file-0.png',
  START: 'https://win98icons.alexmeub.com/icons/png/windows-0.png',
  FILE_BMP: 'https://win98icons.alexmeub.com/icons/png/paint_file-0.png',
  FILE_TXT: 'https://win98icons.alexmeub.com/icons/png/notepad_file-0.png'
};

const INITIAL_WINDOWS: Record<AppId, WindowState> = {
  [AppId.PIXEL_ART]: {
    id: AppId.PIXEL_ART, title: 'Pixel Studio 95', isOpen: false, isMinimized: false, zIndex: 2, icon: ICONS[AppId.PIXEL_ART], position: { x: 100, y: 100 }, resizable: true
  },
  [AppId.TRIVIA]: {
    id: AppId.TRIVIA, title: 'Nostalgia Trivia', isOpen: false, isMinimized: false, zIndex: 3, icon: ICONS[AppId.TRIVIA], position: { x: 150, y: 150 }, resizable: true
  },
  [AppId.WEB_BROWSER]: {
    id: AppId.WEB_BROWSER, title: 'NetWorld Navigator', isOpen: false, isMinimized: false, zIndex: 4, icon: ICONS[AppId.WEB_BROWSER], position: { x: 80, y: 80 }, resizable: true
  },
  [AppId.REGISTER]: {
    id: AppId.REGISTER, title: 'Register RetroWave OS', isOpen: false, isMinimized: false, zIndex: 5, icon: ICONS[AppId.REGISTER], position: { x: 250, y: 150 }, resizable: false
  },
  [AppId.ABOUT]: {
    id: AppId.ABOUT, title: 'About RetroWave OS', isOpen: false, isMinimized: false, zIndex: 6, icon: ICONS[AppId.ABOUT], position: { x: 200, y: 200 }, resizable: false
  },
  [AppId.FLOPPY_DRIVE]: {
    id: AppId.FLOPPY_DRIVE, title: '3½ Floppy (A:)', isOpen: false, isMinimized: false, zIndex: 7, icon: ICONS[AppId.FLOPPY_DRIVE], position: { x: 300, y: 100 }, resizable: false
  },
  [AppId.FILE_TRANSFER]: {
    id: AppId.FILE_TRANSFER, title: '0.49% of cc32e47.exe Completed', isOpen: false, isMinimized: false, zIndex: 100, icon: ICONS[AppId.FILE_TRANSFER], position: { x: 350, y: 250 }, resizable: false
  },
  [AppId.MINESWEEPER]: {
    id: AppId.MINESWEEPER, title: 'Minesweeper', isOpen: false, isMinimized: false, zIndex: 8, icon: ICONS[AppId.MINESWEEPER], position: { x: 120, y: 120 }, resizable: true
  },
  [AppId.TEXTCRAFT]: {
    id: AppId.TEXTCRAFT, title: 'TextCraft - Untitled', isOpen: false, isMinimized: false, zIndex: 9, icon: ICONS[AppId.TEXTCRAFT], position: { x: 140, y: 140 }, resizable: true
  },
  [AppId.MEDIA_PLAYER]: {
    id: AppId.MEDIA_PLAYER, title: 'Media Player', isOpen: false, isMinimized: false, zIndex: 10, icon: ICONS[AppId.MEDIA_PLAYER], position: { x: 160, y: 160 }, resizable: true
  },
  [AppId.MY_COMPUTER]: {
    id: AppId.MY_COMPUTER, title: 'My Computer', isOpen: false, isMinimized: false, zIndex: 11, icon: ICONS[AppId.MY_COMPUTER], position: { x: 50, y: 50 }, resizable: true
  },
  [AppId.RECYCLE_BIN]: {
    id: AppId.RECYCLE_BIN, title: 'Recycle Bin', isOpen: false, isMinimized: false, zIndex: 12, icon: ICONS[AppId.RECYCLE_BIN], position: { x: 180, y: 180 }, resizable: true
  },
  [AppId.IMAGE_VIEWER]: {
    id: AppId.IMAGE_VIEWER, title: 'Image Viewer', isOpen: false, isMinimized: false, zIndex: 13, icon: ICONS[AppId.IMAGE_VIEWER], position: { x: 200, y: 100 }, resizable: true
  }
};

const INITIAL_DESKTOP_FILES: FileItem[] = [
  { id: 'magical_nedrysaurus', name: 'Magical Nedrysaurus.gif', type: 'image', icon: ICONS.FILE_BMP, url: 'https://youtu.be/fmz-K2hLwSI' },
];

const INITIAL_USB_FILES: FileItem[] = [
  { id: 'troll_face', name: 'cool_pic.jpg', type: 'image', icon: ICONS.FILE_BMP },
  { id: 'readme', name: 'README.TXT', type: 'text', icon: ICONS.FILE_TXT },
];

const App: React.FC = () => {
  const [showBios, setShowBios] = useState(true);
  const [hasBooted, setHasBooted] = useState(false);
  const [showScreensaver, setShowScreensaver] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: any[] } | null>(null);
  
  const [windows, setWindows] = useState<Record<AppId, WindowState>>(INITIAL_WINDOWS);
  const [topZIndex, setTopZIndex] = useState(10);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  
  const [desktopFiles, setDesktopFiles] = useState<FileItem[]>(INITIAL_DESKTOP_FILES);
  const [usbFiles, setUsbFiles] = useState<FileItem[]>(INITIAL_USB_FILES);
  const [activeTransferFile, setActiveTransferFile] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<{ url: string; name: string } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Screensaver logic - activate after 2 minutes of inactivity
  React.useEffect(() => {
    const checkScreensaver = setInterval(() => {
      if (Date.now() - lastActivity > 120000 && !showScreensaver) { // 2 minutes
        setShowScreensaver(true);
      }
    }, 5000);
    return () => clearInterval(checkScreensaver);
  }, [lastActivity, showScreensaver]);

  // Track user activity
  React.useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      if (showScreensaver) {
        setShowScreensaver(false);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [showScreensaver]);

  const handleOpen = (id: AppId) => {
    soundSystem.pop();
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: true,
        isMinimized: false,
        zIndex: topZIndex + 1
      }
    }));
    setTopZIndex(z => z + 1);
    setStartMenuOpen(false);
  };

  const handleClose = (id: AppId) => {
    soundSystem.close();
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false }
    }));
    if (id === AppId.FILE_TRANSFER) {
      setActiveTransferFile(null);
    }
  };

  const handleMinimize = (id: AppId) => {
    soundSystem.minimize();
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true }
    }));
  };

  const handleFocus = (id: AppId) => {
    if (windows[id].isMinimized) {
      soundSystem.maximize();
    }
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], zIndex: topZIndex + 1, isMinimized: false }
    }));
    setTopZIndex(z => z + 1);
  };

  const toggleStartMenu = () => {
    if (!startMenuOpen) soundSystem.menuOpen();
    setStartMenuOpen(!startMenuOpen);
  };

  const handleDesktopRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        { label: 'Refresh', icon: ICONS.START, onClick: () => window.location.reload() },
        { separator: true },
        { label: 'New', icon: ICONS[AppId.TEXTCRAFT], onClick: () => handleOpen(AppId.TEXTCRAFT) },
        { separator: true },
        { label: 'Properties', onClick: () => alert('Desktop Properties') }
      ]
    });
  };

  const startTransfer = (fileId: string) => {
    console.log('startTransfer called with fileId:', fileId);
    const file = desktopFiles.find(f => f.id === fileId);
    console.log('Found file:', file);
    if (file) {
      setActiveTransferFile(file.name);
      handleOpen(AppId.FILE_TRANSFER);
      console.log('Opening file transfer window');
    }
  };

  const DesktopIcon: React.FC<{ id?: AppId, label: string, isFile?: boolean, fileId?: string }> = ({ id, label, isFile = false, fileId = '' }) => {
    const file = isFile ? desktopFiles.find(f => f.id === fileId) : null;
    const iconUrl = isFile ? (file?.icon || ICONS.FILE_TXT) : (ICONS[id!] || '');
    
    const onDragStart = (e: React.DragEvent) => {
      if (isFile && fileId) {
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('text/plain', fileId);
        console.log('Dragging file:', fileId);
      }
    };

    const onDoubleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isFile && file?.url) {
        // Open image in the OS image viewer
        setActiveImage({ url: file.url, name: file.name });
        handleOpen(AppId.IMAGE_VIEWER);
        setWindows(prev => ({
          ...prev,
          [AppId.IMAGE_VIEWER]: {
            ...prev[AppId.IMAGE_VIEWER],
            title: file.name
          }
        }));
      } else if (!isFile && id) {
        handleOpen(id);
      }
    };

    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    return (
      <div 
        draggable={isFile}
        onDragStart={onDragStart}
        className="flex flex-col items-center gap-1 w-20 cursor-pointer p-2 hover:bg-[#000080]/30 hover:border hover:border-dotted hover:border-white mb-4"
        onDoubleClick={onDoubleClick}
        onClick={onClick}
      >
        <img src={iconUrl} alt={label} className="w-8 h-8 pixelated pointer-events-none" />
        <span className="text-white text-xs text-center drop-shadow-md font-sans leading-tight break-words">{label}</span>
      </div>
    );
  };

  return (
    <>
      {/* BIOS Screen */}
      {showBios && <BiosScreen onBiosComplete={() => setShowBios(false)} onSkipToDesktop={() => { setShowBios(false); setHasBooted(true); }} />}
      
      {/* Boot Screen */}
      {!showBios && !hasBooted && <BootScreen onBootComplete={() => setHasBooted(true)} />}
      
      {/* Screensaver */}
      {hasBooted && showScreensaver && <Screensaver onExit={() => setShowScreensaver(false)} />}
      
      {/* Main Desktop */}
      {hasBooted && !showScreensaver && (
        <div className="w-screen h-screen flex flex-col overflow-hidden relative select-none bg-[#008080]">
          
          {/* Desktop Area */}
          <div 
            className="flex-1 relative p-4" 
            onClick={() => { setStartMenuOpen(false); setContextMenu(null); }}
            onContextMenu={handleDesktopRightClick}
          >
            
            {/* Main Icons (Left Side) */}
            <div className="flex flex-col flex-wrap h-full content-start gap-2">
              <DesktopIcon id={AppId.MY_COMPUTER} label="My Computer" />
              <DesktopIcon id={AppId.RECYCLE_BIN} label="Recycle Bin" />
              <DesktopIcon id={AppId.WEB_BROWSER} label="The Web" />
              <DesktopIcon id={AppId.TEXTCRAFT} label="TextCraft" />
              <DesktopIcon id={AppId.MEDIA_PLAYER} label="Media Player" />
          
          {/* Files on Desktop */}
          {desktopFiles.map(file => (
            <DesktopIcon key={file.id} label={file.name} isFile={true} fileId={file.id} />
          ))}
        </div>

        {/* Windows */}
        {(Object.values(windows) as WindowState[]).map((win) => (
          <WindowFrame
            key={win.id}
            {...win}
            onClose={handleClose}
            onMinimize={handleMinimize}
            onFocus={handleFocus}
          >
            {win.id === AppId.PIXEL_ART && <PixelStudio />}
            {win.id === AppId.TRIVIA && <Trivia />}
            {win.id === AppId.WEB_BROWSER && <WebBrowser />}
            {win.id === AppId.REGISTER && <Register />}
            {win.id === AppId.MINESWEEPER && <Minesweeper />}
            {win.id === AppId.TEXTCRAFT && <Notepad />}
            {win.id === AppId.MEDIA_PLAYER && <MediaPlayer />}
            {win.id === AppId.MY_COMPUTER && <MyComputer onOpenFloppyDrive={() => handleOpen(AppId.FLOPPY_DRIVE)} />}
            {win.id === AppId.RECYCLE_BIN && (
              <div className="p-4 flex flex-col items-center justify-center h-full gap-4">
                <img src={ICONS[AppId.RECYCLE_BIN]} className="w-16 h-16" />
                <p className="text-center">The Recycle Bin is empty.</p>
                <RetroButton onClick={() => handleClose(AppId.RECYCLE_BIN)}>Close</RetroButton>
              </div>
            )}
            {win.id === AppId.IMAGE_VIEWER && activeImage && (
              <ImageViewer imageUrl={activeImage.url} fileName={activeImage.name} />
            )}
            {win.id === AppId.FLOPPY_DRIVE && (
              <FloppyDrive files={usbFiles} onFileDrop={startTransfer} />
            )}
            {win.id === AppId.FILE_TRANSFER && activeTransferFile && (
              <FileTransfer fileName={activeTransferFile} onCancel={() => handleClose(AppId.FILE_TRANSFER)} />
            )}
            {win.id === AppId.ABOUT && (
              <div className="p-4 flex flex-col gap-4 text-center items-center h-full justify-center">
                <img src={ICONS[AppId.ABOUT]} className="w-16 h-16" />
                <h2 className="text-xl font-bold">RetroWave OS 95</h2>
                <p>The Nostalgia Engine</p>
                <p className="text-sm">Powered by React & Tailwind</p>
                <RetroButton onClick={() => handleClose(AppId.ABOUT)} className="px-6">OK</RetroButton>
              </div>
            )}
          </WindowFrame>
        ))}

        {/* Start Menu */}
        {startMenuOpen && (
          <div className="fixed bottom-[40px] left-0 bg-[#c0c0c0] bevel-out flex w-64 z-50 shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Sidebar Banner */}
            <div className="bg-gradient-to-b from-[#000080] to-[#1084d0] text-white font-bold px-1 py-4 flex items-end w-7 relative">
              <div className="absolute bottom-2 left-1 text-lg whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                <span className="tracking-wide">RetroWave</span>
                <span className="text-base font-normal"> 95</span>
              </div>
            </div>
            
            {/* Menu Items */}
            <div className="flex-1 flex flex-col p-1">
              {/* Programs with submenu arrow */}
              <div className="relative group">
                <div className="flex items-center justify-between px-8 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer text-sm">
                  <div className="flex items-center gap-3">
                    <img src="https://win98icons.alexmeub.com/icons/png/directory_program-4.png" className="w-5 h-5" />
                    <span>Programs</span>
                  </div>
                  <span className="text-xs">▶</span>
                </div>
                {/* Submenu */}
                <div className="hidden group-hover:block absolute left-full top-0 ml-0.5 bg-[#c0c0c0] bevel-out p-1 min-w-[180px] shadow-xl">
                  <button onClick={() => handleOpen(AppId.PIXEL_ART)} className="w-full text-left px-8 py-1.5 hover:bg-[#000080] hover:text-white text-sm flex items-center gap-3">
                    <img src={ICONS[AppId.PIXEL_ART]} className="w-4 h-4 absolute left-2" />
                    Pixel Studio
                  </button>
                  <button onClick={() => handleOpen(AppId.MINESWEEPER)} className="w-full text-left px-8 py-1.5 hover:bg-[#000080] hover:text-white text-sm flex items-center gap-3">
                    <img src={ICONS[AppId.MINESWEEPER]} className="w-4 h-4 absolute left-2" />
                    Minesweeper
                  </button>
                  <button onClick={() => handleOpen(AppId.TRIVIA)} className="w-full text-left px-8 py-1.5 hover:bg-[#000080] hover:text-white text-sm flex items-center gap-3">
                    <img src={ICONS[AppId.TRIVIA]} className="w-4 h-4 absolute left-2" />
                    Nostalgia Trivia
                  </button>
                  <button onClick={() => handleOpen(AppId.MEDIA_PLAYER)} className="w-full text-left px-8 py-1.5 hover:bg-[#000080] hover:text-white text-sm flex items-center gap-3">
                    <img src={ICONS[AppId.MEDIA_PLAYER]} className="w-4 h-4 absolute left-2" />
                    Media Player
                  </button>
                  <div className="border-t border-[#808080] border-b border-white my-1" />
                  <button onClick={() => handleOpen(AppId.WEB_BROWSER)} className="w-full text-left px-8 py-1.5 hover:bg-[#000080] hover:text-white text-sm flex items-center gap-3">
                    <img src={ICONS[AppId.WEB_BROWSER]} className="w-4 h-4 absolute left-2" />
                    NetWorld Navigator
                  </button>
                </div>
              </div>
              
              {/* Accessories with submenu */}
              <div className="relative group">
                <div className="flex items-center justify-between px-8 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer text-sm">
                  <div className="flex items-center gap-3">
                    <img src="https://win98icons.alexmeub.com/icons/png/directory_closed-4.png" className="w-5 h-5" />
                    <span>Accessories</span>
                  </div>
                  <span className="text-xs">▶</span>
                </div>
                <div className="hidden group-hover:block absolute left-full top-0 ml-0.5 bg-[#c0c0c0] bevel-out p-1 min-w-[160px] shadow-xl">
                  <button onClick={() => handleOpen(AppId.TEXTCRAFT)} className="w-full text-left px-8 py-1.5 hover:bg-[#000080] hover:text-white text-sm flex items-center gap-3">
                    <img src={ICONS[AppId.TEXTCRAFT]} className="w-4 h-4 absolute left-2" />
                    TextCraft
                  </button>
                </div>
              </div>

              <div className="border-t border-[#808080] border-b border-white my-1" />
              
              <button onClick={() => handleOpen(AppId.MY_COMPUTER)} className="flex items-center gap-3 px-8 py-1.5 hover:bg-[#000080] hover:text-white text-sm">
                <img src={ICONS[AppId.MY_COMPUTER]} className="w-5 h-5 absolute left-9" />
                My Computer
              </button>
              
              <div className="border-t border-[#808080] border-b border-white my-1" />
              
              <button onClick={() => alert('Find: Files or Folders...')} className="flex items-center gap-3 px-8 py-1.5 hover:bg-[#000080] hover:text-white text-sm">
                <img src="https://win98icons.alexmeub.com/icons/png/search_file-4.png" className="w-5 h-5 absolute left-9" />
                Find
              </button>
              
              <button onClick={() => alert('Help coming soon!')} className="flex items-center gap-3 px-8 py-1.5 hover:bg-[#000080] hover:text-white text-sm">
                <img src="https://win98icons.alexmeub.com/icons/png/help_book_small-0.png" className="w-5 h-5 absolute left-9" />
                Help
              </button>
              
              <button onClick={() => handleOpen(AppId.REGISTER)} className="flex items-center gap-3 px-8 py-1.5 hover:bg-[#000080] hover:text-white text-sm">
                <img src={ICONS[AppId.REGISTER]} className="w-5 h-5 absolute left-9" />
                Register
              </button>
              
              <div className="border-t border-[#808080] border-b border-white my-1" />
              
              <button onClick={() => alert('Shutting down... Just kidding! 😄')} className="flex items-center gap-3 px-8 py-1.5 hover:bg-[#000080] hover:text-white text-sm">
                <img src="https://win98icons.alexmeub.com/icons/png/shut_down_with_computer-0.png" className="w-5 h-5 absolute left-9" />
                Shut Down...
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Taskbar */}
      <div className="h-10 bg-[#c0c0c0] border-t-2 border-white flex items-center p-1 gap-1 z-50">
        <RetroButton 
          startMenu 
          active={startMenuOpen} 
          onClick={(e) => { e.stopPropagation(); toggleStartMenu(); }}
          className="flex items-center"
        >
          <img src={ICONS.START} className="w-5 h-5 mr-1" /> Start
        </RetroButton>
        
        <div className="w-[2px] h-full border-l border-[#808080] border-r border-white mx-1" />

        {/* Taskbar Items */}
        <div className="flex-1 flex gap-1 overflow-x-auto">
          {(Object.values(windows) as WindowState[]).filter(w => w.isOpen).map(win => (
            <RetroButton
              key={win.id}
              active={!win.isMinimized && win.zIndex === topZIndex}
              onClick={() => win.isMinimized ? handleFocus(win.id) : handleMinimize(win.id)}
              className="w-40 justify-start truncate shrink-0"
            >
              <img src={win.icon} className="w-4 h-4 mr-2 pixelated" />
              {win.title}
            </RetroButton>
          ))}
        </div>

        {/* System Tray */}
        <div className="bevel-in px-2 py-1 bg-[#c0c0c0] flex items-center gap-2 text-xs font-sans whitespace-nowrap">
          <img 
            src={soundEnabled 
              ? "https://win98icons.alexmeub.com/icons/png/loudspeaker_rays-0.png" 
              : "https://win98icons.alexmeub.com/icons/png/loudspeaker_muted-0.png"
            }
            className="w-4 h-4 cursor-pointer" 
            onClick={() => {
              const newState = !soundEnabled;
              setSoundEnabled(newState);
              soundSystem.setEnabled(newState);
              if (newState) soundSystem.click();
            }}
            title={soundEnabled ? "Sound On - Click to Mute" : "Sound Off - Click to Unmute"}
          />
          <span>{currentTime}</span>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
      )}
    </>
  );
};

export default App;