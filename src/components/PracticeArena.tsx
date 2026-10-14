import React from 'react';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Grid,
  Filter,
  Check,
  Award,
  Zap,
} from 'lucide-react';
import { NormalizedMCQ, CATEGORIES } from '../data/questionsData';
import {
  UserProgressData,
  recordQuestionAnswer,
  toggleBookmark,
} from '../utils/storage';
import { soundManager } from '../utils/audio';

interface PracticeArenaProps {
  questions: NormalizedMCQ[];
  userProgress: UserProgressData;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgressData>>;
  initialFilterCategory?: string | null;
  onClearCategoryFilter?: () => void;
  targetQuestionNumericId?: number | null;
}

export const PracticeArena: React.FC<PracticeArenaProps> = ({
  questions,
  userProgress,
  setUserProgress,
  initialFilterCategory,
  onClearCategoryFilter,
  targetQuestionNumericId,
}) => {
  // Category filter state
  const [selectedCategory, setSelectedCategory] = React.useState<string>(
    initialFilterCategory || 'All'
  );

  // Status filter state
  const [statusFilter, setStatusFilter] = React.useState<
    'all' | 'core265' | 'unattempted' | 'mistakes' | 'bookmarked'
  >('all');

  // Search query in current pool
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Selected question index within the filtered list
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);

  // Show explanation toggle override
  const [forceShowExplanation, setForceShowExplanation] = React.useState<boolean>(false);

  // Palette drawer modal open
  const [isPaletteOpen, setIsPaletteOpen] = React.useState<boolean>(false);

  // Filter drawer/pill open
  const [showFilterBar, setShowFilterBar] = React.useState<boolean>(false);

  // Question start time tracking for speed metrics
  const questionStartTimeRef = React.useRef<number>(Date.now());

  // Streak celebration banner
  const [streakCelebration, setStreakCelebration] = React.useState<number | null>(null);

  // Synchronize initial filter category if passed from parent (e.g. from analytics click)
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
      setStatusFilter('all');
      setSearchQuery('');
      const targetIdx = questions.findIndex((q) => q.numericId === targetQuestionNumericId);
      if (targetIdx !== -1) {
        setCurrentIndex(targetIdx);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [targetQuestionNumericId, questions]);

  // Compute filtered questions
  const filteredQuestions = React.useMemo(() => {
    return questions.filter((q) => {
      // Core 265 question set filter
      if (statusFilter === 'core265' && q.numericId > 265) {
        return false;
      }

      // Category match
      if (selectedCategory !== 'All' && q.category !== selectedCategory) {
        return false;
      }

      // Status match
      const ans = userProgress.answers[q.id];
      if (statusFilter === 'unattempted' && ans) return false;
      if (statusFilter === 'mistakes' && (!ans || ans.isCorrect)) return false;
      if (statusFilter === 'bookmarked' && !userProgress.bookmarkedIds.includes(q.id))
        return false;

      // Text search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQ = q.question.toLowerCase().includes(query);
        const matchesWord = (q.targetWord || '').toLowerCase().includes(query);
        const matchesTag = q.examTag.toLowerCase().includes(query);
        const matchesMeaning = q.wordMeaningBangla.toLowerCase().includes(query);
        if (!matchesQ && !matchesWord && !matchesTag && !matchesMeaning) return false;
      }

      return true;
    });
  }, [questions, selectedCategory, statusFilter, searchQuery, userProgress]);

  // Guard current index within bounds
  React.useEffect(() => {
    if (currentIndex >= filteredQuestions.length && filteredQuestions.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredQuestions.length, currentIndex]);

  // Reset timer on question change
  React.useEffect(() => {
    questionStartTimeRef.current = Date.now();
    setForceShowExplanation(false);
  }, [currentIndex, filteredQuestions]);

  const currentQ: NormalizedMCQ | undefined = filteredQuestions[currentIndex];
  const currentRecord = currentQ ? userProgress.answers[currentQ.id] : undefined;
  const isBookmarked = currentQ
    ? userProgress.bookmarkedIds.includes(currentQ.id)
    : false;

  const handleSelectOption = (optionKey: string) => {
    if (!currentQ) return;

    // Time spent on this attempt in seconds
    const elapsedSeconds = Math.max(
      1,
      Math.round((Date.now() - questionStartTimeRef.current) / 1000)
    );

    const isCorrect = optionKey.toLowerCase() === currentQ.correctAnswerKey.toLowerCase();

    // Sound effect
    if (isCorrect) {
      soundManager.playCorrect();
      if ((userProgress.currentStreak + 1) % 5 === 0) {
        soundManager.playStreak();
        setStreakCelebration(userProgress.currentStreak + 1);
        setTimeout(() => setStreakCelebration(null), 2500);
      }
    } else {
      soundManager.playIncorrect();
    }

    const { next } = recordQuestionAnswer(
      userProgress,
      currentQ.id,
      optionKey,
      isCorrect,
      elapsedSeconds
    );
    setUserProgress(next);
  };

  const handleToggleBookmark = () => {
    if (!currentQ) return;
    const next = toggleBookmark(userProgress, currentQ.id);
    setUserProgress(next);
  };

  const touchStartXRef = React.useRef<number | null>(null);
  const touchStartYRef = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = e.changedTouches[0].clientY - touchStartYRef.current;
    // Horizontal swipe threshold 45px and dominant horizontal gesture
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
      if (diffX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (filteredQuestions.length === 0) return;
    soundManager.playNav();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      // Loop to last question
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
      // Loop back to start
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

  // Keyboard navigation support
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
      if (['a', 'b', 'c', 'd', 'e'].includes(e.key.toLowerCase()) && currentQ) {
        handleSelectOption(e.key.toLowerCase());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredQuestions.length, currentQ]);

  return (
    <div className="max-w-xl mx-auto px-3.5 pt-3 pb-24">
      {/* Category & Status Filter Bar */}
      <div className="mb-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Active Category Tag */}
          <button
            onClick={() => setShowFilterBar(!showFilterBar)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-indigo-900/60 text-xs font-semibold text-indigo-300 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span className="truncate max-w-[150px] sm:max-w-[200px]">
              {selectedCategory === 'All' ? 'All Topics' : selectedCategory}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
              {filteredQuestions.length}
            </span>
          </button>

          {/* Jump Palette button */}
          <button
            onClick={() => setIsPaletteOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all active:scale-95"
          >
            <Grid className="w-3.5 h-3.5 text-violet-400" />
            <span>Question #{currentIndex + 1}</span>
          </button>
        </div>

        {/* Quick status tabs: All, Core 265, Unattempted, Mistakes, Bookmarked */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: `All (${questions.length})` },
            { id: 'core265', label: '⭐ Core 265 Set' },
            { id: 'unattempted', label: 'Unattempted' },
            { id: 'mistakes', label: 'Mistakes' },
            { id: 'bookmarked', label: 'Starred' },
          ].map((tab) => {
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id as typeof statusFilter);
                  setCurrentIndex(0);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-sm shadow-indigo-500/25'
                    : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Expandable Category Picker */}
        {showFilterBar && (
          <div className="p-3 bg-slate-900/95 border border-indigo-950/80 rounded-2xl shadow-xl space-y-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Filter by Topic / Chapter:</span>
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    if (onClearCategoryFilter) onClearCategoryFilter();
                  }}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setShowFilterBar(false);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
                }`}
              >
                All Topics ({questions.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowFilterBar(false);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Streak celebration popup */}
      {streakCelebration && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black shadow-2xl shadow-amber-500/50 animate-bounce">
          <Zap className="w-5 h-5 fill-slate-950" />
          <span>🔥 {streakCelebration} Streak in a Row! Keep Going!</span>
        </div>
      )}

      {/* Main Question Card */}
      {filteredQuestions.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-base text-slate-200">No questions match this filter</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Try switching status or select "All Topics" to view questions.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setStatusFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : currentQ ? (
        <div
          className="space-y-4 touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Question Card Box */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden backdrop-blur-sm">
            {/* Top metadata row */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/60 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-indigo-400 tracking-wider">
                  Q {currentIndex + 1} of {filteredQuestions.length}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                  {currentQ.category}
                </span>
                {currentQ.typeDisplay && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-950/60 text-violet-300 border border-violet-800/50">
                    {currentQ.typeDisplay}
                  </span>
                )}
              </div>

              {/* Bookmark & ID badge */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleBookmark}
                  title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this question'}
                  className={`p-1.5 rounded-xl transition-all active:scale-90 ${
                    isBookmarked
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`}
                  />
                </button>
              </div>
            </div>

            {/* Exam Tag Banner if available */}
            {currentQ.examTag && (
              <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-pink-300/90 font-medium bg-pink-950/20 px-2.5 py-1 rounded-lg border border-pink-900/30">
                <Award className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span className="truncate">{currentQ.examTag}</span>
              </div>
            )}

            {/* Question Text */}
            <div className="mt-4 mb-4">
              <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed tracking-tight">
                {currentQ.question}
              </h2>

              {/* Target word highlighted pill if present */}
              {currentQ.targetWord && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-indigo-500/15 to-violet-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                  <span className="text-slate-400 font-normal">Target:</span>
                  <span className="font-bold text-white">{currentQ.targetWord}</span>
                  {currentQ.wordMeaningBangla && (
                    <span className="text-pink-300 ml-1">
                      ({currentQ.wordMeaningBangla})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* MCQ Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt) => {
                const isSelected = currentRecord?.selectedOptionKey === opt.id;
                const isTheCorrectOption =
                  opt.id.toLowerCase() === currentQ.correctAnswerKey.toLowerCase();
                const hasAnswered = !!currentRecord;

                let btnStyle =
                  'bg-slate-800/70 hover:bg-slate-800 text-slate-200 border-slate-700/70 hover:border-indigo-500/50';
                let labelStyle = 'bg-slate-700/80 text-slate-300 border-slate-600/70';

                if (hasAnswered) {
                  if (isTheCorrectOption) {
                    btnStyle =
                      'bg-emerald-950/80 text-emerald-100 border-emerald-500 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-500/40';
                    labelStyle = 'bg-emerald-600 text-white border-emerald-400';
                  } else if (isSelected && !isTheCorrectOption) {
                    btnStyle =
                      'bg-rose-950/80 text-rose-100 border-rose-500/90 shadow-md shadow-rose-500/20';
                    labelStyle = 'bg-rose-600 text-white border-rose-400';
                  } else {
                    btnStyle = 'bg-slate-900/50 text-slate-400 border-slate-800 opacity-60';
                    labelStyle = 'bg-slate-800 text-slate-400 border-slate-700';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-150 active:scale-[0.99] select-none ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 shrink-0 rounded-xl flex items-center justify-center text-xs font-black border transition-colors ${labelStyle}`}
                      >
                        {opt.label}
                      </span>
                      <span className="text-sm font-semibold tracking-tight">
                        {opt.text}
                      </span>
                    </div>

                    {/* Feedback Icons */}
                    {hasAnswered && (
                      <div className="shrink-0 ml-2">
                        {isTheCorrectOption && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                        )}
                        {isSelected && !isTheCorrectOption && (
                          <XCircle className="w-5 h-5 text-rose-400 fill-rose-950" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Section */}
            {(currentRecord || forceShowExplanation) && (
              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>
                      Correct Answer:{' '}
                      <strong className="text-white">
                        Option {currentQ.correctAnswerKey.toUpperCase()} ({currentQ.correctOptionText})
                      </strong>
                    </span>
                  </div>

                  {currentRecord && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        currentRecord.isCorrect
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {currentRecord.isCorrect ? 'Correct!' : 'Incorrect'}
                    </span>
                  )}
                </div>

                {/* Bengali Explanation Box */}
                {(currentQ.explanationBangla || currentQ.wordMeaningBangla) && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-purple-950/30 border border-indigo-900/50 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                      <span className="text-pink-300">ব্যাখ্যা ও অর্থ (Explanation):</span>
                      {currentQ.wordMeaningBangla && (
                        <span className="text-amber-300 font-semibold">
                          বাংলা অর্থ: {currentQ.wordMeaningBangla}
                        </span>
                      )}
                    </div>

                    {currentQ.explanationBangla && (
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                        {currentQ.explanationBangla}
                      </p>
                    )}
                  </div>
                )}

                {/* Instant One-Tap Next Question in Explanation */}
                <div className="pt-1">
                  <button
                    onClick={handleNext}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all hover:opacity-95"
                  >
                    <span>{currentIndex === filteredQuestions.length - 1 ? 'Start Over from Q1' : 'Next Question'}</span>
                    {currentIndex === filteredQuestions.length - 1 ? (
                      <RotateCcw className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Toggle show explanation button if not yet answered */}
            {!currentRecord && !forceShowExplanation && (
              <div className="mt-3 text-right">
                <button
                  onClick={() => setForceShowExplanation(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 ml-auto"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Reveal Explanation</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Card Navigation Controls */}
          <div className="flex items-center justify-between gap-2 px-1 pt-1">
            <button
              onClick={handlePrev}
              title="Previous Question (Left Arrow)"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm font-bold text-slate-200 hover:text-white hover:border-slate-700 transition-all active:scale-95 shadow-md min-h-[48px]"
            >
              <ChevronLeft className="w-4 h-4 shrink-0 text-slate-400" />
              <span>{currentIndex === 0 ? 'Last Q' : 'Previous'}</span>
            </button>

            {/* Question status counter with quick palette modal trigger */}
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="flex flex-col items-center justify-center px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-colors min-h-[48px]"
            >
              <span className="text-xs font-black text-indigo-400">
                {currentIndex + 1} / {filteredQuestions.length}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                <Grid className="w-3 h-3 text-violet-400" /> Grid
              </span>
            </button>

            <button
              onClick={handleNext}
              title="Next Question (Right Arrow or Enter)"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-xs sm:text-sm font-extrabold text-white hover:from-indigo-500 hover:to-violet-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/30 min-h-[48px]"
            >
              <span>{currentIndex === filteredQuestions.length - 1 ? 'Restart Set' : 'Next'}</span>
              {currentIndex === filteredQuestions.length - 1 ? (
                <RotateCcw className="w-4 h-4 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 shrink-0" />
              )}
            </button>
          </div>

          {/* Touch swipe navigation hint */}
          <div className="text-center text-[11px] text-slate-500 font-medium py-0.5 select-none flex items-center justify-center gap-1.5">
            <span>👈 Swipe left for Next • Swipe right for Prev 👉</span>
          </div>
        </div>
      ) : null}

      {/* Jump Question Palette Modal */}
      {isPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-extrabold text-base text-white">Question Navigator</h3>
                <p className="text-xs text-slate-400">
                  {filteredQuestions.length} Questions in current view
                </p>
              </div>
              <button
                onClick={() => setIsPaletteOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 py-2 text-[10px] text-slate-400 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Correct
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Wrong
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" /> Unattempted
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Current
              </span>
            </div>

            {/* Grid of question buttons */}
            <div className="flex-1 overflow-y-auto grid grid-cols-6 sm:grid-cols-8 gap-2 py-3 pr-1">
              {filteredQuestions.map((q, idx) => {
                const ans = userProgress.answers[q.id];
                const isCur = idx === currentIndex;

                let bg = 'bg-slate-800 text-slate-300 hover:bg-slate-750';
                if (ans) {
                  bg = ans.isCorrect
                    ? 'bg-emerald-600/90 text-white font-bold'
                    : 'bg-rose-600/90 text-white font-bold';
                }
                if (isCur) {
                  bg += ' ring-2 ring-indigo-400 shadow-md shadow-indigo-500/50';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => handleJumpTo(idx)}
                    className={`h-9 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center ${bg}`}
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
