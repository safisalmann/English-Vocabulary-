import React from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Layers, 
  FileJson, 
  PlusCircle, 
  Database,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { DatasetMetadata } from '../types';

interface HeaderProps {
  currentView: 'quiz' | 'bank' | 'flashcards' | 'json';
  onViewChange: (view: 'quiz' | 'bank' | 'flashcards' | 'json') => void;
  datasets: DatasetMetadata[];
  selectedDatasetId: string;
  onSelectDataset: (id: string) => void;
  onOpenAddModal: () => void;
  totalFilteredCount: number;
  bookmarkedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  datasets,
  selectedDatasetId,
  onSelectDataset,
  onOpenAddModal,
  totalFilteredCount,
  bookmarkedCount
}) => {
  const currentDataset = datasets.find(d => d.id === selectedDatasetId);

  return (
    <>
      {/* Sticky Top Header (Mobile & Desktop) */}
      <header className="bg-[#16171A]/95 backdrop-blur-md border-b border-[#2A2B2F] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          
          {/* MOBILE VIEW (Compact 1-row header: ~54px height) */}
          <div className="flex md:hidden items-center justify-between py-2.5 gap-2">
            {/* Logo & App title */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B38F24] flex items-center justify-center text-[#0F1012] shadow-xs shadow-[#D4AF37]/20 shrink-0">
                <BookOpen className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-serif font-bold text-white tracking-tight leading-none">VocabMCQ</h1>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                    {selectedDatasetId === 'all' ? 'All' : selectedDatasetId}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Dataset selector & Add Set */}
            <div className="flex items-center gap-1.5">
              <div className="relative inline-flex items-center">
                <label htmlFor="mobile-dataset-select" className="sr-only">Select Dataset</label>
                <div className="flex items-center gap-1 bg-[#1C1D21] border border-[#2A2B2F] rounded-lg px-2 py-1 text-xs font-bold text-[#E2E2E2]">
                  <Database className="w-3 h-3 text-[#D4AF37] shrink-0" />
                  <select
                    id="mobile-dataset-select"
                    value={selectedDatasetId}
                    onChange={(e) => onSelectDataset(e.target.value)}
                    className="bg-transparent border-0 text-[#E2E2E2] text-xs font-bold focus:ring-0 focus:outline-hidden cursor-pointer pr-2 max-w-[100px] truncate"
                  >
                    <option value="all" className="bg-[#1C1D21] text-white">All Sets</option>
                    {datasets.map((d) => (
                      <option key={d.id} value={d.id} className="bg-[#1C1D21] text-white">
                        {d.id} ({d.count} Qs)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                id="mobile-btn-add-dataset"
                onClick={onOpenAddModal}
                className="p-1.5 text-xs font-bold text-[#E2E2E2] bg-[#1C1D21] hover:bg-[#23242A] border border-[#2A2B2F] hover:border-[#D4AF37]/50 rounded-lg transition-colors shadow-2xs"
                title="Add / Import Set"
                aria-label="Add or Import Dataset"
              >
                <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </div>
          </div>

          {/* DESKTOP VIEW (Standard rich row) */}
          <div className="hidden md:flex flex-row items-center justify-between py-3.5 gap-3">
            
            {/* Logo & Dataset Badge */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B38F24] flex items-center justify-center text-[#0F1012] shadow-sm shadow-[#D4AF37]/20">
                <BookOpen className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-serif font-bold text-white tracking-tight">VocabMCQ</h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                    {selectedDatasetId === 'all' ? 'All Sets' : selectedDatasetId}
                  </span>
                </div>
                <p className="text-xs text-[#8E8F94] font-medium">
                  Synonyms & Antonyms MCQ Engine • Bengali Translation Support
                </p>
              </div>
            </div>

            {/* Dataset Selector Dropdown & Add Dataset Button */}
            <div className="flex items-center flex-wrap gap-2">
              <div className="relative inline-flex items-center">
                <label htmlFor="dataset-select" className="sr-only">Select Dataset</label>
                <div className="flex items-center gap-1.5 bg-[#1C1D21] border border-[#2A2B2F] rounded-xl px-3 py-1.5 text-sm font-medium text-[#E2E2E2] focus-within:border-[#D4AF37]/60">
                  <Database className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs text-[#8E8F94] uppercase tracking-wider font-semibold">Dataset:</span>
                  <select
                    id="dataset-select"
                    value={selectedDatasetId}
                    onChange={(e) => onSelectDataset(e.target.value)}
                    className="bg-transparent border-0 text-[#E2E2E2] font-bold focus:ring-0 focus:outline-hidden cursor-pointer pr-4"
                  >
                    <option value="all" className="bg-[#1C1D21] text-white">All Datasets ({datasets.reduce((acc, d) => acc + d.count, 0)})</option>
                    {datasets.map((d) => (
                      <option key={d.id} value={d.id} className="bg-[#1C1D21] text-white">
                        {d.id} {d.count > 0 ? `(${d.count} MCQs)` : '(Ready for Data)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                id="btn-add-dataset"
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#E2E2E2] bg-[#1C1D21] hover:bg-[#23242A] border border-[#2A2B2F] hover:border-[#D4AF37]/50 rounded-xl transition-colors shadow-2xs cursor-pointer"
                title="Add or import questions for sets"
              >
                <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>+ Add / Import Set</span>
              </button>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="flex items-center gap-1 bg-[#121316] p-1 rounded-xl border border-[#2A2B2F]" aria-label="Main Navigation">
              <button
                id="nav-quiz-mode"
                onClick={() => onViewChange('quiz')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'quiz'
                    ? 'bg-[#D4AF37] text-[#0F1012] shadow-sm shadow-[#D4AF37]/20 font-black'
                    : 'text-[#8E8F94] hover:text-white hover:bg-[#1C1D21]'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Quiz Mode</span>
              </button>

              <button
                id="nav-question-bank"
                onClick={() => onViewChange('bank')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'bank'
                    ? 'bg-[#D4AF37] text-[#0F1012] shadow-sm shadow-[#D4AF37]/20 font-black'
                    : 'text-[#8E8F94] hover:text-white hover:bg-[#1C1D21]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Questions ({totalFilteredCount})</span>
              </button>

              <button
                id="nav-flashcards"
                onClick={() => onViewChange('flashcards')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'flashcards'
                    ? 'bg-[#D4AF37] text-[#0F1012] shadow-sm shadow-[#D4AF37]/20 font-black'
                    : 'text-[#8E8F94] hover:text-white hover:bg-[#1C1D21]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Flashcards</span>
              </button>

              <button
                id="nav-json-view"
                onClick={() => onViewChange('json')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'json'
                    ? 'bg-[#D4AF37] text-[#0F1012] shadow-sm shadow-[#D4AF37]/20 font-black'
                    : 'text-[#8E8F94] hover:text-white hover:bg-[#1C1D21]'
                }`}
              >
                <FileJson className="w-4 h-4" />
                <span>JSON View</span>
              </button>
            </nav>

          </div>
        </div>
      </header>

      {/* MOBILE STICKY BOTTOM NAVIGATION BAR (Never moves when scrolling on mobile) */}
      <nav 
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#141518]/95 backdrop-blur-xl border-t border-[#2A2B2F] px-2 py-1.5 shadow-2xl pb-safe"
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          <button
            id="mobile-nav-quiz"
            onClick={() => {
              onViewChange('quiz');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              currentView === 'quiz'
                ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-black'
                : 'text-[#8E8F94] hover:text-[#E2E2E2]'
            }`}
          >
            <HelpCircle className={`w-5 h-5 mb-0.5 ${currentView === 'quiz' ? 'text-[#D4AF37]' : ''}`} />
            <span className="text-[10px] tracking-tight">Quiz</span>
          </button>

          <button
            id="mobile-nav-bank"
            onClick={() => {
              onViewChange('bank');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl relative transition-all ${
              currentView === 'bank'
                ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-black'
                : 'text-[#8E8F94] hover:text-[#E2E2E2]'
            }`}
          >
            <div className="relative">
              <CheckCircle2 className={`w-5 h-5 mb-0.5 ${currentView === 'bank' ? 'text-[#D4AF37]' : ''}`} />
              {totalFilteredCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#D4AF37] text-[#0F1012] text-[9px] font-black rounded-full px-1 min-w-[14px] text-center leading-tight">
                  {totalFilteredCount > 99 ? '99+' : totalFilteredCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">Questions</span>
          </button>

          <button
            id="mobile-nav-flashcards"
            onClick={() => {
              onViewChange('flashcards');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              currentView === 'flashcards'
                ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-black'
                : 'text-[#8E8F94] hover:text-[#E2E2E2]'
            }`}
          >
            <Layers className={`w-5 h-5 mb-0.5 ${currentView === 'flashcards' ? 'text-[#D4AF37]' : ''}`} />
            <span className="text-[10px] tracking-tight">Flashcards</span>
          </button>

          <button
            id="mobile-nav-json"
            onClick={() => {
              onViewChange('json');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              currentView === 'json'
                ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-black'
                : 'text-[#8E8F94] hover:text-[#E2E2E2]'
            }`}
          >
            <FileJson className={`w-5 h-5 mb-0.5 ${currentView === 'json' ? 'text-[#D4AF37]' : ''}`} />
            <span className="text-[10px] tracking-tight">JSON</span>
          </button>
        </div>
      </nav>
    </>
  );
};

