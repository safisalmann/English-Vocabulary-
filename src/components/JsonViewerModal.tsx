import React, { useState } from 'react';
import { 
  FileJson, 
  Copy, 
  Check, 
  Download, 
  Filter, 
  Upload, 
  Database, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { MCQQuestion } from '../types';

interface JsonViewerModalProps {
  questions: MCQQuestion[];
  allQuestions: MCQQuestion[];
  selectedDatasetId: string;
  onImportJson: (newQuestions: MCQQuestion[]) => void;
}

export const JsonViewerModal: React.FC<JsonViewerModalProps> = ({
  questions,
  allQuestions,
  selectedDatasetId,
  onImportJson
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [jsonScope, setJsonScope] = useState<'filtered' | 'dataset' | 'all'>('dataset');
  const [importText, setImportText] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [showImportDrawer, setShowImportDrawer] = useState<boolean>(false);

  // Determine questions to display based on jsonScope
  let displayQuestions: MCQQuestion[] = [];
  if (jsonScope === 'filtered') {
    displayQuestions = questions;
  } else if (jsonScope === 'dataset') {
    displayQuestions = selectedDatasetId === 'all' 
      ? allQuestions 
      : allQuestions.filter(q => q.datasetId === selectedDatasetId);
  } else {
    displayQuestions = allQuestions;
  }

  const jsonString = JSON.stringify(displayQuestions, null, 2);
  const jsonSizeKb = (new Blob([jsonString]).size / 1024).toFixed(1);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const filename = `${selectedDatasetId}_questions_${displayQuestions.length}items.json`;
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleProcessImport = () => {
    setImportError(null);
    setImportSuccess(null);
    try {
      if (!importText.trim()) {
        setImportError('Please paste valid JSON questions array.');
        return;
      }
      const parsed = JSON.parse(importText);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      
      // Basic validation
      const valid = arr.every(item => item.id && item.word && item.options && item.correctAnswerIndex !== undefined);
      if (!valid) {
        setImportError('Invalid format. Ensure each item has id, word, options array, and correctAnswerIndex.');
        return;
      }

      onImportJson(arr);
      setImportSuccess(`Successfully imported ${arr.length} questions into Question Bank!`);
      setImportText('');
      setTimeout(() => setImportSuccess(null), 4000);
    } catch (e: any) {
      setImportError(`JSON Parse Error: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-[#16171A] rounded-3xl border border-[#2A2B2F] p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-[#1C1D21] text-[#D4AF37] border border-[#2A2B2F]">
              <FileJson className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-serif font-bold text-white tracking-tight">
              JSON Question Bank Data Viewer & Exporter
            </h2>
          </div>
          <p className="text-xs text-[#8E8F94]">
            Export, copy, or review the raw JSON dataset formatted with strict schema for MCQ answering.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#E2E2E2] bg-[#1C1D21] border border-[#2A2B2F] rounded-xl hover:border-[#D4AF37]/50 shadow-xs transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#D4AF37]" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#0F1012] bg-[#D4AF37] hover:bg-[#E5C158] rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download .json File</span>
          </button>

          <button
            onClick={() => setShowImportDrawer(!showImportDrawer)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-xl transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{showImportDrawer ? 'Close Importer' : 'Import JSON'}</span>
          </button>
        </div>
      </div>

      {/* Scope Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#16171A] p-2.5 rounded-2xl border border-[#2A2B2F]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#8E8F94] uppercase tracking-wider pl-2">JSON Scope:</span>
          
          <button
            onClick={() => setJsonScope('dataset')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              jsonScope === 'dataset'
                ? 'bg-[#D4AF37] text-[#0F1012] shadow-xs'
                : 'text-[#8E8F94] hover:text-white'
            }`}
          >
            Selected Dataset ({selectedDatasetId})
          </button>

          <button
            onClick={() => setJsonScope('filtered')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              jsonScope === 'filtered'
                ? 'bg-[#D4AF37] text-[#0F1012] shadow-xs'
                : 'text-[#8E8F94] hover:text-white'
            }`}
          >
            Current Filter ({questions.length})
          </button>

          <button
            onClick={() => setJsonScope('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              jsonScope === 'all'
                ? 'bg-[#D4AF37] text-[#0F1012] shadow-xs'
                : 'text-[#8E8F94] hover:text-white'
            }`}
          >
            All Datasets ({allQuestions.length})
          </button>
        </div>

        <div className="text-xs font-mono text-[#8E8F94] pr-2">
          Count: <strong className="text-white">{displayQuestions.length}</strong> items | Size: <strong className="text-[#D4AF37]">{jsonSizeKb} KB</strong>
        </div>
      </div>

      {/* Optional Import Drawer */}
      {showImportDrawer && (
        <div className="p-6 bg-[#16171A] rounded-3xl border border-[#D4AF37]/30 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-sm font-bold text-white">
              Paste & Import Additional JSON (Continuation / Second Command)
            </h3>
          </div>
          <p className="text-xs text-[#8E8F94] leading-relaxed">
            If you have questions in JSON format (e.g. from subsequent commands, Z6, Z5, P4, etc.), paste them below to load them into the application instantly:
          </p>

          <textarea
            rows={6}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder={`[\n  {\n    "id": "Z6-A-SYN-01",\n    "datasetId": "Z6",\n    "letter": "A",\n    "word": "Abundant",\n    "category": "Synonym",\n    "questionType": "single",\n    "questionText": "Which of the following is synonymous with 'Abundant'?",\n    "options": ["Plentiful", "Scarce", "Meager", "Barren"],\n    "correctAnswerIndex": 0,\n    "correctAnswerLabel": "A",\n    "correctAnswerText": "Plentiful",\n    "bengaliMeaning": "প্রচুর",\n    "providedTargets": ["Plentiful"],\n    "explanation": "Abundant and Plentiful both mean existing in large quantities."\n  }\n]`}
            className="w-full p-4 font-mono text-xs bg-[#0F1012] text-[#D4AF37] rounded-2xl border border-[#2A2B2F] focus:outline-hidden focus:ring-1 focus:ring-[#D4AF37] placeholder-[#6B6C70]"
          />

          {importError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300 font-semibold">
              {importError}
            </div>
          )}

          {importSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{importSuccess}</span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowImportDrawer(false)}
              className="px-4 py-2 text-xs font-bold text-[#8E8F94] hover:text-white bg-[#1C1D21] hover:bg-[#23242A] border border-[#2A2B2F] rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleProcessImport}
              className="px-5 py-2 text-xs font-bold text-[#0F1012] bg-[#D4AF37] hover:bg-[#E5C158] rounded-xl shadow-md cursor-pointer"
            >
              Merge & Load JSON
            </button>
          </div>
        </div>
      )}

      {/* Code syntax viewer */}
      <div className="relative rounded-3xl border border-[#2A2B2F] bg-[#0F1012] overflow-hidden shadow-lg">
        <div className="bg-[#16171A] px-4 py-2.5 border-b border-[#2A2B2F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-[#D4AF37]/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-[#8E8F94] pl-2">
              {selectedDatasetId}_questions.json
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="text-xs font-mono text-[#D4AF37] hover:text-[#E5C158] flex items-center gap-1 cursor-pointer"
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        <pre className="p-5 overflow-x-auto text-xs font-mono text-[#D4AF37]/90 max-h-[600px] scrollbar-thin leading-relaxed">
          <code>{jsonString}</code>
        </pre>
      </div>
    </div>
  );
};
