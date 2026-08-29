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
    <header className="bg-[#16171A]/95 backdrop-blur-md border-b border-[#2A2B2F] sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#E2E2E2] bg-[#1C1D21] hover:bg-[#23242A] border border-[#2A2B2F] hover:border-[#D4AF37]/50 rounded-xl transition-colors shadow-2xs"
              title="Add or import questions for Z6, Z5, P4 etc."
            >
              <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
              <span>+ Add / Import Set</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-[#121316] p-1 rounded-xl border border-[#2A2B2F]" aria-label="Main Navigation">
            <button
              id="nav-quiz-mode"
              onClick={() => onViewChange('quiz')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
  );
};
