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
      }, 1100);
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

  const handlePrev = () => {
    if (filteredQuestions.length === 0) return;
    soundManager.playNav();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(filteredQuestions.length - 1);
    }
  };

  const handleNext = () => {
    if (filteredQuestions.length === 0) return;
    soundManager.playNav();
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleJumpTo = (index: number) => {
    soundManager.playNav();
    setCurrentIndex(index);
    setIsPaletteOpen(false);
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
          ' <span className="inline-block border border-[#d97706]/90 bg-[#291b05] text-[#fbbf24] px-1.5 py-0.5 rounded font-bold mx-0.5 shadow-sm">
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
          <span className="inline-block border border-[#d97706]/90 bg-[#291b05] text-[#fbbf24] px-1.5 py-0.5 rounded font-bold mx-0.5 shadow-sm">
            {matched}
          </span>
          {after}
        </span>
      );
    }

    return <span>{text}</span>;
  };

  // Helper to extract clean Target Word Meaning
  const getTargetMeaningDisplay = () => {
    if (!currentQ) return null;
    const meaning = (currentQ.wordMeaningBangla || '').trim();
    const target = (currentQ.targetWord || '').trim();

    if (!meaning && !target) return null;
    if (!meaning) return target;
    if (!target) return meaning;

    if (meaning.toLowerCase().startsWith(target.toLowerCase())) {
      return meaning;
    }
    return `${target} — ${meaning}`;
  };

  return (
    <div className="h-full max-h-full w-full max-w-xl mx-auto flex flex-col justify-between overflow-hidden px-2 sm:px-3.5 pt-1.5 pb-1 text-slate-100 font-sans select-none">
      {/* Top Fixed Section: Header Bar & Category Scrubber */}
      <div className="shrink-0 space-y-1">
        {/* 1. Header Bar: MATQUIZ + Single Target Button + Top Icons */}
        <div className="flex items-center justify-between gap-1.5 bg-[#0c1327]/90 px-2 sm:px-3 py-1 rounded-xl border border-[#1b2545]/80 shadow-sm">
          {/* Left: MATQUIZ | # 1/1655 */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#090f20] border border-[#1d2a4d] text-xs font-bold shadow-inner">
              <span className="text-[#6875f5] tracking-wider font-extrabold text-[11px] uppercase">
                MATQUIZ
              </span>
              <span className="text-slate-600 text-[10px]">|</span>
              <span className="text-slate-300 font-semibold text-[11px]">
                # {currentIndex + 1}/{filteredQuestions.length}
              </span>
            </div>

            {/* Target on/off button at very top (ONLY ONE on the entire page) */}
            <button
              onClick={onToggleTargetSection}
              title={showTargetSection ? 'Target Clues: ON (Click to turn OFF)' : 'Target Clues: OFF (Click to turn ON)'}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-bold transition-all active:scale-95 ${
                showTargetSection
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20'
                  : 'bg-[#090f20] text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
            >
              <Target className={`w-3 h-3 ${showTargetSection ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>Target {showTargetSection ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Right Action Icons (TTS Speaker, Bookmark, Sound FX, Analytics/Grid) */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              onClick={handleSpeakQuestion}
              title="Read Question Aloud"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors active:scale-90"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleToggleBookmark}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this question'}
              className="p-1.5 rounded-lg text-slate-300 hover:text-amber-300 hover:bg-slate-800/60 transition-colors active:scale-90"
            >
              <Bookmark
                className={`w-3.5 h-3.5 ${isBookmarked ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
              />
            </button>

            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Sound Effects: Enabled' : 'Sound Effects: Muted'}
              className="p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors active:scale-90"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            <button
              onClick={() => setIsPaletteOpen(true)}
              title="Question Palette Grid"
              className="p-1.5 rounded-lg text-slate-300 hover:text-indigo-400 hover:bg-slate-800/60 transition-colors active:scale-90"
            >
              <BarChart2 className="w-3.5 h-3.5 rotate-90" />
            </button>
          </div>
        </div>

        {/* 2. Category Selector & Scroll Bar (Core 265 Set Removed) */}
        <div className="space-y-0.5">
          <div
            ref={categoryScrollRef}
            onScroll={handleCategoryScroll}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth"
          >
            <button
              onClick={() => {
                setSelectedCategory('All');
                setCurrentIndex(0);
              }}
              className={`text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap transition-all select-none ${
                selectedCategory === 'All'
                  ? 'bg-[#3d4ee7] text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-[#0c1327] text-slate-400 hover:text-slate-200 border border-[#1b2545]'
              }`}
            >
              All ({questions.length})
            </button>

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
                  className={`text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap transition-all select-none ${
                    isSelected
                      ? 'bg-[#3d4ee7] text-white font-bold shadow-sm shadow-indigo-600/30'
                      : 'bg-[#0c1327] text-slate-400 hover:text-slate-200 border border-[#1b2545]'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Horizontal Category Scrollbar Track */}
          <div className="flex items-center gap-1.5 px-0.5">
            <button
              onClick={() => scrollCategories(-180)}
              className="text-slate-500 hover:text-slate-300 p-0.5 transition-colors"
              title="Scroll categories left"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <div className="flex-1 h-1 bg-[#090f20] rounded-full overflow-hidden border border-[#1b2545]/50 relative">
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
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Middle Flexible Section: Question Card + Options + Explanation (Fits exactly without scrolling) */}
      <div className="flex-1 min-h-0 flex flex-col justify-center space-y-1.5 sm:space-y-2 overflow-hidden my-auto py-1">
        {filteredQuestions.length === 0 ? (
          <div className="p-4 text-center bg-[#0c1327] border border-[#1b2545] rounded-xl space-y-2">
            <p className="text-slate-300 font-bold text-xs">No questions found in this category.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
            >
              Show All Questions
            </button>
          </div>
        ) : currentQ ? (
          <>
            {/* 3. Question Card */}
            <div className="shrink-0 bg-[#0c1327] border border-[#1b2545] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-lg space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="bg-[#182552] text-[#6d8aff] text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
                  {currentQ.category}
                </span>
                {currentQ.examTag && (
                  <span className="text-slate-400 text-[10px] sm:text-[11px] font-normal truncate max-w-[200px] sm:max-w-[260px]">
                    {currentQ.examTag}
                  </span>
                )}
              </div>

              <h2 className="text-xs sm:text-base font-bold text-white leading-snug tracking-tight pt-0.5">
                {renderFormattedQuestion()}
              </h2>
            </div>

            {/* 4. MCQ Options List */}
            <div className="shrink-0 space-y-1 sm:space-y-1.5">
              {currentQ.options.map((opt) => {
                const isSelected = currentRecord?.selectedOptionKey === opt.id;
                const isTheCorrectOption =
                  opt.id.toLowerCase() === currentQ.correctAnswerKey.toLowerCase();
                const hasAnswered = !!currentRecord;

                let cardStyle =
                  'bg-[#0c1327] hover:bg-[#121c3b] border-[#1b2545] text-slate-200';
                let badgeStyle =
                  'bg-[#141d3b] text-slate-400 font-bold';

                if (hasAnswered) {
                  if (isTheCorrectOption) {
                    cardStyle =
                      'bg-[#061e18] border-2 border-[#10b981] text-white shadow-md shadow-emerald-950/40';
                    badgeStyle =
                      'bg-[#10b981] text-white font-bold';
                  } else if (isSelected && !isTheCorrectOption) {
                    cardStyle =
                      'bg-[#1f0d18] border-2 border-[#e11d48] text-white shadow-md shadow-rose-950/40';
                    badgeStyle =
                      'bg-[#e11d48] text-white font-bold';
                  } else {
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
                    className={`w-full flex items-center justify-between py-1.5 px-3 sm:py-2.5 sm:px-3.5 rounded-xl border text-left transition-all active:scale-[0.99] select-none min-h-[38px] sm:min-h-[44px] ${cardStyle}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-5 h-5 shrink-0 rounded flex items-center justify-center text-[10px] sm:text-xs uppercase transition-colors ${badgeStyle}`}
                      >
                        {opt.label}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold tracking-tight">
                        {opt.text}
                      </span>
                    </div>

                    {hasAnswered && (
                      <div className="shrink-0 ml-1.5">
                        {isTheCorrectOption && (
                          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                        )}
                        {isSelected && !isTheCorrectOption && (
                          <X className="w-3.5 h-3.5 text-rose-400 stroke-[3]" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 5. Explanation Section with Target Word Meaning */}
            {(currentRecord || forceShowExplanation) && (
              <div className="shrink-0 max-h-[82px] sm:max-h-[105px] overflow-y-auto rounded-xl bg-[#0c1327] border border-[#1b2545] p-2 sm:p-2.5 space-y-1 animate-in fade-in duration-150">

                {/* Target Word Meaning in Bangla */}
                {getTargetMeaningDisplay() && (
                  <div className="text-[11px] sm:text-xs text-amber-300 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30 flex items-baseline gap-1">
                    <span className="text-amber-400 font-extrabold shrink-0">🎯 Target:</span>
                    <span className="text-amber-200">{getTargetMeaningDisplay()}</span>
                  </div>
                )}

                {/* Full Explanation text */}
                {currentQ.explanationBangla && (
                  <p className="text-[11px] sm:text-xs text-slate-200 leading-snug font-normal whitespace-pre-line pt-0.5">
                    {currentQ.explanationBangla}
                  </p>
                )}
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* 6. Bottom Navigation Controls (Prev, পুনরায়, স্বয়ংক্রিয়, Next) */}
      <div className="shrink-0 flex items-center justify-between gap-1.5 sm:gap-2 pt-1 pb-0.5 max-w-xl mx-auto w-full select-none">
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          title="Previous Question"
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#0c1327] border border-[#1b2545] text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95 shadow-md"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        {/* Center Controls: পুনরায় (Retry) and স্বয়ংক্রিয় (Auto-Advance) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleRetryCurrentQuestion}
            title="Reset this question and try again"
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#0c1327] border border-[#1b2545] text-slate-300 hover:text-white font-semibold text-[11px] sm:text-xs flex items-center gap-1 transition-all active:scale-95 shadow-md"
          >
            <RotateCcw className="w-3 h-3 text-indigo-400" />
            <span>পুনরায়</span>
          </button>

          <button
            onClick={() => setIsAutoAdvance((prev) => !prev)}
            title={isAutoAdvance ? 'Auto-advance is ON' : 'Auto-advance is OFF'}
            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border font-semibold text-[11px] sm:text-xs flex items-center gap-1 transition-all active:scale-95 shadow-md ${
              isAutoAdvance
                ? 'text-emerald-400 border-emerald-500/50 bg-emerald-950/20'
                : 'text-slate-300 hover:text-white border-[#1b2545] bg-[#0c1327]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
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
          className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl bg-[#4353ff] hover:bg-[#3444f0] text-white font-extrabold text-xs flex items-center gap-1 transition-all active:scale-95 shadow-lg shadow-indigo-600/30"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Question Grid Palette Modal */}
      {isPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-[#0c1327] border border-[#1b2545] rounded-3xl max-w-md w-full max-h-[82vh] flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#1b2545]">
              <h3 className="font-bold text-xs sm:text-sm text-white">
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
                    className={`py-1.5 rounded-xl text-xs font-bold border transition-transform active:scale-90 flex items-center justify-center ${bg}`}
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
