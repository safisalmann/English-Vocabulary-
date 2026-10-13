export type QuestionType =
  | 'single'
  | 'multiple'
  | 'true_false'
  | 'assertion_reasoning'
  | 'code_scenario';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MCQOption {
  id: string; // e.g. "a", "b", "c", "d" or "true", "false"
  text: string;
  codeSnippet?: string;
}

export interface MCQQuestion {
  id: string;
  category: string;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  codeSnippet?: string;
  options: MCQOption[];
  answerKey: string | string[]; // Single ID (e.g. "b") or array (e.g. ["a", "c"])
  explanation: string;
  tags?: string[];
  assertion?: string;
  reason?: string;
}

export interface UserAnswerRecord {
  questionId: string;
  selectedOptionIds: string[];
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: number;
}

export interface QuizResult {
  id: string;
  title: string;
  category: string;
  mode: 'practice' | 'timed_exam' | 'rapid_fire';
  startTime: number;
  endTime: number;
  totalQuestions: number;
  correctCount: number;
  totalTimeSeconds: number;
  answers: UserAnswerRecord[];
}

export interface CategoryStat {
  category: string;
  totalAttempted: number;
  totalCorrect: number;
  accuracy: number;
  avgTimeSeconds: number;
}

export interface TypeStat {
  type: QuestionType;
  totalAttempted: number;
  totalCorrect: number;
  accuracy: number;
}

export interface UserStats {
  totalAnswered: number;
  totalCorrect: number;
  currentStreak: number;
  longestStreak: number;
  totalTimeSpentSeconds: number;
  bookmarkedQuestionIds: string[];
  categoryStats: Record<string, { attempted: number; correct: number; timeSpent: number }>;
  typeStats: Record<QuestionType, { attempted: number; correct: number }>;
  recentResults: QuizResult[];
}
