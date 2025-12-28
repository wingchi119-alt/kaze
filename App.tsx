
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { SongCard } from './components/SongCard';
import { LyricExplorer } from './components/LyricExplorer';
import { AiTutor } from './components/AiTutor';
import { Quiz } from './components/Quiz';
import { SONGS } from './data/songs';
import { Song } from './types';

type View = 'home' | 'tutor' | 'song-detail' | 'quiz';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [tutorContext, setTutorContext] = useState<Song | undefined>(undefined);

  const handleSongClick = (song: Song) => {
    setSelectedSong(song);
    setActiveView('song-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (activeView === 'quiz') {
      setActiveView('song-detail');
    } else {
      setActiveView('home');
      setSelectedSong(null);
      setTutorContext(undefined);
    }
  };

  const navigateTo = (view: 'home' | 'tutor') => {
    setActiveView(view);
    if (view === 'home') {
      setSelectedSong(null);
      setTutorContext(undefined);
    }
  };

  const handleAskSenseiFromSong = () => {
    if (selectedSong) {
      setTutorContext(selectedSong);
      setActiveView('tutor');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTakeQuiz = () => {
    setActiveView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout 
      onBack={['song-detail', 'quiz'].includes(activeView) ? handleBack : (activeView === 'tutor' && tutorContext ? () => setActiveView('song-detail') : undefined)} 
      onNav={navigateTo}
      activeView={activeView === 'tutor' ? 'tutor' : 'home'}
      title={
        activeView === 'song-detail' ? "歌詞解析" : 
        activeView === 'tutor' ? "詢問 Sensei" : 
        activeView === 'quiz' ? "理解測驗" : 
        "風學 KazeGaku"
      }
    >
      {activeView === 'home' && (
        <div className="px-6 py-12 max-w-7xl mx-auto animate-in fade-in duration-700">
          <div className="text-center mb-20 space-y-8">
            <h2 className="text-6xl md:text-8xl font-poetic italic text-stone-800 tracking-tighter">
              隨風而學，<span className="text-orange-600">靈魂對話</span>
            </h2>
            <p className="text-stone-500 max-w-3xl mx-auto text-xl leading-relaxed font-light">
              專為日文初學者設計的沉浸式學習平台。藉由藤井風的溫暖旋律與深刻歌詞，<br className="hidden md:block"/>
              讓 AI 導師陪你解鎖日語單字、文法與那股吹進心裡的音樂力量。
            </p>
            <div className="flex justify-center gap-6">
               <button 
                 onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                 className="bg-stone-900 text-white px-10 py-4 rounded-full font-bold hover:bg-stone-800 transition-all shadow-xl hover:-translate-y-1"
               >
                 開始探索歌詞
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {SONGS.map(song => (
              <SongCard key={song.id} song={song} onClick={handleSongClick} />
            ))}
          </div>

          <div className="mt-32 bg-stone-900 rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-8">
              <h3 className="text-4xl md:text-5xl font-poetic italic">「保持良善，永不傷害」</h3>
              <p className="text-stone-400 max-w-2xl mx-auto text-lg leading-relaxed">
                我們的 AI 老師 Sensei 不僅教你日文，更會與你探討歌曲背後的慈悲與恩典。
                準備好開始這場不僅僅是學習語言的旅程了嗎？
              </p>
              <button 
                onClick={() => setActiveView('tutor')}
                className="bg-orange-500 text-white px-12 py-4 rounded-full font-bold hover:bg-orange-400 transition-all shadow-xl hover:scale-105 uppercase tracking-widest text-sm"
              >
                立即詢問 Sensei
              </button>
            </div>
            {/* 裝飾性背景 */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-orange-600/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-stone-500/10 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3"></div>
          </div>
        </div>
      )}

      {activeView === 'song-detail' && selectedSong && (
        <div className="animate-in slide-in-from-right-8 duration-700">
          <LyricExplorer 
            song={selectedSong} 
            onAskSensei={handleAskSenseiFromSong} 
            onTakeQuiz={handleTakeQuiz}
          />
        </div>
      )}

      {activeView === 'tutor' && (
        <div className="animate-in slide-in-from-bottom-8 duration-700">
          <AiTutor contextSong={tutorContext} />
        </div>
      )}

      {activeView === 'quiz' && selectedSong && (
        <div className="animate-in slide-in-from-bottom-8 duration-700">
          <Quiz song={selectedSong} onComplete={() => setActiveView('song-detail')} />
        </div>
      )}
    </Layout>
  );
};

export default App;
