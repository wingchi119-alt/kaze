
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onBack?: () => void;
  onNav?: (view: 'home' | 'tutor') => void;
  title?: string;
  activeView?: 'home' | 'tutor';
}

export const Layout: React.FC<LayoutProps> = ({ children, onBack, onNav, title, activeView }) => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-100 sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-stone-50 rounded-full transition-colors text-stone-400 hover:text-stone-800"
              aria-label="返回上一頁"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          )}
          <h1 
            onClick={() => onNav?.('home')}
            className="text-2xl font-poetic font-bold tracking-tighter text-stone-800 cursor-pointer hover:text-orange-600 transition-colors"
          >
            {title || "風學 KazeGaku"}
          </h1>
        </div>
        <nav className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-widest text-stone-400">
          <button 
            onClick={() => onNav?.('home')} 
            className={`${activeView === 'home' ? 'text-stone-900' : 'hover:text-stone-600'} transition-colors relative py-2`}
          >
            歌詞探索
            {activeView === 'home' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-400"></span>}
          </button>
          <button 
            onClick={() => onNav?.('tutor')} 
            className={`${activeView === 'tutor' ? 'text-stone-900' : 'hover:text-stone-600'} transition-colors relative py-2`}
          >
            詢問 Sensei
            {activeView === 'tutor' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-400"></span>}
          </button>
        </nav>
      </header>
      <main className="flex-1 bg-stone-50/40">
        {children}
      </main>
      <footer className="bg-stone-900 text-stone-500 py-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="text-white font-poetic text-3xl mb-6 italic">KazeGaku</h3>
            <p className="text-sm max-w-sm leading-relaxed mb-8">
              「Help Ever, Hurt Never」— 我們的使命是結合音樂與 AI 技術，
              讓每一位日文初學者都能在藤井風的歌聲中，找到學習與人生的共鳴。
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-white hover:bg-orange-500 cursor-pointer transition-colors">f</div>
              <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-white hover:bg-orange-500 cursor-pointer transition-colors">t</div>
              <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-white hover:bg-orange-500 cursor-pointer transition-colors">i</div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">學習專區</h4>
            <ul className="text-sm space-y-4">
              <li className="hover:text-white cursor-pointer transition-colors">全曲歌詞解析</li>
              <li className="hover:text-white cursor-pointer transition-colors">AI 導師諮詢</li>
              <li className="hover:text-white cursor-pointer transition-colors">理解測驗</li>
              <li className="hover:text-white cursor-pointer transition-colors">初學者語法</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">致敬與協力</h4>
            <ul className="text-sm space-y-4">
              <li className="hover:text-white cursor-pointer transition-colors">音樂：藤井 風 (Fujii Kaze)</li>
              <li className="hover:text-white cursor-pointer transition-colors">AI：Gemini 3 Pro</li>
              <li className="hover:text-white cursor-pointer transition-colors">設計：KazeGaku 團隊</li>
              <li className="hover:text-white cursor-pointer transition-colors">靈感：marumaru-x</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-stone-800 text-center text-xs tracking-widest">
          © 2024 KAZEGAKU. ALL RIGHTS RESERVED. KEEP LEARNING IN THE WIND.
        </div>
      </footer>
    </div>
  );
};
