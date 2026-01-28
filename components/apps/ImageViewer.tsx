import React from 'react';

interface ImageViewerProps {
  imageUrl: string;
  fileName: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, fileName }) => {
  // Check if it's a YouTube URL
  const isYouTube = imageUrl.includes('youtube.com') || imageUrl.includes('youtu.be');
  
  // Extract video ID from YouTube URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.includes('youtu.be') 
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&fs=0`;
  };

  if (isYouTube) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
        <iframe
          src={getYouTubeEmbedUrl(imageUrl)}
          className="h-full aspect-video"
          allow="autoplay; encrypted-media"
          style={{ pointerEvents: 'none' }}
          title={fileName}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white flex items-center justify-center p-4 overflow-auto">
      <img 
        src={imageUrl} 
        alt={fileName}
        className="max-w-full max-h-full object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};
