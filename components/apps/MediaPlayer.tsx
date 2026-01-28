import React, { useState, useRef, useEffect } from 'react';
import { RetroButton } from '../ui/RetroButton';

interface Track {
  name: string;
  artist: string;
  duration: string;
}

// Classic 90s tracks (just metadata for the look)
const PLAYLIST: Track[] = [
  { name: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', duration: '5:56' },
  { name: 'Smells Like Teen Spirit', artist: 'Nirvana', duration: '5:01' },
  { name: 'Wonderwall', artist: 'Oasis', duration: '4:18' },
  { name: 'Black Hole Sun', artist: 'Soundgarden', duration: '5:18' },
  { name: 'Under the Bridge', artist: 'Red Hot Chili Peppers', duration: '4:24' },
  { name: 'Losing My Religion', artist: 'R.E.M.', duration: '4:27' },
  { name: 'Zombie', artist: 'The Cranberries', duration: '5:06' },
  { name: 'No Rain', artist: 'Blind Melon', duration: '3:36' }
];

export const MediaPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(50);
  const [position, setPosition] = useState(0);
  const [visualizer, setVisualizer] = useState<number[]>([]);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [showEqualizer, setShowEqualizer] = useState(false);

  // Simulate playback progress
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setPosition(p => {
          const maxPos = 100;
          if (p >= maxPos) {
            handleNext();
            return 0;
          }
          return p + 0.5;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Animated visualizer
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setVisualizer(Array.from({ length: 16 }, () => Math.random() * 100));
      } else {
        setVisualizer(Array.from({ length: 16 }, () => 0));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setPosition(0);
  };

  const handlePrevious = () => {
    setCurrentTrack(t => (t > 0 ? t - 1 : PLAYLIST.length - 1));
    setPosition(0);
  };

  const handleNext = () => {
    setCurrentTrack(t => (t < PLAYLIST.length - 1 ? t + 1 : 0));
    setPosition(0);
  };

  const track = PLAYLIST[currentTrack];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#3b82f6] p-1 font-sans select-none">
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-2 py-1 text-xs font-bold mb-1 flex items-center justify-between">
        <span>Winamp 95 Player</span>
        <span className="text-[10px]">v2.95</span>
      </div>

      {/* Main Display */}
      <div className="bg-black text-green-400 p-2 mb-1 border-2 border-gray-700 font-mono text-sm">
        <div className="flex justify-between items-center mb-1">
          <div className="flex-1">
            <div className="text-xs opacity-75">Now Playing:</div>
            <div className="font-bold truncate">{track.name}</div>
            <div className="text-xs opacity-75">{track.artist}</div>
          </div>
          <div className="text-2xl font-bold">{volume}%</div>
        </div>
        
        {/* Position */}
        <div className="text-xs flex justify-between mt-2">
          <span>{formatTime(position)}</span>
          <span>{track.duration}</span>
        </div>
      </div>

      {/* Visualizer */}
      <div className="bg-black p-1 mb-1 h-20 flex items-end justify-center gap-1 border-2 border-gray-700">
        {visualizer.map((height, i) => (
          <div
            key={i}
            className="w-3 bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-800 p-2 mb-1">
        <div className="w-full h-3 bg-gray-900 border border-gray-600 relative cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = ((e.clientX - rect.left) / rect.width) * 100;
            setPosition(percent);
          }}
        >
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
            style={{ width: `${position}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-1 mb-1 bg-gray-800 p-2 rounded">
        <RetroButton onClick={handlePrevious} className="w-10 h-10 !p-0 font-bold">
          ⏮
        </RetroButton>
        <RetroButton onClick={handlePlayPause} className="w-10 h-10 !p-0 font-bold text-lg">
          {isPlaying ? '⏸' : '▶'}
        </RetroButton>
        <RetroButton onClick={handleStop} className="w-10 h-10 !p-0 font-bold">
          ⏹
        </RetroButton>
        <RetroButton onClick={handleNext} className="w-10 h-10 !p-0 font-bold">
          ⏭
        </RetroButton>
      </div>

      {/* Volume Control */}
      <div className="bg-gray-800 p-2 mb-1 flex items-center gap-2">
        <span className="text-white text-xs">🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 accent-blue-600"
        />
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-1 mb-1">
        <RetroButton 
          onClick={() => setShowPlaylist(!showPlaylist)}
          active={showPlaylist}
          className="flex-1 text-xs"
        >
          Playlist
        </RetroButton>
        <RetroButton 
          onClick={() => setShowEqualizer(!showEqualizer)}
          active={showEqualizer}
          className="flex-1 text-xs"
        >
          Equalizer
        </RetroButton>
      </div>

      {/* Playlist */}
      {showPlaylist && (
        <div className="flex-1 bg-black text-green-400 p-1 overflow-auto border-2 border-gray-700 font-mono text-xs">
          {PLAYLIST.map((t, i) => (
            <div
              key={i}
              onClick={() => {
                setCurrentTrack(i);
                setPosition(0);
                setIsPlaying(true);
              }}
              className={`p-1 cursor-pointer hover:bg-gray-800 ${
                i === currentTrack ? 'bg-blue-900 text-white font-bold' : ''
              }`}
            >
              {i + 1}. {t.name} - {t.artist} [{t.duration}]
            </div>
          ))}
        </div>
      )}

      {/* Equalizer (when shown) */}
      {showEqualizer && (
        <div className="flex-1 bg-gray-900 p-2 border-2 border-gray-700">
          <div className="text-white text-xs mb-2">10-Band Equalizer</div>
          <div className="flex gap-2 items-end h-32 justify-around">
            {[60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000].map((freq, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <input
                  type="range"
                  min="-12"
                  max="12"
                  defaultValue="0"
                  className="h-20 accent-blue-600"
                  style={{ WebkitAppearance: 'slider-vertical', appearance: 'slider-vertical' } as React.CSSProperties}
                />
                <span className="text-[8px] text-white">{freq < 1000 ? freq : `${freq/1000}k`}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-2 py-1 text-[10px] mt-1 text-center">
        It really whips the llama's ass! 🦙
      </div>
    </div>
  );
};

const formatTime = (percent: number) => {
  const seconds = Math.floor((percent / 100) * 300); // Assume 5 min max
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
