import React from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { PracticeArena } from './components/PracticeArena';
import { ExamArena } from './components/ExamArena';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { QuestionExplorer } from './components/QuestionExplorer';
import { SettingsModal } from './components/SettingsModal';
import { NORMALIZED_QUESTIONS } from './data/questionsData';
import {
  UserProgressData,
  loadUserProgress,
  saveUserProgress,
  computeAnalytics,
} from './utils/storage';
import { soundManager } from './utils/audio';

export default function App() {
  const [userProgress, setUserProgress] = React.useState<UserProgressData>(() =>
    loadUserProgress()
  );
  const [activeTab, setActiveTab] = React.useState<NavTab>('practice');
  const [practiceCategoryFilter, setPracticeCategoryFilter] = React.useState<string | null>(null);
  const [targetQuestionId, setTargetQuestionId] = React.useState<number | null>(null);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = React.useState<any>(null);

  // Synchronize audio preference with soundManager
  React.useEffect(() => {
    soundManager.setEnabled(userProgress.soundEnabled);
  }, [userProgress.soundEnabled]);

  // Listen for PWA installation prompt
  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredInstallPrompt(null);
    }
  };

  const handleToggleSound = () => {
    const nextVal = soundManager.toggle();
    const updated = { ...userProgress, soundEnabled: nextVal };
    saveUserProgress(updated);
    setUserProgress(updated);
  };

  const handleToggleTargetSection = () => {
    const nextVal = !userProgress.showTargetSection;
    const updated = { ...userProgress, showTargetSection: nextVal };
    saveUserProgress(updated);
    setUserProgress(updated);
  };

  const analytics = React.useMemo(
    () => computeAnalytics(userProgress, NORMALIZED_QUESTIONS),
    [userProgress]
  );

  // Switch to Practice with specific category from analytics
  const handlePracticeCategory = (categoryName: string) => {
    setTargetQuestionId(null);
    setPracticeCategoryFilter(categoryName);
    setActiveTab('practice');
  };

  // Switch to Practice for Mistakes
  const handlePracticeMistakes = () => {
    setTargetQuestionId(null);
    setPracticeCategoryFilter('All');
    setActiveTab('practice');
  };

  // Switch to Practice for specific numeric ID
  const handlePracticeSpecificQuestion = (questionNumericId: number) => {
    setTargetQuestionId(questionNumericId);
    setPracticeCategoryFilter('All');
    setActiveTab('practice');
  };

  // Header bookmark click
  const handleOpenBookmarks = () => {
    setTargetQuestionId(null);
    setActiveTab('practice');
  };

  return (
    <div
      className={`bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white ${
        activeTab === 'practice'
          ? 'h-[100dvh] max-h-[100dvh] overflow-hidden'
          : 'min-h-screen'
      }`}
    >
      {/* Fixed Header - rendered on non-practice tabs so Practice page matches exact screenshot */}
      {activeTab !== 'practice' && (
        <Header
          currentStreak={userProgress.currentStreak}
          bestStreak={userProgress.bestStreak}
          bookmarkedCount={userProgress.bookmarkedIds.length}
          overallAccuracy={analytics.overallAccuracy}
          onOpenBookmarks={handleOpenBookmarks}
          soundEnabled={userProgress.soundEnabled}
          onToggleSound={handleToggleSound}
          showTargetSection={userProgress.showTargetSection}
          onToggleTargetSection={handleToggleTargetSection}
          totalQuestions={NORMALIZED_QUESTIONS.length}
        />
      )}

      {/* Main Tab Content */}
      <main
        className={`w-full max-w-2xl mx-auto ${
          activeTab === 'practice'
            ? 'flex-1 h-[calc(100dvh-54px)] max-h-[calc(100dvh-54px)] overflow-hidden flex flex-col'
            : 'flex-1'
        }`}
      >
        {activeTab === 'practice' && (
          <PracticeArena
            questions={NORMALIZED_QUESTIONS}
            userProgress={userProgress}
            setUserProgress={setUserProgress}
            initialFilterCategory={practiceCategoryFilter}
            onClearCategoryFilter={() => setPracticeCategoryFilter(null)}
            targetQuestionNumericId={targetQuestionId}
            showTargetSection={userProgress.showTargetSection}
            onToggleTargetSection={handleToggleTargetSection}
            soundEnabled={userProgress.soundEnabled}
            onToggleSound={handleToggleSound}
            onOpenAnalytics={() => setActiveTab('analytics')}
          />
        )}

        {activeTab === 'exam' && (
          <ExamArena
            allQuestions={NORMALIZED_QUESTIONS}
            userProgress={userProgress}
            setUserProgress={setUserProgress}
            onGoToAnalytics={() => setActiveTab('analytics')}
            showTargetSection={userProgress.showTargetSection}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            allQuestions={NORMALIZED_QUESTIONS}
            userProgress={userProgress}
            setUserProgress={setUserProgress}
            onPracticeCategory={handlePracticeCategory}
            onPracticeMistakes={handlePracticeMistakes}
          />
        )}

        {activeTab === 'explorer' && (
          <QuestionExplorer
            allQuestions={NORMALIZED_QUESTIONS}
            userProgress={userProgress}
            setUserProgress={setUserProgress}
            onPracticeSpecificQuestion={handlePracticeSpecificQuestion}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsModal
            userProgress={userProgress}
            setUserProgress={setUserProgress}
            installPromptEvent={deferredInstallPrompt}
            onInstallApp={handleInstallApp}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        unattemptedCount={analytics.unattemptedCount}
      />
    </div>
  );
}
