// ============================================================================
// File System Context - Manages all file operations
// ============================================================================

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { FileItem, FileLocation, Position } from '../types';
import { ALL_INITIAL_FILES } from '../config';

interface FileSystemContextType {
  // All files in the system
  files: FileItem[];
  
  // Filtered file lists
  desktopFiles: FileItem[];
  floppyFiles: FileItem[];
  cDriveFiles: FileItem[];
  recycleBinFiles: FileItem[];
  
  // Easter egg: System32 in recycle bin
  system32InBin: boolean;
  setSystem32InBin: (value: boolean) => void;
  
  // File operations
  moveFile: (fileId: string, newLocation: FileLocation, position?: Position) => void;
  updateFilePosition: (fileId: string, position: Position) => void;
  deleteFile: (fileId: string) => void;
  restoreFile: (fileId: string, location: FileLocation) => void;
  getFile: (fileId: string) => FileItem | undefined;
  createFile: (file: FileItem) => void;
  emptyRecycleBin: () => void;
  permanentlyDeleteFile: (fileId: string) => void;
}

const FileSystemContext = createContext<FileSystemContextType | null>(null);

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileItem[]>(ALL_INITIAL_FILES);
  // Easter egg: track if System32 is in the recycle bin
  const [system32InBin, setSystem32InBin] = useState(false);

  // Memoized filtered file lists
  const desktopFiles = useMemo(() => files.filter(f => f.location === 'desktop'), [files]);
  const floppyFiles = useMemo(() => files.filter(f => f.location === 'floppy'), [files]);
  const cDriveFiles = useMemo(() => files.filter(f => f.location === 'c-drive'), [files]);
  const recycleBinFiles = useMemo(() => files.filter(f => f.location === 'recycle-bin'), [files]);

  const moveFile = useCallback((fileId: string, newLocation: FileLocation, position?: Position) => {
    console.log(`[FileSystem] Moving file ${fileId} to ${newLocation}`, position);
    setFiles(prev => prev.map(file => {
      if (file.id !== fileId) return file;
      
      return {
        ...file,
        location: newLocation,
        position: newLocation === 'desktop' ? (position || { x: 100, y: 100 }) : undefined,
      };
    }));
  }, []);

  const updateFilePosition = useCallback((fileId: string, position: Position) => {
    console.log(`[FileSystem] Updating position for ${fileId}`, position);
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, position } : file
    ));
  }, []);

  const deleteFile = useCallback((fileId: string) => {
    console.log(`[FileSystem] Moving file ${fileId} to recycle bin`);
    setFiles(prev => prev.map(file =>
      file.id === fileId ? { ...file, location: 'recycle-bin' as FileLocation } : file
    ));
  }, []);

  const restoreFile = useCallback((fileId: string, location: FileLocation) => {
    console.log(`[FileSystem] Restoring file ${fileId} to ${location}`);
    setFiles(prev => prev.map(file =>
      file.id === fileId ? { ...file, location } : file
    ));
  }, []);

  const getFile = useCallback((fileId: string) => {
    return files.find(f => f.id === fileId);
  }, [files]);

  const createFile = useCallback((file: FileItem) => {
    console.log(`[FileSystem] Creating new file`, file);
    setFiles(prev => [...prev, file]);
  }, []);

  const emptyRecycleBin = useCallback(() => {
    console.log(`[FileSystem] Emptying recycle bin`);
    setFiles(prev => prev.filter(file => file.location !== 'recycle-bin'));
  }, []);

  const permanentlyDeleteFile = useCallback((fileId: string) => {
    console.log(`[FileSystem] Permanently deleting file ${fileId}`);
    setFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  const value = useMemo(() => ({
    files,
    desktopFiles,
    floppyFiles,
    cDriveFiles,
    recycleBinFiles,
    system32InBin,
    setSystem32InBin,
    moveFile,
    updateFilePosition,
    deleteFile,
    restoreFile,
    getFile,
    createFile,
    emptyRecycleBin,
    permanentlyDeleteFile,
  }), [files, desktopFiles, floppyFiles, cDriveFiles, recycleBinFiles, system32InBin, moveFile, updateFilePosition, deleteFile, restoreFile, getFile, createFile, emptyRecycleBin, permanentlyDeleteFile]);

  return (
    <FileSystemContext.Provider value={value}>
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
};
