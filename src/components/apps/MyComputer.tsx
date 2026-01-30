// ============================================================================
// My Computer Component - File explorer with drive navigation
// ============================================================================

import React, { useState, useCallback } from 'react';
import { useFileSystem, useWindowManager } from '../../contexts';
import { AppId, FileSystemItem } from '../../types';
import { SYSTEM_ICONS, FILE_ICONS, APP_ICONS } from '../../config';
import { DRAG_TYPE_FILE } from '../desktop/DesktopIcon';
import { RetroButton } from '../ui/RetroButton';
import { useMessageBox, MessageBoxType } from '../ui/MessageBox';
import { ContextMenu } from '../ui/ContextMenu';
import { soundSystem } from '../../services/sounds';

// Data type for protected items (drives, system files)
const DRAG_TYPE_PROTECTED = 'application/x-webos-protected';
// Special drag type for System32 easter egg
const DRAG_TYPE_SYSTEM32 = 'application/x-webos-system32';

// Static file system structure
const FILE_SYSTEM: FileSystemItem[] = [
  {
    name: 'My Computer',
    type: 'folder',
    icon: APP_ICONS[AppId.MY_COMPUTER],
    items: [
      {
        name: '3½ Floppy (A:)',
        type: 'drive',
        icon: APP_ICONS[AppId.FLOPPY_DRIVE],
        items: []
      },
      {
        name: 'C (C:)',
        type: 'drive',
        icon: SYSTEM_ICONS.HARD_DRIVE,
        isDriveRoot: true,
        items: [
          {
            name: 'Program Files',
            type: 'folder',
            icon: SYSTEM_ICONS.FOLDER,
            items: [
              { 
                name: 'Internet Explorer', 
                type: 'folder', 
                icon: SYSTEM_ICONS.FOLDER,
                items: [
                  { name: 'iexplore.exe', type: 'file', icon: FILE_ICONS.EXE, size: '89 KB', modified: '08/24/1998', isSystemFile: true },
                  { name: 'urlmon.dll', type: 'file', icon: FILE_ICONS.DLL, size: '456 KB', modified: '08/24/1998', isSystemFile: true },
                  { name: 'mshtml.dll', type: 'file', icon: FILE_ICONS.DLL, size: '1.2 MB', modified: '08/24/1998', isSystemFile: true },
                  { name: 'shdocvw.dll', type: 'file', icon: FILE_ICONS.DLL, size: '892 KB', modified: '08/24/1998', isSystemFile: true },
                  { name: 'iexplore.ini', type: 'file', icon: FILE_ICONS.INI, size: '2 KB', modified: '08/24/1998', isSystemFile: true },
                ]
              },
              { 
                name: 'Windows Media Player', 
                type: 'folder', 
                icon: SYSTEM_ICONS.FOLDER,
                items: [
                  { name: 'wmplayer.exe', type: 'file', icon: FILE_ICONS.EXE, size: '156 KB', modified: '06/15/1999', isSystemFile: true },
                  { name: 'wmpcore.dll', type: 'file', icon: FILE_ICONS.DLL, size: '2.1 MB', modified: '06/15/1999', isSystemFile: true },
                  { name: 'wmpui.dll', type: 'file', icon: FILE_ICONS.DLL, size: '456 KB', modified: '06/15/1999', isSystemFile: true },
                  { name: 'wmplayer.ini', type: 'file', icon: FILE_ICONS.INI, size: '1 KB', modified: '06/15/1999', isSystemFile: true },
                ]
              },
              { 
                name: 'Common Files', 
                type: 'folder', 
                icon: SYSTEM_ICONS.FOLDER,
                items: [
                  { name: 'oleaut32.dll', type: 'file', icon: FILE_ICONS.DLL, size: '598 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'msvcrt.dll', type: 'file', icon: FILE_ICONS.DLL, size: '295 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'mfc42.dll', type: 'file', icon: FILE_ICONS.DLL, size: '972 KB', modified: '05/11/1998', isSystemFile: true },
                ]
              },
            ]
          },
          {
            name: 'Windows',
            type: 'folder',
            icon: SYSTEM_ICONS.FOLDER_WINDOWS,
            items: [
              { name: 'explorer.exe', type: 'file', icon: FILE_ICONS.EXE, size: '204 KB', modified: '05/11/1998', isSystemFile: true },
              { name: 'notepad.exe', type: 'file', icon: FILE_ICONS.EXE, size: '52 KB', modified: '05/11/1998', isSystemFile: true },
              { name: 'regedit.exe', type: 'file', icon: FILE_ICONS.EXE, size: '120 KB', modified: '05/11/1998', isSystemFile: true },
              { name: 'win.ini', type: 'file', icon: FILE_ICONS.INI, size: '4 KB', modified: '05/11/1998', isSystemFile: true },
              { name: 'system.ini', type: 'file', icon: FILE_ICONS.INI, size: '2 KB', modified: '05/11/1998', isSystemFile: true },
              { name: 'control.ini', type: 'file', icon: FILE_ICONS.INI, size: '1 KB', modified: '05/11/1998', isSystemFile: true },
              { name: 'win.com', type: 'file', icon: FILE_ICONS.EXE, size: '24 KB', modified: '05/11/1998', isSystemFile: true },
              { name: 'bootlog.txt', type: 'file', icon: FILE_ICONS.TXT, size: '8 KB', modified: '01/30/2026', isSystemFile: true },
              { 
                name: 'System32', 
                type: 'folder', 
                icon: SYSTEM_ICONS.FOLDER,
                items: [
                  { name: 'kernel32.dll', type: 'file', icon: FILE_ICONS.DLL, size: '412 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'user32.dll', type: 'file', icon: FILE_ICONS.DLL, size: '556 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'gdi32.dll', type: 'file', icon: FILE_ICONS.DLL, size: '234 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'shell32.dll', type: 'file', icon: FILE_ICONS.DLL, size: '1.8 MB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'advapi32.dll', type: 'file', icon: FILE_ICONS.DLL, size: '389 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'ntdll.dll', type: 'file', icon: FILE_ICONS.DLL, size: '590 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'comctl32.dll', type: 'file', icon: FILE_ICONS.DLL, size: '921 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'comdlg32.dll', type: 'file', icon: FILE_ICONS.DLL, size: '178 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'config.sys', type: 'file', icon: FILE_ICONS.SYS, size: '1 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'vga.drv', type: 'file', icon: FILE_ICONS.SYS, size: '67 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'mouse.drv', type: 'file', icon: FILE_ICONS.SYS, size: '23 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'keyboard.drv', type: 'file', icon: FILE_ICONS.SYS, size: '18 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'system.dat', type: 'file', icon: FILE_ICONS.DAT, size: '2.4 MB', modified: '01/30/2026', isSystemFile: true },
                  { name: 'user.dat', type: 'file', icon: FILE_ICONS.DAT, size: '896 KB', modified: '01/30/2026', isSystemFile: true },
                ]
              },
              { 
                name: 'Fonts', 
                type: 'folder', 
                icon: SYSTEM_ICONS.FOLDER_FONTS, 
                items: [
                  { name: 'arial.ttf', type: 'file', icon: FILE_ICONS.TTF, size: '267 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'arialbd.ttf', type: 'file', icon: FILE_ICONS.TTF, size: '243 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'ariali.ttf', type: 'file', icon: FILE_ICONS.TTF, size: '251 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'times.ttf', type: 'file', icon: FILE_ICONS.TTF, size: '389 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'timesbd.ttf', type: 'file', icon: FILE_ICONS.TTF, size: '356 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'cour.ttf', type: 'file', icon: FILE_ICONS.TTF, size: '178 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'courbd.ttf', type: 'file', icon: FILE_ICONS.TTF, size: '165 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'comic.ttf', type: 'file', icon: FILE_ICONS.TTF, size: '156 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'verdana.ttf', type: 'file', icon: FILE_ICONS.TTF, size: '198 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'georgia.ttf', type: 'file', icon: FILE_ICONS.TTF, size: '212 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'wingding.ttf', type: 'file', icon: FILE_ICONS.TTF, size: '78 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'symbol.ttf', type: 'file', icon: FILE_ICONS.TTF, size: '56 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'webdings.ttf', type: 'file', icon: FILE_ICONS.TTF, size: '89 KB', modified: '05/11/1998', isSystemFile: true },
                  { name: 'marlett.ttf', type: 'file', icon: FILE_ICONS.TTF, size: '34 KB', modified: '05/11/1998', isSystemFile: true },
                ]
              },
              { 
                name: 'Temp', 
                type: 'folder', 
                icon: SYSTEM_ICONS.FOLDER,
                items: []
              },
            ]
          },
          {
            name: 'My Documents',
            type: 'folder',
            icon: SYSTEM_ICONS.FOLDER_COOL,
            items: [
              { name: 'vacation.bmp', type: 'file', icon: FILE_ICONS.BMP, size: '2.4 MB', modified: '12/25/1999' },
              { name: 'resume.doc', type: 'file', icon: FILE_ICONS.DOC, size: '45 KB', modified: '03/15/1999' },
            ]
          },
        ]
      },
      {
        name: 'CD-ROM (D:)',
        type: 'drive',
        icon: SYSTEM_ICONS.CD_DRIVE,
        items: []
      }
    ]
  }
];

export const MyComputer: React.FC = () => {
  const { cDriveFiles, moveFile, system32InBin, setSystem32InBin } = useFileSystem();
  const { openWindow } = useWindowManager();
  const { showMessage, MessageBoxComponent } = useMessageBox();
  
  const [currentPath, setCurrentPath] = useState<FileSystemItem[]>([FILE_SYSTEM[0]]);
  const [view, setView] = useState<'icons' | 'list'>('icons');
  const [isDragOver, setIsDragOver] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: FileSystemItem } | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleItemClick = useCallback((itemName: string) => {
    setSelectedItem(itemName);
    soundSystem.select();
  }, []);

  const current = currentPath[currentPath.length - 1];

  // Get items to display, including user files for C: drive root
  const getCurrentItems = useCallback((): FileSystemItem[] => {
    let items: FileSystemItem[] = [];
    
    if (current.isDriveRoot) {
      const userFiles: FileSystemItem[] = cDriveFiles.map(file => ({
        name: file.name,
        type: 'file' as const,
        icon: file.icon,
        size: '1 KB',
        modified: new Date().toLocaleDateString()
      }));
      items = [...(current.items || []), ...userFiles];
    } else {
      items = current.items || [];
    }
    
    // Filter out System32 if it's been moved to the Recycle Bin
    if (system32InBin) {
      items = items.filter(item => !(item.name === 'System32' && item.type === 'folder'));
    }
    
    return items;
  }, [current, cDriveFiles, system32InBin]);

  const isInCDrive = useCallback(() => {
    return currentPath.some(p => p.name === 'C (C:)');
  }, [currentPath]);

  const navigateTo = useCallback((item: FileSystemItem) => {
    if (item.type === 'file') {
      // Check if it's a system file
      if (item.isSystemFile) {
        const ext = item.name.split('.').pop()?.toLowerCase() || '';
        let message = '';
        let type: MessageBoxType = 'error';
        
        if (['dll', 'ocx', 'cpl'].includes(ext)) {
          message = `Cannot open '${item.name}':\n\nThis file is a system component and cannot be opened directly. It is used by Windows and other programs.`;
        } else if (['exe', 'com'].includes(ext)) {
          message = `Cannot run '${item.name}':\n\nAccess is denied. You do not have permission to run this program.\n\nContact your system administrator.`;
        } else if (['sys', 'drv', 'vxd'].includes(ext)) {
          message = `Cannot open '${item.name}':\n\nThis is a Windows system driver file. Opening or modifying this file may cause system instability.`;
          type = 'warning';
        } else if (['ini', 'cfg', 'inf'].includes(ext)) {
          message = `Cannot open '${item.name}':\n\nThis configuration file is in use by the system and is locked for editing.`;
        } else if (['ttf', 'fon', 'fot'].includes(ext)) {
          message = `Cannot preview '${item.name}':\n\nThis font file is currently in use by the system.\n\nClose all programs and try again.`;
          type = 'warning';
        } else if (['dat'].includes(ext)) {
          message = `Cannot open '${item.name}':\n\nThis file contains system data and cannot be viewed or modified.\n\nAccess is denied.`;
        } else if (['txt', 'log'].includes(ext)) {
          message = `Cannot open '${item.name}':\n\nThis system log file is currently in use by another process.`;
          type = 'warning';
        } else {
          message = `Cannot open '${item.name}':\n\nThis file is protected and cannot be accessed.`;
        }
        
        showMessage({ title: item.name, message, type });
        return;
      }
      
      // Regular file - show info message
      showMessage({ title: item.name, message: `Opening ${item.name}...`, type: 'info' });
      return;
    }
    if (item.name === '3½ Floppy (A:)') {
      openWindow(AppId.FLOPPY_DRIVE);
      return;
    }
    setSelectedItem(null);
    setCurrentPath([...currentPath, item]);
  }, [currentPath, openWindow, showMessage]);

  const navigateBack = useCallback(() => {
    if (currentPath.length > 1) {
      setSelectedItem(null);
      setCurrentPath(currentPath.slice(0, -1));
    }
  }, [currentPath]);

  const navigateUp = useCallback(() => {
    if (currentPath.length > 1) {
      setSelectedItem(null);
      setCurrentPath(currentPath.slice(0, -1));
    }
  }, [currentPath]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (isInCDrive()) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setIsDragOver(true);
    }
  }, [isInCDrive]);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (isInCDrive()) {
      const fileId = e.dataTransfer.getData(DRAG_TYPE_FILE) || e.dataTransfer.getData('text/plain');
      console.log('[MyComputer] Drop received, fileId:', fileId);
      if (fileId) {
        moveFile(fileId, 'c-drive');
      }
    }
  }, [isInCDrive, moveFile]);

  const handleFileDragStart = useCallback((e: React.DragEvent, fileName: string) => {
    // First check if it's a user file from the FileSystem
    const file = cDriveFiles.find(f => f.name === fileName);
    if (file) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData(DRAG_TYPE_FILE, file.id);
      e.dataTransfer.setData('text/plain', file.id);
    } else {
      // For static file system items, use a custom data type
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('application/x-webos-static-item', fileName);
      e.dataTransfer.setData('text/plain', fileName);
    }
  }, [cDriveFiles]);

  const handleProtectedDragStart = useCallback((e: React.DragEvent, itemName: string, isDrive: boolean) => {
    // Allow dragging but mark as protected so drop handlers can show error
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData(DRAG_TYPE_PROTECTED, JSON.stringify({ name: itemName, isDrive }));
    e.dataTransfer.setData('text/plain', itemName);
  }, []);

  // Special handler for System32 easter egg - allows dragging to Recycle Bin
  const handleSystem32DragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData(DRAG_TYPE_SYSTEM32, 'system32');
    e.dataTransfer.setData('text/plain', 'System32');
  }, []);

  // Handle right-click context menu
  const handleContextMenu = useCallback((e: React.MouseEvent, item: FileSystemItem) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  }, []);

  // Handle delete from context menu
  const handleDelete = useCallback((item: FileSystemItem) => {
    const isDrive = item.type === 'drive';
    const isSystemFile = item.isSystemFile === true;
    const isSystem32 = item.name === 'System32' && item.type === 'folder';
    
    // Easter egg: System32 can be "deleted"
    if (isSystem32) {
      showMessage({
        title: 'Confirm Folder Delete',
        message: `Are you sure you want to send 'System32' to the Recycle Bin?`,
        type: 'question',
        buttons: [
          { 
            label: 'Yes', 
            onClick: () => {
              // Second confirmation - this is a critical folder!
              setTimeout(() => {
                showMessage({
                  title: '⚠️ Warning',
                  message: `You are attempting to delete 'System32'.\n\nThis folder contains critical system files required for Windows to function.\n\nAre you REALLY sure you want to do this?`,
                  type: 'warning',
                  buttons: [
                    { 
                      label: 'Yes, Delete It', 
                      onClick: () => {
                        setSystem32InBin(true);
                        showMessage({
                          title: 'Recycle Bin',
                          message: 'System32 has been moved to the Recycle Bin.\n\n...You monster.',
                          type: 'info'
                        });
                      }
                    },
                    { label: 'No, Keep It', primary: true }
                  ]
                });
              }, 100);
            }
          },
          { label: 'No', primary: true }
        ]
      });
    } else if (isDrive) {
      showMessage({
        title: 'Error Deleting File',
        message: `Cannot delete ${item.name}\n\nThis is a system drive and cannot be moved or deleted.`,
        type: 'error'
      });
    } else if (isSystemFile) {
      showMessage({
        title: 'Error Deleting File',
        message: `Cannot delete ${item.name}\n\nAccess is denied. This file is required by Windows and cannot be deleted.`,
        type: 'error'
      });
    } else {
      // For user files, actually delete them
      const file = cDriveFiles.find(f => f.name === item.name);
      if (file) {
        showMessage({
          title: 'Confirm File Delete',
          message: `Are you sure you want to send '${item.name}' to the Recycle Bin?`,
          type: 'question',
          buttons: [
            { label: 'Yes', onClick: () => { /* TODO: delete file */ } },
            { label: 'No', primary: true }
          ]
        });
      } else {
        showMessage({
          title: 'Error Deleting File',
          message: `Cannot delete ${item.name}\n\nThis item cannot be deleted.`,
          type: 'error'
        });
      }
    }
    setContextMenu(null);
  }, [cDriveFiles, showMessage, setSystem32InBin]);

  const currentItems = getCurrentItems();
  
  // Build proper Windows-style path
  const buildAddressPath = (): string => {
    if (currentPath.length === 1) return 'My Computer';
    
    const pathParts: string[] = [];
    for (let i = 1; i < currentPath.length; i++) {
      const item = currentPath[i];
      if (item.type === 'drive') {
        // Extract drive letter: "C (C:)" -> "C:"
        const match = item.name.match(/\(([A-Z]:)\)/);
        pathParts.push(match ? match[1] : item.name);
      } else {
        pathParts.push(item.name);
      }
    }
    return pathParts.join('\\');
  };
  
  const addressBar = buildAddressPath();

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans">
      {/* Menu Bar */}
      <div className="flex gap-4 text-sm border-b border-[#808080] pb-1 px-1">
        {['File', 'Edit', 'View', 'Go', 'Favorites', 'Help'].map(menu => (
          <span key={menu} className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">
            {menu}
          </span>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1 border-b border-[#808080]">
        <RetroButton onClick={navigateBack} disabled={currentPath.length <= 1} className="text-xs px-2">
          ← Back
        </RetroButton>
        <RetroButton onClick={navigateUp} disabled={currentPath.length <= 1} className="text-xs px-2">
          ↑ Up
        </RetroButton>
        <div className="w-[2px] h-6 bg-[#808080]" />
        <RetroButton onClick={() => setView('icons')} active={view === 'icons'} className="text-xs px-2">
          Icons
        </RetroButton>
        <RetroButton onClick={() => setView('list')} active={view === 'list'} className="text-xs px-2">
          List
        </RetroButton>
      </div>

      {/* Address Bar */}
      <div className="flex items-center gap-2 px-2 py-1 border-b border-[#808080]">
        <span className="text-xs font-bold">Address:</span>
        <div className="flex-1 bg-white border-2 border-b-white border-r-white border-t-[#808080] border-l-[#808080] px-2 py-0.5 text-sm">
          {addressBar}
        </div>
      </div>

      {/* Main View */}
      <div 
        className={`flex-1 bg-white overflow-auto p-2 ${isDragOver ? 'bg-blue-100' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {view === 'icons' ? (
          <div className="grid grid-cols-4 gap-4 auto-rows-min">
            {currentItems.map((item, i) => {
              const isDrive = item.type === 'drive';
              const isSystemFile = item.isSystemFile === true;
              const isProtected = isDrive || isSystemFile;
              const isSystem32 = item.name === 'System32' && item.type === 'folder';
              
              const handleDragStart = (e: React.DragEvent) => {
                // Easter egg: System32 can be dragged to recycle bin
                if (isSystem32) {
                  handleSystem32DragStart(e);
                } else if (isProtected) {
                  handleProtectedDragStart(e, item.name, isDrive);
                } else {
                  handleFileDragStart(e, item.name);
                }
              };
              
              return (
                <div
                  key={i}
                  draggable={true}
                  onDragStart={handleDragStart}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                  onClick={() => handleItemClick(item.name)}
                  className={`flex flex-col items-center gap-1 p-2 cursor-pointer ${
                    selectedItem === item.name 
                      ? 'bg-[#000080] text-white' 
                      : 'hover:bg-[#000080]/20 hover:border hover:border-dotted hover:border-[#000080]'
                  }`}
                  onDoubleClick={() => navigateTo(item)}
                >
                  <img src={item.icon} alt={item.name} className="w-12 h-12 pixelated pointer-events-none" draggable={false} />
                  <span className="text-xs text-center break-words max-w-full">{item.name}</span>
                </div>
              );
            })}
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
              {currentItems.map((item, i) => {
                const isDrive = item.type === 'drive';
                const isSystemFile = item.isSystemFile === true;
                const isProtected = isDrive || isSystemFile;
                const isSystem32 = item.name === 'System32' && item.type === 'folder';
                
                const handleDragStart = (e: React.DragEvent) => {
                  // Easter egg: System32 can be dragged to recycle bin
                  if (isSystem32) {
                    handleSystem32DragStart(e);
                  } else if (isProtected) {
                    handleProtectedDragStart(e, item.name, isDrive);
                  } else {
                    handleFileDragStart(e, item.name);
                  }
                };
                
                return (
                  <tr
                    key={i}
                    draggable={true}
                    onDragStart={handleDragStart}
                    onContextMenu={(e) => handleContextMenu(e, item)}
                    onClick={() => handleItemClick(item.name)}
                    className={`cursor-pointer ${
                      selectedItem === item.name 
                        ? 'bg-[#000080] text-white' 
                        : 'hover:bg-[#000080] hover:text-white'
                    }`}
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
                );
              })}
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
        <span className="flex-1" />
        <span className="bevel-in px-2 py-0.5 bg-[#c0c0c0]">
          My Computer
        </span>
      </div>
      
      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={[
            { label: 'Open', onClick: () => { navigateTo(contextMenu.item); setContextMenu(null); } },
            { separator: true },
            { label: 'Delete', onClick: () => handleDelete(contextMenu.item) },
            { separator: true },
            { label: 'Arrange Icons', disabled: true },
            { label: 'Line up Icons', disabled: true },
            { separator: true },
            { label: 'Refresh', onClick: () => setContextMenu(null) },
            { separator: true },
            { label: 'Properties', disabled: true }
          ]}
          onClose={() => setContextMenu(null)}
        />
      )}
      
      {/* Message Box */}
      {MessageBoxComponent}
    </div>
  );
};
