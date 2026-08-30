export type QuestionCategory = 'Synonym' | 'Antonym';
export type QuestionTypeRule = 'single' | 'multiple_both' | 'negative_not';

export interface MCQQuestion {
  id: string;
  datasetId: string; // e.g. "Set A", "Set B", "Set C", etc.
  letter: string; // e.g. "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"
  word: string;
  sourceExam?: string; // e.g. "45th BCS", "DU: 23-24, B"
  category: QuestionCategory;
  questionType: QuestionTypeRule;
  questionText: string;
  options: [string, string, string, string]; // Exactly 4 options: A, B, C, D
  optionMeanings?: [string, string, string, string]; // Bengali meanings of options A, B, C, D
  correctAnswerIndex: number; // 0, 1, 2, 3
  correctAnswerLabel: 'A' | 'B' | 'C' | 'D';
  correctAnswerText: string;
  bengaliMeaning: string;
  providedTargets: string[]; // Original target words/synonyms/antonyms
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
