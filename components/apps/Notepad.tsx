import React, { useState, useRef } from 'react';
import { RetroButton } from '../ui/RetroButton';

export const Notepad: React.FC = () => {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('Untitled');
  const [isModified, setIsModified] = useState(false);
  const [fontSize, setFontSize] = useState(12);
  const [wordWrap, setWordWrap] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNew = () => {
    if (isModified && !confirm('Do you want to save changes?')) {
      return;
    }
    setContent('');
    setFileName('Untitled');
    setIsModified(false);
  };

  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setIsModified(false);
  };

  const handleOpen = () => {
    fileInputRef.current?.click();
  };

  const handleFileRead = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(text);
        setFileName(file.name);
        setIsModified(false);
      };
      reader.readAsText(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
  };

  const getStats = () => {
    const lines = content.split('\n').length;
    const chars = content.length;
    const words = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
    return { lines, chars, words };
  };

  const stats = getStats();

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans">
      {/* Menu Bar */}
      <div className="flex gap-4 text-sm border-b border-[#808080] pb-1 px-1">
        <div className="relative group">
          <span className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">File</span>
          {/* Dropdown simulation - not fully functional but looks authentic */}
        </div>
        <span className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">Edit</span>
        <span className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">Format</span>
        <span className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">View</span>
        <span className="cursor-pointer px-1 hover:bg-[#000080] hover:text-white">Help</span>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 items-center p-1 border-b border-[#808080] flex-wrap">
        <RetroButton onClick={handleNew} className="text-xs">
          New
        </RetroButton>
        <RetroButton onClick={handleOpen} className="text-xs">
          Open...
        </RetroButton>
        <RetroButton onClick={handleSave} className="text-xs">
          Save
        </RetroButton>
        <div className="w-[2px] h-6 bg-[#808080]" />
        <RetroButton 
          onClick={() => setFontSize(f => Math.max(8, f - 2))}
          className="text-xs w-8"
          title="Decrease font size"
        >
          A-
        </RetroButton>
        <span className="text-xs">{fontSize}pt</span>
        <RetroButton 
          onClick={() => setFontSize(f => Math.min(24, f + 2))}
          className="text-xs w-8"
          title="Increase font size"
        >
          A+
        </RetroButton>
        <div className="w-[2px] h-6 bg-[#808080]" />
        <label className="flex items-center gap-1 text-xs cursor-pointer">
          <input 
            type="checkbox" 
            checked={wordWrap}
            onChange={(e) => setWordWrap(e.target.checked)}
            className="accent-[#000080]"
          />
          Word Wrap
        </label>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        onChange={handleFileRead}
        className="hidden"
      />

      {/* Text Area */}
      <div className="flex-1 overflow-hidden">
        <textarea
          value={content}
          onChange={handleChange}
          className="w-full h-full p-2 resize-none outline-none bg-white text-black font-mono border-2 border-[#808080] border-t-[#000] border-l-[#000]"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: '1.5',
            whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
            overflowWrap: wordWrap ? 'break-word' : 'normal',
            fontFamily: 'Courier New, monospace'
          }}
          placeholder="Type your text here..."
          spellCheck={false}
        />
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#c0c0c0] border-t-2 border-white flex items-center px-2 text-xs gap-4">
        <span className="bevel-in px-2 py-0.5 bg-[#c0c0c0] min-w-[100px]">
          {isModified ? 'Modified' : 'Saved'}
        </span>
        <span className="bevel-in px-2 py-0.5 bg-[#c0c0c0]">
          Ln {content.split('\n').length}
        </span>
        <span className="bevel-in px-2 py-0.5 bg-[#c0c0c0]">
          {stats.words} words
        </span>
        <span className="bevel-in px-2 py-0.5 bg-[#c0c0c0]">
          {stats.chars} chars
        </span>
        <span className="flex-1"></span>
        <span className="bevel-in px-2 py-0.5 bg-[#c0c0c0]">
          {fileName}
        </span>
      </div>
    </div>
  );
};
