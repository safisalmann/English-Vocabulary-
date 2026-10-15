import React from 'react';
import {
  Volume2,
  VolumeX,
  Flame,
  Bookmark,
  Sparkles,
  Wifi,
  WifiOff,
  Target,
  Eye,
  EyeOff,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  currentStreak: number;
  bestStreak: number;
  bookmarkedCount: number;
  overallAccuracy: number;
  onOpenBookmarks: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  showTargetSection: boolean;
  onToggleTargetSection: () => void;
  totalQuestions?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentStreak,
  bookmarkedCount,
  overallAccuracy,
  onOpenBookmarks,
  soundEnabled,
  onToggleSound,
  showTargetSection,
  onToggleTargetSection,
  totalQuestions = 2093,
}) => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-indigo-950/60 px-4 py-2.5 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-indigo-200 to-violet-300 bg-clip-text text-transparent">
                PulseMCQ
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {totalQuestions.toLocaleString()} Qs
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              {isOnline ? (
                <span className="flex items-center gap-0.5 text-emerald-400">
                  <Wifi className="w-3 h-3 inline" /> Offline-Ready
                </span>
              ) : (
                <span className="flex items-center gap-0.5 text-amber-400">
                  <WifiOff className="w-3 h-3 inline" /> Offline Mode
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Real-time stats badges & action controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Target Section Hide/Show Button */}
          <button
            onClick={onToggleTargetSection}
            title={
              showTargetSection
                ? 'Target Section: Visible (Click to Hide target clues/words)'
                : 'Target Section: Hidden (Click to Show target clues/words)'
            }
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
              showTargetSection
                ? 'bg-gradient-to-r from-indigo-600/30 to-violet-600/30 text-indigo-200 border-indigo-500/50 shadow-sm shadow-indigo-500/25 ring-1 ring-indigo-500/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700/60'
            }`}
          >
            <Target className={`w-3.5 h-3.5 ${showTargetSection ? 'text-indigo-400' : 'text-slate-500'}`} />
            <span className="hidden xs:inline text-[11px]">Target:</span>
            <span
              className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                showTargetSection
                  ? 'text-emerald-300 bg-emerald-950/70 border border-emerald-500/30'
                  : 'text-slate-400 bg-slate-900 border border-slate-800'
              }`}
            >
              {showTargetSection ? 'SHOW' : 'HIDE'}
            </span>
            {showTargetSection ? (
              <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            )}
          </button>

          {/* Streak indicator */}
          <div
            title={`Current Streak: ${currentStreak}`}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
              currentStreak > 0
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20 animate-pulse'
                : 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${currentStreak > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
            <span>{currentStreak}</span>
          </div>

          {/* Accuracy pill */}
          <div
            title="Overall Accuracy"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 text-xs font-semibold"
          >
            <span>{overallAccuracy}% Acc</span>
          </div>

          {/* Bookmarks shortcut */}
          <button
            onClick={onOpenBookmarks}
            title="View Bookmarked Questions"
            className="relative flex items-center justify-center p-2 rounded-xl bg-slate-800/70 hover:bg-slate-750 text-slate-300 hover:text-amber-300 transition-colors border border-slate-700/50 active:scale-95"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarkedCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                {bookmarkedCount}
              </span>
            )}
          </button>

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            className="flex items-center justify-center p-2 rounded-xl bg-slate-800/70 hover:bg-slate-750 text-slate-300 hover:text-indigo-300 transition-colors border border-slate-700/50 active:scale-95"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
