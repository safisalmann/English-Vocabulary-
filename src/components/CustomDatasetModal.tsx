import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Database, 
  FileText, 
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { MCQQuestion, DatasetMetadata } from '../types';
import { parseVocabTextToMCQ } from '../utils/parser';

interface CustomDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDataset: (metadata: DatasetMetadata, questions: MCQQuestion[]) => void;
}

export const CustomDatasetModal: React.FC<CustomDatasetModalProps> = ({
  isOpen,
  onClose,
  onAddDataset
}) => {
  const [datasetId, setDatasetId] = useState<string>('Z6');
  const [datasetName, setDatasetName] = useState<string>('Dataset Z6');
  const [datasetDesc, setDatasetDesc] = useState<string>('Upcoming vocabulary collection');
  const [synonymsText, setSynonymsText] = useState<string>('');
  const [antonymsText, setAntonymsText] = useState<string>('');
  const [previewQuestions, setPreviewQuestions] = useState<MCQQuestion[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGeneratePreview = () => {
    const synQuestions = parseVocabTextToMCQ(synonymsText, datasetId, 'Synonym');
    const antQuestions = parseVocabTextToMCQ(antonymsText, datasetId, 'Antonym');
    const all = [...synQuestions, ...antQuestions];
    setPreviewQuestions(all);
    setShowPreview(true);
  };

  const handleSave = () => {
    const synQuestions = parseVocabTextToMCQ(synonymsText, datasetId, 'Synonym');
    const antQuestions = parseVocabTextToMCQ(antonymsText, datasetId, 'Antonym');
    const all = [...synQuestions, ...antQuestions];

    if (all.length === 0) {
      alert('Please enter at least one valid vocabulary line in the format: Word — Target1, Target2 (Bengali)');
      return;
    }

    const letters = Array.from(new Set(all.map(q => q.letter))).sort();

    const meta: DatasetMetadata = {
      id: datasetId.trim().toUpperCase(),
      name: datasetName.trim() || `Dataset ${datasetId.trim().toUpperCase()}`,
      description: datasetDesc.trim() || 'User added dataset',
      count: all.length,
      letters
    };

    onAddDataset(meta, all);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#16171A] rounded-3xl border border-[#2A2B2F] w-full max-w-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-[#0F1012] border-b border-[#2A2B2F] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#1C1D21] text-[#D4AF37] border border-[#2A2B2F]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white tracking-tight">Add / Import Dataset (Z6, Z5, P4, etc.)</h3>
              <p className="text-xs text-[#8E8F94]">
                Paste raw vocabulary to automatically formulate rule-based MCQs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8E8F94] hover:text-white hover:bg-[#1C1D21] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          
          {/* Metadata inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#8E8F94] mb-1">
                Dataset ID (e.g. Z6, Z5, P4):
              </label>
              <input
                type="text"
                value={datasetId}
                onChange={(e) => setDatasetId(e.target.value.toUpperCase())}
                placeholder="Z6"
                className="w-full px-3 py-2 text-xs bg-[#0F1012] border border-[#2A2B2F] rounded-xl focus:border-[#D4AF37] focus:outline-hidden text-white font-bold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#8E8F94] mb-1">
                Dataset Name:
              </label>
              <input
                type="text"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                placeholder="Dataset Z6"
                className="w-full px-3 py-2 text-xs bg-[#0F1012] border border-[#2A2B2F] rounded-xl focus:border-[#D4AF37] focus:outline-hidden text-white"
              />
            </div>
          </div>

          {/* Synonyms text box */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#8E8F94]">
                Synonyms List (one per line):
              </label>
              <span className="text-[11px] text-[#6B6C70] font-mono">
                Format: Word — Syn1, Syn2 (বাংলা)
              </span>
            </div>
            <textarea
              rows={4}
              value={synonymsText}
              onChange={(e) => setSynonymsText(e.target.value)}
              placeholder="Abundant — Plentiful, Copious (প্রচুর)&#10;Acclaim — Praise, Applaud, Commend (প্রশংসা করা)"
              className="w-full p-3 text-xs bg-[#0F1012] border border-[#2A2B2F] rounded-xl font-mono focus:border-[#D4AF37] focus:outline-hidden text-[#D4AF37] placeholder-[#6B6C70]"
            />
          </div>

          {/* Antonyms text box */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#8E8F94]">
                Antonyms List (one per line):
              </label>
              <span className="text-[11px] text-[#6B6C70] font-mono">
                Format: Word — Ant1, Ant2 (বাংলা)
              </span>
            </div>
            <textarea
              rows={4}
              value={antonymsText}
              onChange={(e) => setAntonymsText(e.target.value)}
              placeholder="Amateur — Professional (অপেশাদার / পেশাদার)&#10;Ancient — Modern, Contemporary (প্রাচীন / আধুনিক)"
              className="w-full p-3 text-xs bg-[#0F1012] border border-[#2A2B2F] rounded-xl font-mono focus:border-[#D4AF37] focus:outline-hidden text-[#D4AF37] placeholder-[#6B6C70]"
            />
          </div>

          {/* Formulation Rules Summary Box */}
          <div className="p-4 bg-[#121316] border border-[#2A2B2F] rounded-2xl text-xs text-[#8E8F94] space-y-1">
            <span className="font-bold text-[#D4AF37] block">Formulation Rules Applied:</span>
            <ul className="list-disc list-inside space-y-0.5 text-[#8E8F94]">
              <li><strong>1 Target:</strong> Formulates direct meaning / synonym MCQ.</li>
              <li><strong>2 Targets:</strong> Formulates multiple-choice with <strong>"Both A and B"</strong> as the correct option.</li>
              <li><strong>3+ Targets:</strong> Formulates <strong>"Which of the following is NOT a synonym/antonym"</strong> with an auto-generated non-target distractor.</li>
            </ul>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="border-t border-[#2A2B2F] pt-4 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Generated MCQs Preview ({previewQuestions.length} Questions):
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {previewQuestions.map((q, i) => (
                  <div key={i} className="p-3 bg-[#0F1012] border border-[#2A2B2F] rounded-xl text-xs">
                    <div className="font-bold text-[#E2E2E2]">{q.id}: {q.questionText}</div>
                    <div className="text-[#D4AF37] font-semibold pt-0.5">Answer: {q.correctAnswerLabel}) {q.correctAnswerText}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0F1012] border-t border-[#2A2B2F] flex items-center justify-between">
          <button
            onClick={handleGeneratePreview}
            className="px-4 py-2 text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 rounded-xl border border-[#D4AF37]/30 transition-colors cursor-pointer"
          >
            Preview Rules
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#8E8F94] hover:text-white bg-[#1C1D21] hover:bg-[#23242A] border border-[#2A2B2F] rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-[#0F1012] bg-[#D4AF37] hover:bg-[#E5C158] rounded-xl shadow-md transition-all cursor-pointer"
            >
              Save & Load Dataset
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
