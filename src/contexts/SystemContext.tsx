// ============================================================================
// System Context - Manages boot state, sound, screensaver, etc.
// ============================================================================

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { SCREENSAVER_TIMEOUT, BOOT_AUDIO_URL } from '../config';
import { soundSystem } from '../services/sounds';

interface SystemContextType {
  // Boot state
  soundPromptShown: boolean;
  soundEnabled: boolean;
  showBios: boolean;
  showBlackScreen: boolean;
  hasBooted: boolean;
  showScreensaver: boolean;
  isSystemCrashed: boolean;
  
  // Actions
  handleSoundPrompt: (enableSound: boolean) => void;
  completeBios: () => void;
  skipToDesktop: () => void;
  completeBoot: () => void;
  exitScreensaver: () => void;
  toggleSound: () => void;
  trackActivity: () => void;
  triggerSystemCrash: () => void;
  
  // Time
  currentTime: string;
}

const SystemContext = createContext<SystemContextType | null>(null);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundPromptShown, setSoundPromptShown] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showBios, setShowBios] = useState(true);
  const [showBlackScreen, setShowBlackScreen] = useState(false);
  const [hasBooted, setHasBooted] = useState(false);
  const [showScreensaver, setShowScreensaver] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isSystemCrashed, setIsSystemCrashed] = useState(false);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  
  const bootAudioRef = useRef<HTMLAudioElement | null>(null);

  // Clock timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Screensaver logic
  useEffect(() => {
    if (!hasBooted) return;
    
    const checkScreensaver = setInterval(() => {
      if (Date.now() - lastActivity > SCREENSAVER_TIMEOUT && !showScreensaver) {
        setShowScreensaver(true);
      }
    }, 5000);
    return () => clearInterval(checkScreensaver);
  }, [lastActivity, showScreensaver, hasBooted]);

  // Activity tracking
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      if (showScreensaver) {
        setShowScreensaver(false);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [showScreensaver]);

  const stopBootAudio = useCallback(() => {
    if (bootAudioRef.current) {
      bootAudioRef.current.pause();
      bootAudioRef.current.currentTime = 0;
    }
  }, []);

  const handleSoundPrompt = useCallback((enableSound: boolean) => {
    setSoundEnabled(enableSound);
    setSoundPromptShown(true);
    soundSystem.setEnabled(enableSound);
    
    if (enableSound) {
      bootAudioRef.current = new Audio(BOOT_AUDIO_URL);
      bootAudioRef.current.volume = 0.4;
      bootAudioRef.current.playbackRate = 1.5;
      bootAudioRef.current.loop = true;
      bootAudioRef.current.play().catch(err => console.log('Boot audio failed:', err));
    }
    
    // Show black screen briefly
    setShowBlackScreen(true);
    setTimeout(() => setShowBlackScreen(false), 2000);
  }, []);

  const completeBios = useCallback(() => {
    setShowBios(false);
  }, []);

  const skipToDesktop = useCallback(() => {
    setShowBios(false);
    setHasBooted(true);
    stopBootAudio();
  }, [stopBootAudio]);

  const completeBoot = useCallback(() => {
    setHasBooted(true);
    stopBootAudio();
  }, [stopBootAudio]);

  const exitScreensaver = useCallback(() => {
    setShowScreensaver(false);
    setLastActivity(Date.now());
  }, []);

  const toggleSound = useCallback(() => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundSystem.setEnabled(newState);
    if (newState) soundSystem.click();
  }, [soundEnabled]);

  const trackActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  const triggerSystemCrash = useCallback(() => {
    console.log('[System] FATAL ERROR: System32 deleted. Triggering crash sequence...');
    setIsSystemCrashed(true);
  }, []);

  const value = useMemo(() => ({
    soundPromptShown,
    soundEnabled,
    showBios,
    showBlackScreen,
    hasBooted,
    showScreensaver,
    isSystemCrashed,
    handleSoundPrompt,
    completeBios,
    skipToDesktop,
    completeBoot,
    exitScreensaver,
    toggleSound,
    trackActivity,
    triggerSystemCrash,
    currentTime,
  }), [
    soundPromptShown,
    soundEnabled,
    showBios,
    showBlackScreen,
    hasBooted,
    showScreensaver,
    isSystemCrashed,
    handleSoundPrompt,
    completeBios,
    skipToDesktop,
    completeBoot,
    exitScreensaver,
    toggleSound,
    trackActivity,
    triggerSystemCrash,
    currentTime,
  ]);

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
