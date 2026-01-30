// ============================================================================
// Placeholder App Components
// These are simplified versions - copy full implementations from original project
// ============================================================================

import React from 'react';
import { RetroButton } from '../ui/RetroButton';

// Notepad / TextCraft
export const Notepad: React.FC = () => {
  const [content, setContent] = React.useState('');
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-4 text-sm border-b border-[#808080] pb-1 px-1 bg-[#c0c0c0]">
        <span className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">File</span>
        <span className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">Edit</span>
        <span className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">Format</span>
        <span className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">Help</span>
      </div>
      <textarea
        className="flex-1 w-full p-2 font-mono text-sm resize-none border-none outline-none bg-white"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type here..."
      />
    </div>
  );
};

// Image Viewer
interface ImageViewerProps {
  imageUrl?: string;
  fileName?: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, fileName }) => {
  if (!imageUrl) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No image selected
      </div>
    );
  }

  // Check if it's a video file
  const isVideo = imageUrl.endsWith('.mp4') || imageUrl.endsWith('.webm') || imageUrl.endsWith('.ogg');
  
  if (isVideo) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-white">
        <video
          className="w-full h-full object-contain"
          src={imageUrl}
          autoPlay
          loop
          muted={false}
          playsInline
        />
      </div>
    );
  }

  // Check if it's a YouTube URL (including Shorts)
  const isYouTube = imageUrl.includes('youtu');
  const isShorts = imageUrl.includes('/shorts/');
  
  if (isYouTube) {
    // Extract video ID from various YouTube URL formats
    let videoId = '';
    if (isShorts) {
      // Format: youtube.com/shorts/VIDEO_ID
      videoId = imageUrl.split('/shorts/')[1]?.split('?')[0] || '';
    } else if (imageUrl.includes('youtu.be/')) {
      // Format: youtu.be/VIDEO_ID
      videoId = imageUrl.split('youtu.be/')[1]?.split('?')[0] || '';
    } else {
      // Format: youtube.com/watch?v=VIDEO_ID
      videoId = imageUrl.split('v=')[1]?.split('&')[0] || imageUrl.split('/').pop()?.split('?')[0] || '';
    }
    
    return (
      <div className="h-full w-full flex items-center justify-center bg-black">
        <iframe
          className="w-full h-full"
          style={{ aspectRatio: '1/1', objectFit: 'cover' }}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center bg-gray-100 overflow-auto">
      <img src={imageUrl} alt={fileName} className="max-w-full max-h-full object-contain" />
    </div>
  );
};

// Pixel Studio placeholder
export const PixelStudio: React.FC = () => (
  <div className="h-full flex items-center justify-center bg-[#c0c0c0]">
    <p className="text-center">Pixel Studio 95<br/><span className="text-sm text-gray-600">Coming soon...</span></p>
  </div>
);

// Trivia placeholder
export const Trivia: React.FC = () => (
  <div className="h-full flex items-center justify-center bg-[#c0c0c0]">
    <p className="text-center">Nostalgia Trivia<br/><span className="text-sm text-gray-600">Coming soon...</span></p>
  </div>
);

// Web Browser placeholder
export const WebBrowser: React.FC = () => (
  <div className="h-full flex items-center justify-center bg-white">
    <p className="text-center">NetWorld Navigator<br/><span className="text-sm text-gray-600">Coming soon...</span></p>
  </div>
);

// Register placeholder
export const Register: React.FC = () => (
  <div className="h-full flex flex-col items-center justify-center gap-4 bg-[#c0c0c0] p-4">
    <h2 className="text-lg font-bold">Register RetroWave OS</h2>
    <p className="text-sm text-center">Thank you for trying RetroWave OS 95!</p>
    <RetroButton>Register Now</RetroButton>
  </div>
);

// Minesweeper - Full implementation
type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

type Difficulty = 'beginner' | 'intermediate' | 'expert';

const DIFFICULTIES = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 }
};

export const Minesweeper: React.FC = () => {
  const [difficulty, setDifficulty] = React.useState<Difficulty>('beginner');
  const [grid, setGrid] = React.useState<Cell[][]>([]);
  const [gameState, setGameState] = React.useState<'playing' | 'won' | 'lost'>('playing');
  const [flagCount, setFlagCount] = React.useState(0);
  const [timer, setTimer] = React.useState(0);
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);
  const [firstClick, setFirstClick] = React.useState(true);

  const config = DIFFICULTIES[difficulty];

  // Timer effect
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && gameState === 'playing') {
      interval = setInterval(() => {
        setTimer(t => Math.min(t + 1, 999));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameState]);

  // Initialize game
  React.useEffect(() => {
    initializeGame();
  }, [difficulty]);

  const initializeGame = () => {
    const newGrid: Cell[][] = [];
    for (let i = 0; i < config.rows; i++) {
      newGrid[i] = [];
      for (let j = 0; j < config.cols; j++) {
        newGrid[i][j] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0
        };
      }
    }
    setGrid(newGrid);
    setGameState('playing');
    setFlagCount(0);
    setTimer(0);
    setIsTimerRunning(false);
    setFirstClick(true);
  };

  const placeMines = (avoidRow: number, avoidCol: number) => {
    const newGrid = [...grid.map(row => [...row])];
    let minesPlaced = 0;
    
    while (minesPlaced < config.mines) {
      const row = Math.floor(Math.random() * config.rows);
      const col = Math.floor(Math.random() * config.cols);
      
      if ((row !== avoidRow || col !== avoidCol) && !newGrid[row][col].isMine) {
        newGrid[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let i = 0; i < config.rows; i++) {
      for (let j = 0; j < config.cols; j++) {
        if (!newGrid[i][j].isMine) {
          let count = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ni = i + di;
              const nj = j + dj;
              if (ni >= 0 && ni < config.rows && nj >= 0 && nj < config.cols && newGrid[ni][nj].isMine) {
                count++;
              }
            }
          }
          newGrid[i][j].neighborMines = count;
        }
      }
    }

    setGrid(newGrid);
    return newGrid;
  };

  const revealCell = (row: number, col: number, currentGrid?: Cell[][]) => {
    const gridToUse = currentGrid || grid;
    const newGrid = [...gridToUse.map(r => [...r])];
    
    if (row < 0 || row >= config.rows || col < 0 || col >= config.cols) return newGrid;
    if (newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return newGrid;

    newGrid[row][col].isRevealed = true;

    if (newGrid[row][col].isMine) {
      setGameState('lost');
      setIsTimerRunning(false);
      for (let i = 0; i < config.rows; i++) {
        for (let j = 0; j < config.cols; j++) {
          if (newGrid[i][j].isMine) {
            newGrid[i][j].isRevealed = true;
          }
        }
      }
      return newGrid;
    }

    if (newGrid[row][col].neighborMines === 0) {
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          const ni = row + di;
          const nj = col + dj;
          if (ni >= 0 && ni < config.rows && nj >= 0 && nj < config.cols) {
            if (!newGrid[ni][nj].isRevealed && !newGrid[ni][nj].isFlagged) {
              const updatedGrid = revealCell(ni, nj, newGrid);
              for (let i = 0; i < config.rows; i++) {
                for (let j = 0; j < config.cols; j++) {
                  newGrid[i][j] = updatedGrid[i][j];
                }
              }
            }
          }
        }
      }
    }

    return newGrid;
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameState !== 'playing') return;
    if (grid[row][col].isFlagged || grid[row][col].isRevealed) return;

    if (firstClick) {
      const newGrid = placeMines(row, col);
      setFirstClick(false);
      setIsTimerRunning(true);
      const revealed = revealCell(row, col, newGrid);
      setGrid(revealed);
    } else {
      const revealed = revealCell(row, col);
      setGrid(revealed);
    }

    checkWin();
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState !== 'playing' || grid[row][col].isRevealed) return;

    const newGrid = [...grid.map(r => [...r])];
    if (newGrid[row][col].isFlagged) {
      newGrid[row][col].isFlagged = false;
      setFlagCount(flagCount - 1);
    } else {
      newGrid[row][col].isFlagged = true;
      setFlagCount(flagCount + 1);
    }
    setGrid(newGrid);
  };

  const checkWin = () => {
    let unrevealedNonMines = 0;
    for (let i = 0; i < config.rows; i++) {
      for (let j = 0; j < config.cols; j++) {
        if (!grid[i][j].isMine && !grid[i][j].isRevealed) {
          unrevealedNonMines++;
        }
      }
    }
    if (unrevealedNonMines === 0) {
      setGameState('won');
      setIsTimerRunning(false);
    }
  };

  const getCellContent = (cell: Cell) => {
    if (!cell.isRevealed) {
      return cell.isFlagged ? '🚩' : '';
    }
    if (cell.isMine) {
      return '💣';
    }
    if (cell.neighborMines === 0) {
      return '';
    }
    return cell.neighborMines;
  };

  const getCellColor = (num: number) => {
    const colors = ['', '#0000FF', '#008000', '#FF0000', '#000080', '#800000', '#008080', '#000000', '#808080'];
    return colors[num] || '#000';
  };

  const getFaceEmoji = () => {
    if (gameState === 'lost') return '😵';
    if (gameState === 'won') return '😎';
    return '🙂';
  };

  return (
    <div className="flex flex-col h-full gap-2 p-2 select-none bg-[#c0c0c0]">
      {/* Menu Bar */}
      <div className="flex gap-4 text-sm border-b border-[#808080] pb-1">
        <div className="relative group">
          <span className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">Game</span>
        </div>
        <span className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">Help</span>
      </div>

      {/* Top Panel */}
      <div className="flex justify-between items-center bg-[#c0c0c0] bevel-in p-2">
        <div className="bg-black text-red-600 font-mono text-2xl px-2 py-1 font-bold" style={{ fontFamily: 'Courier New' }}>
          {String(config.mines - flagCount).padStart(3, '0')}
        </div>

        <RetroButton onClick={initializeGame} className="text-2xl w-12 h-12 !p-0">
          {getFaceEmoji()}
        </RetroButton>

        <div className="bg-black text-red-600 font-mono text-2xl px-2 py-1 font-bold" style={{ fontFamily: 'Courier New' }}>
          {String(timer).padStart(3, '0')}
        </div>
      </div>

      {/* Game Grid */}
      <div className="flex-1 overflow-auto flex items-center justify-center bevel-in p-1">
        <div 
          className="inline-grid gap-0 bg-[#c0c0c0]"
          style={{ 
            gridTemplateColumns: `repeat(${config.cols}, 20px)`,
            gridTemplateRows: `repeat(${config.rows}, 20px)`
          }}
        >
          {grid.map((row, i) => 
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`
                  w-5 h-5 flex items-center justify-center text-xs font-bold cursor-pointer
                  ${cell.isRevealed 
                    ? 'bg-[#c0c0c0] border border-[#808080]' 
                    : 'bevel-out bg-[#c0c0c0] active:bevel-in'
                  }
                `}
                style={{
                  color: cell.isRevealed && !cell.isMine ? getCellColor(cell.neighborMines) : '#000'
                }}
                onClick={() => handleCellClick(i, j)}
                onContextMenu={(e) => handleRightClick(e, i, j)}
              >
                {getCellContent(cell)}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Difficulty Selector */}
      <div className="flex gap-2 justify-center pt-2 border-t border-white">
        <RetroButton 
          onClick={() => setDifficulty('beginner')} 
          active={difficulty === 'beginner'}
          className="text-xs"
        >
          Beginner
        </RetroButton>
        <RetroButton 
          onClick={() => setDifficulty('intermediate')}
          active={difficulty === 'intermediate'}
          className="text-xs"
        >
          Intermediate
        </RetroButton>
        <RetroButton 
          onClick={() => setDifficulty('expert')}
          active={difficulty === 'expert'}
          className="text-xs"
        >
          Expert
        </RetroButton>
      </div>

      {/* Status Messages */}
      {gameState !== 'playing' && (
        <div className={`text-center font-bold p-2 ${gameState === 'won' ? 'bg-green-200' : 'bg-red-200'}`}>
          {gameState === 'won' ? '🎉 You Won! 🎉' : '💥 Game Over! 💥'}
        </div>
      )}
    </div>
  );
};

// Media Player placeholder
export const MediaPlayer: React.FC = () => (
  <div className="h-full flex items-center justify-center bg-black text-white">
    <p className="text-center">Media Player<br/><span className="text-sm text-gray-400">Coming soon...</span></p>
  </div>
);

// File Transfer dialog
interface FileTransferProps {
  fileName: string;
  onCancel: () => void;
}

export const FileTransfer: React.FC<FileTransferProps> = ({ fileName, onCancel }) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.random() * 2;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4">
      <p className="text-sm">Copying: {fileName}</p>
      <div className="w-full h-4 bg-white bevel-in">
        <div 
          className="h-full bg-[#000080]" 
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="text-xs text-gray-600">{progress.toFixed(1)}% complete</p>
      <div className="flex justify-end">
        <RetroButton onClick={onCancel}>Cancel</RetroButton>
      </div>
    </div>
  );
};
