import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../../services/gemini';
import { ChatMessage } from '../../types';
import { RetroButton } from '../ui/RetroButton';

export const ChatRoom: React.FC = () => {
  const [history, setHistory] = useState<ChatMessage[]>([
    { role: 'model', text: 'Welcome to the Rad Chat! I\'m Rob. A/S/L?', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date().toLocaleTimeString() };
    setHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Format history for Gemini
      const geminiHistory = history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }));

      const responseText = await sendChatMessage(geminiHistory, input);
      
      const modelMsg: ChatMessage = { 
        role: 'model', 
        text: responseText, 
        timestamp: new Date().toLocaleTimeString() 
      };
      setHistory(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      setHistory(prev => [...prev, { role: 'model', text: 'Connection lost... [Error]', timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">
      <div className="flex-1 bg-white border-2 border-b-white border-r-white border-t-[#808080] border-l-[#808080] p-2 overflow-y-auto mb-2 font-mono text-sm">
        {history.map((msg, i) => (
          <div key={i} className="mb-2">
            <span className="text-gray-500 text-xs">[{msg.timestamp}] </span>
            <span className={`font-bold ${msg.role === 'model' ? 'text-blue-800' : 'text-red-800'}`}>
              &lt;{msg.role === 'model' ? 'RadicalRob' : 'Guest'}&gt;
            </span>
            <span className="ml-1 text-black">{msg.text}</span>
          </div>
        ))}
        {isLoading && <div className="text-gray-500 animate-pulse">RadicalRob is typing...</div>}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-2 py-1 border-2 border-b-white border-r-white border-t-[#808080] border-l-[#808080] outline-none font-mono text-sm"
          placeholder="Say something..."
          autoFocus
        />
        <RetroButton onClick={handleSend} disabled={isLoading}>
          Send
        </RetroButton>
      </div>
    </div>
  );
};