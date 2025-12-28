
import React, { useState, useEffect } from 'react';
import { Song, QuizQuestion } from '../types';
import { generateQuiz } from '../services/geminiService';

interface QuizProps {
  song: Song;
  onComplete: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ song, onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const data = await generateQuiz(song);
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch quiz", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [song]);

  const handleOptionClick = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === questions[currentIndex].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-stone-400 space-y-4">
        <div className="w-12 h-12 border-4 border-stone-200 border-t-orange-500 rounded-full animate-spin"></div>
        <p className="font-poetic italic">AI 正在為你準備專屬測驗...</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center animate-in fade-in zoom-in-95">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-stone-100">
          <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
            {Math.round((score / questions.length) * 100)}%
          </div>
          <h2 className="text-3xl font-poetic font-bold text-stone-800 mb-2">測驗完成！</h2>
          <p className="text-stone-500 mb-8 leading-relaxed">
            你在《{song.title}》的測驗中獲得了 {score} / {questions.length} 分。<br/>
            音樂是靈魂的語言，而你正逐漸掌握它。
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => { setIsFinished(false); setCurrentIndex(0); setScore(0); setSelectedOption(null); setShowExplanation(false); }}
              className="px-8 py-3 bg-stone-100 text-stone-800 rounded-full font-bold hover:bg-stone-200 transition-colors"
            >
              再次挑戰
            </button>
            <button 
              onClick={onComplete}
              className="px-8 py-3 bg-stone-800 text-white rounded-full font-bold hover:bg-stone-700 transition-colors"
            >
              返回歌詞
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-in slide-in-from-bottom-4">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-400 transition-all duration-500" 
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-stone-200 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-bl-full -z-0"></div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-stone-800 mb-8 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => {
              let buttonClass = "w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between ";
              
              if (showExplanation) {
                if (idx === currentQuestion.correctIndex) {
                  buttonClass += "bg-green-50 border-green-500 text-green-900";
                } else if (idx === selectedOption) {
                  buttonClass += "bg-red-50 border-red-500 text-red-900";
                } else {
                  buttonClass += "bg-white border-stone-100 text-stone-400";
                }
              } else {
                buttonClass += "bg-white border-stone-100 hover:border-orange-200 hover:bg-orange-50/30 text-stone-700";
              }

              return (
                <button 
                  key={idx}
                  disabled={showExplanation}
                  onClick={() => handleOptionClick(idx)}
                  className={buttonClass}
                >
                  <span className="font-medium">{option}</span>
                  {showExplanation && idx === currentQuestion.correctIndex && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M20 6 9 17l-5-5"/></svg>
                  )}
                  {showExplanation && idx === selectedOption && idx !== currentQuestion.correctIndex && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  )}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="mt-8 p-6 bg-stone-50 rounded-2xl border-l-4 border-stone-800 animate-in fade-in slide-in-from-top-2">
              <h4 className="font-bold text-stone-800 mb-2 uppercase text-xs tracking-widest">Sensei's Explanation</h4>
              <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap">
                {currentQuestion.explanation}
              </p>
              <button 
                onClick={handleNext}
                className="mt-6 w-full py-4 bg-stone-800 text-white rounded-xl font-bold hover:bg-stone-700 transition-colors shadow-lg"
              >
                {currentIndex < questions.length - 1 ? "下一題" : "查看結果"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
