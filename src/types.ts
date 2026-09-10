export type QuestionCategory = 'Preposition' | 'Synonym' | 'Antonym';
export type QuestionTypeRule = 'single' | 'multiple_both' | 'negative_not';

export interface MCQQuestion {
  id: string;
  datasetId: string; // e.g. "Preposition A-H", "Preposition I-Z"
  letter: string; // e.g. "A", "B", "C", "D", etc.
  word: string; // e.g. "adhere to", "look into"
  sourceExam?: string; // e.g. "45th BCS", "DU: 21-22, C"
  category: QuestionCategory;
  questionType: QuestionTypeRule;
  questionText: string;
  options: [string, string, string, string]; // Exactly 4 options: A, B, C, D
  optionMeanings?: [string, string, string, string]; // Optional
  correctAnswerIndex: number; // 0, 1, 2, 3
  correctAnswerLabel: 'A' | 'B' | 'C' | 'D';
  correctAnswerText: string;
  bengaliMeaning: string; // Bangla meaning of the correct answer
  providedTargets: string[];
  explanation: string;
}

export interface DatasetMetadata {
  id: string;
  name: string;
  description: string;
  count: number;
  letters: string[];
  isDefault?: boolean;
}

export interface QuizFilter {
  datasetId: string;
  letter: string;
  category: string;
  questionType: string;
  searchQuery: string;
  onlyBookmarked: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  accuracy: number;
}
