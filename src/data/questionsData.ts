import { BATCH_1 } from './questionsBatch1';
import { BATCH_2 } from './questionsBatch2';
import { BATCH_3 } from './questionsBatch3';
import { BATCH_4 } from './questionsBatch4';
import { BATCH_5 } from './questionsBatch5';
import { BATCH_6 } from './questionsBatch6';
import { BATCH_7 } from './questionsBatch7';
import { BATCH_8 } from './questionsBatch8';
import { BATCH_9 } from './questionsBatch9';
import { BATCH_10 } from './questionsBatch10';
import { BATCH_11 } from './questionsBatch11';
import { BATCH_12 } from './questionsBatch12';
import { BATCH_13 } from './questionsBatch13';
import { BATCH_14 } from './questionsBatch14';
import { BATCH_15 } from './questionsBatch15';
import { BATCH_16 } from './questionsBatch16';
import { BATCH_PREPOSITIONS } from './questionsPrepositions';

export interface RawMCQ {
  id: number;
  question: string;
  targetWord?: string;
  type?: string;
  category?: string;
  examTag?: string;
  options: string[];
  correctAnswer: string;
  wordMeaningBangla?: string;
  explanationBangla?: string;
}

export interface OptionItem {
  id: string; // 'a', 'b', 'c', 'd', 'e'
  label: string; // 'A', 'B', 'C', 'D', 'E'
  text: string;
}

export interface NormalizedMCQ {
  id: string;
  numericId: number;
  question: string;
  targetWord?: string;
  rawType: string;
  typeDisplay: string;
  category: string;
  categoryGroup: string;
  examTag: string;
  options: OptionItem[];
  correctAnswerKey: string; // 'a', 'b', 'c', 'd', 'e'
  correctOptionText: string;
  wordMeaningBangla: string;
  explanationBangla: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const ALL_RAW_QUESTIONS: RawMCQ[] = [
  ...BATCH_1,
  ...BATCH_2,
  ...BATCH_3,
  ...BATCH_4,
  ...BATCH_5,
  ...BATCH_6,
  ...BATCH_7,
  ...BATCH_8,
  ...BATCH_9,
  ...BATCH_10,
  ...BATCH_11,
  ...BATCH_12,
  ...BATCH_13,
  ...BATCH_14,
  ...BATCH_15,
  ...BATCH_16,
  ...BATCH_PREPOSITIONS,
].sort((a, b) => a.id - b.id);

// Clean category mapping for better UI filter badges
export function resolveCategoryGroup(category?: string, type?: string): { category: string; categoryGroup: string } {
  const cat = (category || '').trim();
  const t = (type || '').trim().toLowerCase();

  if (cat.includes('Preposition') || t.includes('prep') || cat.includes('Prep')) {
    return { category: 'Prepositions', categoryGroup: 'Grammar & Syntax' };
  }
  if (cat.includes('Adjective') || cat === 'Latin Adjectives') return { category: 'Adjectives', categoryGroup: 'Grammar & Syntax' };
  if (cat.includes('Pronoun')) return { category: 'Pronoun', categoryGroup: 'Grammar & Syntax' };
  if (cat.includes('Conjunction') || cat.includes('Linkers')) return { category: 'Conjunction & Linkers', categoryGroup: 'Grammar & Syntax' };
  if (cat.includes('Number')) return { category: 'Number (Singular/Plural)', categoryGroup: 'Grammar & Syntax' };
  if (cat.includes('Gender')) return { category: 'Gender Forms', categoryGroup: 'Grammar & Syntax' };
  if (cat.includes('Noun')) return { category: 'Noun', categoryGroup: 'Grammar & Syntax' };
  if (cat.includes('Verb')) return { category: 'Verb', categoryGroup: 'Grammar & Syntax' };
  if (cat.includes('Adverb')) return { category: 'Adverb', categoryGroup: 'Grammar & Syntax' };
  if (cat.includes('Degree')) return { category: 'Degrees of Comparison', categoryGroup: 'Grammar & Syntax' };
  if (cat.includes('Article')) return { category: 'Articles', categoryGroup: 'Grammar & Syntax' };
  if (cat.includes('Interjection')) return { category: 'Interjection', categoryGroup: 'Grammar & Syntax' };
  if (cat.includes('Suffix') || cat.includes('Prefix') || cat.includes('Affix') || cat.includes('Derivatives')) return { category: 'Affixes & Word Formation', categoryGroup: 'Vocabulary & Semantics' };
  if (cat.includes('Id-POS')) return { category: 'Parts of Speech Identification', categoryGroup: 'Parts of Speech' };
  if (cat.includes('Int-POS')) return { category: 'Interchange of Parts of Speech', categoryGroup: 'Parts of Speech' };
  if (cat.includes('Pos-POS')) return { category: 'Positional Parts of Speech', categoryGroup: 'Parts of Speech' };
  if (cat.includes('SWUAD-POS')) return { category: 'Same Word Used as Different POS', categoryGroup: 'Parts of Speech' };

  if (t === 'synonym' || cat.toLowerCase().includes('synonym')) return { category: 'Synonyms', categoryGroup: 'Vocabulary & Semantics' };
  if (t === 'antonym' || cat.toLowerCase().includes('antonym')) return { category: 'Antonyms', categoryGroup: 'Vocabulary & Semantics' };
  if (t === 'meaning' || cat.toLowerCase().includes('meaning')) return { category: 'Word Meanings', categoryGroup: 'Vocabulary & Semantics' };
  if (t === 'spelling' || cat.toLowerCase().includes('spelling')) return { category: 'Spelling Mastery', categoryGroup: 'Vocabulary & Semantics' };

  return { category: cat || 'General English', categoryGroup: 'Competitive Exam Topics' };
}

// Map option letter (a, b, c, d, e)
const OPTION_LETTERS = ['a', 'b', 'c', 'd', 'e', 'f'];
const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function normalizeQuestion(raw: RawMCQ): NormalizedMCQ {
  const { category, categoryGroup } = resolveCategoryGroup(raw.category, raw.type);

  // Normalize options
  const options: OptionItem[] = (raw.options || []).map((optText, idx) => ({
    id: OPTION_LETTERS[idx] || String(idx),
    label: OPTION_LABELS[idx] || String(idx + 1),
    text: String(optText).trim(),
  }));

  // Normalize correct answer key
  let normalizedKey = String(raw.correctAnswer || '').trim().toLowerCase();
  // If correctAnswer is whole string or letter
  if (normalizedKey.length > 1) {
    const matchedIdx = options.findIndex(
      (o) => o.text.toLowerCase() === normalizedKey.toLowerCase()
    );
    if (matchedIdx >= 0) {
      normalizedKey = options[matchedIdx].id;
    } else {
      normalizedKey = normalizedKey[0] || 'a';
    }
  }

  const correctOption = options.find((o) => o.id === normalizedKey) || options[0] || {
    id: 'a',
    label: 'A',
    text: '',
  };

  // Determine difficulty heuristic
  const hasRareWord = (raw.targetWord || '').length > 8;
  const longOptions = (raw.options || []).some((o) => o.length > 25);
  const difficulty: 'easy' | 'medium' | 'hard' = hasRareWord || longOptions ? 'hard' : raw.id % 3 === 0 ? 'medium' : 'easy';

  // Display type
  let typeDisplay = 'Single Choice MCQ';
  if (raw.type === 'synonym') typeDisplay = 'Synonym';
  else if (raw.type === 'antonym') typeDisplay = 'Antonym';
  else if (raw.type === 'meaning') typeDisplay = 'Meaning';
  else if (raw.type === 'preposition' || category.includes('Prep')) typeDisplay = 'Appropriate Preposition';
  else if (category.includes('POS') || category.includes('Parts of Speech')) typeDisplay = 'Grammar Rule';

  return {
    id: `q-${raw.id}`,
    numericId: raw.id,
    question: raw.question,
    targetWord: raw.targetWord,
    rawType: raw.type || 'standard',
    typeDisplay,
    category,
    categoryGroup,
    examTag: raw.examTag || 'Competitive Exam',
    options,
    correctAnswerKey: normalizedKey,
    correctOptionText: correctOption.text,
    wordMeaningBangla: raw.wordMeaningBangla || '',
    explanationBangla: raw.explanationBangla || '',
    difficulty,
  };
}

// Cache of normalized questions
export const NORMALIZED_QUESTIONS: NormalizedMCQ[] = ALL_RAW_QUESTIONS.map(normalizeQuestion);

// Get unique categories and groups
export const CATEGORIES = Array.from(new Set(NORMALIZED_QUESTIONS.map((q) => q.category))).sort();
export const CATEGORY_GROUPS = Array.from(new Set(NORMALIZED_QUESTIONS.map((q) => q.categoryGroup))).sort();
export const EXAM_TAGS = Array.from(
  new Set(NORMALIZED_QUESTIONS.flatMap((q) => q.examTag.split(',').map((s) => s.trim()).filter(Boolean)))
).slice(0, 30);
