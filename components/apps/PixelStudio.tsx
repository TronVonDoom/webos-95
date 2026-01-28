import React, { useState, useRef, useEffect } from 'react';
import { RetroButton } from '../ui/RetroButton';

// Classic Windows 16-color palette
const PALETTE = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#FFFFFF', '#C0C0C0', '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF',
];

export const PixelStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Fill with white
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 32, 32);
      }
    }
  }, []);

  // Draw Grid Overlay
  useEffect(() => {
    const gridCanvas = gridRef.current;
    if (!gridCanvas) return;
    const ctx = gridCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

    if (showGrid) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)'; // Subtle black grid
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      // Vertical lines (every 8px for 256px canvas / 32 pixels)
      for (let x = 8; x < 256; x += 8) {
        // Add 0.5 to align with pixel grid for crisp lines
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, 256);
      }
      
      // Horizontal lines
      for (let y = 8; y < 256; y += 8) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(256, y + 0.5);
      }
      ctx.stroke();
    }
  }, [showGrid]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    // Calculate relative position and scale to 32x32
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((clientX - rect.left) * scaleX);
    const y = Math.floor((clientY - rect.top) * scaleY);
    
    return { x, y };
  };

  const drawPixel = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (x >= 0 && x < 32 && y >= 0 && y < 32) {
      ctx.fillStyle = selectedColor;
      ctx.fillRect(x, y, 1, 1);
    }
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const { x, y } = getPos(e);
    drawPixel(x, y);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getPos(e);
    drawPixel(x, y);
  };

  const handleEnd = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 32, 32);
      }
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Create a temporary canvas to upscale the image 16x (32 * 16 = 512)
      // This prevents the "blurry" look when opening the tiny 32x32 image in standard viewers
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 512;
      tempCanvas.height = 512;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(canvas, 0, 0, 512, 512);
        
        const link = document.createElement('a');
        link.download = 'pixel-art.png';
        link.href = tempCanvas.toDataURL();
        link.click();
      }
    }
  };

  return (
    <div className="flex flex-col h-full gap-2 p-1 select-none">
      <div className="flex justify-between items-center bg-[#c0c0c0] p-1 border border-white border-b-[#808080] border-r-[#808080] mb-1">
        <span className="text-xs font-bold">Tools</span>
        <div className="flex gap-2 items-center">
          <label className="flex items-center gap-1 text-xs cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={showGrid} 
              onChange={(e) => setShowGrid(e.target.checked)}
              className="accent-[#000080]"
            />
            Grid
          </label>
          <div className="w-[1px] h-4 bg-[#808080] border-r border-white mx-1"></div>
          <RetroButton onClick={handleClear} className="text-xs px-2 py-0 h-6">Clear</RetroButton>
          <RetroButton onClick={handleSave} className="text-xs px-2 py-0 h-6">Save</RetroButton>
        </div>
      </div>
      
      <div className="flex-1 bg-[#808080] border-2 border-b-white border-r-white border-t-[#404040] border-l-[#404040] flex items-center justify-center overflow-hidden p-4">
        {/* box-content ensures the width is exactly 256px excluding the border, fixing alignment issues */}
        <div className="relative w-[256px] h-[256px] border border-black bg-white box-content">
            <canvas
              ref={canvasRef}
              width={32}
              height={32}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
              style={{ 
                imageRendering: 'pixelated' 
              }}
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={handleStart}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
            />
            {/* Grid Overlay Canvas - 256x256 for precise 8px lines */}
            <canvas 
              ref={gridRef}
              width={256}
              height={256}
              className="absolute inset-0 pointer-events-none"
            />
        </div>
      </div>

      <div className="bg-[#c0c0c0] border-t border-[#808080] pt-2">
        <div className="flex flex-wrap gap-1 justify-center">
          {PALETTE.map(color => (
            <div
              key={color}
              className={`w-6 h-6 border-2 cursor-pointer ${selectedColor === color ? 'border-black' : 'border-t-[#fff] border-l-[#fff] border-b-[#808080] border-r-[#808080]'}`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
              title={color}
            />
          ))}
        </div>
        <div className="text-center text-xs mt-1 text-gray-600 font-mono">
          Color: {selectedColor}
        </div>
      </div>
    </div>
  );
};