// ============================================================================
// Recycle Bin Component - Shows deleted files with restore/delete options
// ============================================================================

import React, { useState, useCallback } from 'react';
import { useFileSystem, useSystem } from '../../contexts';
import { SYSTEM_ICONS } from '../../config';
import { RetroButton } from '../ui/RetroButton';
import { useMessageBox } from '../ui/MessageBox';
import { DRAG_TYPE_FILE } from '../desktop/DesktopIcon';

// Data type for protected items (drives, system files)
const DRAG_TYPE_PROTECTED = 'application/x-webos-protected';
// Special drag type for System32 easter egg
const DRAG_TYPE_SYSTEM32 = 'application/x-webos-system32';

export const RecycleBin: React.FC = () => {
  const { recycleBinFiles, restoreFile, permanentlyDeleteFile, emptyRecycleBin, deleteFile, system32InBin, setSystem32InBin } = useFileSystem();
  const { triggerSystemCrash } = useSystem();
  const { showMessage, MessageBoxComponent } = useMessageBox();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [view, setView] = useState<'icons' | 'list'>('icons');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleRestore = useCallback(() => {
    if (selectedFile) {
      // Check if restoring System32
      if (selectedFile === 'system32-folder') {
        setSystem32InBin(false);
        setSelectedFile(null);
        showMessage({ 
          title: 'Recycle Bin', 
          message: 'System32 has been restored.\n\nYour computer thanks you for your mercy.', 
          type: 'info' 
        });
        return;
      }
      restoreFile(selectedFile, 'desktop');
      setSelectedFile(null);
      showMessage({ title: 'Recycle Bin', message: 'File restored to Desktop.', type: 'info' });
    }
  }, [selectedFile, restoreFile, showMessage]);

  const handleDelete = useCallback(() => {
    if (selectedFile) {
      // Special handling for System32
      if (selectedFile === 'system32-folder') {
        showMessage({
          title: '⚠️ CRITICAL SYSTEM WARNING ⚠️',
          message: `You are about to permanently delete System32!\n\nThis folder contains essential Windows system files. Deleting it will cause your computer to become completely unusable.\n\nAre you ABSOLUTELY SURE you want to do this?`,
          type: 'error',
          buttons: [
            { 
              label: 'Yes, Delete It', 
              onClick: () => {
                // Second confirmation
                setTimeout(() => {
                  showMessage({
                    title: '🚨 LAST WARNING 🚨',
                    message: `REALLY? You REALLY want to delete System32?\n\nThis is like removing the brain from a computer. There's no going back. Your OS will literally stop working.\n\nAre you REALLY, REALLY sure?`,
                    type: 'error',
                    buttons: [
                      {
                        label: 'I\'m Really Sure',
                        onClick: () => {
                          // Final confirmation
                          setTimeout(() => {
                            showMessage({
                              title: '💀 POINT OF NO RETURN 💀',
                              message: `Okay, this is it. Final chance.\n\nYou're about to break everything. Like, EVERYTHING everything.\n\nDon't say we didn't warn you...\n\nReally, REALLY, REALLY sure?`,
                              type: 'error',
                              buttons: [
                                {
                                  label: 'DO IT!',
                                  onClick: () => {
                                    setSystem32InBin(false);
                                    setSelectedFile(null);
                                    // Trigger the crash!
                                    setTimeout(() => {
                                      triggerSystemCrash();
                                    }, 500);
                                  }
                                },
                                { label: 'Okay, maybe not...', primary: true }
                              ]
                            });
                          }, 100);
                        }
                      },
                      { label: 'No, I was just kidding', primary: true }
                    ]
                  });
                }, 100);
              }
            },
            { label: 'No, Keep It!', primary: true }
          ]
        });
        return;
      }
      
      const file = recycleBinFiles.find(f => f.id === selectedFile);
      if (file) {
        showMessage({
          title: 'Confirm File Delete',
          message: `Are you sure you want to permanently delete '${file.name}'?\n\nThis action cannot be undone.`,
          type: 'warning',
          buttons: [
            { label: 'Yes', onClick: () => { permanentlyDeleteFile(selectedFile); setSelectedFile(null); } },
            { label: 'No', primary: true }
          ]
        });
      }
    }
  }, [selectedFile, recycleBinFiles, permanentlyDeleteFile, showMessage, triggerSystemCrash]);

  const handleEmptyBin = useCallback(() => {
    const totalItems = recycleBinFiles.length + (system32InBin ? 1 : 0);
    
    if (totalItems === 0) {
      showMessage({ title: 'Recycle Bin', message: 'The Recycle Bin is already empty.', type: 'info' });
      return;
    }
    
    // Special handling if System32 is in the bin
    if (system32InBin) {
      showMessage({
        title: '⚠️ CRITICAL SYSTEM WARNING ⚠️',
        message: `You are about to permanently delete ${totalItems} item(s), including SYSTEM32!\n\nThis folder contains essential Windows system files. Deleting it will cause catastrophic system failure.\n\nAre you SURE you want to empty the Recycle Bin?`,
        type: 'error',
        buttons: [
          { 
            label: 'Yes, Empty It', 
            onClick: () => {
              setTimeout(() => {
                showMessage({
                  title: '🚨 SERIOUSLY?! 🚨',
                  message: `Wait, you actually clicked yes?\n\nLet me be clear: deleting System32 will literally break Windows. Your desktop will disappear. Programs will stop working. Cats and dogs will start living together. Mass hysteria!\n\nAre you REALLY sure?`,
                  type: 'error',
                  buttons: [
                    {
                      label: 'Yes, I\'m Sure!',
                      onClick: () => {
                        setTimeout(() => {
                          showMessage({
                            title: '💀 FINAL WARNING 💀',
                            message: `Okay, I give up trying to stop you.\n\nJust know that IT will probably yell at you, your computer will make that sad noise, and you'll be telling this story at parties for years.\n\n"Remember that time I deleted System32?"\n\nLast chance to back out...`,
                            type: 'error',
                            buttons: [
                              {
                                label: 'YOLO! Delete Everything!',
                                onClick: () => {
                                  emptyRecycleBin();
                                  setSelectedFile(null);
                                  setSystem32InBin(false);
                                  // Trigger the crash!
                                  setTimeout(() => {
                                    triggerSystemCrash();
                                  }, 500);
                                }
                              },
                              { label: 'Fine, I\'ll keep it...', primary: true }
                            ]
                          });
                        }, 100);
                      }
                    },
                    { label: 'On second thought...', primary: true }
                  ]
                });
              }, 100);
            }
          },
          { label: 'No, Cancel', primary: true }
        ]
      });
      return;
    }
    
    showMessage({
      title: 'Confirm Multiple File Delete',
      message: `Are you sure you want to permanently delete ${recycleBinFiles.length} item(s)?\n\nThis action cannot be undone.`,
      type: 'warning',
      buttons: [
        { label: 'Yes', onClick: () => { emptyRecycleBin(); setSelectedFile(null); } },
        { label: 'No', primary: true }
      ]
    });
  }, [recycleBinFiles, emptyRecycleBin, showMessage, system32InBin, triggerSystemCrash]);

  const handleFileClick = useCallback((fileId: string) => {
    setSelectedFile(fileId);
  }, []);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    // Check for System32 easter egg first
    const system32Data = e.dataTransfer.getData(DRAG_TYPE_SYSTEM32);
    if (system32Data) {
      console.log('[RecycleBin] System32 dropped! Easter egg activated.');
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
      return;
    }
    
    // Check for protected items
    const protectedData = e.dataTransfer.getData(DRAG_TYPE_PROTECTED);
    if (protectedData) {
      try {
        const { name, isDrive } = JSON.parse(protectedData);
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
        return;
      } catch (err) {
        console.error('Error parsing protected data:', err);
      }
    }
    
    // Handle regular file drop
    const fileId = e.dataTransfer.getData(DRAG_TYPE_FILE);
    if (fileId) {
      console.log(`[RecycleBin] File dropped: ${fileId}`);
      deleteFile(fileId);
    }
  }, [deleteFile, showMessage]);

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans">
      {/* Menu Bar */}
      <div className="flex gap-4 text-sm border-b border-[#808080] pb-1 px-1">
        {['File', 'Edit', 'View', 'Help'].map(menu => (
          <span key={menu} className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">
            {menu}
          </span>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1 border-b border-[#808080]">
        <RetroButton 
          onClick={handleEmptyBin} 
          className="text-xs px-2"
          disabled={recycleBinFiles.length === 0 && !system32InBin}
        >
          Empty Recycle Bin
        </RetroButton>
        <div className="w-[2px] h-6 bg-[#808080]" />
        <RetroButton 
          onClick={handleRestore} 
          disabled={!selectedFile}
          className="text-xs px-2"
        >
          Restore
        </RetroButton>
        <RetroButton 
          onClick={handleDelete} 
          disabled={!selectedFile}
          className="text-xs px-2"
        >
          Delete
        </RetroButton>
        <div className="w-[2px] h-6 bg-[#808080]" />
        <RetroButton onClick={() => setView('icons')} active={view === 'icons'} className="text-xs px-2">
          Icons
        </RetroButton>
        <RetroButton onClick={() => setView('list')} active={view === 'list'} className="text-xs px-2">
          List
        </RetroButton>
      </div>

      {/* Main View - Drop Zone */}
      <div 
        className={`flex-1 bg-white overflow-auto p-2 ${isDragOver ? 'bg-blue-100 border-2 border-dashed border-blue-400' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {view === 'icons' ? (
          <div className="grid grid-cols-4 gap-4 auto-rows-min">
            {/* System32 easter egg folder */}
            {system32InBin && (
              <div
                className={`flex flex-col items-center gap-1 p-2 cursor-pointer ${
                  selectedFile === 'system32-folder' 
                    ? 'bg-[#000080] text-white' 
                    : 'hover:bg-[#000080]/20 hover:border hover:border-dotted hover:border-[#000080]'
                }`}
                onClick={() => handleFileClick('system32-folder')}
                onDoubleClick={handleRestore}
              >
                <img src={SYSTEM_ICONS.FOLDER} alt="System32" className="w-12 h-12 pixelated pointer-events-none" draggable={false} />
                <span className="text-xs text-center break-words max-w-full">System32</span>
              </div>
            )}
            {recycleBinFiles.map((file) => (
              <div
                key={file.id}
                className={`flex flex-col items-center gap-1 p-2 cursor-pointer ${
                  selectedFile === file.id 
                    ? 'bg-[#000080] text-white' 
                    : 'hover:bg-[#000080]/20 hover:border hover:border-dotted hover:border-[#000080]'
                }`}
                onClick={() => handleFileClick(file.id)}
                onDoubleClick={handleRestore}
              >
                <img src={file.icon} alt={file.name} className="w-12 h-12 pixelated pointer-events-none" draggable={false} />
                <span className="text-xs text-center break-words max-w-full">{file.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#c0c0c0] border-b border-[#808080]">
                <th className="text-left p-1 font-normal">Name</th>
                <th className="text-left p-1 font-normal">Original Location</th>
                <th className="text-left p-1 font-normal">Type</th>
              </tr>
            </thead>
            <tbody>
              {/* System32 easter egg folder */}
              {system32InBin && (
                <tr
                  className={`cursor-pointer ${
                    selectedFile === 'system32-folder' 
                      ? 'bg-[#000080] text-white' 
                      : 'hover:bg-[#000080] hover:text-white'
                  }`}
                  onClick={() => handleFileClick('system32-folder')}
                  onDoubleClick={handleRestore}
                >
                  <td className="p-1 flex items-center gap-2">
                    <img src={SYSTEM_ICONS.FOLDER} alt="" className="w-4 h-4 pixelated" />
                    System32
                  </td>
                  <td className="p-1">C:\Windows</td>
                  <td className="p-1">System Folder</td>
                </tr>
              )}
              {recycleBinFiles.map((file) => (
                <tr
                  key={file.id}
                  className={`cursor-pointer ${
                    selectedFile === file.id 
                      ? 'bg-[#000080] text-white' 
                      : 'hover:bg-[#000080] hover:text-white'
                  }`}
                  onClick={() => handleFileClick(file.id)}
                  onDoubleClick={handleRestore}
                >
                  <td className="p-1 flex items-center gap-2">
                    <img src={file.icon} alt="" className="w-4 h-4 pixelated" />
                    {file.name}
                  </td>
                  <td className="p-1">Desktop</td>
                  <td className="p-1">{file.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {recycleBinFiles.length === 0 && !system32InBin && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <img src={SYSTEM_ICONS.RECYCLE_BIN_EMPTY} alt="Empty" className="w-16 h-16 mb-4 opacity-50" />
            <p>The Recycle Bin is empty.</p>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#c0c0c0] border-t-2 border-white flex items-center px-2 text-xs gap-4">
        <span className="bevel-in px-2 py-0.5 bg-[#c0c0c0]">
          {recycleBinFiles.length + (system32InBin ? 1 : 0)} object(s)
        </span>
        <span className="flex-1" />
        <span className="bevel-in px-2 py-0.5 bg-[#c0c0c0]">
          Recycle Bin
        </span>
      </div>
      
      {/* Message Box */}
      {MessageBoxComponent}
    </div>
  );
};
