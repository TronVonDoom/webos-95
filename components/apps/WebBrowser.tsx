import React, { useState, useEffect } from 'react';
import { RetroButton } from '../ui/RetroButton';

interface Bookmark {
  title: string;
  url: string;
  description: string;
}

const BOOKMARKS: Bookmark[] = [
  {
    title: "The Revue Channel",
    url: "https://revuechannel.com/",
    description: "The ultimate 90s TV Guide experience. Don't touch that dial!"
  }
];

export const WebBrowser: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null); // null means Home/Bookmarks
  const [inputUrl, setInputUrl] = useState("about:home");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Forces iframe reload

  // Sync input field with actual current URL (e.g. when clicking bookmarks)
  useEffect(() => {
    setInputUrl(currentUrl || "about:home");
  }, [currentUrl]);

  const handleNavigate = (url: string) => {
    // Only allow URLs from the whitelist (Bookmarks) or home
    const isAllowed = url === "about:home" || BOOKMARKS.some(b => b.url === url);
    
    if (!isAllowed) {
       alert("Restricted Access: The administrator has blocked access to this site.");
       return;
    }

    if (url === "about:home") {
      handleHome();
      return;
    }

    setIsLoading(true);
    setCurrentUrl(url);
    setRefreshKey(prev => prev + 1); // Increment key to force iframe remount/refresh
  };

  const handleRefresh = () => {
    if (currentUrl) {
      setIsLoading(true);
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleHome = () => {
    setCurrentUrl(null);
    setIsLoading(false);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans pb-1">
      {/* Menu Bar */}
      <div className="flex gap-2 px-1 py-0.5 text-sm border-b border-[#808080] mb-1">
        <span className="cursor-pointer hover:bg-[#000080] hover:text-white px-1">File</span>
        <span className="cursor-pointer hover:bg-[#000080] hover:text-white px-1">Edit</span>
        <span className="cursor-pointer hover:bg-[#000080] hover:text-white px-1">View</span>
        <span className="cursor-pointer hover:bg-[#000080] hover:text-white px-1">Go</span>
        <span className="cursor-pointer hover:bg-[#000080] hover:text-white px-1">Help</span>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-start px-1 mb-1 border-b border-[#808080] pb-1">
        <div className="flex gap-1 flex-wrap">
          <RetroButton onClick={handleHome} className="text-xs font-bold px-2">
            Home
          </RetroButton>
          <RetroButton onClick={handleHome} className="text-xs px-2" disabled={!currentUrl}>
            Back
          </RetroButton>
          <RetroButton className="text-xs px-2" disabled>
            Forward
          </RetroButton>
          <RetroButton onClick={handleRefresh} className="text-xs px-2" disabled={!currentUrl}>
            Refresh
          </RetroButton>
          <RetroButton onClick={handleHome} className="text-xs px-2 text-red-800 font-bold">
            Stop
          </RetroButton>
        </div>
        
        {/* Browser Indicator (The Spinning Globe style) */}
        <div className="w-10 h-10 bevel-in bg-[#c0c0c0] flex items-center justify-center mr-1">
          <div className={`w-8 h-8 bg-white flex items-center justify-center`}>
             <img 
               src="https://win98icons.alexmeub.com/icons/png/world-0.png" 
               className={`w-6 h-6 pixelated ${isLoading ? 'animate-bounce' : ''}`} 
               alt="Loading Indicator"
             />
          </div>
        </div>
      </div>

      {/* Address Bar */}
      <div className="flex items-center gap-2 px-2 mb-2">
        <span className="text-xs font-bold">Address:</span>
        <input 
          type="text"
          readOnly
          value={inputUrl}
          className="flex-1 bg-[#e0e0e0] border-2 border-b-white border-r-white border-t-[#808080] border-l-[#808080] px-1 py-0.5 text-sm outline-none text-gray-700 font-sans cursor-not-allowed select-none"
        />
      </div>

      {/* Viewport */}
      <div className="flex-1 border-2 border-b-white border-r-white border-t-[#808080] border-l-[#808080] bg-white relative overflow-hidden">
        {/* Home Page / Bookmarks */}
        {!currentUrl && (
          <div className="p-8 h-full overflow-y-auto">
            <h1 className="text-3xl font-serif mb-4 text-[#000080]">Welcome to the World Wide Web</h1>
            <p className="mb-6 text-black">Select a destination to begin surfing the information superhighway.</p>
            
            <div className="grid gap-6">
              {BOOKMARKS.map((bookmark, idx) => (
                <div key={idx} className="flex flex-col gap-1 items-start">
                  <button 
                    onClick={() => handleNavigate(bookmark.url)}
                    className="text-blue-700 underline font-bold text-lg hover:text-red-600 active:text-red-800"
                  >
                    {bookmark.title}
                  </button>
                  <span className="text-sm text-gray-600">{bookmark.description}</span>
                  <span className="text-xs text-green-700">{bookmark.url}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 p-4 bg-yellow-50 border border-gray-300 text-xs text-black">
              <p><strong>System Administrator Note:</strong> Browsing is currently restricted to approved internal sites only.</p>
            </div>
          </div>
        )}

        {/* Iframe for external content */}
        {currentUrl && (
          <iframe
            key={refreshKey} // Forces React to remount the iframe on refresh
            src={currentUrl}
            className="w-full h-full border-none bg-white"
            onLoad={handleIframeLoad}
            title="Browser Content"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        )}
      </div>
      
      {/* Status Bar */}
      <div className="h-6 border-t border-[#808080] flex items-center px-2 text-xs gap-2 mt-1">
        <img src="https://win98icons.alexmeub.com/icons/png/internet_connection_wiz-0.png" className="w-4 h-4" />
        <span className="truncate flex-1 text-black">
          {isLoading ? `Opening ${currentUrl}...` : "Done"}
        </span>
        <div className="w-32 border border-[#808080] h-4 bg-[#c0c0c0] relative overflow-hidden flex items-center px-[2px]">
           {isLoading && (
             <div className="h-3 bg-[#000080] w-6 absolute animate-[marquee_1.5s_linear_infinite]" 
                  style={{ animationName: 'marquee' }}>
             </div>
           )}
           {/* Static blocks for progress-bar aesthetic */}
           <div className="flex gap-[2px] w-full h-full opacity-20 pointer-events-none">
             {[...Array(10)].map((_, i) => <div key={i} className="w-3 h-full bg-[#000080]"></div>)}
           </div>
           <style>{`
             @keyframes marquee {
               0% { left: -24px; }
               100% { left: 100%; }
             }
           `}</style>
        </div>
      </div>
    </div>
  );
};