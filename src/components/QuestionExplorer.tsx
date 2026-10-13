import React from 'react';
import { Search, ChevronDown, ChevronUp, Check, Award, Play, Filter, Bookmark } from 'lucide-react';
import { NormalizedMCQ, CATEGORIES } from '../data/questionsData';
import { UserProgressData, toggleBookmark } from '../utils/storage';

interface QuestionExplorerProps {
  allQuestions: NormalizedMCQ[];
  userProgress: UserProgressData;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgressData>>;
  onPracticeSpecificQuestion: (questionNumericId: number) => void;
}

export const QuestionExplorer: React.FC<QuestionExplorerProps> = ({
  allQuestions,
  userProgress,
  setUserProgress,
  onPracticeSpecificQuestion,
}) => {
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [selectedCat, setSelectedCat] = React.useState<string>('All');
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    return allQuestions.filter((q) => {
      if (selectedCat !== 'All' && q.category !== selectedCat) return false;
      if (!searchTerm.trim()) return true;

      const term = searchTerm.toLowerCase();
      return (
        q.question.toLowerCase().includes(term) ||
        (q.targetWord || '').toLowerCase().includes(term) ||
        q.wordMeaningBangla.toLowerCase().includes(term) ||
        q.examTag.toLowerCase().includes(term) ||
        q.explanationBangla.toLowerCase().includes(term) ||
        String(q.numericId) === term
      );
    });
  }, [allQuestions, selectedCat, searchTerm]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleBookmark = (e: React.MouseEvent, qId: string) => {
    e.stopPropagation();
    const next = toggleBookmark(userProgress, qId);
    setUserProgress(next);
  };

  return (
    <div className="max-w-xl mx-auto px-3.5 pt-3 pb-24 space-y-3.5">
      {/* Search Header */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white">Question Bank Explorer</h2>
          <span className="text-xs font-bold text-indigo-400">
            {filtered.length} of {allQuestions.length} Qs
          </span>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by word, meaning, exam tag, rule..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setSelectedCat('All')}
            className={`text-xs px-2.5 py-1 rounded-xl font-medium whitespace-nowrap transition-all ${
              selectedCat === 'All'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Topics
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`text-xs px-2.5 py-1 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCat === cat
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-2.5">
        {filtered.slice(0, 80).map((q) => {
          const isExpanded = expandedId === q.id;
          const ans = userProgress.answers[q.id];
          const isBookmarked = userProgress.bookmarkedIds.includes(q.id);

          return (
            <div
              key={q.id}
              className="rounded-2xl bg-slate-900/90 border border-slate-800/80 overflow-hidden transition-all shadow-md"
            >
              {/* Question summary row */}
              <div
                onClick={() => toggleExpand(q.id)}
                className="p-3.5 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-850 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    <span className="font-extrabold text-indigo-400">#{q.numericId}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                      {q.category}
                    </span>
                    {q.examTag && (
                      <span className="text-pink-300 font-semibold truncate max-w-[180px]">
                        {q.examTag}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
                    {q.question}
                  </p>

                  {q.targetWord && (
                    <div className="text-[11px] text-slate-400">
                      Word:{' '}
                      <strong className="text-indigo-300 font-bold">{q.targetWord}</strong>
                      {q.wordMeaningBangla && (
                        <span className="text-pink-300 ml-1.5 font-medium">
                          ({q.wordMeaningBangla})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                  <button
                    onClick={(e) => handleBookmark(e, q.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isBookmarked
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`}
                    />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPracticeSpecificQuestion(q.numericId);
                    }}
                    title="Practice this question"
                    className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-800/80 space-y-2.5 bg-slate-950/40 animate-in fade-in duration-150">
                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {q.options.map((opt) => {
                      const isCorrect =
                        opt.id.toLowerCase() === q.correctAnswerKey.toLowerCase();
                      return (
                        <div
                          key={opt.id}
                          className={`p-2 rounded-xl text-xs flex items-center gap-2 border ${
                            isCorrect
                              ? 'bg-emerald-950/60 text-emerald-200 border-emerald-500/50 font-semibold'
                              : 'bg-slate-800/60 text-slate-300 border-slate-700/60'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                              isCorrect
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {opt.label}
                          </span>
                          <span className="truncate">{opt.text}</span>
                          {isCorrect && (
                            <Check className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Bengali explanation */}
                  {(q.explanationBangla || q.wordMeaningBangla) && (
                    <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-slate-200 space-y-1">
                      <span className="text-pink-300 font-bold block text-[11px]">
                        বাংলা ব্যাখ্যা (Explanation):
                      </span>
                      <p className="leading-relaxed">{q.explanationBangla}</p>
                    </div>
                  )}

                  {/* Direct Launch Button */}
                  <div className="text-right pt-1">
                    <button
                      onClick={() => onPracticeSpecificQuestion(q.numericId)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Practice in Arena</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length > 80 && (
          <div className="text-center py-2 text-xs text-slate-400">
            Showing top 80 of {filtered.length} matches. Refine your search query to see more.
          </div>
        )}
      </div>
    </div>
  );
};
