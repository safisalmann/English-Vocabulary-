import { MCQQuestion, QuestionCategory } from '../types';

// Distractor bank for rule-based generation if custom text is added
const GENERAL_DISTRACTORS = [
  'Conventional', 'Temporary', 'Obscure', 'Negligible', 'Superficial',
  'Fragile', 'Stagnant', 'Harmonious', 'Restricted', 'Peculiar',
  'Timid', 'Lethargic', 'Frivolous', 'Ambiguous', 'Trivial'
];

export function parseVocabTextToMCQ(
  rawText: string,
  datasetId: string = 'Z7',
  category: QuestionCategory = 'Synonym'
): MCQQuestion[] {
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const questions: MCQQuestion[] = [];

  lines.forEach((line, idx) => {
    // Expected format: Word — Target1, Target2, Target3 (Bengali meaning)
    // or Word - Target1, Target2
    const delimiter = line.includes('—') ? '—' : (line.includes('-') ? '-' : ':');
    if (!line.includes(delimiter)) return;

    const parts = line.split(delimiter);
    const word = parts[0].trim();
    const rightPart = parts.slice(1).join(delimiter).trim();

    // Extract bengali meaning if in parentheses
    let bengali = '';
    let targetsStr = rightPart;
    const match = rightPart.match(/\((.*?)\)/);
    if (match) {
      bengali = match[1].trim();
      targetsStr = rightPart.replace(/\(.*?\)/, '').trim();
    }

    const targets = targetsStr.split(/[,/]/).map(t => t.trim()).filter(t => t.length > 0);
    if (targets.length === 0) return;

    const letter = word.charAt(0).toUpperCase();
    const qId = `${datasetId}-${letter}-${category.substring(0, 3).toUpperCase()}-${String(idx + 1).padStart(2, '0')}`;

    let questionText = '';
    let options: [string, string, string, string] = ['', '', '', ''];
    let correctAnswerIndex = 0;
    let correctAnswerLabel: 'A' | 'B' | 'C' | 'D' = 'A';
    let correctAnswerText = '';
    let questionType: 'single' | 'multiple_both' | 'negative_not' = 'single';

    if (targets.length === 1) {
      questionType = 'single';
      const target = targets[0];
      if (category === 'Synonym') {
        questionText = idx % 2 === 0
          ? `Which of the following is synonymous with '${word}'?`
          : `The meaning of the word '${word}' is —`;
      } else {
        questionText = `Which of the following is the antonym of '${word}'?`;
      }
      const distractors = GENERAL_DISTRACTORS.filter(d => d.toLowerCase() !== target.toLowerCase()).slice(0, 3);
      options = [target, distractors[0] || 'Unrelated', distractors[1] || 'Superficial', distractors[2] || 'Trivial'];
      correctAnswerIndex = 0;
      correctAnswerLabel = 'A';
      correctAnswerText = target;
    } else if (targets.length === 2) {
      questionType = 'multiple_both';
      if (category === 'Synonym') {
        questionText = `Which of the following is synonymous with '${word}'?`;
      } else {
        questionText = `Which of the following is an antonym of '${word}'?`;
      }
      const distractor = GENERAL_DISTRACTORS.filter(d => !targets.map(t => t.toLowerCase()).includes(d.toLowerCase()))[0] || 'Unrelated';
      options = [targets[0], targets[1], distractor, 'Both A and B'];
      correctAnswerIndex = 3;
      correctAnswerLabel = 'D';
      correctAnswerText = 'Both A and B';
    } else {
      // 3 or more targets -> Rule: "Which of the following is NOT a synonym/antonym"
      questionType = 'negative_not';
      if (category === 'Synonym') {
        questionText = `Which of the following is NOT a synonym of '${word}'?`;
      } else {
        questionText = `Which of the following is NOT an antonym of '${word}'?`;
      }
      const nonTarget = GENERAL_DISTRACTORS.filter(d => !targets.map(t => t.toLowerCase()).includes(d.toLowerCase()))[0] || 'Conventional';
      options = [targets[0], targets[1], targets[2], nonTarget];
      correctAnswerIndex = 3;
      correctAnswerLabel = 'D';
      correctAnswerText = nonTarget;
    }

    questions.push({
      id: qId,
      datasetId,
      letter,
      word,
      category,
      questionType,
      questionText,
      options,
      correctAnswerIndex,
      correctAnswerLabel,
      correctAnswerText,
      bengaliMeaning: bengali,
      providedTargets: targets,
      explanation: category === 'Synonym'
        ? `'${word}' means ${bengali || targets.join(', ')}. Target synonyms: ${targets.join(', ')}.`
        : `'${word}' (${bengali}) antonyms: ${targets.join(', ')}.`
    });
  });

  return questions;
}
