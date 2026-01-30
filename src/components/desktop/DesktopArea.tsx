// ============================================================================
// Desktop Area Component - Main drop zone for files
// ============================================================================

import React, { useCallback, useState, useEffect } from 'react';
import { AppId, Position, ContextMenuItem } from '../../types';
import { DESKTOP_ICONS, APP_ICONS, SYSTEM_ICONS } from '../../config';
import { useFileSystem, useWindowManager } from '../../contexts';
import { DesktopIcon, DRAG_TYPE_FILE, DRAG_TYPE_ICON } from './DesktopIcon';
import { ContextMenu } from '../ui/ContextMenu';
import { useMessageBox } from '../ui/MessageBox';

// Data type for protected items (drives, system files)
const DRAG_TYPE_PROTECTED = 'application/x-webos-protected';

// Grid snapping configuration
const GRID_SIZE = 85; // Grid cell size - bigger to fit icons better
const GRID_OFFSET_X = 16; // Match desktop padding (p-4 = 16px)
const GRID_OFFSET_Y = 16;
const ICON_INSET = 2; // Small inset so icon doesn't touch grid lines
const SHOW_GRID = false; // Set to true to show the grid overlay for debugging

// Snap position to grid
const snapToGrid = (x: number, y: number): Position => {
  // Snap to grid, accounting for offset so icons align properly
  const snappedX = Math.round((x - GRID_OFFSET_X) / GRID_SIZE) * GRID_SIZE + GRID_OFFSET_X + ICON_INSET;
  const snappedY = Math.round((y - GRID_OFFSET_Y) / GRID_SIZE) * GRID_SIZE + GRID_OFFSET_Y + ICON_INSET;
  return {
    x: Math.max(GRID_OFFSET_X + ICON_INSET, snappedX),
    y: Math.max(GRID_OFFSET_Y + ICON_INSET, snappedY),
  };
};

interface DesktopAreaProps {
  onCloseStartMenu: () => void;
}

export const DesktopArea: React.FC<DesktopAreaProps> = ({ onCloseStartMenu }) => {
  const { desktopFiles, recycleBinFiles, moveFile, updateFilePosition, getFile, deleteFile, system32InBin, setSystem32InBin } = useFileSystem();
  const { openWindow } = useWindowManager();
  const { showMessage, MessageBoxComponent } = useMessageBox();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null);
  
  // Track selected icons - can be app IDs or file IDs
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set());
  
  // Get the appropriate recycle bin icon based on whether it has files (including System32)
  const getRecycleBinIcon = useCallback(() => {
    return (recycleBinFiles.length > 0 || system32InBin) ? SYSTEM_ICONS.RECYCLE_BIN_FULL : SYSTEM_ICONS.RECYCLE_BIN_EMPTY;
  }, [recycleBinFiles.length, system32InBin]);
  
  // Track app icon positions (files have their own positions in FileSystemContext)
  const [appIconPositions, setAppIconPositions] = useState<Record<string, Position>>(() => {
    // Initialize app icons in first column
    const positions: Record<string, Position> = {};
    DESKTOP_ICONS.forEach(({ id }, index) => {
      positions[id] = { 
        x: GRID_OFFSET_X + ICON_INSET, 
        y: GRID_OFFSET_Y + ICON_INSET + (index * GRID_SIZE) 
      };
    });
    return positions;
  });

  // Handle icon selection with Ctrl key support for multi-select
  const handleIconSelect = useCallback((iconId: string, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Ctrl+click: toggle selection (add or remove from selection)
      setSelectedIcons(prev => {
        const newSet = new Set(prev);
        if (newSet.has(iconId)) {
          newSet.delete(iconId);
        } else {
          newSet.add(iconId);
        }
        return newSet;
      });
    } else {
      // Regular click: select only this icon
      setSelectedIcons(new Set([iconId]));
    }
  }, []);

  // Handle dropping icons on the desktop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check for protected items first
    const protectedData = e.dataTransfer.getData(DRAG_TYPE_PROTECTED);
    if (protectedData) {
      try {
        const { name, isDrive } = JSON.parse(protectedData);
        if (isDrive) {
          showMessage({
            title: 'Error Moving File',
            message: `Cannot move ${name}\n\nThis is a system drive and cannot be moved or deleted.`,
            type: 'error'
          });
        } else {
          showMessage({
            title: 'Error Moving File',
            message: `Cannot move ${name}\n\nAccess is denied. This file is required by Windows and cannot be moved or deleted.`,
            type: 'error'
          });
        }
        return;
      } catch (err) {
        console.error('Error parsing protected data:', err);
      }
    }
    
    // Try to get file ID or app icon ID from drag data
    const fileId = e.dataTransfer.getData(DRAG_TYPE_FILE);
    const appIconId = e.dataTransfer.getData(DRAG_TYPE_ICON);
    const fallbackId = e.dataTransfer.getData('text/plain');
    
    console.log(`[DesktopArea] Drop received - fileId: ${fileId}, appIconId: ${appIconId}`);
    
    // Calculate drop position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 40; // Center icon
    const y = e.clientY - rect.top - 40;
    
    // Snap to grid for clean desktop layout
    const snappedPosition = snapToGrid(Math.max(0, x), Math.max(0, y));
    
    if (fileId) {
      // Handle file drop
      console.log(`[DesktopArea] Moving file ${fileId} to`, snappedPosition);
      const file = getFile(fileId);
      if (file?.location === 'desktop') {
        updateFilePosition(fileId, snappedPosition);
      } else {
        moveFile(fileId, 'desktop', snappedPosition);
      }
    } else if (appIconId || fallbackId) {
      // Handle app icon drop
      const iconId = appIconId || fallbackId;
      console.log(`[DesktopArea] Moving app icon ${iconId} to`, snappedPosition);
      setAppIconPositions(prev => ({
        ...prev,
        [iconId]: snappedPosition
      }));
    }
  }, [moveFile, updateFilePosition, getFile, showMessage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // Sort/arrange all icons to grid
  const handleSortIcons = useCallback(() => {
    console.log('[DesktopArea] Sorting icons to grid');
    
    // Calculate how many rows fit on screen
    const maxRows = Math.floor((window.innerHeight - 100) / GRID_SIZE);
    let gridIndex = 0;
    
    // Reset app icon positions to first column
    const newAppPositions: Record<string, Position> = {};
    DESKTOP_ICONS.forEach(({ id }) => {
      const col = Math.floor(gridIndex / maxRows);
      const row = gridIndex % maxRows;
      newAppPositions[id] = {
        x: GRID_OFFSET_X + ICON_INSET + (col * GRID_SIZE),
        y: GRID_OFFSET_Y + ICON_INSET + (row * GRID_SIZE)
      };
      gridIndex++;
    });
    setAppIconPositions(newAppPositions);
    
    // Reposition desktop files after app icons
    desktopFiles.forEach((file) => {
      const col = Math.floor(gridIndex / maxRows);
      const row = gridIndex % maxRows;
      const newPosition = {
        x: GRID_OFFSET_X + ICON_INSET + (col * GRID_SIZE),
        y: GRID_OFFSET_Y + ICON_INSET + (row * GRID_SIZE)
      };
      updateFilePosition(file.id, newPosition);
      gridIndex++;
    });
    
    setContextMenu(null);
  }, [desktopFiles, updateFilePosition]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    console.log('[DesktopArea] Context menu triggered at', e.clientX, e.clientY);
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        { label: 'Arrange Icons', onClick: handleSortIcons },
        { label: 'Line up Icons', onClick: handleSortIcons },
        { separator: true },
        { label: 'Refresh', onClick: () => window.location.reload() },
        { separator: true },
        { label: 'New', onClick: () => openWindow(AppId.TEXTCRAFT) },
        { separator: true },
        { label: 'Properties', onClick: () => alert('Desktop Properties') }
      ]
    });
  }, [openWindow, handleSortIcons]);

  const handleClick = useCallback(() => {
    onCloseStartMenu();
    setContextMenu(null);
    // Clear selection when clicking empty desktop area
    setSelectedIcons(new Set());
  }, [onCloseStartMenu]);

  // Arrange icons to grid on initial load
  useEffect(() => {
    handleSortIcons();
  }, []); // Run once on mount

  // Handle double-click on app icon
  const handleAppDoubleClick = useCallback((appId: AppId) => {
    openWindow(appId);
  }, [openWindow]);

  // Handle double-click on file
  const handleFileDoubleClick = useCallback((fileId: string) => {
    const file = getFile(fileId);
    if (!file) return;

    if (file.type === 'image' && file.url) {
      openWindow(AppId.IMAGE_VIEWER, { imageUrl: file.url, fileName: file.name });
    } else if (file.type === 'text') {
      openWindow(AppId.TEXTCRAFT);
    }
  }, [getFile, openWindow]);

  // Handle file drop on Recycle Bin
  const handleRecycleBinDrop = useCallback((fileId: string) => {
    console.log(`[DesktopArea] File dropped on Recycle Bin: ${fileId}`);
    deleteFile(fileId);
  }, [deleteFile]);

  // Handle protected item drop on Recycle Bin
  const handleProtectedRecycleBinDrop = useCallback((name: string, isDrive: boolean) => {
    if (isDrive) {
      showMessage({
        title: 'Error Deleting File',
        message: `Cannot delete ${name}\n\nThis is a system drive and cannot be moved or deleted.`,
        type: 'error'
      });
    } else {
      showMessage({
        title: 'Error Deleting File',
        message: `Cannot delete ${name}\n\nAccess is denied. This file is required by Windows and cannot be deleted.`,
        type: 'error'
      });
    }
  }, [showMessage]);

  // Handle System32 drop on Recycle Bin (Easter egg)
  const handleSystem32RecycleBinDrop = useCallback(() => {
    console.log('[DesktopArea] System32 dropped on Recycle Bin! Easter egg activated.');
    setSystem32InBin(true);
    showMessage({
      title: 'Are you sure?',
      message: `You are attempting to move 'System32' to the Recycle Bin.\n\nThis folder contains critical system files required for Windows to function.\n\nAre you sure you want to do this?`,
      type: 'warning',
      buttons: [
        { 
          label: 'Yes', 
          onClick: () => {
            showMessage({
              title: 'Recycle Bin',
              message: 'System32 has been moved to the Recycle Bin.\n\n...You monster.',
              type: 'info'
            });
            // Open the recycle bin to show them their handiwork
            setTimeout(() => openWindow(AppId.RECYCLE_BIN), 500);
          }
        },
        { 
          label: 'No', 
          primary: true,
          onClick: () => {
            setSystem32InBin(false);
          }
        }
      ]
    });
  }, [showMessage, openWindow]);

  // Handle context menu for file icons
  const handleFileContextMenu = useCallback((e: React.MouseEvent, fileId: string) => {
    const file = getFile(fileId);
    if (!file) return;
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        { label: 'Open', onClick: () => { handleFileDoubleClick(fileId); setContextMenu(null); } },
        { separator: true },
        { label: 'Delete', onClick: () => { deleteFile(fileId); setContextMenu(null); } },
        { separator: true },
        { label: 'Arrange Icons', onClick: handleSortIcons },
        { label: 'Line up Icons', onClick: handleSortIcons },
        { separator: true },
        { label: 'Refresh', onClick: () => window.location.reload() },
        { separator: true },
        { label: 'Properties', disabled: true }
      ]
    });
  }, [getFile, handleFileDoubleClick, deleteFile, handleSortIcons]);

  // Handle context menu for app icons
  const handleAppContextMenu = useCallback((e: React.MouseEvent, appId: AppId) => {
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        { label: 'Open', onClick: () => { openWindow(appId); setContextMenu(null); } },
        { separator: true },
        // Recycle Bin has special options
        ...(appId === AppId.RECYCLE_BIN ? [
          { label: 'Empty Recycle Bin', onClick: () => { 
            if (recycleBinFiles.length > 0) {
              showMessage({
                title: 'Confirm Multiple File Delete',
                message: `Are you sure you want to permanently delete ${recycleBinFiles.length} item(s)?\n\nThis action cannot be undone.`,
                type: 'warning' as const,
                buttons: [
                  { label: 'Yes', onClick: () => { /* emptyRecycleBin(); */ } },
                  { label: 'No', primary: true }
                ]
              });
            }
            setContextMenu(null);
          }},
          { separator: true },
        ] : []),
        { label: 'Arrange Icons', onClick: handleSortIcons },
        { label: 'Line up Icons', onClick: handleSortIcons },
        { separator: true },
        { label: 'Refresh', onClick: () => window.location.reload() },
        { separator: true },
        { label: 'Properties', disabled: true }
      ]
    });
  }, [openWindow, recycleBinFiles.length, showMessage, handleSortIcons]);

  return (
    <div
      className="flex-1 relative p-4 z-0 select-none"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Grid Overlay (for debugging - set SHOW_GRID to false to hide) */}
      {SHOW_GRID && (
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
            backgroundPosition: `${GRID_OFFSET_X}px ${GRID_OFFSET_Y}px`,
          }}
        />
      )}

      {/* Static App Icons - Using positions from state */}
      {DESKTOP_ICONS.map(({ id, label }) => (
        <DesktopIcon
          key={id}
          appId={id}
          label={label}
          icon={id === AppId.RECYCLE_BIN ? getRecycleBinIcon() : APP_ICONS[id]}
          position={appIconPositions[id]}
          isSelected={selectedIcons.has(id)}
          onSelect={(e) => handleIconSelect(id, e)}
          onDoubleClick={() => handleAppDoubleClick(id)}
          onFileDrop={id === AppId.RECYCLE_BIN ? handleRecycleBinDrop : undefined}
          onProtectedDrop={id === AppId.RECYCLE_BIN ? handleProtectedRecycleBinDrop : undefined}
          onSystem32Drop={id === AppId.RECYCLE_BIN ? handleSystem32RecycleBinDrop : undefined}
          onContextMenu={(e) => handleAppContextMenu(e, id)}
        />
      ))}

      {/* File Icons - Positioned Absolutely */}
      {desktopFiles.map(file => (
        <DesktopIcon
          key={file.id}
          fileId={file.id}
          label={file.name}
          icon={file.icon}
          position={file.position}
          isSelected={selectedIcons.has(file.id)}
          onSelect={(e) => handleIconSelect(file.id, e)}
          onDoubleClick={() => handleFileDoubleClick(file.id)}
          onContextMenu={(e) => handleFileContextMenu(e, file.id)}
        />
      ))}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
      
      {/* Message Box */}
      {MessageBoxComponent}
    </div>
  );
};
