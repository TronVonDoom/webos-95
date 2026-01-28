export enum AppId {
  PIXEL_ART = 'PIXEL_ART',
  TRIVIA = 'TRIVIA',
  WEB_BROWSER = 'WEB_BROWSER',
  REGISTER = 'REGISTER',
  ABOUT = 'ABOUT',
  USB_DRIVE = 'USB_DRIVE',
  FILE_TRANSFER = 'FILE_TRANSFER',
  MINESWEEPER = 'MINESWEEPER',
  TEXTCRAFT = 'TEXTCRAFT',
  MEDIA_PLAYER = 'MEDIA_PLAYER',
  MY_COMPUTER = 'MY_COMPUTER',
  RECYCLE_BIN = 'RECYCLE_BIN',
  IMAGE_VIEWER = 'IMAGE_VIEWER',
}

export interface FileItem {
  id: string;
  name: string;
  type: 'image' | 'text' | 'system';
  icon: string;
  content?: string;
  url?: string;
}

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  icon: string;
  position: { x: number; y: number };
  resizable?: boolean;
}

export interface TriviaQuestion {
  question: string;
  options: string[];
  answer: string;
  fact: string;
}

export interface TriviaState {
  score: number;
  currentQuestion: TriviaQuestion | null;
  loading: boolean;
  gameOver: boolean;
  message: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}