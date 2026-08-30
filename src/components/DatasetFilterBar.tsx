import React from 'react';
import { Search, Filter, Bookmark, X, Check, RefreshCw } from 'lucide-react';
import { QuizFilter } from '../types';

interface DatasetFilterBarProps {
  filter: QuizFilter;
  onFilterChange: (newFilter: QuizFilter) => void;
  availableLetters: string[];
  totalQuestions: number;
  filteredCount: number;
  bookmarkedCount: number;
}

export const DatasetFilterBar: React.FC<DatasetFilterBarProps> = ({
  filter,
  onFilterChange,
  availableLetters,
  totalQuestions,
  filteredCount,
  bookmarkedCount
}) => {
  const letters = ['all', ...availableLetters];

  const handleLetterClick = (letter: string) => {
    onFilterChange({ ...filter, letter });
  };

  const handleCategoryClick = (category: string) => {
    onFilterChange({ ...filter, category });
  };

  const handleTypeClick = (questionType: string) => {
    onFilterChange({ ...filter, questionType });
  };

  const resetFilters = () => {
    onFilterChange({
      datasetId: filter.datasetId,
      letter: 'all',
      category: 'all',
      questionType: 'all',
      searchQuery: '',
      onlyBookmarked: false
    });
  };

  const isFiltered = filter.letter !== 'all' || filter.category !== 'all' || filter.questionType !== 'all' || filter.searchQuery !== '' || filter.onlyBookmarked;

  return (
    <div className="bg-[#16171A] rounded-2xl sm:rounded-3xl border border-[#2A2B2F] p-3.5 sm:p-5 mb-4 sm:mb-6 shadow-sm space-y-3.5 sm:space-y-4">
      {/* Top row: Search and Quick stats */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8E8F94] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="filter-search-input"
            type="text"
            placeholder="Search word, meaning, or Bengali..."
            value={filter.searchQuery}
            onChange={(e) => onFilterChange({ ...filter, searchQuery: e.target.value })}
            className="w-full pl-9 pr-8 py-2 text-xs bg-[#0F1012] border border-[#2A2B2F] rounded-xl focus:bg-[#121316] focus:outline-hidden focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-[#E2E2E2] placeholder-[#6B6C70]"
          />
          {filter.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filter, searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E8F94] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <button
            id="btn-filter-bookmarked"
            onClick={() => onFilterChange({ ...filter, onlyBookmarked: !filter.onlyBookmarked })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              filter.onlyBookmarked
                ? 'bg-[#D4AF37] text-[#0F1012] border-[#D4AF37] shadow-xs'
                : 'bg-[#1C1D21] text-[#E2E2E2] border-[#2A2B2F] hover:border-[#D4AF37]/50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${filter.onlyBookmarked ? 'fill-current' : ''}`} />
            <span>Saved ({bookmarkedCount})</span>
          </button>

          {isFiltered && (
            <button
              id="btn-reset-filters"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-950/70 rounded-xl border border-rose-800/40 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          <div className="text-xs text-[#8E8F94] font-medium px-2.5 py-1.5 bg-[#1C1D21] border border-[#2A2B2F] rounded-xl shrink-0">
            <span className="text-[#D4AF37] font-bold">{filteredCount}</span>/{totalQuestions} Qs
          </div>
        </div>
      </div>

      {/* Filter Row 1: Letter selection (Swipeable on mobile) */}
      <div>
        <div className="text-[11px] sm:text-xs font-bold text-[#8E8F94] uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-[#D4AF37]" />
            <span>Filter by Letter:</span>
          </div>
          <span className="text-[10px] text-[#6B6C70] md:hidden">Swipe letters ➔</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-1 px-1">
          {letters.map((ltr) => (
            <button
              key={ltr}
              id={`filter-letter-${ltr}`}
              onClick={() => handleLetterClick(ltr)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                filter.letter === ltr
                  ? 'bg-[#D4AF37] text-[#0F1012] shadow-xs font-black ring-2 ring-[#D4AF37]/30'
                  : 'bg-[#1C1D21] text-[#8E8F94] hover:text-white hover:bg-[#23242A] border border-[#2A2B2F]'
              }`}
            >
              {ltr === 'all' ? 'All Letters' : `Letter ${ltr}`}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Row 2: Category & Question Rule Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 pt-2.5 sm:pt-3 border-t border-[#2A2B2F]">
        <div>
          <span className="text-[11px] sm:text-xs font-bold text-[#8E8F94] uppercase tracking-wider block mb-1.5">
            Vocabulary Type:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Types' },
              { id: 'Synonym', label: 'Synonyms Only' },
              { id: 'Antonym', label: 'Antonyms Only' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  filter.category === cat.id
                    ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40 font-black'
                    : 'bg-[#1C1D21] text-[#8E8F94] border-[#2A2B2F] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[11px] sm:text-xs font-bold text-[#8E8F94] uppercase tracking-wider block mb-1.5">
            MCQ Formulation Rule:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Rules' },
              { id: 'single', label: '1 Target (Direct)' },
              { id: 'multiple_both', label: '2 Targets (Both A & B)' },
              { id: 'negative_not', label: '3+ Targets (NOT a Syn/Ant)' }
            ].map((typ) => (
              <button
                key={typ.id}
                onClick={() => handleTypeClick(typ.id)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  filter.questionType === typ.id
                    ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40 font-black'
                    : 'bg-[#1C1D21] text-[#8E8F94] border-[#2A2B2F] hover:text-white'
                }`}
              >
                {typ.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
