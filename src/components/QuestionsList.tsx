import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  Volume2, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  Eye,
  FileCode
} from 'lucide-react';
import { MCQQuestion } from '../types';
import { SolutionCard } from './SolutionCard';

interface QuestionsListProps {
  questions: MCQQuestion[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

export const QuestionsList: React.FC<QuestionsListProps> = ({
  questions,
  bookmarkedIds,
  onToggleBookmark
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testedAnswers, setTestedAnswers] = useState<Record<string, number>>({});

  const handleCopyJson = (q: MCQQuestion) => {
    navigator.clipboard.writeText(JSON.stringify(q, null, 2));
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="bg-[#16171A] rounded-3xl border border-[#2A2B2F] p-12 text-center text-[#8E8F94]">
        No questions found for the selected filters.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold text-[#8E8F94] uppercase tracking-wider">
          MCQ Question Bank Directory ({questions.length} Items)
        </h2>
        <span className="text-xs text-[#8E8F94] font-medium">
          Click any card to expand options & test yourself
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {questions.map((q, idx) => {
          const isExpanded = expandedId === q.id;
          const isBookmarked = bookmarkedIds.includes(q.id);
          const isCopied = copiedId === q.id;
          const userAns = testedAnswers[q.id];

          return (
            <div
              key={q.id}
              className={`bg-[#16171A] rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                isExpanded ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/30' : 'border-[#2A2B2F] hover:border-[#38393F]'
              }`}
            >
              {/* Card Header / Summary Row */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer select-none bg-[#16171A] hover:bg-[#1C1D21] transition-colors"
              >
                <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#1C1D21] border border-[#2A2B2F] text-[#D4AF37] font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
                      <span className={`px-2 py-0.5 rounded text-[11px] sm:text-xs font-bold uppercase ${
                        q.category === 'Synonym' ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30' : 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
                      }`}>
                        {q.category}
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold text-[#8E8F94] bg-[#1C1D21] border border-[#2A2B2F] px-2 py-0.5 rounded">
                        Set: {q.datasetId}
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold text-[#8E8F94] bg-[#1C1D21] border border-[#2A2B2F] px-2 py-0.5 rounded">
                        Letter {q.letter}
                      </span>
                      {q.sourceExam && (
                        <span className="text-[10px] sm:text-[11px] font-bold text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-2 py-0.5 rounded">
                          {q.sourceExam}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-base sm:text-lg font-serif font-bold text-white">{q.word}</span>
                      {q.bengaliMeaning && (
                        <span className="text-xs sm:text-sm font-semibold text-[#D4AF37] font-['Noto_Sans_Bengali']">
                          ({q.bengaliMeaning})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-1.5 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-[#2A2B2F]/60" onClick={(e) => e.stopPropagation()}>
                  <div className="text-[11px] text-[#8E8F94] sm:hidden">
                    Ans: <span className="text-emerald-400 font-bold">({q.correctAnswerLabel})</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSpeak(q.word)}
                      className="p-1.5 text-[#8E8F94] hover:text-[#D4AF37] hover:bg-[#1C1D21] rounded-lg transition-colors cursor-pointer"
                      title="Speak word"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleCopyJson(q)}
                      className="p-1.5 text-[#8E8F94] hover:text-emerald-400 hover:bg-[#1C1D21] rounded-lg transition-colors cursor-pointer"
                      title="Copy Question JSON"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => onToggleBookmark(q.id)}
                      className="p-1.5 text-[#8E8F94] hover:text-[#D4AF37] hover:bg-[#1C1D21] rounded-lg transition-colors cursor-pointer"
                      title="Bookmark"
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="p-1.5 text-[#8E8F94] hover:text-white rounded-lg cursor-pointer ml-1"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Card Details & Mini-Quiz Options */}
              {isExpanded && (
                <div className="p-5 bg-[#121316] border-t border-[#2A2B2F] space-y-4">
                  <div className="p-3.5 bg-[#16171A] rounded-xl border border-[#2A2B2F]">
                    <p className="text-sm font-bold text-[#E2E2E2]">
                      {q.questionText}
                    </p>
                  </div>

                  {/* 4 Interactive options for on-the-spot practice */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const label = (['A', 'B', 'C', 'D'] as const)[optIdx];
                      const isSelected = userAns === optIdx;
                      const isRight = q.correctAnswerIndex === optIdx;
                      const isTested = userAns !== undefined;

                      let style = 'bg-[#1C1D21] border-[#2A2B2F] text-[#E2E2E2] hover:bg-[#23242A]';
                      if (isTested) {
                        if (isRight) style = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold';
                        else if (isSelected && !isRight) style = 'bg-rose-950/40 border-rose-500 text-rose-200 line-through';
                        else style = 'bg-[#16171A] border-[#2A2B2F] text-[#6B6C70] opacity-60';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => setTestedAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${style}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#8E8F94]">{label})</span>
                            <span>{opt}</span>
                          </div>
                          {isTested && isRight && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          {isTested && isSelected && !isRight && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Full Solution and Bangla Meanings */}
                  <SolutionCard question={q} userAnswerIndex={userAns} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
