import React from 'react';
import {
  Volume2,
  VolumeX,
  Palette,
  Smartphone,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Target,
} from 'lucide-react';
import { UserProgressData, saveUserProgress, resetAllProgress } from '../utils/storage';
import { soundManager } from '../utils/audio';

interface SettingsModalProps {
  userProgress: UserProgressData;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgressData>>;
  installPromptEvent: any;
  onInstallApp: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  userProgress,
  setUserProgress,
  installPromptEvent,
  onInstallApp,
}) => {
  const [confirmReset, setConfirmReset] = React.useState(false);

  const toggleSound = () => {
    const nextVal = soundManager.toggle();
    const updated = { ...userProgress, soundEnabled: nextVal };
    saveUserProgress(updated);
    setUserProgress(updated);
  };

  const toggleTargetSection = () => {
    const nextVal = !userProgress.showTargetSection;
    const updated = { ...userProgress, showTargetSection: nextVal };
    saveUserProgress(updated);
    setUserProgress(updated);
  };

  const handleThemeChange = (theme: 'neon-indigo' | 'cyber-emerald' | 'sunset-rose') => {
    const updated = { ...userProgress, theme };
    saveUserProgress(updated);
    setUserProgress(updated);
  };

  const handleReset = () => {
    const clean = resetAllProgress();
    setUserProgress(clean);
    setConfirmReset(false);
  };

  return (
    <div className="max-w-xl mx-auto px-3.5 pt-3 pb-24 space-y-4">
      {/* Title */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <h2 className="text-base font-extrabold text-white">Application Settings</h2>
        <p className="text-xs text-slate-400">Configure theme, sound, and offline PWA installation</p>
      </div>

      {/* PWA / APK Offline Section */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/70 border border-indigo-700/40 space-y-3 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">Offline PWA & APK Readiness</h3>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Offline Compatible (1,214 Questions Local)
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          PulseMCQ is fully bundled with service worker caching. It functions without internet access
          and can be converted directly into an Android APK via PWABuilder or installed directly to
          your home screen for a native app feel.
        </p>

        {installPromptEvent ? (
          <button
            onClick={onInstallApp}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 hover:opacity-95 active:scale-95 flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>Install App on Device</span>
          </button>
        ) : (
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-indigo-300 block">How to Install to Home Screen:</span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[11px]">
              <li><strong>Chrome / Android:</strong> Tap the 3 dots menu (⋮) → "Install app" or "Add to Home screen".</li>
              <li><strong>Safari / iOS:</strong> Tap the Share button (⎋) → "Add to Home Screen".</li>
            </ul>
          </div>
        )}
      </div>

      {/* Audio FX Setting */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-800 text-indigo-400">
            {userProgress.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </div>
          <div>
            <span className="font-bold text-xs text-white block">Synthesizer Sound Effects</span>
            <span className="text-[11px] text-slate-400">
              Immediate audio feedback for correct/incorrect answers
            </span>
          </div>
        </div>

        <button
          onClick={toggleSound}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            userProgress.soundEnabled ? 'bg-indigo-600' : 'bg-slate-700'
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              userProgress.soundEnabled ? 'right-0.5' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      {/* Target Section Setting */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-800 text-indigo-400">
            <Target className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <span className="font-bold text-xs text-white block">Target Section & Word Clues</span>
            <span className="text-[11px] text-slate-400">
              Show or hide target words and Bengali meanings during practice
            </span>
          </div>
        </div>

        <button
          onClick={toggleTargetSection}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            userProgress.showTargetSection ? 'bg-indigo-600' : 'bg-slate-700'
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              userProgress.showTargetSection ? 'right-0.5' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      {/* Vibrant Themes */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Palette className="w-4 h-4 text-indigo-400" />
          <span>Vibrant Theme Accents</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            {
              id: 'neon-indigo',
              name: 'Electric Indigo',
              gradient: 'from-indigo-600 to-violet-600',
            },
            {
              id: 'cyber-emerald',
              name: 'Cyber Emerald',
              gradient: 'from-emerald-500 to-teal-500',
            },
            {
              id: 'sunset-rose',
              name: 'Sunset Rose',
              gradient: 'from-pink-500 to-rose-500',
            },
          ].map((theme) => {
            const isSelected = userProgress.theme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id as any)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-indigo-500 shadow-md ring-1 ring-indigo-400'
                    : 'bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`w-full h-5 rounded-xl bg-gradient-to-r ${theme.gradient} mb-2 shadow-sm`}
                />
                <span className="text-[11px] font-bold block">{theme.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Progress */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
        {confirmReset ? (
          <div className="space-y-2 text-center">
            <p className="text-xs text-rose-300 font-bold">
              Confirm reset all stats, bookmarks, and quiz history?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-rose-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Learning Progress</span>
          </button>
        )}
      </div>
    </div>
  );
};
