
import React, { useState, useEffect } from 'react';
import { Song, AnalysisResponse } from '../types';
import { analyzeLyrics, getQuickTranslation } from '../services/geminiService';

interface LyricExplorerProps {
  song: Song;
  onAskSensei: () => void;
  onTakeQuiz: () => void;
}

export const LyricExplorer: React.FC<LyricExplorerProps> = ({ song, onAskSensei, onTakeQuiz }) => {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedText, setSelectedText] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const data = await analyzeLyrics(song.lyrics, song.title);
        setAnalysis(data);
      } catch (error) {
        console.error("分析歌詞失敗", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [song]);

  const handleTranslate = async (text: string) => {
    if (!text.trim()) return;
    setSelectedText(text);
    setTranslating(true);
    try {
      const res = await getQuickTranslation(text);
      setTranslation(res);
    } catch (e) {
      setTranslation("翻譯出錯了，請稍後再試。");
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 影音與標題區塊 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8">
          <div className="rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video relative group">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${song.youtubeId}?autoplay=0&rel=0`}
              title={song.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col justify-center">
          <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-0 opacity-50"></div>
             <div className="relative z-10">
               <h2 className="text-4xl font-poetic font-bold mb-2 text-stone-800">{song.title}</h2>
               <p className="text-stone-400 italic mb-6">{song.romajiTitle}</p>
               <p className="text-stone-600 leading-relaxed mb-8 italic">"{song.description}"</p>
               <div className="flex gap-4">
                 <button 
                  onClick={onTakeQuiz}
                  className="flex-1 bg-stone-900 text-white py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors shadow-lg flex items-center justify-center gap-2"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                   開始測驗
                 </button>
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左側歌詞區 */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              歌詞全文 (點擊單句解析)
            </h3>
            <div className="space-y-4 leading-relaxed text-xl text-stone-800 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              {song.lyrics.split('\n').map((line, i) => (
                <p 
                  key={i} 
                  onClick={() => line.trim() && handleTranslate(line)}
                  className={`p-2 rounded-xl transition-all ${line.trim() ? 'cursor-pointer hover:bg-orange-50 hover:text-orange-900 border-l-4 border-transparent hover:border-orange-400' : 'h-4'}`}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {selectedText && (
            <div className="bg-stone-900 text-white p-8 rounded-3xl shadow-xl animate-in fade-in slide-in-from-bottom-4 sticky bottom-8">
              <h4 className="font-poetic italic text-orange-400 text-lg mb-4">AI 靈魂譯站</h4>
              <p className="text-stone-400 text-sm mb-6 border-b border-stone-800 pb-4">"{selectedText}"</p>
              {translating ? (
                <div className="flex gap-2 py-4">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-stone-100 leading-relaxed text-lg">{translation}</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={onAskSensei}
                      className="text-xs bg-orange-500 text-white px-4 py-2 rounded-full font-bold hover:bg-orange-400 transition-colors"
                    >
                      深入詢問文法
                    </button>
                    <button 
                      onClick={() => setSelectedText('')}
                      className="text-xs text-stone-500 hover:text-stone-300 transition-colors"
                    >
                      關閉解析
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 右側分析區 */}
        <div className="lg:col-span-7 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-stone-400 space-y-4 bg-white rounded-3xl border border-stone-100">
              <div className="w-12 h-12 border-4 border-stone-50 border-t-orange-400 rounded-full animate-spin"></div>
              <p className="font-poetic italic">正在解構風的音樂哲學...</p>
            </div>
          ) : analysis ? (
            <>
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-stone-900 rounded-2xl flex items-center justify-center text-white font-poetic text-xl">風</div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-800">歌曲意境摘要</h3>
                    <p className="text-xs text-stone-400 uppercase tracking-widest">Philosophical Essence</p>
                  </div>
                </div>
                <p className="text-stone-700 leading-relaxed text-xl font-light italic border-l-4 border-orange-200 pl-6 mb-8">
                  "{analysis.summary}"
                </p>
                <div className="bg-stone-50 p-6 rounded-2xl">
                  <h4 className="font-bold text-stone-800 text-xs mb-2 uppercase tracking-widest flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    文化與語境補充
                  </h4>
                  <p className="text-stone-600 text-sm leading-relaxed">{analysis.culturalNote}</p>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                  <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">核心詞彙</h3>
                  <div className="space-y-4">
                    {analysis.vocabulary.map((v, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:border-orange-200 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-2xl font-bold text-stone-800">{v.word}</span>
                          <span className="text-xs bg-stone-50 px-2 py-1 rounded font-mono text-stone-500">
                            {v.reading}
                          </span>
                        </div>
                        <p className="text-orange-700 font-bold text-sm mb-3">{v.meaning}</p>
                        <p className="text-stone-400 text-[11px] leading-snug italic">語境："{v.context}"</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">重點文法</h3>
                  <div className="space-y-4">
                    {analysis.grammar.map((g, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                        <h4 className="text-sm font-bold text-stone-800 mb-3 border-b border-stone-50 pb-2">{g.point}</h4>
                        <p className="text-stone-500 mb-4 text-xs leading-relaxed">{g.explanation}</p>
                        <div className="bg-orange-50/40 p-3 rounded-xl">
                          <p className="text-stone-800 font-medium text-xs">例句：{g.example}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
