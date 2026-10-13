import { NormalizedMCQ } from '../data/questionsData';

export interface QuestionAnswerRecord {
  questionId: string;
  selectedOptionKey: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  attempts: number;
  lastAttemptAt: number;
}

export interface QuizSessionResult {
  id: string;
  title: string;
  category: string;
  timestamp: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  scorePercentage: number;
  totalTimeSeconds: number;
  avgTimeSeconds: number;
  records: {
    questionId: string;
    questionText: string;
    userKey: string;
    correctKey: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface UserProgressData {
  version: number;
  answers: Record<string, QuestionAnswerRecord>;
  bookmarkedIds: string[];
  currentStreak: number;
  bestStreak: number;
  totalTimeSpentSeconds: number;
  quizHistory: QuizSessionResult[];
  soundEnabled: boolean;
  autoShowExplanation: boolean;
  theme: 'neon-indigo' | 'cyber-emerald' | 'sunset-rose';
}

const STORAGE_KEY = 'pulsemcq_progress_v1';

const DEFAULT_DATA: UserProgressData = {
  version: 1,
  answers: {},
  bookmarkedIds: [],
  currentStreak: 0,
  bestStreak: 0,
  totalTimeSpentSeconds: 0,
  quizHistory: [],
  soundEnabled: true,
  autoShowExplanation: true,
  theme: 'neon-indigo',
};

export function loadUserProgress(): UserProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DATA };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_DATA,
      ...parsed,
      answers: parsed.answers || {},
      bookmarkedIds: parsed.bookmarkedIds || [],
      quizHistory: parsed.quizHistory || [],
    };
  } catch (e) {
    console.error('Failed to load user progress:', e);
    return { ...DEFAULT_DATA };
  }
}

export function saveUserProgress(data: UserProgressData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save user progress:', e);
  }
}

// Record an individual question answer
export function recordQuestionAnswer(
  prev: UserProgressData,
  questionId: string,
  selectedOptionKey: string,
  isCorrect: boolean,
  timeSpentSeconds: number
): { next: UserProgressData; isNewStreakBest: boolean } {
  const existing = prev.answers[questionId];
  const newAttempts = (existing?.attempts || 0) + 1;

  let newCurrentStreak = prev.currentStreak;
  if (isCorrect) {
    newCurrentStreak += 1;
  } else {
    newCurrentStreak = 0;
  }

  const isNewStreakBest = newCurrentStreak > prev.bestStreak;
  const newBestStreak = Math.max(prev.bestStreak, newCurrentStreak);

  const updatedAnswers: Record<string, QuestionAnswerRecord> = {
    ...prev.answers,
    [questionId]: {
      questionId,
      selectedOptionKey,
      isCorrect,
      timeSpentSeconds: (existing?.timeSpentSeconds || 0) + timeSpentSeconds,
      attempts: newAttempts,
      lastAttemptAt: Date.now(),
    },
  };

  const next: UserProgressData = {
    ...prev,
    answers: updatedAnswers,
    currentStreak: newCurrentStreak,
    bestStreak: newBestStreak,
    totalTimeSpentSeconds: prev.totalTimeSpentSeconds + timeSpentSeconds,
  };

  saveUserProgress(next);
  return { next, isNewStreakBest };
}

// Toggle question bookmark
export function toggleBookmark(prev: UserProgressData, questionId: string): UserProgressData {
  const isBookmarked = prev.bookmarkedIds.includes(questionId);
  const updatedIds = isBookmarked
    ? prev.bookmarkedIds.filter((id) => id !== questionId)
    : [...prev.bookmarkedIds, questionId];

  const next: UserProgressData = {
    ...prev,
    bookmarkedIds: updatedIds,
  };
  saveUserProgress(next);
  return next;
}

// Save complete quiz test session
export function saveQuizSession(
  prev: UserProgressData,
  session: QuizSessionResult
): UserProgressData {
  const next: UserProgressData = {
    ...prev,
    quizHistory: [session, ...(prev.quizHistory || [])].slice(0, 50), // keep last 50
  };
  saveUserProgress(next);
  return next;
}

// Compute comprehensive real-time analytics
export interface ProgressAnalytics {
  totalQuestionsInDb: number;
  totalAttempted: number;
  totalCorrect: number;
  totalWrong: number;
  overallAccuracy: number; // 0 - 100
  masteryPercentage: number; // attempted & correct / total in db
  unattemptedCount: number;
  currentStreak: number;
  bestStreak: number;
  avgTimeSeconds: number;
  totalTimeMinutes: number;
  bookmarkedCount: number;
  categoryBreakdown: {
    category: string;
    group: string;
    total: number;
    attempted: number;
    correct: number;
    accuracy: number;
  }[];
  mistakeQuestionIds: string[];
}

export function computeAnalytics(
  data: UserProgressData,
  allQuestions: NormalizedMCQ[]
): ProgressAnalytics {
  const totalQuestionsInDb = allQuestions.length;
  const answerEntries = Object.values(data.answers);
  const attemptedSet = new Set(answerEntries.map((a) => a.questionId));
  const totalAttempted = attemptedSet.size;

  let totalCorrect = 0;
  let totalWrong = 0;
  let totalTimeSum = 0;
  const mistakeQuestionIds: string[] = [];

  for (const record of answerEntries) {
    if (record.isCorrect) {
      totalCorrect++;
    } else {
      totalWrong++;
      mistakeQuestionIds.push(record.questionId);
    }
    totalTimeSum += record.timeSpentSeconds;
  }

  const overallAccuracy =
    totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const masteryPercentage =
    totalQuestionsInDb > 0 ? Math.round((totalCorrect / totalQuestionsInDb) * 100) : 0;
  const unattemptedCount = Math.max(0, totalQuestionsInDb - totalAttempted);
  const avgTimeSeconds =
    totalAttempted > 0 ? Math.round((totalTimeSum / totalAttempted) * 10) / 10 : 0;

  // Group by category
  const catMap = new Map<
    string,
    { group: string; total: number; attempted: number; correct: number }
  >();

  for (const q of allQuestions) {
    const entry = catMap.get(q.category) || {
      group: q.categoryGroup,
      total: 0,
      attempted: 0,
      correct: 0,
    };
    entry.total++;
    const ans = data.answers[q.id];
    if (ans) {
      entry.attempted++;
      if (ans.isCorrect) {
        entry.correct++;
      }
    }
    catMap.set(q.category, entry);
  }

  const categoryBreakdown = Array.from(catMap.entries())
    .map(([cat, stats]) => ({
      category: cat,
      group: stats.group,
      total: stats.total,
      attempted: stats.attempted,
      correct: stats.correct,
      accuracy: stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  return {
    totalQuestionsInDb,
    totalAttempted,
    totalCorrect,
    totalWrong,
    overallAccuracy,
    masteryPercentage,
    unattemptedCount,
    currentStreak: data.currentStreak,
    bestStreak: data.bestStreak,
    avgTimeSeconds,
    totalTimeMinutes: Math.round(data.totalTimeSpentSeconds / 60),
    bookmarkedCount: data.bookmarkedIds.length,
    categoryBreakdown,
    mistakeQuestionIds,
  };
}

// Reset progress for clean slate
export function resetAllProgress(): UserProgressData {
  localStorage.removeItem(STORAGE_KEY);
  return { ...DEFAULT_DATA };
}
