import React from 'react';
import confetti from 'canvas-confetti';
import {
  Timer,
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Award,
  ChevronRight,
  ChevronLeft,
  Grid,
  Zap,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { NormalizedMCQ, CATEGORIES } from '../data/questionsData';
import {
  UserProgressData,
  QuizSessionResult,
  saveQuizSession,
  recordQuestionAnswer,
} from '../utils/storage';
import { soundManager } from '../utils/audio';

interface ExamArenaProps {
  allQuestions: NormalizedMCQ[];
  userProgress: UserProgressData;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgressData>>;
  onGoToAnalytics: () => void;
  showTargetSection?: boolean;
}

export const ExamArena: React.FC<ExamArenaProps> = ({
  allQuestions,
  userProgress,
  setUserProgress,
  onGoToAnalytics,
  showTargetSection = true,
}) => {
  // Phase: 'setup' | 'active' | 'result'
  const [phase, setPhase] = React.useState<'setup' | 'active' | 'result'>('setup');

  // Exam Setup options - Default 20 MCQ Mock Test
  const [questionCount, setQuestionCount] = React.useState<number>(20);
  const [selectedTopic, setSelectedTopic] = React.useState<string>('All');
  const [timeLimitMinutes, setTimeLimitMinutes] = React.useState<number>(15);

  // Active Exam State
  const [examQuestions, setExamQuestions] = React.useState<NormalizedMCQ[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, string>>({});
  const [flaggedIds, setFlaggedIds] = React.useState<string[]>([]);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = React.useState<number>(600);
  const [examStartTime, setExamStartTime] = React.useState<number>(0);
  const [isPaletteOpen, setIsPaletteOpen] = React.useState<boolean>(false);

  // Completed result state
  const [latestResult, setLatestResult] = React.useState<QuizSessionResult | null>(null);

  // Start exam handler
  const handleStartExam = () => {
    // Filter questions
    let pool = allQuestions;
    if (selectedTopic === 'core265') {
      pool = pool.filter((q) => q.numericId <= 265);
    } else if (selectedTopic !== 'All') {
      pool = pool.filter((q) => q.category === selectedTopic);
    }

    if (pool.length === 0) {
      pool = allQuestions;
    }

    // Shuffle and pick questionCount
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(questionCount, pool.length));

    setExamQuestions(selected);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlaggedIds([]);
    setTimeRemainingSeconds(timeLimitMinutes * 60);
    setExamStartTime(Date.now());
    setPhase('active');
  };

  // Timer effect
  React.useEffect(() => {
    if (phase !== 'active') return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, examQuestions, selectedAnswers]);

  // Handle option select
  const handleSelectOption = (qId: string, optKey: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optKey,
    }));
  };

  // Toggle flag for review
  const handleToggleFlag = (qId: string) => {
    setFlaggedIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  // Submit and grade the exam
  const handleSubmitExam = () => {
    const totalTime = Math.max(1, Math.round((Date.now() - examStartTime) / 1000));
    let correctCount = 0;
    let wrongCount = 0;

    const records = examQuestions.map((q) => {
      const userKey = selectedAnswers[q.id] || '';
      const isCorrect = userKey.toLowerCase() === q.correctAnswerKey.toLowerCase();
      if (isCorrect) correctCount++;
      else wrongCount++;

      return {
        questionId: q.id,
        questionText: q.question,
        userKey,
        correctKey: q.correctAnswerKey,
        isCorrect,
        explanation: q.explanationBangla || q.wordMeaningBangla || 'No explanation provided.',
      };
    });

    const scorePercentage =
      examQuestions.length > 0 ? Math.round((correctCount / examQuestions.length) * 100) : 0;
    const avgTimeSeconds =
      examQuestions.length > 0 ? Math.round((totalTime / examQuestions.length) * 10) / 10 : 0;

    const sessionResult: QuizSessionResult = {
      id: `exam-${Date.now()}`,
      title: `${selectedTopic === 'All' ? 'Full Mock' : selectedTopic} Exam (${examQuestions.length} Qs)`,
      category: selectedTopic,
      timestamp: Date.now(),
      totalQuestions: examQuestions.length,
      correctCount,
      wrongCount,
      scorePercentage,
      totalTimeSeconds: totalTime,
      avgTimeSeconds,
      records,
    };

    // Save to user progress and individual answers
    let updatedProgress = saveQuizSession(userProgress, sessionResult);
    for (const rec of records) {
      if (rec.userKey) {
        const { next } = recordQuestionAnswer(
          updatedProgress,
          rec.questionId,
          rec.userKey,
          rec.isCorrect,
          avgTimeSeconds
        );
        updatedProgress = next;
      }
    }
    setUserProgress(updatedProgress);

    // Audio & Confetti
    if (scorePercentage >= 60) {
      soundManager.playComplete();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981'],
        });
      } catch {}
    }

    setLatestResult(sessionResult);
    setPhase('result');
  };

  // Format timer string MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const [showSubmitModal, setShowSubmitModal] = React.useState<boolean>(false);

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
    if (examQuestions.length === 0) return;
    soundManager.playNav();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(examQuestions.length - 1);
    }
    scrollToTop();
  };

  const handleNext = () => {
    if (examQuestions.length === 0) return;
    soundManager.playNav();
    if (currentIndex < examQuestions.length - 1) {
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

  const currentQ = examQuestions[currentIndex];

  // Keyboard navigation support for active exam
  React.useEffect(() => {
    if (phase !== 'active') return;
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
        handleSelectOption(currentQ.id, e.key.toLowerCase());
      }
      if (['1', '2', '3', '4'].includes(e.key) && currentQ) {
        const keyMap: Record<string, string> = { '1': 'a', '2': 'b', '3': 'c', '4': 'd' };
        handleSelectOption(currentQ.id, keyMap[e.key]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, currentIndex, examQuestions.length, currentQ]);

  // -------------------------------------------------------------
  // PHASE: SETUP SCREEN
  // -------------------------------------------------------------
  if (phase === 'setup') {
    return (
      <div className="max-w-xl mx-auto px-4 pt-4 pb-24 space-y-5">
        {/* Banner */}
        <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-700/40 shadow-xl">
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30">
              <Timer className="w-3.5 h-3.5 text-indigo-400" />
              Real-time Exam Simulator
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Timed Mock Challenge
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Test your speed, accuracy, and endurance with real competitive exam standards.
            </p>
          </div>
          <Sparkles className="absolute -right-4 -bottom-4 w-28 h-28 text-indigo-500/10 pointer-events-none" />
        </div>

        {/* Configuration options */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5">
          {/* Preset question count */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Number of Questions</span>
              <span className="text-indigo-400 font-extrabold">{questionCount} Qs</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[20, 10, 30, 50].map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    setQuestionCount(count);
                    setTimeLimitMinutes(Math.max(5, Math.round(count * 0.75)));
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    questionCount === count
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30 ring-1 ring-indigo-400'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750 border border-slate-700/50'
                  }`}
                >
                  {count} Qs {count === 20 ? '⭐' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Exam Topic Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Topic Focus</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">Mixed All Topics ({allQuestions.length} Questions)</option>
              <option value="Verb">🎯 Verbs Special Focus ({allQuestions.filter((q) => q.category === 'Verb').length} Qs)</option>
              <option value="Prepositions">🎯 Appropriate Prepositions Focus ({allQuestions.filter((q) => q.category === 'Prepositions').length} Qs)</option>
              <option value="core265">⭐ Core 265 Question Bank (Q1 - Q265)</option>
              {CATEGORIES.filter((cat) => cat !== 'Verb' && cat !== 'Prepositions').map((cat) => {
                const count = allQuestions.filter((q) => q.category === cat).length;
                return (
                  <option key={cat} value={cat}>
                    {cat} ({count} Qs)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Time Limit */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Time Allotted</span>
              <span className="text-pink-400 font-extrabold">{timeLimitMinutes} Minutes</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 30].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setTimeLimitMinutes(mins)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    timeLimitMinutes === mins
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-500/30 ring-1 ring-pink-400'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750 border border-slate-700/50'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Start CTA */}
          <button
            onClick={handleStartExam}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-600 to-pink-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 hover:opacity-95 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Exam Challenge</span>
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // PHASE: ACTIVE EXAM IN PROGRESS
  // -------------------------------------------------------------
  if (phase === 'active' && currentQ) {
    const isFlagged = flaggedIds.includes(currentQ.id);
    const selectedOpt = selectedAnswers[currentQ.id];
    const answeredCount = Object.keys(selectedAnswers).length;
    const isUrgentTime = timeRemainingSeconds < 60;

    return (
      <div
        className="max-w-xl mx-auto px-3.5 pt-2 pb-24 space-y-3 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Exam Status Bar */}
        <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          {/* Question Counter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-indigo-400">
              Q {currentIndex + 1} / {examQuestions.length}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
              {answeredCount} Answered
            </span>
          </div>

          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs font-black transition-all ${
              isUrgentTime
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse'
                : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${isUrgentTime ? 'text-rose-400' : 'text-indigo-400'}`} />
            <span>{formatTime(timeRemainingSeconds)}</span>
          </div>

          {/* Quick grid button */}
          <button
            onClick={() => setIsPaletteOpen(true)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-300"
            style={{
              width: `${Math.round(((currentIndex + 1) / examQuestions.length) * 100)}%`,
            }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">{currentQ.category}</span>
            <button
              onClick={() => handleToggleFlag(currentQ.id)}
              className={`text-xs px-2 py-1 rounded-lg font-bold transition-all ${
                isFlagged
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isFlagged ? '★ Marked' : '☆ Mark for Review'}
            </button>
          </div>

          {/* Question Text */}
          <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {currentQ.question}
          </h2>

          {/* Target Word if present and enabled */}
          {currentQ.targetWord && showTargetSection && (
            <div className="inline-block px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300 font-semibold">
              Word: <span className="text-white font-bold">{currentQ.targetWord}</span>
            </div>
          )}

          {/* Options */}
          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOpt === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(currentQ.id, opt.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all active:scale-[0.99] ${
                    isSelected
                      ? 'bg-indigo-600/30 text-white border-indigo-500 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400'
                      : 'bg-slate-800/60 text-slate-200 border-slate-700/60 hover:bg-slate-800'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black border transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-400'
                        : 'bg-slate-700 text-slate-300 border-slate-600'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-sm font-semibold">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation Controls */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={handlePrev}
            title="Previous Question (Left Arrow)"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm font-bold text-slate-200 hover:text-white hover:border-slate-700 transition-all active:scale-95 shadow-md min-h-[48px]"
          >
            <ChevronLeft className="w-4 h-4 shrink-0 text-slate-400" />
            <span>{currentIndex === 0 ? 'Last Q' : 'Prev'}</span>
          </button>

          {/* Question overview indicator and trigger */}
          <button
            onClick={() => setIsPaletteOpen(true)}
            className="flex flex-col items-center justify-center px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-colors min-h-[48px]"
          >
            <span className="text-xs font-black text-indigo-400">
              {currentIndex + 1} / {examQuestions.length}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
              <Grid className="w-3 h-3 text-violet-400" /> Overview
            </span>
          </button>

          <button
            onClick={handleNext}
            title="Next Question (Right Arrow)"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-xs sm:text-sm font-extrabold text-white hover:from-indigo-500 hover:to-violet-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/30 min-h-[48px]"
          >
            <span>{currentIndex === examQuestions.length - 1 ? 'Back to Q1' : 'Next'}</span>
            {currentIndex === examQuestions.length - 1 ? (
              <RotateCcw className="w-4 h-4 shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 shrink-0" />
            )}
          </button>
        </div>

        {/* Dedicated Submit Exam Action Button */}
        <div className="pt-1">
          <button
            onClick={() => {
              if (answeredCount < examQuestions.length) {
                setShowSubmitModal(true);
              } else {
                handleSubmitExam();
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-xs sm:text-sm font-black text-white shadow-xl shadow-emerald-600/25 hover:opacity-95 active:scale-95 transition-all min-h-[48px]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Exam ({answeredCount}/{examQuestions.length} Answered)</span>
          </button>
        </div>

        {/* Mobile touch swipe hint */}
        <div className="text-center text-[11px] text-slate-500 font-medium py-0.5 select-none flex items-center justify-center gap-1.5">
          <span>👈 Swipe left for Next • Swipe right for Prev 👉</span>
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Submit Exam?</h3>
                  <p className="text-xs text-slate-400">
                    You answered <span className="text-indigo-400 font-bold">{answeredCount}</span> of <span className="text-white font-bold">{examQuestions.length}</span> questions.
                  </p>
                </div>
              </div>
              <p className="text-xs text-amber-200/90 bg-amber-950/30 p-3 rounded-xl border border-amber-800/40 leading-relaxed">
                ⚠️ You have <strong className="text-white">{examQuestions.length - answeredCount}</strong> unanswered questions. Unanswered questions will be scored as 0 marks.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    const firstUnansweredIdx = examQuestions.findIndex((q) => !selectedAnswers[q.id]);
                    if (firstUnansweredIdx !== -1) {
                      setCurrentIndex(firstUnansweredIdx);
                      scrollToTop();
                    }
                  }}
                  className="flex-1 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition-all"
                >
                  Review Missing
                </button>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    handleSubmitExam();
                  }}
                  className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all"
                >
                  Yes, Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* In-exam question grid palette */}
        {isPaletteOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-sm text-white">Questions Overview</h3>
                <button
                  onClick={() => setIsPaletteOpen(false)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto grid grid-cols-6 sm:grid-cols-8 gap-2 py-3">
                {examQuestions.map((q, idx) => {
                  const isAns = !!selectedAnswers[q.id];
                  const isCur = idx === currentIndex;
                  const isFlag = flaggedIds.includes(q.id);

                  let bg = 'bg-slate-800 text-slate-300';
                  if (isAns) bg = 'bg-indigo-600 text-white font-bold';
                  if (isFlag) bg = 'bg-amber-600 text-white font-bold';
                  if (isCur) bg += ' ring-2 ring-pink-400';

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsPaletteOpen(false);
                      }}
                      className={`h-9 rounded-xl text-xs font-bold flex items-center justify-center ${bg}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleSubmitExam}
                className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Submit Exam Now ({answeredCount}/{examQuestions.length})
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // PHASE: RESULT SCREEN WITH DETAILED REVIEW
  // -------------------------------------------------------------
  if (phase === 'result' && latestResult) {
    const isHighPassing = latestResult.scorePercentage >= 80;
    const isPassing = latestResult.scorePercentage >= 50;

    return (
      <div className="max-w-xl mx-auto px-4 pt-3 pb-24 space-y-4">
        {/* Score Card Header */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/70 border border-indigo-700/40 text-center space-y-3 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 text-xs font-bold text-indigo-300 border border-slate-700">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Exam Results & Scorecard</span>
          </div>

          <div className="py-2">
            <div className="text-5xl font-black bg-gradient-to-r from-emerald-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
              {latestResult.scorePercentage}%
            </div>
            <div className="text-xs font-semibold text-slate-300 mt-1">
              {isHighPassing
                ? '🌟 Outstanding Mastery! Excellent Performance!'
                : isPassing
                ? '👍 Good Effort! Passing Score Achieved.'
                : '💪 Needs More Practice. Review Mistakes Below!'}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
            <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-emerald-400 font-extrabold text-lg">
                {latestResult.correctCount}
              </div>
              <div className="text-[10px] text-slate-400">Correct</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-rose-400 font-extrabold text-lg">
                {latestResult.wrongCount}
              </div>
              <div className="text-[10px] text-slate-400">Incorrect</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-indigo-400 font-extrabold text-lg">
                {latestResult.avgTimeSeconds}s
              </div>
              <div className="text-[10px] text-slate-400">Avg Pace</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setPhase('setup')}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Take Another Exam</span>
            </button>
            <button
              onClick={onGoToAnalytics}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>View Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Detailed Review Section */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-sm text-slate-200 px-1">
            Question-by-Question Review ({latestResult.records.length})
          </h3>

          <div className="space-y-3">
            {latestResult.records.map((rec, idx) => (
              <div
                key={rec.questionId}
                className={`p-4 rounded-2xl border transition-all ${
                  rec.isCorrect
                    ? 'bg-slate-900/80 border-emerald-900/50'
                    : 'bg-slate-900/80 border-rose-900/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-400">#{idx + 1}</span>
                    {rec.isCorrect ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] font-bold text-slate-300">
                    Your Choice:{' '}
                    <span className={rec.isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                      {rec.userKey ? rec.userKey.toUpperCase() : 'None'}
                    </span>{' '}
                    | Ans: <span className="text-emerald-400">{rec.correctKey.toUpperCase()}</span>
                  </div>
                </div>

                <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-200">
                  {rec.questionText}
                </p>

                {/* Explanation */}
                {rec.explanation && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 leading-relaxed">
                    <span className="text-pink-300 font-bold block mb-0.5">ব্যাখ্যা:</span>
                    {rec.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
