import React, { useState, useEffect } from 'react';
import { RetroButton } from '../ui/RetroButton';

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
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [flagCount, setFlagCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [firstClick, setFirstClick] = useState(true);

  const config = DIFFICULTIES[difficulty];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && gameState === 'playing') {
      interval = setInterval(() => {
        setTimer(t => Math.min(t + 1, 999));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameState]);

  // Initialize game
  useEffect(() => {
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
      
      // Don't place mine on first click or already mined cell
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

    // If mine, game over
    if (newGrid[row][col].isMine) {
      setGameState('lost');
      setIsTimerRunning(false);
      // Reveal all mines
      for (let i = 0; i < config.rows; i++) {
        for (let j = 0; j < config.cols; j++) {
          if (newGrid[i][j].isMine) {
            newGrid[i][j].isRevealed = true;
          }
        }
      }
      return newGrid;
    }

    // If empty (no neighbor mines), reveal neighbors recursively
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

    // First click - place mines
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

    // Check win condition
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
        {/* Mine Counter */}
        <div className="bg-black text-red-600 font-mono text-2xl px-2 py-1 font-bold" style={{ fontFamily: 'Courier New' }}>
          {String(config.mines - flagCount).padStart(3, '0')}
        </div>

        {/* Reset Button */}
        <RetroButton onClick={initializeGame} className="text-2xl w-12 h-12 !p-0">
          {getFaceEmoji()}
        </RetroButton>

        {/* Timer */}
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
