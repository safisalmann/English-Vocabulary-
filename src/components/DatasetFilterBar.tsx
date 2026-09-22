import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Search, Filter, Bookmark, X, Check, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { QuizFilter } from '../types';

interface DatasetFilterBarProps {
  filter: QuizFilter;
  onFilterChange: (newFilter: QuizFilter) => void;
  availableLetters: string[];
  totalQuestions: number;
  filteredCount: number;
  bookmarkedCount: number;
  letterCounts?: Record<string, number>;
}

const ALL_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

export const DatasetFilterBar: React.FC<DatasetFilterBarProps> = ({
  filter,
  onFilterChange,
  availableLetters,
  totalQuestions,
  filteredCount,
  bookmarkedCount,
  letterCounts
}) => {
  // Always include all 26 letters of the English alphabet so no letters are ever missing
  const letters = ['all', ...ALL_ALPHABET];

  // Ref for the horizontal letter scroll container
  const letterScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll bounds
  const updateScrollBounds = useCallback(() => {
    if (letterScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = letterScrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    const el = letterScrollRef.current;
    if (!el) return;
    updateScrollBounds();
    el.addEventListener('scroll', updateScrollBounds, { passive: true });
    window.addEventListener('resize', updateScrollBounds);
    return () => {
      el.removeEventListener('scroll', updateScrollBounds);
      window.removeEventListener('resize', updateScrollBounds);
    };
  }, [updateScrollBounds]);

  // Auto-scroll selected letter into view
  useEffect(() => {
    if (filter.letter && letterScrollRef.current) {
      const btn = document.getElementById(`filter-letter-${filter.letter}`);
      if (btn) {
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [filter.letter]);

  // Slide letters left or right
  const scrollLetters = (direction: 'left' | 'right') => {
    if (letterScrollRef.current) {
      const distance = 260;
      letterScrollRef.current.scrollBy({
        left: direction === 'left' ? -distance : distance,
        behavior: 'smooth'
      });
    }
  };

  // Allow standard mouse wheel to scroll horizontally when hovering over the letter container
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (letterScrollRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      letterScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const handleLetterClick = (letter: string) => {
    if (letter !== 'all' && letterCounts && (letterCounts[letter] || 0) === 0) {
      // If current dataset has 0 questions for this letter, switch dataset to 'all' so questions appear
      onFilterChange({ ...filter, datasetId: 'all', letter });
      return;
    }
    onFilterChange({ ...filter, letter });
  };

  const handleCategoryClick = (category: string) => {
    onFilterChange({ ...filter, category });
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

      {/* Filter Row 1: Letter selection with slide buttons for mouse and touch */}
      <div>
        <div className="text-[11px] sm:text-xs font-bold text-[#8E8F94] uppercase tracking-wider mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Filter by Letter:</span>
          </div>

          {/* Quick slide controls in header for instant visibility */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="btn-slide-left-header"
              onClick={() => scrollLetters('left')}
              disabled={!canScrollLeft}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${
                canScrollLeft
                  ? 'bg-[#1C1D21] text-[#E2E2E2] hover:bg-[#25272D] hover:text-[#D4AF37] border-[#2F3036] hover:border-[#D4AF37]/50 active:scale-95'
                  : 'bg-[#141518] text-[#484950] border-[#1C1D22] cursor-not-allowed opacity-40'
              }`}
              title="Slide letters left (A-J)"
              aria-label="Slide letters left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Slide</span> Left
            </button>

            <button
              type="button"
              id="btn-slide-right-header"
              onClick={() => scrollLetters('right')}
              disabled={!canScrollRight}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${
                canScrollRight
                  ? 'bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F1012] border-[#D4AF37]/40 active:scale-95 shadow-xs font-black'
                  : 'bg-[#141518] text-[#484950] border-[#1C1D22] cursor-not-allowed opacity-40'
              }`}
              title="Slide letters right (K-Z)"
              aria-label="Slide letters right"
            >
              <span className="hidden xs:inline">Slide</span> Right
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Letter Carousel with flanking Left / Right navigation buttons */}
        <div className="relative flex items-center gap-1.5">
          {/* Left Arrow Button */}
          <button
            type="button"
            id="btn-slide-letter-left"
            onClick={() => scrollLetters('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll letters left"
            title="Scroll letters left (earlier letters)"
            className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 transition-all cursor-pointer select-none ${
              canScrollLeft
                ? 'bg-[#1C1D21] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F1012] border-[#2E3036] hover:border-[#D4AF37] shadow-sm active:scale-95'
                : 'bg-[#131417] text-[#3E4047] border-[#1A1B20] cursor-not-allowed opacity-30'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Letter Track Container */}
          <div
            ref={letterScrollRef}
            onWheel={handleWheel}
            className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5"
            tabIndex={0}
            role="region"
            aria-label="Letter selection carousel (use arrow buttons or mouse wheel to scroll)"
          >
            {letters.map((ltr) => {
              const count = ltr === 'all' ? totalQuestions : (letterCounts ? letterCounts[ltr] || 0 : 0);
              const isZero = ltr !== 'all' && letterCounts && count === 0;
              return (
                <button
                  key={ltr}
                  id={`filter-letter-${ltr}`}
                  onClick={() => handleLetterClick(ltr)}
                  title={isZero ? `Letter ${ltr} (0 in this set — click to view across all datasets)` : `Filter by Letter ${ltr}`}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                    filter.letter === ltr
                      ? 'bg-[#D4AF37] text-[#0F1012] shadow-xs font-black ring-2 ring-[#D4AF37]/30'
                      : isZero
                      ? 'bg-[#18191D] text-[#55565B] hover:text-[#A0A1A6] hover:bg-[#202127] border border-[#222327]'
                      : 'bg-[#1C1D21] text-[#8E8F94] hover:text-white hover:bg-[#23242A] border border-[#2A2B2F]'
                  }`}
                >
                  <span>{ltr === 'all' ? 'All Letters' : `Letter ${ltr}`}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                      filter.letter === ltr ? 'bg-black/20 text-[#0F1012]' : 'bg-[#26282E] text-[#D4AF37]'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            id="btn-slide-letter-right"
            onClick={() => scrollLetters('right')}
            disabled={!canScrollRight}
            aria-label="Scroll letters right"
            title="Scroll letters right (letters K to Z)"
            className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 transition-all cursor-pointer select-none ${
              canScrollRight
                ? 'bg-[#1C1D21] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F1012] border-[#2E3036] hover:border-[#D4AF37] shadow-sm active:scale-95 ring-1 ring-[#D4AF37]/30'
                : 'bg-[#131417] text-[#3E4047] border-[#1A1B20] cursor-not-allowed opacity-30'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Row 2: Category Types */}
      <div className="pt-2.5 sm:pt-3 border-t border-[#2A2B2F] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] sm:text-xs font-bold text-[#8E8F94] uppercase tracking-wider shrink-0">
            Category Type:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Types' },
              { id: 'Group Verb', label: 'Group Verbs' },
              { id: 'Preposition', label: 'Prepositions' },
              { id: 'Synonym', label: 'Synonyms' },
              { id: 'Antonym', label: 'Antonyms' }
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
      </div>
    </div>
  );
};
