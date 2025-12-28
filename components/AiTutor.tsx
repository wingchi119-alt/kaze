
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Song } from '../types';
import { askTutor } from '../services/geminiService';

interface AiTutorProps {
  contextSong?: Song;
}

export const AiTutor: React.FC<AiTutorProps> = ({ contextSong }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial message based on context
    const initialText = contextSong 
      ? `你好！我們來聊聊《${contextSong.title}》這首歌吧。歌詞裡的用法、意境，或是想深入了解其中某個單字？盡管問我。`
      : '你好！我是 KazeGaku 的專屬日文 Sensei。不論是歌詞裡的深意，還是日常文法，儘管問我吧。';
    
    setMessages([{ role: 'model', text: initialText }]);
  }, [contextSong]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await askTutor([...messages, userMessage], contextSong);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "抱歉，我的思緒被強風吹散了，請再試一次。" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 h-[calc(100vh-160px)] flex flex-col">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-3xl font-poetic font-bold text-stone-800">Ask Sensei 風學老師</h2>
        {contextSong && (
          <div className="mt-4 flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-orange-100 shadow-sm animate-in fade-in zoom-in-95">
            <img src={contextSong.coverImage} className="w-8 h-8 rounded-full object-cover" alt="" />
            <span className="text-sm font-medium text-orange-800">正在討論歌曲：{contextSong.title}</span>
          </div>
        )}
        {!contextSong && <p className="text-stone-500 italic mt-2">Exploring the nuances of language together.</p>}
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 px-4 py-6 bg-white/50 rounded-3xl border border-stone-200 shadow-inner mb-6"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-2xl shadow-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-stone-800 text-white rounded-tr-none' 
                : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap text-sm md:text-base prose prose-stone">{m.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-5 rounded-2xl border border-stone-100 rounded-tl-none shadow-sm flex gap-2">
              <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-4">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={contextSong ? `問問關於《${contextSong.title}》的事...` : "詢問單字用法或文法問題..."}
          className="flex-1 bg-white border border-stone-200 rounded-full px-6 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
        />
        <button 
          disabled={loading || !input.trim()}
          className="bg-stone-800 text-white w-14 h-14 rounded-full flex items-center justify-center hover:bg-stone-700 disabled:opacity-50 transition-all shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        </button>
      </form>
    </div>
  );
};
