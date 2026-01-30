// ============================================================================
// WebOS-95 Type Definitions
// ============================================================================

/**
 * Application identifiers for all available apps
 */
export enum AppId {
  PIXEL_ART = 'PIXEL_ART',
  TRIVIA = 'TRIVIA',
  WEB_BROWSER = 'WEB_BROWSER',
  REGISTER = 'REGISTER',
  ABOUT = 'ABOUT',
  FLOPPY_DRIVE = 'FLOPPY_DRIVE',
  FILE_TRANSFER = 'FILE_TRANSFER',
  MINESWEEPER = 'MINESWEEPER',
  TEXTCRAFT = 'TEXTCRAFT',
  MEDIA_PLAYER = 'MEDIA_PLAYER',
  MY_COMPUTER = 'MY_COMPUTER',
  RECYCLE_BIN = 'RECYCLE_BIN',
  IMAGE_VIEWER = 'IMAGE_VIEWER',
  JURASSIC_TERMINAL = 'JURASSIC_TERMINAL',
}

/**
 * File location types
 */
export type FileLocation = 'desktop' | 'floppy' | 'c-drive' | 'recycle-bin';

/**
 * File type categories
 */
export type FileType = 'image' | 'text' | 'system' | 'executable';

/**
 * Position coordinates
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * File item in the file system
 */
export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  icon: string;
  content?: string;
  url?: string;
  position?: Position;
  location: FileLocation;
}

/**
 * Window state for each application
 */
export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  icon: string;
  position: Position;
  size?: { width: number; height: number };
  resizable?: boolean;
  data?: Record<string, unknown>; // Optional data passed to the window
}

/**
 * Context menu item
 */
export interface ContextMenuItem {
  label?: string;
  icon?: string;
  onClick?: () => void;
  separator?: boolean;
  disabled?: boolean;
}

/**
 * Context menu state
 */
export interface ContextMenuState {
  x: number;
  y: number;
  items: ContextMenuItem[];
}

/**
 * System state for boot process
 */
export interface SystemState {
  soundEnabled: boolean;
  soundPromptShown: boolean;
  showBios: boolean;
  showBlackScreen: boolean;
  hasBooted: boolean;
  showScreensaver: boolean;
  lastActivity: number;
}

/**
 * Trivia question interface
 */
export interface TriviaQuestion {
  question: string;
  options: string[];
  answer: string;
  fact: string;
}

/**
 * Trivia game state
 */
export interface TriviaState {
  score: number;
  currentQuestion: TriviaQuestion | null;
  loading: boolean;
  gameOver: boolean;
  message: string;
}

/**
 * Chat message interface
 */
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

/**
 * File system item for My Computer navigation
 */
export interface FileSystemItem {
  name: string;
  type: 'folder' | 'file' | 'drive';
  icon: string;
  size?: string;
  modified?: string;
  items?: FileSystemItem[];
  isDriveRoot?: boolean;
  isSystemFile?: boolean;
  isJurassicTerminal?: boolean; // Easter egg - opens Jurassic Park security terminal
}

/**
 * Drag data for file transfers
 */
export interface DragData {
  type: 'file' | 'icon';
  id: string;
  sourceLocation?: FileLocation;
}
