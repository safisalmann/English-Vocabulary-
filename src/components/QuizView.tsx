import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Volume2, 
  Bookmark, 
  Clock, 
  HelpCircle,
  Award,
  Sparkles,
  Zap,
  BookOpen
} from 'lucide-react';
import { MCQQuestion, QuizResult } from '../types';

interface QuizViewProps {
  questions: MCQQuestion[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  onResetQuiz: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  bookmarkedIds,
  onToggleBookmark,
  onResetQuiz
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showInstantFeedback, setShowInstantFeedback] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [showOnlyWrongInReview, setShowOnlyWrongInReview] = useState<boolean>(false);

  // Timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !isCompleted) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isCompleted]);

  // Reset state when questions list changes significantly
  useEffect(() => {
    setCurrentIndex(0);
    setUserAnswers({});
    setIsCompleted(false);
    setSecondsElapsed(0);
  }, [questions.length]);

  if (questions.length === 0) {
    return (
      <div className="bg-[#16171A] rounded-3xl border border-[#2A2B2F] p-12 text-center max-w-xl mx-auto shadow-md">
        <div className="w-16 h-16 bg-[#1C1D21] text-[#D4AF37] border border-[#2A2B2F] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-serif font-bold text-white mb-2">No Questions Match Filter</h3>
        <p className="text-sm text-[#8E8F94] mb-6">
          Please adjust your dataset, letter, or category filter to view questions.
        </p>
        <button
          onClick={onResetQuiz}
          className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0F1012] text-xs font-extrabold rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Reset Filter to All
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isBookmarked = bookmarkedIds.includes(currentQ.id);
  const selectedOptionIndex = userAnswers[currentQ.id];
  const hasAnsweredCurrent = selectedOptionIndex !== undefined;

  const handleSelectOption = (index: number) => {
    if (hasAnsweredCurrent && showInstantFeedback) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: index
    }));
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      setIsTimerRunning(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const calculateResults = (): QuizResult => {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    questions.forEach(q => {
      const ans = userAnswers[q.id];
      if (ans === undefined) {
        unanswered++;
      } else if (ans === q.correctAnswerIndex) {
        correct++;
      } else {
        wrong++;
      }
    });

    const total = questions.length;
    const scorePercentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const accuracy = (correct + wrong) > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

    return {
      totalQuestions: total,
      correctAnswers: correct,
      wrongAnswers: wrong,
      unanswered,
      scorePercentage,
      timeSpentSeconds: secondsElapsed,
      accuracy
    };
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Keyboard shortcut listener (A, B, C, D or 1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted) return;
      const key = e.key.toLowerCase();
      if (key === '1' || key === 'a') handleSelectOption(0);
      else if (key === '2' || key === 'b') handleSelectOption(1);
      else if (key === '3' || key === 'c') handleSelectOption(2);
      else if (key === '4' || key === 'd') handleSelectOption(3);
      else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (hasAnsweredCurrent || !showInstantFeedback) {
          handleNext();
        }
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, hasAnsweredCurrent, isCompleted, showInstantFeedback]);

  // If completed, show comprehensive Result View
  if (isCompleted) {
    const results = calculateResults();
    const wrongQuestions = questions.filter(q => userAnswers[q.id] !== undefined && userAnswers[q.id] !== q.correctAnswerIndex);

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Score Card */}
        <div className="bg-[#16171A] rounded-3xl border border-[#2A2B2F] p-8 shadow-lg text-center">
          <div className="inline-flex p-4 rounded-3xl bg-[#1C1D21] text-[#D4AF37] border border-[#2A2B2F] mb-4 shadow-sm">
            <Award className="w-12 h-12 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1 tracking-tight">Quiz Completed!</h2>
          <p className="text-xs sm:text-sm text-[#8E8F94] mb-6">
            Performance analysis for dataset <span className="font-bold text-[#D4AF37]">{currentQ.datasetId}</span>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="p-4 rounded-2xl bg-[#1C1D21] border border-[#2A2B2F]">
              <span className="text-xs text-[#8E8F94] font-bold uppercase tracking-wider block">Score</span>
              <span className="text-2xl font-bold text-[#D4AF37]">{results.scorePercentage}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#1C1D21] border border-[#2A2B2F]">
              <span className="text-xs text-[#8E8F94] font-bold uppercase tracking-wider block">Correct</span>
              <span className="text-2xl font-bold text-emerald-400">{results.correctAnswers}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#1C1D21] border border-[#2A2B2F]">
              <span className="text-xs text-[#8E8F94] font-bold uppercase tracking-wider block">Mistakes</span>
              <span className="text-2xl font-bold text-rose-400">{results.wrongAnswers}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#1C1D21] border border-[#2A2B2F]">
              <span className="text-xs text-[#8E8F94] font-bold uppercase tracking-wider block">Time</span>
              <span className="text-2xl font-bold text-[#E2E2E2]">{formatTime(results.timeSpentSeconds)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setUserAnswers({});
                setCurrentIndex(0);
                setIsCompleted(false);
                setSecondsElapsed(0);
                setIsTimerRunning(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0F1012] font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>

            {wrongQuestions.length > 0 && (
              <button
                onClick={() => {
                  setShowOnlyWrongInReview(!showOnlyWrongInReview);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#1C1D21] hover:bg-[#23242A] text-rose-300 font-bold text-xs rounded-xl border border-[#2A2B2F] hover:border-rose-500/40 transition-colors cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>{showOnlyWrongInReview ? 'Show All Review' : `Review ${wrongQuestions.length} Mistakes`}</span>
              </button>
            )}
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-white">
              {showOnlyWrongInReview ? `Mistakes Review (${wrongQuestions.length})` : `Full Quiz Review (${questions.length})`}
            </h3>
            <span className="text-xs text-[#8E8F94] font-medium">
              Click bookmark to save tricky words
            </span>
          </div>

          {(showOnlyWrongInReview ? wrongQuestions : questions).map((q, idx) => {
            const userAns = userAnswers[q.id];
            const isCorrect = userAns === q.correctAnswerIndex;
            const isUnanswered = userAns === undefined;

            return (
              <div
                key={q.id}
                className={`p-6 rounded-3xl border bg-[#16171A] shadow-md transition-all ${
                  isCorrect
                    ? 'border-emerald-500/30'
                    : isUnanswered
                    ? 'border-[#2A2B2F]'
                    : 'border-rose-500/30 bg-[#191517]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                      q.category === 'Synonym' ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30' : 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
                    }`}>
                      {q.category}
                    </span>
                    <span className="text-xs font-bold text-[#8E8F94]">
                      {q.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCorrect && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    )}
                    {!isCorrect && !isUnanswered && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-950/40 border border-rose-800/40 px-2 py-0.5 rounded-md">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                    {isUnanswered && (
                      <span className="text-xs font-bold text-[#8E8F94] bg-[#1C1D21] border border-[#2A2B2F] px-2 py-0.5 rounded-md">
                        Skipped
                      </span>
                    )}
                    <button
                      onClick={() => onToggleBookmark(q.id)}
                      className="text-[#8E8F94] hover:text-[#D4AF37] transition-colors"
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(q.id) ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
                    </button>
                  </div>
                </div>

                <h4 className="text-base font-bold text-[#E2E2E2] mb-2 leading-relaxed">
                  {q.questionText}
                </h4>

                {q.bengaliMeaning && (
                  <div className="text-xs font-semibold text-[#8E8F94] mb-4">
                    বাংলা অর্থ: <span className="text-[#D4AF37] font-bold font-['Noto_Sans_Bengali']">{q.bengaliMeaning}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAns === optIdx;
                    const isRight = q.correctAnswerIndex === optIdx;
                    const label = ['A', 'B', 'C', 'D'][optIdx];

                    let optStyle = 'bg-[#1C1D21] border-[#2A2B2F] text-[#E2E2E2]';
                    if (isRight) {
                      optStyle = 'bg-emerald-950/50 border-emerald-500/70 text-emerald-200 font-bold';
                    } else if (isSelected && !isRight) {
                      optStyle = 'bg-rose-950/50 border-rose-500/70 text-rose-200 line-through';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`px-3.5 py-2.5 text-xs rounded-xl border flex items-center justify-between ${optStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#8E8F94]">{label})</span>
                          <span>{opt}</span>
                        </div>
                        {isRight && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        {isSelected && !isRight && <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-[#121316] rounded-2xl border border-[#2A2B2F] text-xs text-[#8E8F94]">
                  <span className="font-bold text-[#E2E2E2] block mb-0.5">Explanation:</span>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Quiz View
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Top Bar: Progress, Timer, Instant Feedback Toggle */}
      <div className="bg-[#16171A] rounded-2xl border border-[#2A2B2F] p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#D4AF37] bg-[#D4AF37]/15 px-2.5 py-1 rounded-lg border border-[#D4AF37]/30">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-xs text-[#8E8F94] font-medium hidden sm:inline">
              Dataset: <strong className="text-white">{currentQ.datasetId}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E2E2E2] bg-[#1C1D21] border border-[#2A2B2F] px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{formatTime(secondsElapsed)}</span>
            </div>

            <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#8E8F94] hover:text-white">
              <input
                type="checkbox"
                checked={showInstantFeedback}
                onChange={(e) => setShowInstantFeedback(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#D4AF37] rounded focus:ring-0"
              />
              <span className="hidden sm:inline">Instant Check</span>
            </label>

            <button
              onClick={() => onToggleBookmark(currentQ.id)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                  : 'bg-[#1C1D21] border-[#2A2B2F] text-[#8E8F94] hover:text-[#D4AF37]'
              }`}
              title="Bookmark question"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#1C1D21] h-2 rounded-full overflow-hidden border border-[#2A2B2F]/60">
          <div
            className="bg-[#D4AF37] h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-[#16171A] rounded-3xl border border-[#2A2B2F] p-6 sm:p-8 shadow-md mb-4 relative">
        
        {/* Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
              currentQ.category === 'Synonym' ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30' : 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
            }`}>
              {currentQ.category}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#1C1D21] text-[#8E8F94] border border-[#2A2B2F]">
              Letter {currentQ.letter}
            </span>
            {currentQ.questionType === 'multiple_both' && (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 hidden sm:inline">
                2-Target Rule (Both A & B)
              </span>
            )}
            {currentQ.questionType === 'negative_not' && (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950/40 text-rose-300 border border-rose-800/40 hidden sm:inline">
                3+ Target Rule (NOT a Synonym)
              </span>
            )}
          </div>

          <button
            onClick={() => handleSpeak(currentQ.word)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#8E8F94] hover:text-[#D4AF37] bg-[#1C1D21] hover:bg-[#23242A] border border-[#2A2B2F] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            title="Pronounce word"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Speak</span>
          </button>
        </div>

        {/* Word Display */}
        <div className="mb-4">
          <div className="text-xs font-bold text-[#8E8F94] uppercase tracking-wider mb-1">Target Word:</div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight flex items-baseline gap-3">
            <span>{currentQ.word}</span>
            {currentQ.bengaliMeaning && (
              <span className="text-base sm:text-lg font-semibold text-[#D4AF37] font-['Noto_Sans_Bengali']">
                ({currentQ.bengaliMeaning})
              </span>
            )}
          </div>
        </div>

        {/* Question Text */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#121316] border border-[#2A2B2F] mb-6">
          <p className="text-base sm:text-lg font-bold text-[#E2E2E2] leading-relaxed">
            {currentQ.questionText}
          </p>
        </div>

        {/* 4 Options */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          {currentQ.options.map((option, idx) => {
            const label = (['A', 'B', 'C', 'D'] as const)[idx];
            const isSelected = selectedOptionIndex === idx;
            const isRight = currentQ.correctAnswerIndex === idx;

            let cardStyles = 'bg-[#1C1D21] border-[#2A2B2F] hover:border-[#D4AF37]/50 hover:bg-[#23242A] text-[#E2E2E2]';
            let labelStyles = 'bg-[#16171A] text-[#8E8F94] border-[#2A2B2F]';

            if (hasAnsweredCurrent && showInstantFeedback) {
              if (isRight) {
                cardStyles = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold ring-2 ring-emerald-500/20';
                labelStyles = 'bg-emerald-500 text-[#0F1012] border-emerald-500 font-black';
              } else if (isSelected && !isRight) {
                cardStyles = 'bg-rose-950/40 border-rose-500 text-rose-200 line-through ring-2 ring-rose-500/20';
                labelStyles = 'bg-rose-500 text-white border-rose-500 font-black';
              } else {
                cardStyles = 'bg-[#121316] border-[#2A2B2F] text-[#6B6C70] opacity-50';
              }
            } else if (isSelected) {
              cardStyles = 'bg-[#D4AF37]/15 border-[#D4AF37] text-white font-bold ring-2 ring-[#D4AF37]/20';
              labelStyles = 'bg-[#D4AF37] text-[#0F1012] border-[#D4AF37] font-black';
            }

            return (
              <button
                key={idx}
                id={`option-${currentQ.id}-${label}`}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all duration-150 cursor-pointer ${cardStyles}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl border flex items-center justify-center text-sm font-black shrink-0 ${labelStyles}`}>
                    {label}
                  </span>
                  <span className="text-base font-medium">{option}</span>
                </div>

                {hasAnsweredCurrent && showInstantFeedback && isRight && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {hasAnsweredCurrent && showInstantFeedback && isSelected && !isRight && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                {!hasAnsweredCurrent && (
                  <span className="text-xs text-[#8E8F94] font-mono hidden sm:inline">
                    [{idx + 1}]
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Explanation Drawer */}
        {hasAnsweredCurrent && showInstantFeedback && (
          <div className="p-5 rounded-2xl bg-[#121316] border border-[#2A2B2F] text-[#E2E2E2] space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-sm">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Answer & Explanation Breakdown:</span>
            </div>
            
            <p className="text-sm font-semibold text-[#E2E2E2] leading-relaxed">
              <strong className="text-emerald-400">Correct Answer: {currentQ.correctAnswerLabel}) {currentQ.correctAnswerText}</strong>
            </p>

            <p className="text-xs text-[#8E8F94] leading-relaxed">
              {currentQ.explanation}
            </p>

            {currentQ.providedTargets.length > 0 && (
              <div className="pt-2 border-t border-[#2A2B2F] flex items-center gap-1.5 flex-wrap text-xs text-[#8E8F94]">
                <span className="font-bold text-[#E2E2E2]">Source list ({currentQ.category}s):</span>
                {currentQ.providedTargets.map((tgt, i) => (
                  <span key={i} className="px-2 py-0.5 bg-[#1C1D21] border border-[#2A2B2F] rounded-md text-[#D4AF37] font-semibold">
                    {tgt}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#16171A] border border-[#2A2B2F] text-[#E2E2E2] font-bold text-xs rounded-xl hover:bg-[#1C1D21] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2">
          {currentIndex === questions.length - 1 ? (
            <button
              id="btn-finish-quiz"
              onClick={() => {
                setIsCompleted(true);
                setIsTimerRunning(false);
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0F1012] font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>Submit & View Results</span>
              <Award className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-next-question"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0F1012] font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>{hasAnsweredCurrent ? 'Next Question' : 'Skip / Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
