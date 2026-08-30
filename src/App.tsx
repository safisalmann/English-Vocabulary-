import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { DatasetFilterBar } from './components/DatasetFilterBar';
import { QuizView } from './components/QuizView';
import { QuestionsList } from './components/QuestionsList';
import { FlashcardsView } from './components/FlashcardsView';
import { JsonViewerModal } from './components/JsonViewerModal';
import { CustomDatasetModal } from './components/CustomDatasetModal';
import { MCQQuestion, DatasetMetadata, QuizFilter } from './types';
import { INITIAL_DATASETS, INITIAL_QUESTIONS } from './data/datasets';
import { 
  Database, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  FileJson,
  Layers,
  Flame,
  Award
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'quiz' | 'bank' | 'flashcards' | 'json'>('quiz');
  
  // Datasets state (Initialized with Set A through Set I)
  const [datasets, setDatasets] = useState<DatasetMetadata[]>(() => {
    const saved = localStorage.getItem('vocab_datasets_v2');
    return saved ? JSON.parse(saved) : INITIAL_DATASETS;
  });

  // Questions state (Initialized with 207 MCQs from Sets A-I)
  const [allQuestions, setAllQuestions] = useState<MCQQuestion[]>(() => {
    const saved = localStorage.getItem('vocab_questions_v2');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  // Selected Dataset: Defaults to 'Set A'
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('Set A');

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('vocab_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  // Filter state
  const [filter, setFilter] = useState<QuizFilter>({
    datasetId: 'Set A',
    letter: 'all',
    category: 'all',
    questionType: 'all',
    searchQuery: '',
    onlyBookmarked: false
  });

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Sync datasets to localStorage
  useEffect(() => {
    localStorage.setItem('vocab_datasets_v2', JSON.stringify(datasets));
  }, [datasets]);

  // Sync questions to localStorage
  useEffect(() => {
    localStorage.setItem('vocab_questions_v2', JSON.stringify(allQuestions));
  }, [allQuestions]);

  // Sync bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('vocab_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  // When selectedDatasetId changes, update filter
  const handleSelectDataset = (id: string) => {
    setSelectedDatasetId(id);
    setFilter(prev => ({
      ...prev,
      datasetId: id,
      letter: 'all'
    }));
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Questions matching the selected dataset
  const datasetQuestions = useMemo(() => {
    if (selectedDatasetId === 'all') return allQuestions;
    return allQuestions.filter(q => q.datasetId === selectedDatasetId);
  }, [allQuestions, selectedDatasetId]);

  // Available letters for current dataset
  const availableLetters = useMemo(() => {
    const letterSet = new Set(datasetQuestions.map(q => q.letter));
    return Array.from(letterSet).sort();
  }, [datasetQuestions]);

  // Filtered questions based on active filters
  const filteredQuestions = useMemo(() => {
    return datasetQuestions.filter(q => {
      // Letter filter
      if (filter.letter !== 'all' && q.letter !== filter.letter) {
        return false;
      }
      // Category filter (Synonym / Antonym)
      if (filter.category !== 'all' && q.category !== filter.category) {
        return false;
      }
      // Question rule type filter
      if (filter.questionType !== 'all' && q.questionType !== filter.questionType) {
        return false;
      }
      // Bookmarked only
      if (filter.onlyBookmarked && !bookmarkedIds.includes(q.id)) {
        return false;
      }
      // Search query
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        const matchWord = q.word.toLowerCase().includes(query);
        const matchBengali = q.bengaliMeaning?.toLowerCase().includes(query);
        const matchText = q.questionText.toLowerCase().includes(query);
        const matchOptions = q.options.some(opt => opt.toLowerCase().includes(query));
        const matchTargets = q.providedTargets.some(tgt => tgt.toLowerCase().includes(query));
        return matchWord || matchBengali || matchText || matchOptions || matchTargets;
      }
      return true;
    });
  }, [datasetQuestions, filter, bookmarkedIds]);

  // Handle adding custom dataset
  const handleAddDataset = (meta: DatasetMetadata, questions: MCQQuestion[]) => {
    setDatasets(prev => {
      const exists = prev.some(d => d.id === meta.id);
      if (exists) {
        return prev.map(d => d.id === meta.id ? { ...d, ...meta, count: questions.length } : d);
      }
      return [...prev, meta];
    });

    setAllQuestions(prev => {
      // Replace existing questions for that dataset or append
      const filtered = prev.filter(q => q.datasetId !== meta.id);
      return [...filtered, ...questions];
    });

    setSelectedDatasetId(meta.id);
    setFilter(prev => ({
      ...prev,
      datasetId: meta.id,
      letter: 'all'
    }));
  };

  // Handle JSON Import
  const handleImportJson = (newQuestions: MCQQuestion[]) => {
    setAllQuestions(prev => {
      const existingIds = new Set(prev.map(q => q.id));
      const filteredNew = newQuestions.filter(q => !existingIds.has(q.id));
      return [...prev, ...filteredNew];
    });

    // Update dataset counts
    const datasetCounts: Record<string, number> = {};
    const datasetLetters: Record<string, Set<string>> = {};

    [...allQuestions, ...newQuestions].forEach(q => {
      datasetCounts[q.datasetId] = (datasetCounts[q.datasetId] || 0) + 1;
      if (!datasetLetters[q.datasetId]) datasetLetters[q.datasetId] = new Set();
      datasetLetters[q.datasetId].add(q.letter);
    });

    setDatasets(prev => {
      return prev.map(d => ({
        ...d,
        count: datasetCounts[d.id] || d.count,
        letters: datasetLetters[d.id] ? Array.from(datasetLetters[d.id]).sort() : d.letters
      }));
    });
  };

  const handleResetFilters = () => {
    setFilter({
      datasetId: selectedDatasetId,
      letter: 'all',
      category: 'all',
      questionType: 'all',
      searchQuery: '',
      onlyBookmarked: false
    });
  };

  const currentDatasetMeta = datasets.find(d => d.id === selectedDatasetId);

  return (
    <div className="min-h-screen bg-[#0F1012] text-[#E2E2E2] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Navigation Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        datasets={datasets}
        selectedDatasetId={selectedDatasetId}
        onSelectDataset={handleSelectDataset}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        totalFilteredCount={filteredQuestions.length}
        bookmarkedCount={bookmarkedIds.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 pb-24 md:pb-8">
        
        {/* Dataset Status Banner (Mobile-Optimized) */}
        <div className="mb-4 sm:mb-6 bg-gradient-to-r from-[#181A1F] via-[#141518] to-[#101114] text-[#E2E2E2] rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-[#2A2B2F] shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 tracking-wide">
                  Active Set: {selectedDatasetId}
                </span>
                <span className="text-xs text-[#8E8F94] font-medium">
                  {datasetQuestions.length} Formulated MCQs
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-serif font-bold text-white tracking-tight leading-snug">
                {currentDatasetMeta?.name || `Dataset ${selectedDatasetId}`}
              </h2>
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1 max-w-2xl leading-relaxed">
                {currentDatasetMeta?.description || 'Formulated MCQs from user synonyms and antonyms with Bengali meanings.'}
              </p>
            </div>

            {/* Quick stats pills */}
            <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2A2B2F]/60">
              <div className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-[#1C1D21] border border-[#2A2B2F] text-center">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#8E8F94] tracking-wider block">Letters</span>
                <span className="text-sm sm:text-base font-bold text-[#D4AF37]">{availableLetters.length}</span>
              </div>
              <div className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-[#1C1D21] border border-[#2A2B2F] text-center">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#8E8F94] tracking-wider block">Synonyms</span>
                <span className="text-sm sm:text-base font-bold text-[#E2E2E2]">
                  {datasetQuestions.filter(q => q.category === 'Synonym').length}
                </span>
              </div>
              <div className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-[#1C1D21] border border-[#2A2B2F] text-center">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#8E8F94] tracking-wider block">Antonyms</span>
                <span className="text-sm sm:text-base font-bold text-[#E2E2E2]">
                  {datasetQuestions.filter(q => q.category === 'Antonym').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Universal Filter Bar */}
        <DatasetFilterBar
          filter={filter}
          onFilterChange={setFilter}
          availableLetters={availableLetters}
          totalQuestions={datasetQuestions.length}
          filteredCount={filteredQuestions.length}
          bookmarkedCount={bookmarkedIds.length}
        />

        {/* View Routing */}
        {currentView === 'quiz' && (
          <QuizView
            questions={filteredQuestions}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onResetQuiz={handleResetFilters}
          />
        )}

        {currentView === 'bank' && (
          <QuestionsList
            questions={filteredQuestions}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentView === 'flashcards' && (
          <FlashcardsView
            questions={filteredQuestions}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentView === 'json' && (
          <JsonViewerModal
            questions={filteredQuestions}
            allQuestions={allQuestions}
            selectedDatasetId={selectedDatasetId}
            onImportJson={handleImportJson}
          />
        )}

      </main>

      {/* Footer (Optimized for mobile padding above bottom bar) */}
      <footer className="bg-[#121316] border-t border-[#2A2B2F] py-6 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-[#8E8F94] space-y-1">
          <p className="font-semibold text-[#D4AF37]">
            VocabMCQ • Vocabulary Question Bank & Quiz Engine
          </p>
          <p className="text-[#6B6C70] text-[11px]">
            BCS & Admission Test Synonyms & Antonyms with Comprehensive Bengali Solutions.
          </p>
        </div>
      </footer>

      {/* Custom Dataset Creator Modal */}
      <CustomDatasetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDataset={handleAddDataset}
      />
    </div>
  );
}
