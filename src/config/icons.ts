// ============================================================================
// WebOS-95 Icon Constants
// ============================================================================

import { AppId } from '../types';

/**
 * Base URL for Windows 98 icons
 */
const ICON_BASE = 'https://win98icons.alexmeub.com/icons/png';

/**
 * Application icons mapping
 */
export const APP_ICONS: Record<AppId, string> = {
  [AppId.PIXEL_ART]: `${ICON_BASE}/paint_file-2.png`,
  [AppId.TRIVIA]: `${ICON_BASE}/game_solitaire-1.png`,
  [AppId.WEB_BROWSER]: `${ICON_BASE}/world-0.png`,
  [AppId.REGISTER]: `${ICON_BASE}/key_win-0.png`,
  [AppId.ABOUT]: `${ICON_BASE}/help_question_mark-0.png`,
  [AppId.FLOPPY_DRIVE]: `${ICON_BASE}/floppy_drive_3_5_cool-0.png`,
  [AppId.FILE_TRANSFER]: `${ICON_BASE}/file_copy-0.png`,
  [AppId.MINESWEEPER]: `${ICON_BASE}/minesweeper-1.png`,
  [AppId.TEXTCRAFT]: `${ICON_BASE}/notepad-3.png`,
  [AppId.MEDIA_PLAYER]: `${ICON_BASE}/cd_audio_cd-0.png`,
  [AppId.MY_COMPUTER]: `${ICON_BASE}/computer-1.png`,
  [AppId.RECYCLE_BIN]: `${ICON_BASE}/recycle_bin_full-2.png`,
  [AppId.IMAGE_VIEWER]: `${ICON_BASE}/paint_file-0.png`,
};

/**
 * System icons
 */
export const SYSTEM_ICONS = {
  START: `${ICON_BASE}/windows-0.png`,
  FOLDER: `${ICON_BASE}/directory_closed-0.png`,
  FOLDER_OPEN: `${ICON_BASE}/directory_open-2.png`,
  FOLDER_PROGRAMS: `${ICON_BASE}/directory_open_cool-0.png`,
  FOLDER_WINDOWS: `${ICON_BASE}/directory_explorer-0.png`,
  FOLDER_FONTS: `${ICON_BASE}/directory_fonts-0.png`,
  FOLDER_COOL: `${ICON_BASE}/directory_closed_cool-4.png`,
  HARD_DRIVE: `${ICON_BASE}/hard_disk_drive-0.png`,
  CD_DRIVE: `${ICON_BASE}/cd_drive-0.png`,
  SEARCH: `${ICON_BASE}/magnifying_glass-0.png`,
  HELP: `${ICON_BASE}/help_book_small-0.png`,
  SHUTDOWN: `${ICON_BASE}/shut_down_with_computer-0.png`,
  SOUND_ON: `${ICON_BASE}/loudspeaker_rays-0.png`,
  SOUND_OFF: `${ICON_BASE}/loudspeaker_muted-0.png`,
  RECYCLE_BIN_EMPTY: `${ICON_BASE}/recycle_bin_empty-0.png`,
  RECYCLE_BIN_FULL: `${ICON_BASE}/recycle_bin_full-0.png`,
};

/**
 * File type icons
 */
export const FILE_ICONS = {
  BMP: `${ICON_BASE}/paint_file-0.png`,
  TXT: `${ICON_BASE}/notepad_file-0.png`,
  DOC: `${ICON_BASE}/write_wordpad-0.png`,
  EXE: `${ICON_BASE}/application_hourglass-0.png`,
  DLL: `${ICON_BASE}/file_windows-0.png`,
  SYS: `${ICON_BASE}/settings_gear-0.png`,
  INI: `${ICON_BASE}/file_lines-0.png`,
  TTF: `${ICON_BASE}/charmap-0.png`,
  DAT: `${ICON_BASE}/file_lines-0.png`,
  LOG: `${ICON_BASE}/notepad_file-0.png`,
  DEFAULT: `${ICON_BASE}/file_question-0.png`,
};

/**
 * Get icon for file extension
 */
export function getFileIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'bmp':
    case 'gif':
    case 'jpg':
    case 'jpeg':
    case 'png':
      return FILE_ICONS.BMP;
    case 'txt':
    case 'bat':
      return FILE_ICONS.TXT;
    case 'sys':
    case 'drv':
    case 'vxd':
      return FILE_ICONS.SYS;
    case 'ini':
    case 'inf':
    case 'cfg':
      return FILE_ICONS.INI;
    case 'doc':
    case 'rtf':
      return FILE_ICONS.DOC;
    case 'exe':
    case 'com':
      return FILE_ICONS.EXE;
    case 'dll':
    case 'ocx':
    case 'cpl':
      return FILE_ICONS.DLL;
    case 'ttf':
    case 'fon':
    case 'fot':
      return FILE_ICONS.TTF;
    case 'dat':
    case 'log':
      return FILE_ICONS.DAT;
    default:
      return FILE_ICONS.DEFAULT;
  }
}
