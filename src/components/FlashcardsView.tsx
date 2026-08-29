import React, { useState } from 'react';
import { 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  Shuffle, 
  Volume2, 
  Bookmark, 
  Sparkles,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { MCQQuestion } from '../types';

interface FlashcardsViewProps {
  questions: MCQQuestion[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  questions,
  bookmarkedIds,
  onToggleBookmark
}) => {
  const [index, setIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [deck, setDeck] = useState<MCQQuestion[]>(questions);

  // Sync deck when questions change
  React.useEffect(() => {
    setDeck(questions);
    setIndex(0);
    setIsFlipped(false);
  }, [questions]);

  if (deck.length === 0) {
    return (
      <div className="bg-[#16171A] rounded-3xl border border-[#2A2B2F] p-12 text-center text-[#8E8F94]">
        No flashcards available for the current filter.
      </div>
    );
  }

  const currentQ = deck[index] || deck[0];
  const isBookmarked = bookmarkedIds.includes(currentQ.id);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % deck.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + deck.length) % deck.length);
    }, 150);
  };

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setIndex(0);
    setIsFlipped(false);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-[#8E8F94] uppercase tracking-wider">
          Card <span className="text-[#D4AF37] font-bold">{index + 1}</span> of {deck.length}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#16171A] border border-[#2A2B2F] hover:bg-[#1C1D21] text-[#E2E2E2] text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {/* 3D Flashcard Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="min-h-96 w-full cursor-pointer select-none"
      >
        <div
          className={`w-full h-full min-h-96 rounded-3xl border-2 transition-all duration-300 p-8 flex flex-col justify-between shadow-lg relative ${
            isFlipped 
              ? 'border-[#D4AF37] bg-[#1A1813] shadow-[#D4AF37]/5' 
              : 'border-[#2A2B2F] bg-[#16171A] hover:border-[#38393F]'
          }`}
        >
          {/* Card Top */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                currentQ.category === 'Synonym' ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30' : 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
              }`}>
                {currentQ.category}
              </span>
              <span className="text-xs font-bold text-[#8E8F94] bg-[#1C1D21] border border-[#2A2B2F] px-2.5 py-0.5 rounded-lg">
                Letter {currentQ.letter}
              </span>
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => handleSpeak(currentQ.word)}
                className="p-2 text-[#8E8F94] hover:text-[#D4AF37] hover:bg-[#1C1D21] rounded-xl transition-colors cursor-pointer"
                title="Pronounce"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onToggleBookmark(currentQ.id)}
                className="p-2 text-[#8E8F94] hover:text-[#D4AF37] hover:bg-[#1C1D21] rounded-xl transition-colors cursor-pointer"
                title="Bookmark"
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Card Center */}
          <div className="text-center py-6">
            {!isFlipped ? (
              <div className="space-y-3">
                <div className="text-xs font-bold text-[#8E8F94] uppercase tracking-widest">
                  Target Word
                </div>
                <h3 className="text-4xl font-serif font-bold text-white tracking-tight">
                  {currentQ.word}
                </h3>
                <p className="text-xs text-[#8E8F94] pt-2 flex items-center justify-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Click to reveal Bengali meaning & answers</span>
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div>
                  <span className="text-xs font-bold text-[#8E8F94] uppercase tracking-widest block mb-1">
                    বাংলা অর্থ (Bengali Meaning)
                  </span>
                  <div className="text-2xl font-bold text-[#D4AF37] font-['Noto_Sans_Bengali']">
                    {currentQ.bengaliMeaning || 'অর্থ অন্তর্ভুক্ত'}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#2A2B2F]">
                  <span className="text-xs font-bold text-[#8E8F94] uppercase tracking-widest block mb-2">
                    Key {currentQ.category}s:
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {currentQ.providedTargets.map((tgt, i) => (
                      <span key={i} className="px-3 py-1 bg-[#1C1D21] border border-[#2A2B2F] text-[#E2E2E2] font-semibold text-xs rounded-xl shadow-xs">
                        {tgt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-[#121316] rounded-2xl border border-[#2A2B2F] text-xs text-[#8E8F94] text-left">
                  <strong className="text-[#E2E2E2]">MCQ Question:</strong> {currentQ.questionText} <br />
                  <span className="text-emerald-400 font-bold block mt-1">Answer: {currentQ.correctAnswerLabel}) {currentQ.correctAnswerText}</span>
                </div>
              </div>
            )}
          </div>

          {/* Card Bottom */}
          <div className="flex items-center justify-between text-xs text-[#6B6C70] pt-3 border-t border-[#2A2B2F]">
            <span>ID: {currentQ.id}</span>
            <span className="font-semibold text-[#D4AF37]">
              {isFlipped ? 'Answer Revealed' : 'Click card to Flip'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          className="flex-1 py-3 px-4 bg-[#16171A] border border-[#2A2B2F] text-[#E2E2E2] font-bold text-xs rounded-2xl hover:bg-[#1C1D21] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Card</span>
        </button>

        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="py-3 px-5 bg-[#1C1D21] border border-[#2A2B2F] text-[#D4AF37] font-bold text-xs rounded-2xl hover:bg-[#23242A] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCw className="w-4 h-4" />
          <span>Flip</span>
        </button>

        <button
          onClick={handleNext}
          className="flex-1 py-3 px-4 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0F1012] font-black text-xs rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <span>Next Card</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
