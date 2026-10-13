import React from 'react';
import {
  BarChart3,
  Flame,
  Clock,
  Target,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Download,
  Upload,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { NormalizedMCQ } from '../data/questionsData';
import {
  UserProgressData,
  computeAnalytics,
  resetAllProgress,
  saveUserProgress,
} from '../utils/storage';

interface AnalyticsDashboardProps {
  allQuestions: NormalizedMCQ[];
  userProgress: UserProgressData;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgressData>>;
  onPracticeCategory: (categoryName: string) => void;
  onPracticeMistakes: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  allQuestions,
  userProgress,
  setUserProgress,
  onPracticeCategory,
  onPracticeMistakes,
}) => {
  const analytics = React.useMemo(
    () => computeAnalytics(userProgress, allQuestions),
    [userProgress, allQuestions]
  );

  const [confirmReset, setConfirmReset] = React.useState<boolean>(false);

  const handleExportData = () => {
    try {
      const json = JSON.stringify(userProgress, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pulsemcq-progress-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          saveUserProgress(parsed);
          setUserProgress(parsed);
        }
      } catch (err) {
        alert('Invalid progress JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    const clean = resetAllProgress();
    setUserProgress(clean);
    setConfirmReset(false);
  };

  return (
    <div className="max-w-xl mx-auto px-3.5 pt-3 pb-24 space-y-4">
      {/* Overview Top Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950/80 border border-indigo-700/50 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-900/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Performance Analytics</h2>
              <p className="text-[11px] text-indigo-300/80">Real-time mastery across all 1,214 questions</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400">Total DB</span>
            <div className="text-sm font-black text-indigo-300">1,214 Qs</div>
          </div>
        </div>

        {/* Master Progress Ring & Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
          {/* Overall Accuracy */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Accuracy
            </span>
            <div className="my-1 text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              {analytics.overallAccuracy}%
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-500"
                style={{ width: `${analytics.overallAccuracy}%` }}
              />
            </div>
          </div>

          {/* Mastered Questions */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Solved Correct
            </span>
            <div className="my-1 text-2xl font-black text-indigo-300">
              {analytics.totalCorrect}
            </div>
            <span className="text-[10px] text-slate-500">
              of {analytics.totalQuestionsInDb} total
            </span>
          </div>

          {/* Streaks */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400 fill-amber-400" /> Streaks
            </span>
            <div className="my-1 text-2xl font-black text-amber-400">
              {analytics.currentStreak}
            </div>
            <span className="text-[10px] text-slate-400">
              Best: <strong className="text-white">{analytics.bestStreak}</strong>
            </span>
          </div>

          {/* Average Pace */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-pink-400" /> Avg Speed
            </span>
            <div className="my-1 text-2xl font-black text-pink-300">
              {analytics.avgTimeSeconds}s
            </div>
            <span className="text-[10px] text-slate-500">per question</span>
          </div>
        </div>

        {/* Master Database Coverage Bar */}
        <div className="mt-3 pt-3 border-t border-indigo-950/60 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">Question Pool Coverage</span>
            <span className="text-indigo-300 font-bold">
              {analytics.totalAttempted} / {analytics.totalQuestionsInDb} ({Math.round((analytics.totalAttempted / analytics.totalQuestionsInDb) * 100)}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
            <div
              title="Correct"
              className="bg-emerald-500 h-full transition-all"
              style={{
                width: `${(analytics.totalCorrect / analytics.totalQuestionsInDb) * 100}%`,
              }}
            />
            <div
              title="Wrong"
              className="bg-rose-500 h-full transition-all"
              style={{
                width: `${(analytics.totalWrong / analytics.totalQuestionsInDb) * 100}%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="text-emerald-400">● {analytics.totalCorrect} Correct</span>
            <span className="text-rose-400">● {analytics.totalWrong} Incorrect</span>
            <span className="text-slate-500">● {analytics.unattemptedCount} Unattempted</span>
          </div>
        </div>
      </div>

      {/* Mistake Bank Banner (if there are mistakes) */}
      {analytics.mistakeQuestionIds.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-pink-950/40 border border-rose-800/40 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600/30 text-rose-400 border border-rose-500/40">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white">
                Mistake Review Bank ({analytics.mistakeQuestionIds.length} Questions)
              </div>
              <p className="text-xs text-rose-200/80">
                Retest your failed questions to lock in the correct rules.
              </p>
            </div>
          </div>
          <button
            onClick={onPracticeMistakes}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 transition-all active:scale-95 shadow-md shadow-rose-600/30"
          >
            Review Now
          </button>
        </div>
      )}

      {/* Topic Mastery Breakdown */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            <h3 className="font-extrabold text-sm text-slate-100">Topic Mastery Breakdown</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-semibold">
            {analytics.categoryBreakdown.length} Topics
          </span>
        </div>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {analytics.categoryBreakdown.map((cat) => {
            const hasAttempted = cat.attempted > 0;
            return (
              <div
                key={cat.category}
                onClick={() => onPracticeCategory(cat.category)}
                className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-200 group-hover:text-indigo-300 transition-colors">
                        {cat.category}
                      </span>
                      <span className="text-[10px] text-slate-500">({cat.total} Qs)</span>
                    </div>
                    <span className="text-[10px] text-indigo-400 font-medium">{cat.group}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span
                        className={`text-xs font-black ${
                          hasAttempted
                            ? cat.accuracy >= 70
                              ? 'text-emerald-400'
                              : cat.accuracy >= 40
                              ? 'text-amber-400'
                              : 'text-rose-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {hasAttempted ? `${cat.accuracy}%` : 'Not Started'}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        {cat.correct}/{cat.attempted} done
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </div>

                {/* Mini bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-700/60 mt-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      cat.accuracy >= 70
                        ? 'bg-emerald-400'
                        : cat.accuracy >= 40
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                    }`}
                    style={{ width: `${cat.accuracy}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Past Exam History */}
      {userProgress.quizHistory.length > 0 && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-400" />
              <h3 className="font-extrabold text-sm text-slate-100">Past Mock Exam History</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">
              {userProgress.quizHistory.length} Tests
            </span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {userProgress.quizHistory.map((test) => (
              <div
                key={test.id}
                className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-slate-200">{test.title}</div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(test.timestamp).toLocaleDateString()} • {test.totalQuestions} Qs • Pace:{' '}
                    {test.avgTimeSeconds}s
                  </div>
                </div>

                <div
                  className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                    test.scorePercentage >= 80
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : test.scorePercentage >= 50
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {test.scorePercentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Backup & Reset Tools */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>Data Storage & Offline Backup:</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExportData}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition-all border border-slate-700/50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>

          <label className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition-all border border-slate-700/50 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Import Backup</span>
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>
        </div>

        {confirmReset ? (
          <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-600/60 space-y-2 text-center">
            <p className="text-xs text-rose-200 font-bold">
              Are you sure? This resets all your answers, streaks, and test records.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                Yes, Reset All
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="w-full py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 text-rose-400 border border-rose-900/50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Progress Statistics</span>
          </button>
        )}
      </div>
    </div>
  );
};
