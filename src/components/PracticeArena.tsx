import React from 'react';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BarChart2,
  Check,
  X,
  Target,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { NormalizedMCQ, CATEGORIES } from '../data/questionsData';
import {
  UserProgressData,
  recordQuestionAnswer,
  toggleBookmark,
  saveUserProgress,
} from '../utils/storage';
import { soundManager } from '../utils/audio';

interface PracticeArenaProps {
  questions: NormalizedMCQ[];
  userProgress: UserProgressData;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgressData>>;
  initialFilterCategory?: string | null;
  onClearCategoryFilter?: () => void;
  targetQuestionNumericId?: number | null;
  showTargetSection?: boolean;
  onToggleTargetSection?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onOpenAnalytics?: () => void;
}

export const PracticeArena: React.FC<PracticeArenaProps> = ({
  questions,
  userProgress,
  setUserProgress,
  initialFilterCategory,
  targetQuestionNumericId,
  showTargetSection = true,
  onToggleTargetSection,
  soundEnabled = true,
  onToggleSound,
}) => {
  // Category filter state
  const [selectedCategory, setSelectedCategory] = React.useState<string>(
    initialFilterCategory || 'All'
  );

  // Selected question index within the filtered list
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);

  // Show explanation toggle override
  const [forceShowExplanation, setForceShowExplanation] = React.useState<boolean>(false);

  // Auto-advance toggle (স্বয়ংক্রিয়)
  const [isAutoAdvance, setIsAutoAdvance] = React.useState<boolean>(false);

  // Palette drawer modal open
  const [isPaletteOpen, setIsPaletteOpen] = React.useState<boolean>(false);

  // Question start time tracking for speed metrics
  const questionStartTimeRef = React.useRef<number>(Date.now());

  // Horizontal category scroll container ref
  const categoryScrollRef = React.useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = React.useState<number>(0);

  // Reset explanation and timer on question change
  React.useEffect(() => {
    setForceShowExplanation(false);
    questionStartTimeRef.current = Date.now();
  }, [currentIndex]);

  // Synchronize initial filter category if passed from parent
  React.useEffect(() => {
    if (initialFilterCategory) {
      setSelectedCategory(initialFilterCategory);
      setCurrentIndex(0);
    }
  }, [initialFilterCategory]);

  // Jump to specific question if requested from Explorer
  React.useEffect(() => {
    if (targetQuestionNumericId) {
      setSelectedCategory('All');
      const targetIdx = questions.findIndex((q) => q.numericId === targetQuestionNumericId);
      if (targetIdx !== -1) {
        setCurrentIndex(targetIdx);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [targetQuestionNumericId, questions]);

  // Filtered questions without Core 265 Set
  const filteredQuestions = React.useMemo(() => {
    return questions.filter((q) => {
      if (selectedCategory !== 'All' && q.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [questions, selectedCategory]);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];
  const currentRecord = currentQ ? userProgress.answers[currentQ.id] : undefined;
  const isBookmarked = currentQ ? userProgress.bookmarkedIds.includes(currentQ.id) : false;

  // Auto-advance after answering
  React.useEffect(() => {
    if (isAutoAdvance && currentRecord) {
      const timer = setTimeout(() => {
        handleNext();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [currentRecord, isAutoAdvance]);

  // Handle category scroll tracking
  const handleCategoryScroll = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setScrollProgress((scrollLeft / maxScroll) * 100);
      }
    }
  };

  const scrollCategories = (amount: number) => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Option selection
  const handleSelectOption = (optionId: string) => {
    if (!currentQ || currentRecord) return; // Prevent changing after answer
    const isCorrect = optionId.toLowerCase() === currentQ.correctAnswerKey.toLowerCase();
    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));

    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playIncorrect();
    }

    const { next } = recordQuestionAnswer(userProgress, currentQ.id, optionId, isCorrect, timeSpent);
    setUserProgress(next);
  };

  // Bookmark toggle
  const handleToggleBookmark = () => {
    if (!currentQ) return;
    soundManager.playNav();
    const nextProgress = toggleBookmark(userProgress, currentQ.id);
    setUserProgress(nextProgress);
  };

  // Retry / পুনরায়
  const handleRetryCurrentQuestion = () => {
    if (!currentQ) return;
    soundManager.playNav();
    const updatedAnswers = { ...userProgress.answers };
    delete updatedAnswers[currentQ.id];
    const updated = { ...userProgress, answers: updatedAnswers };
    saveUserProgress(updated);
    setUserProgress(updated);
    setForceShowExplanation(false);
  };

  // Read aloud / TTS
  const handleSpeakQuestion = () => {
    if ('speechSynthesis' in window && currentQ) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQ.question);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Navigation
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (filteredQuestions.length === 0) return;
    soundManager.playNav();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(filteredQuestions.length - 1);
    }
    scrollToTop();
  };

  const handleNext = () => {
    if (filteredQuestions.length === 0) return;
    soundManager.playNav();
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
    scrollToTop();
  };

  const handleJumpTo = (index: number) => {
    soundManager.playNav();
    setCurrentIndex(index);
    setIsPaletteOpen(false);
    scrollToTop();
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
        handleNext();
      }
      if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
        handlePrev();
      }
      if (['a', 'b', 'c', 'd', 'e'].includes(e.key.toLowerCase()) && currentQ && !currentRecord) {
        handleSelectOption(e.key.toLowerCase());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredQuestions.length, currentQ, currentRecord]);

  // Helper to format question text with gold target box when Target is ON
  const renderFormattedQuestion = () => {
    if (!currentQ) return null;
    const text = currentQ.question;

    if (!showTargetSection) {
      return <span>{text}</span>;
    }

    // When Target is ON: highlight quoted words like ' river ' or 'word' or targetWord
    const targetWord = (currentQ.targetWord || '').trim();

    // Check if question has single quotes around a word/phrase
    const quoteRegex = /'([^']+)'|"([^"]+)"/;
    const match = text.match(quoteRegex);

    if (match) {
      const quoted = match[1] || match[2];
      const parts = text.split(match[0]);
      return (
        <span>
          {parts[0]}
          ' <span className="inline-block border border-[#d97706]/90 bg-[#291b05] text-[#fbbf24] px-2 py-0.5 rounded-md font-bold mx-0.5 shadow-sm">
            {quoted.trim()}
          </span> '
          {parts.slice(1).join(match[0])}
        </span>
      );
    }

    if (targetWord && text.toLowerCase().includes(targetWord.toLowerCase())) {
      const idx = text.toLowerCase().indexOf(targetWord.toLowerCase());
      const before = text.substring(0, idx);
      const matched = text.substring(idx, idx + targetWord.length);
      const after = text.substring(idx + targetWord.length);
      return (
        <span>
          {before}
          <span className="inline-block border border-[#d97706]/90 bg-[#291b05] text-[#fbbf24] px-2 py-0.5 rounded-md font-bold mx-0.5 shadow-sm">
            {matched}
          </span>
          {after}
        </span>
      );
    }

    return <span>{text}</span>;
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 pt-3 pb-24 text-slate-100 font-sans">
      {/* 1. Very Top Header Bar (Matching Screenshot with MATQUIZ and Single Target Button) */}
      <div className="flex items-center justify-between gap-2 mb-3 bg-[#0c1327]/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-[#1b2545]/80 shadow-md">
        {/* Left: MATQUIZ | # 1/1655 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090f20] border border-[#1d2a4d] text-xs font-bold shadow-inner">
            <span className="text-[#6875f5] tracking-wider font-extrabold text-xs uppercase">
              MATQUIZ
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-semibold">
              # {currentIndex + 1}/{filteredQuestions.length}
            </span>
          </div>

          {/* Target on/off button at very top (ONLY ONE on the entire page) */}
          <button
            onClick={onToggleTargetSection}
            title={showTargetSection ? 'Target Clues: ON (Click to turn OFF)' : 'Target Clues: OFF (Click to turn ON)'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
              showTargetSection
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20'
                : 'bg-[#090f20] text-slate-400 border-slate-700/60 hover:text-slate-200'
            }`}
          >
            <Target className={`w-3.5 h-3.5 ${showTargetSection ? 'text-amber-400' : 'text-slate-500'}`} />
            <span className="text-[11px] font-bold">
              Target {showTargetSection ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* Right Action Icons (TTS Speaker, Bookmark, Sound FX, Analytics/Grid) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* TTS Read Aloud */}
          <button
            onClick={handleSpeakQuestion}
            title="Read Question Aloud"
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors active:scale-90"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Bookmark */}
          <button
            onClick={handleToggleBookmark}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this question'}
            className="p-2 rounded-xl text-slate-300 hover:text-amber-300 hover:bg-slate-800/60 transition-colors active:scale-90"
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
            />
          </button>

          {/* Sound FX Toggle (Green speaker) */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Sound Effects: Enabled' : 'Sound Effects: Muted'}
            className="p-2 rounded-xl hover:bg-slate-800/60 transition-colors active:scale-90"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Question Grid / Analytics */}
          <button
            onClick={() => setIsPaletteOpen(true)}
            title="Question Palette Grid"
            className="p-2 rounded-xl text-slate-300 hover:text-indigo-400 hover:bg-slate-800/60 transition-colors active:scale-90"
          >
            <BarChart2 className="w-4 h-4 rotate-90" />
          </button>
        </div>
      </div>

      {/* 2. Category Selector & Scroll Bar (Core 265 Set Removed) */}
      <div className="mb-4 space-y-1.5">
        <div
          ref={categoryScrollRef}
          onScroll={handleCategoryScroll}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 scroll-smooth"
        >
          {/* All Questions Chip */}
          <button
            onClick={() => {
              setSelectedCategory('All');
              setCurrentIndex(0);
            }}
            className={`text-xs px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all select-none ${
              selectedCategory === 'All'
                ? 'bg-[#3d4ee7] text-white shadow-md shadow-indigo-600/30'
                : 'bg-[#0c1327] text-slate-400 hover:text-slate-200 border border-[#1b2545]'
            }`}
          >
            All ({questions.length})
          </button>

          {/* Category Chips (Core 265 Set Removed) */}
          {CATEGORIES.map((cat) => {
            const count = questions.filter((q) => q.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentIndex(0);
                }}
                className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all select-none ${
                  isSelected
                    ? 'bg-[#3d4ee7] text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'bg-[#0c1327] text-slate-400 hover:text-slate-200 border border-[#1b2545]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Horizontal Category Scrollbar Track */}
        <div className="flex items-center gap-2 px-1">
          <button
            onClick={() => scrollCategories(-180)}
            className="text-slate-500 hover:text-slate-300 p-0.5 transition-colors"
            title="Scroll categories left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <div className="flex-1 h-1.5 bg-[#090f20] rounded-full overflow-hidden border border-[#1b2545]/50 relative">
            <div
              className="h-full bg-slate-500/80 rounded-full transition-all duration-150"
              style={{
                width: '28%',
                transform: `translateX(${scrollProgress * 2.4}%)`,
              }}
            />
          </div>
          <button
            onClick={() => scrollCategories(180)}
            className="text-slate-500 hover:text-slate-300 p-0.5 transition-colors"
            title="Scroll categories right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Main Question Card (Matching Screenshot layout & style) */}
      {filteredQuestions.length === 0 ? (
        <div className="p-8 text-center bg-[#0c1327] border border-[#1b2545] rounded-2xl space-y-3">
          <p className="text-slate-300 font-bold">No questions found in this category.</p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Show All Questions
          </button>
        </div>
      ) : currentQ ? (
        <div className="space-y-4">
          <div className="bg-[#0c1327] border border-[#1b2545] rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3">
            {/* Top row inside card: Category Badge + Exam Tag */}
            <div className="flex items-center justify-between gap-2">
              <span className="bg-[#182552] text-[#6d8aff] text-xs font-black px-2.5 py-0.5 rounded tracking-wider uppercase">
                {currentQ.category}
              </span>
              {currentQ.examTag && (
                <span className="text-slate-400 text-xs font-normal truncate max-w-[280px]">
                  {currentQ.examTag}
                </span>
              )}
            </div>

            {/* Question Text with Target Clue highlight */}
            <div className="pt-1 pb-1">
              <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed tracking-tight">
                {renderFormattedQuestion()}
              </h2>
            </div>
          </div>

          {/* 4. MCQ Options (Matching red-wrong / green-correct screenshot style) */}
          <div className="space-y-2.5 pt-1">
            {currentQ.options.map((opt) => {
              const isSelected = currentRecord?.selectedOptionKey === opt.id;
              const isTheCorrectOption =
                opt.id.toLowerCase() === currentQ.correctAnswerKey.toLowerCase();
              const hasAnswered = !!currentRecord;

              // Default styles before answering
              let cardStyle =
                'bg-[#0c1327] hover:bg-[#121c3b] border-[#1b2545] text-slate-200';
              let badgeStyle =
                'bg-[#141d3b] text-slate-400 font-bold';

              if (hasAnswered) {
                if (isTheCorrectOption) {
                  // Correct option: Green border, green background, checkmark on right
                  cardStyle =
                    'bg-[#061e18] border-2 border-[#10b981] text-white shadow-md shadow-emerald-950/40';
                  badgeStyle =
                    'bg-[#10b981] text-white font-bold';
                } else if (isSelected && !isTheCorrectOption) {
                  // Incorrect selected option: Red border, red background, X mark on right
                  cardStyle =
                    'bg-[#1f0d18] border-2 border-[#e11d48] text-white shadow-md shadow-rose-950/40';
                  badgeStyle =
                    'bg-[#e11d48] text-white font-bold';
                } else {
                  // Other unselected options: Dimmed
                  cardStyle =
                    'bg-[#0c1327]/60 border-[#17203d] text-slate-500 opacity-60';
                  badgeStyle =
                    'bg-[#121a36] text-slate-600 font-semibold';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={hasAnswered}
                  className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border text-left transition-all active:scale-[0.99] select-none min-h-[52px] ${cardStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 shrink-0 rounded flex items-center justify-center text-xs uppercase transition-colors ${badgeStyle}`}
                    >
                      {opt.label}
                    </span>
                    <span className="text-sm font-semibold tracking-tight">
                      {opt.text}
                    </span>
                  </div>

                  {/* Right Status Feedback Icon */}
                  {hasAnswered && (
                    <div className="shrink-0 ml-2">
                      {isTheCorrectOption && (
                        <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                      )}
                      {isSelected && !isTheCorrectOption && (
                        <X className="w-4 h-4 text-rose-400 stroke-[3]" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* 5. Explanation Section (Matching screenshot • বাংলা অর্থ (EXPLANATION)) */}
          {(currentRecord || forceShowExplanation) && (
            <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-[#0c1327] border border-[#1b2545] space-y-2 animate-in fade-in duration-200">
              <div className="text-[#4f70f4] text-xs font-bold flex items-center gap-1.5">
                <span className="text-base leading-none">•</span>
                <span>বাংলা অর্থ (EXPLANATION)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                {currentQ.explanationBangla || currentQ.wordMeaningBangla || 'সঠিক উত্তরটি উপরে নির্দেশ করা হয়েছে।'}
              </p>
            </div>
          )}

          {/* 6. Bottom Navigation Controls (Prev, পুনরায়, স্বয়ংক্রিয়, Next) */}
          <div className="flex items-center justify-between gap-2.5 pt-5 max-w-xl mx-auto select-none">
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              title="Previous Question"
              className="px-5 py-2.5 rounded-xl bg-[#0c1327] border border-[#1b2545] text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            {/* Center Controls: পুনরায় (Retry) and স্বয়ংক্রিয় (Auto-Advance) */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRetryCurrentQuestion}
                title="Reset this question and try again"
                className="px-3.5 py-2.5 rounded-xl bg-[#0c1327] border border-[#1b2545] text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                <span>পুনরায়</span>
              </button>

              <button
                onClick={() => setIsAutoAdvance((prev) => !prev)}
                title={isAutoAdvance ? 'Auto-advance is ON' : 'Auto-advance is OFF'}
                className={`px-3.5 py-2.5 rounded-xl bg-[#0c1327] border font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md ${
                  isAutoAdvance
                    ? 'text-emerald-400 border-emerald-500/50 bg-emerald-950/20'
                    : 'text-slate-300 hover:text-white border-[#1b2545]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAutoAdvance ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                  }`}
                />
                <span>স্বয়ংক্রিয়</span>
              </button>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              title="Next Question"
              className="px-6 py-2.5 rounded-xl bg-[#4353ff] hover:bg-[#3444f0] text-white font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-indigo-600/30"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Question Grid Palette Modal */}
      {isPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#0c1327] border border-[#1b2545] rounded-3xl max-w-md w-full max-h-[80vh] flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2545]">
              <h3 className="font-bold text-sm text-white">
                Question Navigator ({filteredQuestions.length} Questions)
              </h3>
              <button
                onClick={() => setIsPaletteOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 grid grid-cols-5 sm:grid-cols-6 gap-2">
              {filteredQuestions.map((q, idx) => {
                const rec = userProgress.answers[q.id];
                const isCurrent = idx === currentIndex;
                let bg = 'bg-[#141d3b] text-slate-300 border-[#1b2545]';

                if (rec) {
                  bg = rec.isCorrect
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
                    : 'bg-rose-950/80 text-rose-300 border-rose-500/60';
                }

                if (isCurrent) {
                  bg += ' ring-2 ring-indigo-400 font-black';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => handleJumpTo(idx)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-transform active:scale-90 flex items-center justify-center ${bg}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
