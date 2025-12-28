
import React from 'react';
import { Song } from '../types';

interface SongCardProps {
  song: Song;
  onClick: (song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onClick }) => {
  return (
    <div 
      onClick={() => onClick(song)}
      className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100 flex flex-col h-full"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={song.coverImage} 
          alt={song.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <span className="text-white text-xs font-bold uppercase tracking-widest border border-white/40 px-3 py-1 rounded-full backdrop-blur-sm">
            點擊探索歌詞
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-md ${
            song.difficulty === 'Beginner' ? 'bg-white/90 text-green-700' : 'bg-white/90 text-orange-700'
          }`}>
            {song.difficulty}
          </span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-poetic font-bold text-stone-800 mb-1 group-hover:text-orange-700 transition-colors">{song.title}</h3>
        <p className="text-xs italic text-stone-400 mb-4 tracking-tighter uppercase">{song.romajiTitle}</p>
        <p className="text-stone-600 text-sm line-clamp-2 leading-relaxed font-light italic">
          "{song.description}"
        </p>
        <div className="mt-auto pt-6 flex items-center gap-2 text-stone-400 group-hover:text-orange-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          <span className="text-[10px] font-bold uppercase tracking-widest">播放與學習</span>
        </div>
      </div>
    </div>
  );
};
