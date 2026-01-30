// ============================================================================
// WebOS-95 Initial Data Configuration
// ============================================================================

import { AppId, WindowState, FileItem } from '../types';
import { APP_ICONS, FILE_ICONS } from './icons';

/**
 * Initial window configurations
 */
export const INITIAL_WINDOWS: Record<AppId, WindowState> = {
  [AppId.PIXEL_ART]: {
    id: AppId.PIXEL_ART,
    title: 'Pixel Studio 95',
    isOpen: false,
    isMinimized: false,
    zIndex: 2,
    icon: APP_ICONS[AppId.PIXEL_ART],
    position: { x: 100, y: 100 },
    resizable: true,
  },
  [AppId.TRIVIA]: {
    id: AppId.TRIVIA,
    title: 'Nostalgia Trivia',
    isOpen: false,
    isMinimized: false,
    zIndex: 3,
    icon: APP_ICONS[AppId.TRIVIA],
    position: { x: 150, y: 150 },
    resizable: true,
  },
  [AppId.WEB_BROWSER]: {
    id: AppId.WEB_BROWSER,
    title: 'NetWorld Navigator',
    isOpen: false,
    isMinimized: false,
    zIndex: 4,
    icon: APP_ICONS[AppId.WEB_BROWSER],
    position: { x: 80, y: 80 },
    resizable: true,
  },
  [AppId.REGISTER]: {
    id: AppId.REGISTER,
    title: 'Register RetroWave OS',
    isOpen: false,
    isMinimized: false,
    zIndex: 5,
    icon: APP_ICONS[AppId.REGISTER],
    position: { x: 250, y: 150 },
    resizable: false,
  },
  [AppId.ABOUT]: {
    id: AppId.ABOUT,
    title: 'About RetroWave OS',
    isOpen: false,
    isMinimized: false,
    zIndex: 6,
    icon: APP_ICONS[AppId.ABOUT],
    position: { x: 200, y: 200 },
    resizable: false,
  },
  [AppId.FLOPPY_DRIVE]: {
    id: AppId.FLOPPY_DRIVE,
    title: '3½ Floppy (A:)',
    isOpen: false,
    isMinimized: false,
    zIndex: 7,
    icon: APP_ICONS[AppId.FLOPPY_DRIVE],
    position: { x: 300, y: 100 },
    resizable: true,
  },
  [AppId.FILE_TRANSFER]: {
    id: AppId.FILE_TRANSFER,
    title: '0.49% of cc32e47.exe Completed',
    isOpen: false,
    isMinimized: false,
    zIndex: 100,
    icon: APP_ICONS[AppId.FILE_TRANSFER],
    position: { x: 350, y: 250 },
    resizable: false,
  },
  [AppId.MINESWEEPER]: {
    id: AppId.MINESWEEPER,
    title: 'Minesweeper',
    isOpen: false,
    isMinimized: false,
    zIndex: 8,
    icon: APP_ICONS[AppId.MINESWEEPER],
    position: { x: 120, y: 120 },
    resizable: true,
  },
  [AppId.TEXTCRAFT]: {
    id: AppId.TEXTCRAFT,
    title: 'TextCraft - Untitled',
    isOpen: false,
    isMinimized: false,
    zIndex: 9,
    icon: APP_ICONS[AppId.TEXTCRAFT],
    position: { x: 140, y: 140 },
    resizable: true,
  },
  [AppId.MEDIA_PLAYER]: {
    id: AppId.MEDIA_PLAYER,
    title: 'Media Player',
    isOpen: false,
    isMinimized: false,
    zIndex: 10,
    icon: APP_ICONS[AppId.MEDIA_PLAYER],
    position: { x: 160, y: 160 },
    resizable: true,
  },
  [AppId.MY_COMPUTER]: {
    id: AppId.MY_COMPUTER,
    title: 'My Computer',
    isOpen: false,
    isMinimized: false,
    zIndex: 11,
    icon: APP_ICONS[AppId.MY_COMPUTER],
    position: { x: 50, y: 50 },
    resizable: true,
  },
  [AppId.RECYCLE_BIN]: {
    id: AppId.RECYCLE_BIN,
    title: 'Recycle Bin',
    isOpen: false,
    isMinimized: false,
    zIndex: 12,
    icon: APP_ICONS[AppId.RECYCLE_BIN],
    position: { x: 180, y: 180 },
    resizable: true,
  },
  [AppId.IMAGE_VIEWER]: {
    id: AppId.IMAGE_VIEWER,
    title: 'Image Viewer',
    isOpen: false,
    isMinimized: false,
    zIndex: 13,
    icon: APP_ICONS[AppId.IMAGE_VIEWER],
    position: { x: 200, y: 100 },
    resizable: true,
  },
};

/**
 * Initial files on the desktop
 */
export const INITIAL_DESKTOP_FILES: FileItem[] = [
  {
    id: 'magical_nedrysaurus',
    name: 'Magical Nedrysaurus.gif',
    type: 'image',
    icon: FILE_ICONS.BMP,
    url: 'https://youtu.be/fmz-K2hLwSI',
    position: { x: 100, y: 300 },
    location: 'desktop',
  },
];

/**
 * Initial files on floppy drive (A:)
 */
export const INITIAL_FLOPPY_FILES: FileItem[] = [
  {
    id: 'troll_face',
    name: 'cool_pic.jpg',
    type: 'image',
    icon: FILE_ICONS.BMP,
    location: 'floppy',
  },
  {
    id: 'readme',
    name: 'README.TXT',
    type: 'text',
    icon: FILE_ICONS.TXT,
    content: 'Welcome to RetroWave OS 95!\n\nThis is a nostalgic trip back to 1995.',
    location: 'floppy',
  },
];

/**
 * Initial files on C: drive
 */
export const INITIAL_C_DRIVE_FILES: FileItem[] = [
  {
    id: 'autoexec',
    name: 'AUTOEXEC.BAT',
    type: 'text',
    icon: FILE_ICONS.TXT,
    content: '@ECHO OFF\nPATH C:\\WINDOWS;C:\\DOS',
    location: 'c-drive',
  },
  {
    id: 'config',
    name: 'CONFIG.SYS',
    type: 'text',
    icon: FILE_ICONS.TXT,
    content: 'FILES=30\nBUFFERS=20',
    location: 'c-drive',
  },
];

/**
 * All initial files combined
 */
export const ALL_INITIAL_FILES: FileItem[] = [
  ...INITIAL_DESKTOP_FILES,
  ...INITIAL_FLOPPY_FILES,
  ...INITIAL_C_DRIVE_FILES,
];

/**
 * Desktop icons (static, non-file icons)
 */
export const DESKTOP_ICONS = [
  { id: AppId.MY_COMPUTER, label: 'My Computer' },
  { id: AppId.RECYCLE_BIN, label: 'Recycle Bin' },
  { id: AppId.WEB_BROWSER, label: 'The Web' },
  { id: AppId.TEXTCRAFT, label: 'TextCraft' },
  { id: AppId.MEDIA_PLAYER, label: 'Media Player' },
] as const;

/**
 * Screensaver timeout in milliseconds (2 minutes)
 */
export const SCREENSAVER_TIMEOUT = 120000;

/**
 * Boot audio URL
 */
export const BOOT_AUDIO_URL = 'https://cdn.pixabay.com/audio/2022/02/07/audio_4c00022a75.mp3';
