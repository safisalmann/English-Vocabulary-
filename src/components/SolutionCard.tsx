import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { MCQQuestion } from '../types';

interface SolutionCardProps {
  question: MCQQuestion;
  userAnswerIndex?: number;
}

export const SolutionCard: React.FC<SolutionCardProps> = ({ question }) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#121316] border border-[#2A2B2F] text-[#E2E2E2] space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#2A2B2F] pb-2.5">
        <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs sm:text-sm">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>Solution & Bangla Meanings (বাংলা সমাধান)</span>
        </div>
        {question.sourceExam && (
          <span className="text-[11px] font-bold text-[#D4AF37] bg-[#1C1D21] border border-[#D4AF37]/30 px-2 py-0.5 rounded">
            {question.sourceExam}
          </span>
        )}
      </div>

      {/* 1. Question Word Bangla Meaning */}
      <div className="p-3 bg-[#16171A] rounded-xl border border-[#2A2B2F]/80">
        <div className="text-[11px] font-bold text-[#8E8F94] uppercase tracking-wider mb-1">
          শব্দের অর্থ (Question Word):
        </div>
        <div className="text-sm sm:text-base font-bold text-white flex items-baseline gap-2 flex-wrap">
          <span className="font-serif">{question.word}</span>
          <span className="text-[#D4AF37] font-semibold font-['Noto_Sans_Bengali']">
            — {question.bengaliMeaning}
          </span>
        </div>
      </div>

      {/* 2. 4 Options Bangla Meanings */}
      <div>
        <div className="text-[11px] font-bold text-[#8E8F94] uppercase tracking-wider mb-2">
          অপশনগুলোর বাংলা অর্থ (Options Meaning):
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {question.options.map((opt, idx) => {
            const label = (['A', 'B', 'C', 'D'] as const)[idx];
            const isRight = question.correctAnswerIndex === idx;
            const meaning = question.optionMeanings?.[idx];

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs flex flex-col gap-1 transition-all ${
                  isRight
                    ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200 shadow-xs'
                    : 'bg-[#16171A] border-[#2A2B2F] text-[#E2E2E2]'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className={isRight ? 'text-emerald-400 font-black' : 'text-[#8E8F94]'}>({label})</span>
                    <span className={isRight ? 'text-white' : ''}>{opt}</span>
                  </div>
                  {isRight && (
                    <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-800/50">
                      Answer
                    </span>
                  )}
                </div>
                {meaning && (
                  <div className="text-[11px] text-[#8E8F94] font-['Noto_Sans_Bengali'] pl-4 border-l border-[#2A2B2F]">
                    = {meaning}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Correct Answer Bar */}
      <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold text-emerald-300">
            সঠিক উত্তর: ({question.correctAnswerLabel}) {question.correctAnswerText}
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#8E8F94] bg-[#16171A] px-2 py-0.5 rounded border border-[#2A2B2F]">
          {question.category}
        </span>
      </div>

      {/* Explanation Details */}
      {question.explanation && (
        <div className="text-xs text-[#8E8F94] whitespace-pre-line leading-relaxed pt-2 border-t border-[#2A2B2F]/60">
          {question.explanation}
        </div>
      )}
    </div>
  );
};
